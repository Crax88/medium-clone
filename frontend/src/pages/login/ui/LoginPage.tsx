import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from 'features/session/login';
import { classNames as cn } from 'shared/lib';
import classes from './LoginPage.module.css';

const LoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const onLoginComplete = () => {
		navigate(location.state?.returnUrl ?? '/');
	};
	return (
		<div className={cn(classes.container, {}, [classes.login])}>
			<h2 className={classes.login_header}>Sign in</h2>
			<Link
				to="/register"
				className={classes.login_link}
				state={location.state}
			>
				Need an account?
			</Link>
			<div className={classes.login_form}>
				<LoginForm onComplete={onLoginComplete} />
			</div>
		</div>
	);
};

export default LoginPage;
