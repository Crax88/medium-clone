import { marked } from 'marked';
import { useGetArticleQuery } from 'entities/article';
import { useParams } from 'react-router-dom';
import classes from './ArticlePage.module.css';
import { ArticleMeta } from 'widgets/ArticleMeta';
import { CommentsList } from 'widgets/CommentsList';
import { NewCommentEditor } from 'widgets/NewCommentEditor';

const ArticlePage = () => {
	const { slug = '' } = useParams();

	const {
		data: article,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetArticleQuery({ slug });

	if (isLoading) {
		return <p>Loading article...</p>;
	}
	if (isError) {
		return <p>{JSON.stringify(error)}</p>;
	}
	if (isSuccess) {
		const articleBody = marked(article.body);

		return (
			<div className={classes.page}>
				<div className={classes.banner}>
					<div className={classes.container}>
						<h1>{article.title}</h1>
						<ArticleMeta article={article} />
					</div>
				</div>
				<div className={classes.container}>
					<div
						className={classes.article_body}
						dangerouslySetInnerHTML={{
							__html: articleBody,
						}}
					></div>
					<hr
						style={{
							marginTop: '1rem',
							marginBottom: '1rem',
							border: '1px solid hsl(var(--clr-light-gray))',
						}}
					/>
					<div
						className={classes.article_actions}
						style={{ justifyContent: 'center' }}
					>
						<ArticleMeta article={article} />
					</div>
					<div style={{ margin: 'auto', maxWidth: '66%' }}>
						<NewCommentEditor slug={article.slug} />
						<br />
						<CommentsList slug={article.slug} />
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default ArticlePage;
