import classes from './ProfilePage.module.css';
import { useEffect, type ReactNode, useMemo } from 'react';
import { FeedToggle } from 'features/feedToggle';
import { useParams, useLocation } from 'react-router-dom';
import { getQueryParams } from 'shared/lib';
import { GlobalArticlesList } from 'widgets/ArticlesList';
import { ProfileCard } from 'widgets/ProfileCard';

const ProfilePage = () => {
	const { username = '' } = useParams();
	const { pathname, search } = useLocation();
	const { page = 1 } = getQueryParams(search);

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

	return (
		<>
			<div className={classes.profile_wrapper}>
				<div className={classes.container}>
					<ProfileCard username={username} />
				</div>
			</div>

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
