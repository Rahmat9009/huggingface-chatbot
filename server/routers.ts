import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createConversation,
  getConversationsByUser,
  getConversationMessages,
  addMessage,
  deleteConversation,
} from "./db";
import { generateChatResponse } from "./huggingface";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    createConversation: protectedProcedure
      .input(z.object({ title: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const result = await createConversation(ctx.user.id, input.title);
        return result;
      }),

    getConversations: protectedProcedure.query(async ({ ctx }) => {
      return getConversationsByUser(ctx.user.id);
    }),

    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        return getConversationMessages(input.conversationId);
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Add user message to database
          await addMessage(input.conversationId, "user", input.message);

          // Get conversation history for context
          const history = await getConversationMessages(input.conversationId);

          // Generate AI response
          const aiResponse = await generateChatResponse(
            history.map((msg) => ({
              role: msg.role,
              content: msg.content,
            }))
          );

          // Add AI response to database
          await addMessage(input.conversationId, "assistant", aiResponse);

          return {
            success: true,
            userMessage: input.message,
            assistantMessage: aiResponse,
          };
        } catch (error) {
          console.error("Error in sendMessage:", error);
          throw error;
        }
      }),

    clearConversation: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteConversation(input.conversationId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
