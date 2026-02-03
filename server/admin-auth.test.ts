import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext; cookies: Record<string, string> } {
  const cookies: Record<string, string> = {};

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

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: any) => {
        cookies[name] = value;
      },
      clearCookie: (name: string) => {
        delete cookies[name];
      },
    } as any,
  };

  return { ctx, cookies };
}

describe("adminAuth", () => {
  it("verifies correct admin password", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.verifyPassword({
      password: "AFK@2309",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects incorrect admin password", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.adminAuth.verifyPassword({
        password: "wrongpassword",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Senha inválida");
    }
  });

  it("sets admin authentication cookie on successful login", async () => {
    const { ctx, cookies } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await caller.adminAuth.verifyPassword({
      password: "AFK@2309",
    });

    expect(cookies["admin_authenticated"]).toBe("true");
  });

  it("clears admin authentication cookie on logout", async () => {
    const { ctx, cookies } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First login
    await caller.adminAuth.verifyPassword({
      password: "AFK@2309",
    });
    expect(cookies["admin_authenticated"]).toBe("true");

    // Then logout
    await caller.adminAuth.logout();
    expect(cookies["admin_authenticated"]).toBeUndefined();
  });
});
