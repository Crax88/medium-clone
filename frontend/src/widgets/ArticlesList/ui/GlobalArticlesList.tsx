import { config } from 'shared/lib';
import {
	ArticleMeta,
	ArticlePreview,
	ArticlesList,
	useGetArticlesQuery,
} from 'entities/article';
// import { useAppSelector } from 'shared/model';
import { Pagination } from 'shared/ui';
// import { selectIsAuth } from 'entities/session';
import classes from './GlobalArticlesList.module.css';
import { FavoriteArticleBtn } from 'features/article/favoriteArticle';

type Props = {
	query: {
		page: number;
		tag?: string;
		isFeed?: boolean;
		author?: string;
		favorited?: string;
	};
	pathName: string;
};

const GlobalArticlesList = ({ query, pathName }: Props) => {
	const { page, tag, isFeed, favorited, author } = query;
	// const isAuth = useAppSelector(selectIsAuth);

	const { data: articles, isLoading } = useGetArticlesQuery(
		{
			tag,
			limit: config.pageSize,
			offset: (Number(page) - 1) * config.pageSize,
			isFeed,
			favorited,
			author,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);
	return (
		<>
			<ArticlesList
				articles={articles?.articles || []}
				isLoading={isLoading}
				renderArticle={(article) => {
					return (
						<ArticlePreview
							article={article}
							meta={
								<ArticleMeta
									article={article}
									actionsSlot={
										<FavoriteArticleBtn
											slug={article.slug}
											favoritesCount={article.favoritesCount}
											isFavorited={article.favorited}
										/>
									}
								/>
							}
						/>
					);
				}}
			/>
			<div className={classes.pagination_container}>
				<Pagination
					pageSize={10}
					itemsCount={articles?.articlesCount || 0}
					currentPage={page}
					href={`${pathName}${tag ? '?tag=' + tag : ''}`}
				/>
			</div>
		</>
	);
};

export default GlobalArticlesList;
