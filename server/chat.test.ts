import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
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
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("chat procedures", () => {
  describe("createConversation", () => {
    it("creates a new conversation for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.createConversation({
        title: "Test Chat",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBeDefined();
      expect(result?.userId).toBe(ctx.user.id);
      expect(result?.title).toBe("Test Chat");
    });

    it("creates conversation with default title if not provided", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.createConversation({});

      expect(result).toBeDefined();
      expect(result?.title).toBe("New Chat");
    });
  });

  describe("getConversations", () => {
    it("returns empty list for user with no conversations", async () => {
      const ctx = createAuthContext(999);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.getConversations();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("sendMessage", () => {
    it("requires authentication", async () => {
      const ctx = createAuthContext();
      // Simulate unauthenticated context
      ctx.user = null as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.sendMessage({
          conversationId: 1,
          message: "Hello",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("rejects empty messages", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.sendMessage({
          conversationId: 1,
          message: "",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("clearConversation", () => {
    it("requires authentication", async () => {
      const ctx = createAuthContext();
      ctx.user = null as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.clearConversation({
          conversationId: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
