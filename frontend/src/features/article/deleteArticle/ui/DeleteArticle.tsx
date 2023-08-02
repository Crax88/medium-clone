import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/ui';
import { useDeleteArticleMutation, type TArticle } from 'entities/article';
import TrashIcon from '../asset/trashIcon.svg';
import { memo } from 'react';

type Props = {
	slug: TArticle['slug'];
};

const DeleteArticle = ({ slug }: Props) => {
	const navigate = useNavigate();
	const [deleteArticle, { isLoading }] = useDeleteArticleMutation();

	const handleClick = () => {
		deleteArticle({ slug })
			.unwrap()
			.then(() => {
				navigate('/');
			});
	};

	return (
		<Button
			onClick={handleClick}
			disabled={isLoading}
			variant="outlined"
			color="danger"
			size="small"
		>
			<div
				style={{
					display: 'flex',
					gap: '2px',
					alignItems: 'center',
				}}
			>
				<TrashIcon
					width={15}
					height={15}
				/>
				Delete Article
			</div>
		</Button>
	);
};

export default memo(DeleteArticle);
