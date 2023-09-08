import { z } from 'zod';

export const articleFormSchema = z.object({
	title: z
		.string({ required_error: 'Required field' })
		.min(1, { message: 'Required field' }),
	description: z
		.string({ required_error: 'Required field' })
		.min(1, { message: 'Required field' }),
	body: z
		.string({ required_error: 'Required field' })
		.min(1, { message: 'Required field' }),
	tagList: z.string({ required_error: 'Required field' }).optional(),
});

export type ArticlenFormSchema = z.infer<typeof articleFormSchema>;
