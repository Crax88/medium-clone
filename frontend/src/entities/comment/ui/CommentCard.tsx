import { ReactNode } from 'react';
import { type TComment } from '../model/types';
import classes from './CommentCard.module.css';
import { Link } from 'react-router-dom';

type Props = {
	comment: TComment;
	actionsSlot?: ReactNode;
};

const CommentCard = ({ comment, actionsSlot }: Props) => {
	return (
		<div className={classes.comment}>
			<div className={classes.comment_header}>
				<p className={classes.comment_text}>{comment.body}</p>
			</div>
			<div className={classes.comment_footer}>
				<Link
					className={classes.comment_footer_img}
					to={`/profile/${comment.author.username}`}
				>
					<img
						src={comment.author.image}
						alt={comment.author.username}
					/>
				</Link>
				<Link
					className={classes.comment_footer_username}
					to={`/profile/${comment.author.username}`}
				>
					<span>{comment.author.username}</span>
				</Link>
				<span className={classes.comment_footer_date}>
					{new Intl.DateTimeFormat(undefined, {
						dateStyle: 'medium',
					}).format(new Date(comment.createdAt))}
				</span>
				<div className={classes.comment_footer_actions}>{actionsSlot}</div>
			</div>
		</div>
	);
};

export default CommentCard;
