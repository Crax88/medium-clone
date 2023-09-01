import classes from './ProfilePage.module.css';
import { useEffect, type ReactNode, useMemo } from 'react';
import { FeedToggle } from 'features/feedToggle';
import { useParams, useLocation } from 'react-router-dom';
import { getQueryParams } from 'shared/lib';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth, selectUser } from 'entities/session';
import { useGetProfileQuery, ProfileCard } from 'entities/profile';
import { FollowProfile } from 'features/profile/followProfile';
import { EditProfile } from 'features/profile/editProfile';
import { GlobalArticlesList } from 'widgets/ArticlesList';

const ProfilePage = () => {
	const { username = '' } = useParams();
	const { pathname, search } = useLocation();
	const { page = 1 } = getQueryParams(search);
	const isAuth = useAppSelector(selectIsAuth);
	const user = useAppSelector(selectUser);

	const { data: profile } = useGetProfileQuery(
		{
			username,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

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
						<section className={classes.main}>
							<GlobalArticlesList
								query={{
									page: +page,
									author: pathname.includes('favorited') ? undefined : username,
									favorited: !pathname.includes('favorited')
										? undefined
										: username,
								}}
								pathName={pathname}
							/>
						</section>
					</main>
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
