import { Button } from 'shared/ui';
import TrashIcon from '../asset/trashIcon.svg';
import { useDeleteCommentMutation } from 'entities/comment';

type Props = {
	slug: string;
	id: number;
};

const DeleteComment = ({ slug, id }: Props) => {
	const [deleteComment, { isLoading }] = useDeleteCommentMutation();
	const handleClick = () => {
		deleteComment({ slug, id });
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
			</div>
		</Button>
	);
};

export default DeleteComment;
