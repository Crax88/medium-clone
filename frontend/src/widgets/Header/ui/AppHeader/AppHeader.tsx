import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import classes from './AppHeader.module.css';

type Props = {
	navbarSlot: ReactNode;
};

const AppHeader = ({ navbarSlot }: Props) => {
	return (
		<header>
			<div className={classes.container}>
				<Link
					to="/"
					className={classes.logo}
				>
					conduit
				</Link>
				<nav>{navbarSlot}</nav>
			</div>
		</header>
	);
};

export default AppHeader;
