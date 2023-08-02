import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/ui';
import { type TArticle } from 'entities/article';
import EditIcon from '../asset/editIcon.svg';
import { memo } from 'react';

type Props = {
	slug: TArticle['slug'];
};

const DeleteArticle = ({ slug }: Props) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/editor/${slug}`);
	};

	return (
		<Button
			onClick={handleClick}
			variant="outlined"
			size="small"
		>
			<div
				style={{
					display: 'flex',
					gap: '2px',
					alignItems: 'center',
				}}
			>
				<EditIcon
					width={15}
					height={15}
				/>
				Edit Article
			</div>
		</Button>
	);
};

export default memo(DeleteArticle);
