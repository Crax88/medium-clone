import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	type ArticlenFormSchema,
	articleFormSchema,
} from '../model/articleFormSchema';
import { Button, Input, Textarea } from 'shared/ui';
import classes from './ArticleForm.module.css';
import { useEffect } from 'react';
import { isFetchBaseQueryError, isValidationError } from 'shared/api';
import { TArticle, useCreateArticleMutation } from 'entities/article';
import { useUpdateArticleMutation } from 'entities/article/api/articleApi';

type Props = {
	onComplete?: (article: TArticle) => void;
	editArticle?: TArticle;
};

const ArticleForm = ({ onComplete, editArticle }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ArticlenFormSchema>({
		resolver: zodResolver(articleFormSchema),
		defaultValues: {
			title: editArticle?.title || '',
			description: editArticle?.description || '',
			body: editArticle?.body || '',
			tagList: editArticle?.tagList.join(',') || '',
		},
	});

	const [
		createArticle,
		{
			isLoading: createLoading,
			isSuccess: createSuccess,
			error: createError,
			data: newArticle,
		},
	] = useCreateArticleMutation();
	const [
		updateArticle,
		{
			isLoading: updateLoading,
			isSuccess: updateSuccess,
			error: updateError,
			data: updatedArticle,
		},
	] = useUpdateArticleMutation();

	const onSubmitHandler = (values: ArticlenFormSchema) => {
		const articleData = {
			title: values.title,
			description: values.description,
			body: values.body,
			tagList: values.tagList?.split(',') ?? [],
		};

		if (editArticle) {
			updateArticle({
				slug: editArticle.slug,
				values: articleData,
			});
		} else {
			createArticle(articleData);
		}
	};

	let serverError: string[] = [];

	if (createLoading || updateLoading) {
		serverError = [];
	} else if (createError || updateError) {
		const err = createError || updateError;
		if (isValidationError(err)) {
			for (const key in err.data.errors) {
				serverError.push(`${key} ${err.data.errors[key]}`);
			}
		} else if (isFetchBaseQueryError(err)) {
			serverError.push(JSON.stringify(err.data));
		} else {
			serverError.push(err?.message || 'Something went wrong');
		}
	}

	useEffect(() => {
		if (createSuccess && newArticle && onComplete) {
			onComplete(newArticle);
		}
		if (updateSuccess && onComplete && updatedArticle) {
			onComplete(updatedArticle);
		}
	}, [
		createSuccess,
		updateSuccess,
		onComplete,
		updateArticle,
		newArticle,
		updatedArticle,
	]);

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
					placeholder="Article Title"
					variant="large"
					{...register('title')}
				/>
				<p className={classes.error_message}>{errors.title?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="text"
					placeholder="What's this article about?"
					{...register('description')}
				/>
				<p className={classes.error_message}>{errors.description?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Textarea
					placeholder="Write your article (in markdown)"
					rows={8}
					{...register('body')}
				/>
				<p className={classes.error_message}>{errors.body?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Input
					type="text"
					placeholder="Enter tags"
					{...register('tagList')}
				/>
				<p className={classes.error_message}>{errors.tagList?.message}</p>
			</fieldset>
			<fieldset className={classes.form_group}>
				<Button
					color="primary"
					variant="contained"
					size="large"
					type="submit"
				>
					Publish Article
				</Button>
			</fieldset>
		</form>
	);
};

export default ArticleForm;
