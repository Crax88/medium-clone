import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	type CommentFormSchema,
	commentFormSchema,
} from '../model/commentFormSchema';
import { Button, Textarea } from 'shared/ui';
import classes from './CommentEditor.module.css';
import { isFetchBaseQueryError, isValidationError } from 'shared/api';

import { TCommentCreateDto } from 'entities/comment/api/types';
import { ReactNode } from 'react';

type Props = {
	onSubmit: (
		comment: Pick<TCommentCreateDto, 'body'>,
		resetForm: () => void,
	) => void;
	initialComment: Pick<TCommentCreateDto, 'body'>;
	isLoading: boolean;
	error: unknown;
	footerSlot?: ReactNode;
};

const CommentEditor = ({
	onSubmit,
	initialComment,
	isLoading,
	error,
	footerSlot,
}: Props) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CommentFormSchema>({
		resolver: zodResolver(commentFormSchema),
		defaultValues: {
			...initialComment,
		},
	});

	const onSubmitHandler = (values: CommentFormSchema) => {
		onSubmit(values, () => reset());
	};

	const serverError: string[] = [];

	if (error) {
		if (isValidationError(error)) {
			for (const key in error.data.errors) {
				serverError.push(`${key} ${error.data.errors[key]}`);
			}
		} else if (isFetchBaseQueryError(error)) {
			serverError.push(JSON.stringify(error.data));
		} else if (error instanceof Error) {
			serverError.push(error?.message);
		} else {
			serverError.push('Server error');
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmitHandler)}
			className={classes.comment}
		>
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

			<fieldset className={classes.comment_header}>
				<Textarea
					placeholder="Write a comment..."
					rows={3}
					{...register('body')}
				/>
				<p className={classes.error_message}>{errors.body?.message}</p>
			</fieldset>

			<fieldset className={classes.comment_footer}>
				{footerSlot}
				<Button
					color="primary"
					variant="contained"
					type="submit"
					size="small"
					disabled={isLoading}
				>
					Post Comment
				</Button>
			</fieldset>
		</form>
	);
};

export default CommentEditor;
