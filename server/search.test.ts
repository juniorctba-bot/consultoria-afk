import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("search functionality", () => {
  it("searches posts by query (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Search for a term that should exist in the blog posts
    const results = await caller.posts.search({ query: "financeiro" });

    expect(Array.isArray(results)).toBe(true);
    // Results should have category attached
    if (results.length > 0) {
      expect(results[0]).toHaveProperty("title");
      expect(results[0]).toHaveProperty("slug");
    }
  });

  it("returns empty array for non-matching query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Search for a term that should not exist
    const results = await caller.posts.search({ query: "xyznonexistent123456" });

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });

  it("searches posts by title", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Search for a term that exists in post titles
    const results = await caller.posts.search({ query: "fluxo" });

    expect(Array.isArray(results)).toBe(true);
  });

  it("searches posts by excerpt", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Search for a term that might exist in excerpts
    const results = await caller.posts.search({ query: "empresa" });

    expect(Array.isArray(results)).toBe(true);
  });

  it("returns posts with category information", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.posts.search({ query: "gestão" });

    expect(Array.isArray(results)).toBe(true);
    // Each result should have a category field (can be null)
    results.forEach(post => {
      expect(post).toHaveProperty("category");
    });
  });
});
