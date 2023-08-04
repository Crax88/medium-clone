import classes from './ProfilePage.module.css';
import { useEffect, type ReactNode, useMemo } from 'react';
import { ArticlesList } from 'widgets/ArticlesList';
import { FeedToggle } from 'features/feedToggle';
import { useParams, useLocation } from 'react-router-dom';
import { config, getQueryParams } from 'shared/lib';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth, selectUser } from 'entities/session';
import { useGetProfileQuery, ProfileCard } from 'entities/profile';
import { useGetArticlesQuery } from 'entities/article';
import { Pagination } from 'widgets/Pagination';
import { FollowProfile } from 'features/profile/followProfile';
import { EditProfile } from 'features/profile/editProfile';

const ProfilePage = () => {
	const { username = '' } = useParams();
	const { pathname, search } = useLocation();
	const { page = 1 } = getQueryParams(search);
	const isAuth = useAppSelector(selectIsAuth);
	const user = useAppSelector(selectUser);

	const {
		data: profile,
		// isLoading: profileIsLoading,
		// isSuccess: profileIsSuccess,
		// isError: profileIsError,
		// error: profileError,
	} = useGetProfileQuery(
		{
			username,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

	const {
		data: articles,
		isLoading: articlesIsLoading,
		isSuccess: articlesIsSuccess,
		isFetching: articlesIsFetching,
		isError: articlesIsError,
		error: articlesError,
	} = useGetArticlesQuery(
		{
			...(pathname.includes('favorited')
				? { favorited: username }
				: { author: username }),
			limit: config.pageSize,
			offset: (Number(page) - 1) * config.pageSize,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

	let content: ReactNode | null = null;
	if (articlesIsLoading) {
		content = <div className={classes.articlePreview}>Loading articles...</div>;
	} else if (articlesIsSuccess) {
		content = (
			<>
				<ArticlesList articles={articles.articles} />
				{articlesIsFetching && (
					<div className={classes.articlePreview}>Loading articles...</div>
				)}
				<div className={classes.pagination_container}>
					<Pagination
						pageSize={10}
						itemsCount={articles.articlesCount}
						currentPage={Number(page)}
						href={`${pathname}`}
					/>
				</div>
			</>
		);
	} else if (articlesIsError) {
		content = <p>{JSON.stringify(articlesError)}</p>;
	}

	const feedLinks = useMemo(() => {
		const links: {
			href: string;
			label: string | ReactNode;
			isActive: boolean;
		}[] = [
			{
				href: `/profile/${username}`,
				label: 'My Articles',
				isActive: !pathname.includes('favorited'),
			},
			{
				href: `/profile/${username}/favorited`,
				label: 'Favorited Articles',
				isActive: pathname.includes('favorited'),
			},
		];

		return links;
	}, [username, pathname]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [pathname]);

	const follow = useMemo(() => {
		if (profile && user?.username !== username) {
			return (
				<FollowProfile
					key={1}
					following={profile.following}
					username={profile.username}
				/>
			);
		}
		return null;
	}, [profile, username, user?.username]);

	const edit = useMemo(() => {
		if (isAuth && user?.username === username) {
			return <EditProfile />;
		}
		return null;
	}, [isAuth, username, user?.username]);

	return (
		<>
			{profile && (
				<div className={classes.profile_wrapper}>
					<div className={classes.container}>
						<ProfileCard
							profile={profile}
							actionSlot={
								<>
									{edit}
									{follow}
								</>
							}
						/>
					</div>
				</div>
			)}
			<div className={classes.container}>
				<div className={classes.content}>
					<main>
						<FeedToggle links={feedLinks} />
						<section className={classes.main}>{content}</section>
					</main>
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
