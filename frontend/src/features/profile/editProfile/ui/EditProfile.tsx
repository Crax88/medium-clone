import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/ui';
import GearIcon from '../asset/gearIcon.svg';
import { memo } from 'react';

const EditProfile = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/settings');
	};

	return (
		<Button
			onClick={handleClick}
			variant={'outlined'}
			color="default"
			size="small"
		>
			<div style={{ display: 'flex', gap: '2px' }}>
				<GearIcon
					width={20}
					height={20}
				/>

				<span>Edit Profile Settings</span>
			</div>
		</Button>
	);
};

export default memo(EditProfile);
