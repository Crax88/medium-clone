import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	type ArticlenFormSchema,
	articleFormSchema,
} from '../model/articleFormSchema';
import { Button, Input, Textarea } from 'shared/ui';
import classes from './ArticleEditor.module.css';
import { isFetchBaseQueryError, isValidationError } from 'shared/api';
import { TArticleCreateDto } from 'entities/article/api/types';

type Props = {
	onSubmit: (article: TArticleCreateDto) => void;
	initialArticle: TArticleCreateDto;
	isLoading: boolean;
	error: unknown;
};

const ArticleEditor = ({
	onSubmit,
	initialArticle,
	isLoading,
	error,
}: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ArticlenFormSchema>({
		resolver: zodResolver(articleFormSchema),
		defaultValues: {
			...initialArticle,
			tagList: initialArticle.tagList.join(','),
		},
	});

	const onSubmitHandler = (values: ArticlenFormSchema) => {
		const articleData = {
			title: values.title,
			description: values.description,
			body: values.body,
			tagList: values.tagList?.split(',') ?? [],
		};

		onSubmit(articleData);
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
					disabled={isLoading}
				>
					Publish Article
				</Button>
			</fieldset>
		</form>
	);
};

export default ArticleEditor;
