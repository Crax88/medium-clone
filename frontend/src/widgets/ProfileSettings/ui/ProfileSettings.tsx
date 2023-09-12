import { selectUser } from 'entities/session';
import { UpdateProfileForm } from 'features/session/updateUser';
import { useAppSelector } from 'shared/model';

const ProfileSettings = () => {
	const user = useAppSelector(selectUser);

	return (
		<UpdateProfileForm
			profile={{
				username: user?.username ?? '',
				bio: user?.bio ?? '',
				email: user?.email ?? '',
				image: user?.image ?? '',
			}}
		/>
	);
};

export default ProfileSettings;
