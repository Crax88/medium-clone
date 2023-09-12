import { useCreateCommentMutation } from 'entities/comment';
import { selectIsAuth, selectUser } from 'entities/session';
import { CommentEditor } from 'features/comment/createComment';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'shared/model';
import classes from './NewCommentEditor.module.css';

type Props = { slug: string };

const NewCommentEditor = ({ slug }: Props) => {
	const isAuth = useAppSelector(selectIsAuth);
	const user = useAppSelector(selectUser);
	const [createComment, { isLoading, error }] = useCreateCommentMutation();

	if (!isAuth || !user) {
		return (
			<p>
				<Link to={'/login'}>Sign in</Link> or{' '}
				<Link to={'/register'}>sign up</Link> to add comments on this article.
			</p>
		);
	}

	if (isAuth && user) {
		return (
			<CommentEditor
				initialComment={{ body: '' }}
				onSubmit={(values, resetForm) => {
					createComment({ body: values.body, slug })
						.unwrap()
						.then(() => resetForm());
				}}
				isLoading={isLoading}
				error={error}
				footerSlot={
					<img
						className={classes.useravatar}
						src={user.image || ''}
						alt={user.username}
					/>
				}
			/>
		);
	}
	return null;
};

export default NewCommentEditor;
