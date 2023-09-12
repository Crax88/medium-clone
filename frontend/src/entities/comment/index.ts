export { type TComment } from './model/types';
export {
	commentApi,
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
} from './api/commentApi';
export { default as CommentCard } from './ui/CommentCard';
