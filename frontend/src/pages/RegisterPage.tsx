import { Button } from 'components/Button';
import { Container } from 'components/Layout';
import { NavLink } from 'react-router-dom';
import {
	center,
	contentCenter,
	form,
	FormButton,
	formControl,
	navLinkHover,
	Title,
} from './LoginPage';

export const RegisterPage = () => {
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
								<label htmlFor="userName">User Name</label>
								<input
									id="userName"
									className={formControl}
								/>
							</div>
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
