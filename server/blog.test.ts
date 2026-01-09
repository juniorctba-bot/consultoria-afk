import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getAllCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Planejamento Financeiro", slug: "planejamento-financeiro", description: null, createdAt: new Date() },
    { id: 2, name: "Gestão Financeira", slug: "gestao-financeira", description: null, createdAt: new Date() },
  ]),
  getCategoryBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "planejamento-financeiro") {
      return Promise.resolve({ id: 1, name: "Planejamento Financeiro", slug: "planejamento-financeiro", description: null, createdAt: new Date() });
    }
    return Promise.resolve(undefined);
  }),
  getCategoryById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({ id: 1, name: "Planejamento Financeiro", slug: "planejamento-financeiro", description: null, createdAt: new Date() });
    }
    return Promise.resolve(undefined);
  }),
  getAllPosts: vi.fn().mockResolvedValue([
    { 
      id: 1, 
      title: "Post de Teste", 
      slug: "post-de-teste", 
      excerpt: "Resumo do post",
      content: "Conteúdo completo do post",
      imageUrl: null,
      categoryId: 1,
      authorId: 1,
      published: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  getPostsByCategory: vi.fn().mockResolvedValue([
    { 
      id: 1, 
      title: "Post de Teste", 
      slug: "post-de-teste", 
      excerpt: "Resumo do post",
      content: "Conteúdo completo do post",
      imageUrl: null,
      categoryId: 1,
      authorId: 1,
      published: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  getPostBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "post-de-teste") {
      return Promise.resolve({ 
        id: 1, 
        title: "Post de Teste", 
        slug: "post-de-teste", 
        excerpt: "Resumo do post",
        content: "Conteúdo completo do post",
        imageUrl: null,
        categoryId: 1,
        authorId: 1,
        published: true,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return Promise.resolve(undefined);
  }),
  getPostById: vi.fn().mockResolvedValue({ 
    id: 1, 
    title: "Post de Teste", 
    slug: "post-de-teste", 
    excerpt: "Resumo do post",
    content: "Conteúdo completo do post",
    imageUrl: null,
    categoryId: 1,
    authorId: 1,
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  getRelatedPosts: vi.fn().mockResolvedValue([]),
  getRecentPosts: vi.fn().mockResolvedValue([]),
  createPost: vi.fn().mockResolvedValue(1),
  updatePost: vi.fn().mockResolvedValue(undefined),
  deletePost: vi.fn().mockResolvedValue(undefined),
  createCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(undefined),
  createContactSubmission: vi.fn().mockResolvedValue(undefined),
  getAllContactSubmissions: vi.fn().mockResolvedValue([
    { id: 1, name: "João", email: "joao@email.com", phone: null, company: null, message: "Teste", read: false, createdAt: new Date() }
  ]),
  markContactAsRead: vi.fn().mockResolvedValue(undefined),
  deleteContactSubmission: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@consultoriaafk.com.br",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@email.com",
      name: "User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Categories API", () => {
  it("lists all categories (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const categories = await caller.categories.list();
    
    expect(categories).toHaveLength(2);
    expect(categories[0].name).toBe("Planejamento Financeiro");
  });

  it("gets category by slug (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const category = await caller.categories.getBySlug({ slug: "planejamento-financeiro" });
    
    expect(category).toBeDefined();
    expect(category?.name).toBe("Planejamento Financeiro");
  });

  it("creates category (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.categories.create({
      name: "Nova Categoria",
      description: "Descrição da categoria",
    });
    
    expect(result.success).toBe(true);
  });

  it("denies category creation for regular users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.categories.create({
      name: "Nova Categoria",
    })).rejects.toThrow("Acesso restrito a administradores");
  });
});

describe("Posts API", () => {
  it("lists published posts (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const posts = await caller.posts.list();
    
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("Post de Teste");
  });

  it("gets post by slug with category (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const post = await caller.posts.getBySlug({ slug: "post-de-teste" });
    
    expect(post).toBeDefined();
    expect(post?.title).toBe("Post de Teste");
    expect(post?.category).toBeDefined();
  });

  it("returns null for non-existent post", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const post = await caller.posts.getBySlug({ slug: "post-inexistente" });
    
    expect(post).toBeNull();
  });

  it("creates post (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.posts.create({
      title: "Novo Post",
      content: "Conteúdo do novo post",
      published: true,
    });
    
    expect(result.success).toBe(true);
    expect(result.id).toBe(1);
  });

  it("updates post (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.posts.update({
      id: 1,
      title: "Post Atualizado",
    });
    
    expect(result.success).toBe(true);
  });

  it("deletes post (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.posts.delete({ id: 1 });
    
    expect(result.success).toBe(true);
  });

  it("denies post creation for regular users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.posts.create({
      title: "Novo Post",
      content: "Conteúdo",
    })).rejects.toThrow("Acesso restrito a administradores");
  });
});

describe("Contact API", () => {
  it("submits contact form (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.contact.submit({
      name: "Maria",
      email: "maria@email.com",
      message: "Gostaria de mais informações",
    });
    
    expect(result.success).toBe(true);
  });

  it("lists contacts (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const contacts = await caller.contact.list();
    
    expect(contacts).toHaveLength(1);
    expect(contacts[0].name).toBe("João");
  });

  it("marks contact as read (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.contact.markAsRead({ id: 1 });
    
    expect(result.success).toBe(true);
  });

  it("deletes contact (admin only)", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.contact.delete({ id: 1 });
    
    expect(result.success).toBe(true);
  });

  it("denies contact list for regular users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.contact.list()).rejects.toThrow("Acesso restrito a administradores");
  });
});
