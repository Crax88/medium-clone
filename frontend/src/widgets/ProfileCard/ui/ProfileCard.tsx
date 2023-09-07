import { ProfileCard, useGetProfileQuery } from 'entities/profile';
import { selectUser } from 'entities/session';
import { EditProfile } from 'features/profile/editProfile';
import { FollowProfile } from 'features/profile/followProfile';
import { useAppSelector } from 'shared/model';
import { Spinner } from 'shared/ui/Spinner';

type Props = {
	username: string;
};

const ProfileCardW = ({ username }: Props) => {
	const session = useAppSelector(selectUser);
	const { data: profile, isLoading } = useGetProfileQuery(
		{
			username,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);
	if (isLoading) {
		return <Spinner />;
	}

	if (profile) {
		return (
			<ProfileCard
				profile={profile}
				actionSlot={
					session?.username === profile.username ? (
						<EditProfile />
					) : (
						<FollowProfile
							username={profile.username}
							following={profile.following}
						/>
					)
				}
			/>
		);
	}

	return null;
};

export default ProfileCardW;
