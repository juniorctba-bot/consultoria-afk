import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("tags router", () => {
  it("lists all tags (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const tags = await caller.tags.list();

    expect(Array.isArray(tags)).toBe(true);
  });

  it("lists tags with post count (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const tags = await caller.tags.listWithCount();

    expect(Array.isArray(tags)).toBe(true);
    // Each tag should have a postCount property
    if (tags.length > 0) {
      expect(tags[0]).toHaveProperty("postCount");
    }
  });

  it("creates a new tag (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const uniqueSlug = `test-tag-${Date.now()}`;
    const result = await caller.tags.create({
      name: "Test Tag",
      slug: uniqueSlug,
      color: "#FF5733",
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
    expect(result).toHaveProperty("id");
  });

  it("gets tag by slug (public)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a tag
    const uniqueSlug = `slug-test-${Date.now()}`;
    await caller.tags.create({
      name: "Slug Test Tag",
      slug: uniqueSlug,
      color: "#00FF00",
    });

    // Then get it by slug
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);
    const tag = await publicCaller.tags.getBySlug({ slug: uniqueSlug });

    expect(tag).not.toBeNull();
    expect(tag?.slug).toBe(uniqueSlug);
  });

  it("updates a tag (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a tag
    const uniqueSlug = `update-test-${Date.now()}`;
    const created = await caller.tags.create({
      name: "Update Test",
      slug: uniqueSlug,
      color: "#0000FF",
    });

    // Then update it
    const updated = await caller.tags.update({
      id: created.id!,
      name: "Updated Tag Name",
      color: "#FF0000",
    });

    expect(updated.success).toBe(true);
  });

  it("deletes a tag (authenticated)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a tag
    const uniqueSlug = `delete-test-${Date.now()}`;
    const created = await caller.tags.create({
      name: "Delete Test",
      slug: uniqueSlug,
      color: "#FFFF00",
    });

    // Then delete it
    const result = await caller.tags.delete({ id: created.id! });

    expect(result.success).toBe(true);

    // Verify it's deleted by checking it's not in the list
    const tags = await caller.tags.list();
    const found = tags.find(t => t.slug === uniqueSlug);
    expect(found).toBeUndefined();
  });
});
