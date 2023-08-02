import { z } from 'zod';

export const registerFormSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
		})
		.min(1, { message: 'Email is required' })
		.email({
			message: 'Must be a valid email',
		}),
	password: z
		.string({
			required_error: 'Password is required',
		})
		.min(6, {
			message: 'Password must be atleast 6 characters',
		}),
	username: z
		.string({
			required_error: 'Username is required',
		})
		.min(1, { message: 'Username is required' }),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
