import { Link } from 'react-router-dom';
import { type TArticle } from '../../model/types';
import classes from './ArticleMeta.module.css';
import { ReactNode } from 'react';

type Props = {
	article: TArticle;
	actionsSlot?: ReactNode;
};

const ArticleMeta = ({ article, actionsSlot }: Props) => {
	return (
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
	);
};

export default ArticleMeta;
