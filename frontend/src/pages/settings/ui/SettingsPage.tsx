import classes from './SettingsPage.module.css';
import { ProfileSettings } from 'widgets/ProfileSettings';

const SettingsPage = () => {
	return (
		<div className={classes.container}>
			<h1 className={classes.title}>your settings</h1>
			<ProfileSettings />
			<hr />
		</div>
	);
};

export default SettingsPage;
