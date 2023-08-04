import { Link } from 'react-router-dom';
import { type TArticle } from '../model/types';
import classes from './ArticlePreview.module.css';
import { ReactNode } from 'react';

type Props = {
	article: TArticle;
	bottomSlot?: ReactNode;
	actionsSlot?: ReactNode;
};

const ArticlePreview = ({ article, bottomSlot, actionsSlot }: Props) => {
	return (
		<article className={classes.articlePreview}>
			<div className={classes.articleMeta}>
				<Link to={`/profile/${article.author.username}`}>
					<img
						src={article.author.image}
						alt={article.author.username}
					/>
				</Link>
				<div className={classes.info}>
					<Link
						to={`/profile/${article.author.username}`}
						className={classes.author}
					>
						{article.author.username}
					</Link>
					<span className={classes.date}>
						{new Intl.DateTimeFormat(undefined, {
							dateStyle: 'medium',
						}).format(new Date(article.createdAt))}
					</span>
				</div>
				<div className={classes.actions_container}>
					{actionsSlot && actionsSlot}
				</div>
			</div>
			<Link
				to={`/article/${article.slug}`}
				className={classes.previewLink}
			>
				<h2>{article.title}</h2>
				<p>{article.description}</p>
				<span>Read more...</span>
				{bottomSlot && <div className={classes.bottom}>{bottomSlot}</div>}
			</Link>
		</article>
	);
};

export default ArticlePreview;
