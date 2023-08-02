import { Link } from 'react-router-dom';
import classes from './Footer.module.css';

const Footer = () => {
	return (
		<footer className={classes.footer}>
			<div className={classes.container}>
				<Link
					to="/"
					className={classes.logo}
				>
					conduit
				</Link>
				<span className={classes.attribution}>
					An interactive learning project from{' '}
					<a href="https://thinkster.io">Thinkster</a>. Code &amp; design
					licensed under MIT.
				</span>
			</div>
		</footer>
	);
};

export default Footer;
