import { useGetArticlesQuery } from 'entities/article';
import classes from './ArticlesPage.module.css';
import { useEffect, type ReactNode, useMemo } from 'react';
import { PopularTags } from 'widgets/PopularTags';
import { ArticlesList } from 'widgets/ArticlesList';
import { FeedToggle } from 'features/feedToggle';
import { useLocation } from 'react-router-dom';
import { config, getQueryParams } from 'shared/lib';
import { Pagination } from 'widgets/Pagination';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth } from 'entities/session';
import HashIcon from '../asset/hashIcon.svg';

const ArticlesPage = () => {
	const { search, pathname } = useLocation();
	const isAuth = useAppSelector(selectIsAuth);
	const { tag, page = 1 } = getQueryParams(search);
	const isFeed = pathname === '/feed';

	const {
		data: articles,
		isLoading,
		isSuccess,
		isFetching,
		isError,
		error,
	} = useGetArticlesQuery(
		{
			tag,
			limit: config.pageSize,
			offset: (Number(page) - 1) * config.pageSize,
			isFeed,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

	let content: ReactNode | null = null;
	if (isLoading) {
		content = <div className={classes.articlePreview}>Loading articles...</div>;
	} else if (isSuccess) {
		content = (
			<>
				<ArticlesList articles={articles.articles} />
				{isFetching && (
					<div className={classes.articlePreview}>Loading articles...</div>
				)}
				<div className={classes.pagination_container}>
					<Pagination
						pageSize={10}
						itemsCount={articles.articlesCount}
						currentPage={Number(page)}
						href={pathname}
					/>
				</div>
			</>
		);
	} else if (isError) {
		content = <p>{JSON.stringify(error)}</p>;
	}

	const feedLinks = useMemo(() => {
		const links: {
			href: string;
			label: string | ReactNode;
			isActive: boolean;
		}[] = [
			{
				href: '/',
				label: 'Global Feed',
				isActive: !tag && !isFeed,
			},
		];
		if (isAuth) {
			links.unshift({
				href: '/feed',
				label: 'Your Feed',
				isActive: isFeed,
			});
		}
		if (tag) {
			links.push({
				href: `/?${tag}`,
				isActive: !!tag,
				label: (
					<>
						<HashIcon
							width={15}
							height={15}
						/>
						{tag}
					</>
				),
			});
		}
		return links;
	}, [isAuth, tag, isFeed]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [page]);

	return (
		<>
			{!isAuth && (
				<div className={classes.banner}>
					<div className={classes.container}>
						<h1>conduit</h1>
						<p>A place to share your knowledge.</p>
					</div>
				</div>
			)}
			<div className={classes.container}>
				<div className={classes.content}>
					<main>
						<FeedToggle links={feedLinks} />
						<section className={classes.main}>{content}</section>
					</main>
					<aside className={classes.aside}>
						<PopularTags />
					</aside>
				</div>
			</div>
		</>
	);
};

export default ArticlesPage;
