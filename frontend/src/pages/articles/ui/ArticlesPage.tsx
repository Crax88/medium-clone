import classes from './ArticlesPage.module.css';
import { useEffect, type ReactNode, useMemo } from 'react';
import { PopularTags } from 'widgets/PopularTags';
import { FeedToggle } from 'features/feedToggle';
import { useLocation } from 'react-router-dom';
import { getQueryParams } from 'shared/lib';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth } from 'entities/session';
import HashIcon from '../asset/hashIcon.svg';
import { GlobalArticlesList } from 'widgets/ArticlesList';

const ArticlesPage = () => {
	const { search, pathname } = useLocation();
	const isAuth = useAppSelector(selectIsAuth);
	const { tag, page = 1 } = getQueryParams(search);
	const isFeed = pathname === '/feed';

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
						<section className={classes.main}>
							<GlobalArticlesList
								query={{ tag, page: +page, isFeed }}
								pathName={pathname}
							/>
						</section>
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
