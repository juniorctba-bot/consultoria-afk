import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Admin procedure - only allows admin users
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso restrito a administradores' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== CATEGORIES ====================
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCategoryBySlug(input.slug);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const slug = input.slug || generateSlug(input.name);
        await db.createCategory({ ...input, slug });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCategory(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCategory(input.id);
        return { success: true };
      }),
  }),

  // ==================== POSTS ====================
  posts: router({
    list: publicProcedure
      .input(z.object({ categorySlug: z.string().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.categorySlug) {
          const category = await db.getCategoryBySlug(input.categorySlug);
          if (!category) return [];
          const posts = await db.getPostsByCategory(category.id);
          return posts.map(post => ({ ...post, category }));
        }
        
        const posts = await db.getAllPosts(false);
        const categories = await db.getAllCategories();
        const categoryMap = new Map(categories.map(c => [c.id, c]));
        
        return posts.map(post => ({
          ...post,
          category: post.categoryId ? categoryMap.get(post.categoryId) : null,
        }));
      }),
    
    listAll: adminProcedure.query(async () => {
      const posts = await db.getAllPosts(true);
      const categories = await db.getAllCategories();
      const categoryMap = new Map(categories.map(c => [c.id, c]));
      
      return posts.map(post => ({
        ...post,
        category: post.categoryId ? categoryMap.get(post.categoryId) : null,
      }));
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getPostBySlug(input.slug);
        if (!post) return null;
        
        const category = post.categoryId ? await db.getCategoryById(post.categoryId) : null;
        const relatedPosts = await db.getRelatedPosts(post.id, post.categoryId);
        
        return { ...post, category, relatedPosts };
      }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPostById(input.id);
      }),
    
    recent: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const posts = await db.getRecentPosts(input?.limit || 5);
        const categories = await db.getAllCategories();
        const categoryMap = new Map(categories.map(c => [c.id, c]));
        
        return posts.map(post => ({
          ...post,
          category: post.categoryId ? categoryMap.get(post.categoryId) : null,
        }));
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        categoryId: z.number().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const slug = input.slug || generateSlug(input.title);
        const publishedAt = input.published ? new Date() : null;
        
        const id = await db.createPost({
          ...input,
          slug,
          authorId: ctx.user.id,
          publishedAt,
        });
        
        return { success: true, id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        categoryId: z.number().nullable().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        
        // If publishing for first time, set publishedAt
        if (data.published) {
          const existingPost = await db.getPostById(id);
          if (existingPost && !existingPost.publishedAt) {
            (data as any).publishedAt = new Date();
          }
        }
        
        await db.updatePost(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePost(input.id);
        return { success: true };
      }),
  }),

  // ==================== UPLOAD ====================
  upload: router({
    image: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const ext = input.filename.split('.').pop() || 'jpg';
        const key = `blog-images/${nanoid()}.${ext}`;
        
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
  }),

  // ==================== GALLERY ====================
  gallery: router({
    getByPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPostGalleryImages(input.postId);
      }),
    
    add: adminProcedure
      .input(z.object({
        postId: z.number(),
        imageUrl: z.string(),
        caption: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.addGalleryImage({
          postId: input.postId,
          imageUrl: input.imageUrl,
          caption: input.caption || null,
          sortOrder: input.sortOrder || 0,
        });
        return { success: true, id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        caption: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateGalleryImage(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGalleryImage(input.id);
        return { success: true };
      }),
    
    deleteAll: adminProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAllPostGalleryImages(input.postId);
        return { success: true };
      }),
  }),

  // ==================== CONTACT ====================
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await db.createContactSubmission(input);
        return { success: true };
      }),
    
    list: adminProcedure.query(async () => {
      return await db.getAllContactSubmissions();
    }),
    
    markAsRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markContactAsRead(input.id);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContactSubmission(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
