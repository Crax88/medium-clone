import { ReactNode } from 'react';
import { TProfile } from '../model/types';
import classes from './ProfileCard.module.css';

type Props = {
	profile: TProfile;
	actionSlot?: ReactNode;
};
const ProfileCard = ({ profile, actionSlot }: Props) => {
	return (
		<div className={classes.profile_card}>
			<div className={classes.profile_info}>
				<img
					src={profile.image}
					alt={profile.username}
					className={classes.profile_image}
				/>
				<h4 className={classes.profile_name}>{profile.username}</h4>
				<p className={classes.profile_bio}>{profile.bio}</p>
			</div>
			<div className={classes.profile_actions}>{actionSlot}</div>
		</div>
	);
};

export default ProfileCard;
