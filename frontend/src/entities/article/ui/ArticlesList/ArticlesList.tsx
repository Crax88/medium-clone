import { TArticle } from 'entities/article/model/types';
import { ReactNode } from 'react';
import classes from './ArticlesList.module.css';

type Props = {
	isLoading: boolean;
	articles: TArticle[];
	renderArticle: (article: TArticle) => ReactNode;
};

const ArticlesList = ({ isLoading, articles, renderArticle }: Props) => {
	if (isLoading) {
		return <div className={classes.articlePreview}>Loading articles...</div>;
	}
	if (articles.length === 0) {
		return (
			<div className={classes.articlePreview}>No articles are here...yet</div>
		);
	}
	return (
		<ul
			style={{
				listStyle: 'none',
				padding: 0,
				margin: 0,
			}}
		>
			{articles.map(renderArticle)}
		</ul>
	);
};

export default ArticlesList;
