import { Button, Input, Textarea } from 'shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	ProfileFormSchema,
	profileFormSchema,
} from '../model/profileFormSchema';
import { useForm } from 'react-hook-form';
import classes from './UpdateProfileForm.module.css';
import { useUpdateUserMutation } from '../api/updateUserApi';
import { isFetchBaseQueryError, isValidationError } from 'shared/api';

type TProps = {
	profile: ProfileFormSchema;
	onComplete?: () => void;
};

const UpdateProfileForm = ({ profile, onComplete }: TProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormSchema>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			username: profile.username,
			email: profile.email,
			image: profile.image,
			bio: profile.bio,
		},
	});

	const [updateUser, { isLoading, error }] = useUpdateUserMutation();

	const onSubmitHandler = (values: ProfileFormSchema) => {
		updateUser({ ...values, password: values.password ?? null })
			.unwrap()
			.then(() => {
				onComplete && onComplete();
			});
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
					placeholder="URL of profile picture"
					autoComplete="new-image"
					{...register('image')}
				/>
				<p className={classes.error_message}>{errors.image?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="text"
					variant="large"
					placeholder="Your Name"
					autoComplete="new-username"
					{...register('username')}
				/>
				<p className={classes.error_message}>{errors.username?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Textarea
					placeholder="Short bio about you"
					autoComplete="new-bio"
					rows={8}
					{...register('bio')}
				/>
				<p className={classes.error_message}>{errors.bio?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="text"
					variant="large"
					placeholder="Email"
					autoComplete="new-email"
					{...register('email')}
				/>
				<p className={classes.error_message}>{errors.email?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="password"
					variant="large"
					placeholder="New Password"
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
					Update Settings
				</Button>
			</fieldset>
		</form>
	);
};

export default UpdateProfileForm;
