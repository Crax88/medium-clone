import { selectIsAuth, selectUser } from 'entities/session';
import { NavLink } from 'react-router-dom';
import classes from './Navbar.module.css';
import { ReactNode } from 'react';
import { useAppSelector } from 'shared/model/hooks';
import EditIcon from '../asset/editIcon.svg';
import GearIcon from '../asset/gearIcon.svg';

const Navbar = () => {
	const isAuth = useAppSelector(selectIsAuth);
	const user = useAppSelector(selectUser);

	let content: ReactNode = '';

	if (!isAuth) {
		content = (
			<>
				<li>
					<NavLink
						to="/"
						className={({ isActive }) => {
							return isActive ? classes['active-link'] : '';
						}}
					>
						Home
					</NavLink>
				</li>
				<li>
					<NavLink to="/login">Sign in</NavLink>
				</li>
				<li>
					<NavLink to="/register">Sign up</NavLink>
				</li>
			</>
		);
	} else {
		content = (
			<>
				<li>
					<NavLink
						to="/"
						className={({ isActive }) => {
							return isActive ? classes['active-link'] : '';
						}}
					>
						Home
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/editor"
						className={({ isActive }) => {
							return isActive ? classes['active-link'] : '';
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '5px',
							}}
						>
							<EditIcon
								width={20}
								height={20}
								fill="currentColor"
							/>
							New Article
						</div>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/setting"
						className={({ isActive }) => {
							return isActive ? classes['active-link'] : '';
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '5px',
							}}
						>
							<GearIcon
								width={20}
								height={20}
								fill="currentColor"
							/>
							Settings
						</div>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/setting"
						className={({ isActive }) => {
							return isActive ? classes['active-link'] : '';
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '5px',
							}}
						>
							<img
								src={user?.image || ''}
								alt={user?.username}
								style={{
									width: '32px',
									aspectRatio: 1,
									borderRadius: '50%',
								}}
							/>
							<span>{user?.username}</span>
						</div>
					</NavLink>
				</li>
			</>
		);
	}

	return <ul className={classes.nav}>{content}</ul>;
};

export default Navbar;
