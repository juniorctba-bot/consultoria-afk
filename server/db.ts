import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, posts, contactSubmissions, postGalleryImages, tags, postTags, InsertCategory, InsertPost, InsertContactSubmission, InsertPostGalleryImage, InsertTag, InsertPostTag, Category, Post, PostGalleryImage, Tag, PostTag } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER FUNCTIONS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== CATEGORY FUNCTIONS ====================

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(categories).orderBy(categories.name);
  return result;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(data: InsertCategory): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(categories).values(data);
}

export async function updateCategory(id: number, data: Partial<InsertCategory>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(categories).where(eq(categories.id, id));
}

// ==================== POST FUNCTIONS ====================

export async function getAllPosts(includeUnpublished = false): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (includeUnpublished) {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }
  
  return await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt));
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(posts)
    .where(and(eq(posts.categoryId, categoryId), eq(posts.published, true)))
    .orderBy(desc(posts.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPost(data: InsertPost): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(posts).values(data);
  return Number(result[0].insertId);
}

export async function updatePost(id: number, data: Partial<InsertPost>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(posts).where(eq(posts.id, id));
}

export async function getRelatedPosts(postId: number, categoryId: number | null, limit = 3): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (!categoryId) {
    return await db.select().from(posts)
      .where(and(eq(posts.published, true), sql`${posts.id} != ${postId}`))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
  }
  
  return await db.select().from(posts)
    .where(and(
      eq(posts.published, true),
      eq(posts.categoryId, categoryId),
      sql`${posts.id} != ${postId}`
    ))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

// ==================== CONTACT FUNCTIONS ====================

export async function createContactSubmission(data: InsertContactSubmission): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(contactSubmissions).values(data);
}

export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function markContactAsRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contactSubmissions).set({ read: true }).where(eq(contactSubmissions.id, id));
}

export async function deleteContactSubmission(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
}

// ==================== GALLERY FUNCTIONS ====================

export async function getPostGalleryImages(postId: number): Promise<PostGalleryImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(postGalleryImages)
    .where(eq(postGalleryImages.postId, postId))
    .orderBy(postGalleryImages.sortOrder);
}

export async function addGalleryImage(data: InsertPostGalleryImage): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(postGalleryImages).values(data);
  return Number(result[0].insertId);
}

export async function updateGalleryImage(id: number, data: Partial<InsertPostGalleryImage>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(postGalleryImages).set(data).where(eq(postGalleryImages.id, id));
}

export async function deleteGalleryImage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(postGalleryImages).where(eq(postGalleryImages.id, id));
}

export async function deleteAllPostGalleryImages(postId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(postGalleryImages).where(eq(postGalleryImages.postId, postId));
}

// ==================== TAG FUNCTIONS ====================

export async function getAllTags(): Promise<Tag[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tags).orderBy(tags.name);
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTagById(id: number): Promise<Tag | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTag(data: InsertTag): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tags).values(data);
  return Number(result[0].insertId);
}

export async function updateTag(id: number, data: Partial<InsertTag>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(tags).set(data).where(eq(tags.id, id));
}

export async function deleteTag(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // First delete all post-tag relationships
  await db.delete(postTags).where(eq(postTags.tagId, id));
  // Then delete the tag
  await db.delete(tags).where(eq(tags.id, id));
}

// ==================== POST-TAG FUNCTIONS ====================

export async function getPostTags(postId: number): Promise<Tag[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ tag: tags })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId));
  
  return result.map(r => r.tag);
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ post: posts })
    .from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(and(eq(postTags.tagId, tagId), eq(posts.published, true)))
    .orderBy(desc(posts.publishedAt));
  
  return result.map(r => r.post);
}

export async function setPostTags(postId: number, tagIds: number[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete existing tags for this post
  await db.delete(postTags).where(eq(postTags.postId, postId));
  
  // Insert new tags
  if (tagIds.length > 0) {
    const values = tagIds.map(tagId => ({ postId, tagId }));
    await db.insert(postTags).values(values);
  }
}

export async function addPostTag(postId: number, tagId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(postTags).values({ postId, tagId });
}

export async function removePostTag(postId: number, tagId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(postTags).where(and(eq(postTags.postId, postId), eq(postTags.tagId, tagId)));
}

export async function getTagsWithPostCount(): Promise<(Tag & { postCount: number })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const allTags = await db.select().from(tags).orderBy(tags.name);
  
  const tagsWithCount = await Promise.all(
    allTags.map(async (tag) => {
      const countResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postTags)
        .innerJoin(posts, eq(postTags.postId, posts.id))
        .where(and(eq(postTags.tagId, tag.id), eq(posts.published, true)));
      
      return {
        ...tag,
        postCount: Number(countResult[0]?.count || 0),
      };
    })
  );
  
  return tagsWithCount;
}
