import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { NavLink, Outlet } from 'react-router-dom';

const NavigationMenu = styled.nav`
	position: relative;
	padding: 0.5rem 1rem;
`;
export const Container = styled.div`
	margin-left: auto;
	margin-right: auto;
	padding-left: 15px;
	padding-right: 15px;
	max-width: 940px;
`;
const active = css`
	color: black;
`;
const NavMenu = styled.ul`
	float: right;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	list-style: none;
	margin: 0;
	& li {
		flex: 1 1 auto;
		text-align: center;
	}
	& a {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 10px;
	}
`;
const navBrand = css`
	font-family: var(--ff-tillium);
	font-size: 1.5rem;
	padding-top: 0rem;
	margin-right: 2rem;
	color: hsl(var(--clr-primary));
`;
export const Layout = () => {
	return (
		<>
			<header>
				<NavigationMenu>
					<Container>
						<NavLink
							to="/"
							className={navBrand}
						>
							conduit
						</NavLink>
						<NavMenu>
							<li>
								<NavLink
									to="/"
									style={({ isActive }) => ({
										color: isActive ? '#000000' : '#A9A9A9',
									})}
								>
									Home
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/login"
									style={({ isActive }) => ({
										color: isActive ? '#000000' : '#A9A9A9',
									})}
								>
									Sign in
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/register"
									style={({ isActive }) => ({
										color: isActive ? '#000000' : '#A9A9A9',
									})}
								>
									Sign up
								</NavLink>
							</li>
						</NavMenu>
					</Container>
				</NavigationMenu>
			</header>
			<Outlet />
		</>
	);
};
