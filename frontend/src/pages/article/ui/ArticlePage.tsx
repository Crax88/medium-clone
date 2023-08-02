import { marked } from 'marked';
import { useGetArticleQuery } from 'entities/article';
import { Link, useParams } from 'react-router-dom';
import classes from './ArticlePage.module.css';
import { FavoriteArticleBtn } from 'features/article/favoriteArticle';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth, selectUser } from 'entities/session';
import { DeleteArticle } from 'features/article/deleteArticle';
import { EditArticle } from 'features/article/editArticle';

const ArticlePage = () => {
	const { slug = '' } = useParams();
	const isAuth = useAppSelector(selectIsAuth);
	const user = useAppSelector(selectUser);
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
		const actions = (
			<>
				{isAuth && article.author.username === user?.username && (
					<EditArticle slug={slug} />
				)}
				{isAuth && article.author.username === user?.username && (
					<DeleteArticle slug={slug} />
				)}
				<FavoriteArticleBtn
					favoritesCount={article?.favoritesCount}
					isFavorited={article?.favorited}
					size="large"
					slug={article?.slug}
				/>
			</>
		);
		return (
			<div className={classes.page}>
				<div className={classes.banner}>
					<div className={classes.container}>
						<h1>{article.title}</h1>
						<div className={classes.article_actions}>
							<Link to={`/@${article.author.username}`}>
								<img
									src={article.author.image}
									alt={article.author.username}
								/>
							</Link>
							<div className={classes.info}>
								<Link
									className={classes.author}
									to={`/@${article.author.username}`}
								>
									{article.author.username}
								</Link>
								<span className={classes.date}>
									{new Intl.DateTimeFormat(undefined, {
										dateStyle: 'medium',
									}).format(new Date(article.createdAt))}
								</span>
							</div>
							<div
								style={{
									display: 'flex',
									gap: '0.5rem',
								}}
							>
								{actions}
							</div>
						</div>
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
						<Link to={`/@${article.author.username}`}>
							<img
								src={article.author.image}
								alt={article.author.username}
							/>
						</Link>
						<div className={classes.info}>
							<Link
								className={classes.author}
								to={`/@${article.author.username}`}
							>
								{article.author.username}
							</Link>
							<span className={classes.date}>
								{new Intl.DateTimeFormat(undefined, {
									dateStyle: 'medium',
								}).format(new Date(article.createdAt))}
							</span>
						</div>
						<div
							style={{
								display: 'flex',
								gap: '0.5rem',
							}}
						>
							{actions}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default ArticlePage;
