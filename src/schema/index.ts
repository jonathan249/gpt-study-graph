import * as z from "zod";
import { AppRouter } from "~/server/api/root";
import { RouterInputs } from "~/utils";

export const createNotebookSchema = z.object({
  title: z.string().min(1).max(50),
  isPublic: z.boolean().default(false),
});

export type TCreateNotebook = RouterInputs["notebook"]["create"];
