import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	type RegisterFormSchema,
	registerFormSchema,
} from '../model/registerFormSchema';
import { Button, Input } from 'shared/ui';
import { useRegisterMutation } from 'entities/session';
import classes from './RegisterForm.module.css';
import { useEffect } from 'react';
import { isFetchBaseQueryError, isValidationError } from 'shared/api';

type Props = {
	onComplete?: () => void;
};

const RegisterForm = ({ onComplete }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormSchema>({
		resolver: zodResolver(registerFormSchema),
	});

	const [sendRegister, { isLoading, isSuccess, error }] = useRegisterMutation();

	const onSubmitHandler = (values: RegisterFormSchema) => {
		sendRegister(values);
	};

	let serverError: string[] = [];

	if (isLoading) {
		serverError = [];
	} else if (error) {
		if (isValidationError(error)) {
			for (const key in error.data.errors) {
				serverError.push(`${key} ${error.data.errors[key].join(',')}`);
			}
		} else if (isFetchBaseQueryError(error)) {
			serverError.push(JSON.stringify(error.data));
		} else {
			serverError.push(error.message || 'Something went wrong');
		}
	}

	useEffect(() => {
		if (isSuccess && onComplete) {
			onComplete();
		}
	}, [isSuccess, onComplete]);

	return (
		<form onSubmit={handleSubmit(onSubmitHandler)}>
			<ul className={classes.errors_container}>
				{serverError.map((err) => (
					<p
						key={err}
						className={classes.error_message}
					>
						{err}
					</p>
				))}
			</ul>
			<fieldset className={classes.form_group}>
				<Input
					type="text"
					placeholder="Username"
					variant="large"
					autoComplete="new-username"
					{...register('username')}
				/>
				<p className={classes.error_message}>{errors.email?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="text"
					placeholder="Email"
					variant="large"
					autoComplete="new-email"
					{...register('email')}
				/>
				<p className={classes.error_message}>{errors.email?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="password"
					placeholder="Password"
					variant="large"
					autoComplete="new-password"
					{...register('password')}
				/>
				<p className={classes.error_message}>{errors.password?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Button
					color="primary"
					variant="contained"
					size="large"
					type="submit"
					disabled={isLoading}
				>
					Sign up
				</Button>
			</fieldset>
		</form>
	);
};

export default RegisterForm;
