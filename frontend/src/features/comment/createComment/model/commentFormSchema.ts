import { z } from 'zod';

export const commentFormSchema = z.object({
	body: z
		.string({ required_error: 'Required field' })
		.min(1, { message: 'Required field' }),
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;
