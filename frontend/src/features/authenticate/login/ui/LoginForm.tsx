import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	type LoginFormSchema,
	loginFormSchema,
} from '../model/loginFormSchema';
import { Button, Input } from 'shared/ui';
import { useLoginMutation } from 'entities/session';
import classes from './LoginForm.module.css';
import { useEffect } from 'react';
import { isFetchBaseQueryError, isValidationError } from 'shared/api';

type Props = {
	onComplete?: () => void;
};

const LoginForm = ({ onComplete }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,
	} = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
		mode: 'onBlur',
	});

	const [login, { isLoading, isSuccess, error }] = useLoginMutation();

	const onSubmitHandler = (values: LoginFormSchema) => {
		login(values);
	};

	let serverError: string[] = [];

	if (isLoading) {
		serverError = [];
	} else if (error) {
		if (isValidationError(error)) {
			for (const key in error.data.errors) {
				serverError.push(`${key} ${error.data.errors[key]}`);
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

	useEffect(() => {
		setFocus('email');
	}, [setFocus]);

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
					type="email"
					placeholder="Email"
					variant="large"
					autoComplete="current-email"
					required
					formNoValidate={true}
					aria-invalid={errors.email ? true : false}
					aria-errormessage={errors.email ? errors.email?.message : ''}
					{...register('email')}
				/>
				<p className={classes.error_message}>{errors.email?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="password"
					placeholder="Password"
					variant="large"
					autoComplete="current-password"
					required
					formNoValidate={true}
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
					Sign in
				</Button>
			</fieldset>
		</form>
	);
};

export default LoginForm;
