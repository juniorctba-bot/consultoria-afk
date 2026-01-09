import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
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

describe("gallery router", () => {
  it("allows public access to getByPost", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw for public access
    const result = await caller.gallery.getByPost({ postId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("requires admin for add operation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.gallery.add({
        postId: 1,
        imageUrl: "https://example.com/image.jpg",
      })
    ).rejects.toThrow();
  });

  it("requires admin for delete operation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.gallery.delete({ id: 1 })).rejects.toThrow();
  });

  it("requires admin for update operation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.gallery.update({ id: 1, caption: "New caption" })
    ).rejects.toThrow();
  });

  it("requires admin for deleteAll operation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.gallery.deleteAll({ postId: 1 })).rejects.toThrow();
  });
});
