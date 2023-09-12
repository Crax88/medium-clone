import { CommentCard, useGetCommentsQuery } from 'entities/comment';
import { DeleteComment } from 'features/comment/deleteComment';
import { useAppSelector } from 'shared/model';
import { selectIsAuth, selectUser } from 'entities/session';
import { Spinner } from 'shared/ui/Spinner';

type Props = {
	slug: string;
};

const CommentsList = ({ slug }: Props) => {
	const isAuth = useAppSelector(selectIsAuth);
	const user = useAppSelector(selectUser);

	const {
		data: comments,
		isLoading,
		error,
		isError,
		isSuccess,
	} = useGetCommentsQuery(
		{ slug },
		{ refetchOnFocus: true, refetchOnMountOrArgChange: true },
	);

	if (isLoading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Spinner />
			</div>
		);
	}
	if (isError) {
		return <div>{JSON.stringify(error)}</div>;
	}
	if (isSuccess) {
		return (
			<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
				{comments.comments.map((comment) => {
					return (
						<li
							key={comment.id}
							style={{ marginBottom: '0.75rem' }}
						>
							<CommentCard
								comment={comment}
								actionsSlot={
									isAuth && user?.username === comment.author.username ? (
										<DeleteComment
											slug={slug}
											id={comment.id}
										/>
									) : null
								}
							/>
						</li>
					);
				})}
			</ul>
		);
	}
	return null;
};

export default CommentsList;
