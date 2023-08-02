import { type ReactNode } from 'react';
import { type TArticle, ArticlePreview } from 'entities/article';
import { FavoriteArticleBtn } from 'features/article/favoriteArticle';
import { Tag } from 'entities/tag';

type Props = {
	articles: TArticle[];
};

const ArticlesList = ({ articles }: Props) => {
	let content: ReactNode | null = null;
	if (!articles.length) {
		content = <p>No articles are here... yet</p>;
	} else {
		content = articles.map((article) => (
			<li key={article.slug}>
				<ArticlePreview
					article={article}
					actionsSlot={
						<FavoriteArticleBtn
							slug={article.slug}
							isFavorited={article.favorited}
							favoritesCount={article.favoritesCount}
						/>
					}
					bottomSlot={
						<ul
							style={{
								listStyle: 'none',
								display: 'flex',
								gap: '0.2rem',
							}}
						>
							{article.tagList.map((tag) => (
								<li key={tag}>
									<Tag
										tag={tag}
										variant="outlined"
									/>
								</li>
							))}
						</ul>
					}
				/>
			</li>
		));
	}

	return (
		<ul
			style={{
				listStyle: 'none',
				padding: 0,
				margin: 0,
			}}
		>
			{content}
		</ul>
	);
};

export default ArticlesList;
