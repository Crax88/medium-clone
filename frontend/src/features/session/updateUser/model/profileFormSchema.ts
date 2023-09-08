import { z } from 'zod';

export const profileFormSchema = z.object({
	image: z.string().url({ message: 'Must be a valid url' }),
	username: z
		.string({
			required_error: 'Username is required',
		})
		.min(1, { message: 'Username is required' }),
	bio: z.string(),
	email: z
		.string({ required_error: 'Required field' })
		.nonempty('Email is required')
		.email({
			message: 'Must be a valid email',
		}),
	password: z
		.union([
			z.string().min(6, { message: 'Password must be atleast 6 characters' }),
			z.string().length(0),
		])
		.optional()
		.transform((e) => (e === '' ? undefined : e)),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
