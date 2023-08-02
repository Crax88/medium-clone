import { Link, useLocation, useNavigate } from 'react-router-dom';
import { classNames as cn } from 'shared/lib';
import classes from './RegisterPage.module.css';
import { RegisterForm } from 'features/authenticate/register';

const RegisterPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const onRegisterComplete = () => {
		navigate(location.state?.returnUrl ?? '/');
	};
	return (
		<div className={cn(classes.container, {}, [classes.login])}>
			<h2 className={classes.login_header}>Sign in</h2>
			<Link
				to="/login"
				className={classes.login_link}
				state={location.state}
			>
				Have an account?
			</Link>
			<div className={classes.login_form}>
				<RegisterForm onComplete={onRegisterComplete} />
			</div>
		</div>
	);
};

export default RegisterPage;
