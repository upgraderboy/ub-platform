import { z } from 'zod';

export const TerminalCommandSchema = z.object({
  command: z.string().min(1),
  description: z.string(),
  output: z.string(),
  aliases: z.array(z.string()).default([]),
});
export type TerminalCommand = z.infer<typeof TerminalCommandSchema>;
