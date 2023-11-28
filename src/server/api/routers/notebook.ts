import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

/**
 * Schema
 */
import { createNotebookSchema } from "~/schema";

export const notebookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createNotebookSchema)
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
      return ctx.db.node.create({
        data: {
          id: input.id,
          notebookId: input.notebookId,
          label: input.label,
        },
      });
    }),
  getNotebooks: protectedProcedure.query(async ({ ctx, input }) => {
    return ctx.db.notebook.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        title: true,
        isPublic: true,
      },
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.notebook.findUnique({
        where: {
          id: input.id,
        },
        include: {
          nodes: true,
          edges: true,
        },
      });
    }),
});
