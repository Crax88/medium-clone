import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { Button } from 'components/Button';
import { Container } from 'components/Layout';
import { Link, NavLink } from 'react-router-dom';

export const contentCenter = css`
	margin: auto;
	max-width: 600px;
	min-width: 200px;
`;
export const formControl = css`
	display: block;
	width: 100%;
	font-weight: 400;
	line-height: 1.5;
	color: #212529;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid #ced4da;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	min-height: calc(1.5em + 1rem + 2px);
	padding: 0.5rem 1rem;
	font-size: 1.25rem;
	border-radius: 0.5rem;
`;

export const Title = styled.h1`
	font-weight: 500;
	color: #000000;
	margin-bottom: 0.5rem;
`;
export const center = css`
	text-align: center;
`;
export const navLinkHover = css`
	color: var(--brand-primary);
	:hover {
		color: #006400;
		text-decoration: underline;
	}
`;
export const form = css`
	display: flex;
	flex-direction: column;
	& div {
		margin-bottom: 15px;
	}
`;

export const FormButton = styled.div`
	display: flex;
	justify-content: right;
	& button:hover {
		background-color: #006400;
	}
	& button:focus {
		outline: none;
		box-shadow: 0 0 0 1px black;
	}
`;
export const LoginPage = () => {
	return (
		<div>
			<Container>
				<div className={contentCenter}>
					<Title className={center}>Sign in</Title>
					<p className={center}>
						<NavLink
							to="/register"
							className={navLinkHover}
						>
							Need an account?{' '}
						</NavLink>
					</p>
					<div className={form}>
						<form style={{ minWidth: 'content' }}>
							<div>
								<label htmlFor="login">Login</label>
								<input
									id="login"
									className={formControl}
								/>
							</div>
							<div>
								<label htmlFor="password">Password</label>
								<input
									id="password"
									className={formControl}
								/>
							</div>
						</form>
						<FormButton>
							<Button
								onClick={() => {}}
								border="none"
								color="var(--clr-primary)"
								padding="0.75rem 1.5rem"
								radius="0.3rem"
								children="Sign In"
							/>
						</FormButton>
					</div>
				</div>
			</Container>
		</div>
	);
};
