import { NavLink } from 'react-router-dom';
import classes from './FeedToggle.module.css';
import { classNames as cn } from 'shared/lib';
import { ReactNode, memo } from 'react';

type Props = {
	links: {
		href: string;
		label: string | ReactNode;
		isActive?: boolean;
	}[];
};

const FeedToggle = ({ links }: Props) => {
	return (
		<nav className={classes.feed_toggle}>
			<ul className={classes.feed_toggle__list}>
				{links.map((link) => {
					return (
						<li key={link.href}>
							<NavLink
								to={link.href}
								className={cn(classes.feed_toggle__item, {
									[classes['feed_toggle__item-active']]: link.isActive,
								})}
							>
								{link.label}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default memo(FeedToggle);
