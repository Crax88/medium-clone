import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'shared/ui';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth } from 'entities/session';
import PlusIcon from '../asset/plusIcon.svg';
import MinusIcon from '../asset/minusIcon.svg';
import { memo } from 'react';
import { TProfile } from 'entities/profile';
import {
	useFollowProfileMutation,
	useUnfollowProfileMutation,
} from '../api/followProfile.Api';

type Props = {
	username: TProfile['username'];
	following: TProfile['following'];
};

const FollowProfile = ({ username, following }: Props) => {
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const isAuth = useAppSelector(selectIsAuth);
	const [followProfile, { isLoading: followLoading }] =
		useFollowProfileMutation();
	const [unfollowProfile, { isLoading: unfollowLoading }] =
		useUnfollowProfileMutation();
	const disabled = followLoading || unfollowLoading;

	const handleClick = () => {
		if (!isAuth) {
			navigate('/login', {
				state: { returnUrl: pathname + search },
			});
		} else {
			following ? unfollowProfile({ username }) : followProfile({ username });
		}
	};

	// let content = '';
	// if (following) {
	// 	content += (
	// 		<>
	// 			<span>Unfollow</span> <span>{username}</span>`
	// 		</>
	// 	);
	// } else {
	// 	content += (
	// 		<>
	// 			<span>Follow</span> <span>{username}</span>`
	// 		</>
	// 	);
	// }
	return (
		<Button
			onClick={handleClick}
			disabled={disabled}
			variant={'outlined'}
			color="default"
			size="small"
		>
			<div
				style={{
					display: 'flex',
					gap: '.5em',
					alignItems: 'center',
				}}
			>
				{following ? (
					<MinusIcon
						width={15}
						height={15}
					/>
				) : (
					<PlusIcon
						width={15}
						height={15}
					/>
				)}
				<span>{following ? 'Unfollow' : 'Follow'}</span>
				<span>{username}</span>
			</div>
		</Button>
	);
};

export default memo(FollowProfile);
