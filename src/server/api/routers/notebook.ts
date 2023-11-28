import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const notebookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notebook.create({
        data: {
          title: input.title,
          isPublic: input.isPublic,
          userId: ctx.auth.userId,
        },
      });
    }),

  addNode: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notebookId: z.string(),
        label: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const notebook = await ctx.db.notebook.findUnique({
        where: {
          id: input.notebookId,
        },
      });

      if (!notebook) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notebook not found",
        });
      }

      return ctx.db.node.create({
        data: {
          id: input.id,
          notebookId: input.notebookId,
          label: input.label,
        },
      });
    }),
  getNotebook: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.notebook.findUnique({
        where: {
          id: input.id,
        },
        include: {
          nodes: true,
        },
      });
    }),
});
