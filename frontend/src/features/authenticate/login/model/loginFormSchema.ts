import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
		})
		.nonempty('Email is required')
		.email({
			message: 'Must be a valid email',
		}),
	password: z
		.string({
			required_error: 'Password is required',
		})
		.nonempty('Password is required'),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
