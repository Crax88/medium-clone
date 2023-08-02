import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'shared/ui';
import { type TArticle } from 'entities/article';
import {
	useFavoriteArticleMutation,
	useUnfavoriteArticleMutation,
} from '../api/favoriteArticleApi';
import { useAppSelector } from 'shared/model/hooks';
import { selectIsAuth } from 'entities/session';
import HeartIcon from '../asset/heartIcon.svg';
import { memo } from 'react';

type Props = {
	slug: TArticle['slug'];
	isFavorited: TArticle['favorited'];
	favoritesCount: TArticle['favoritesCount'];
	size?: 'small' | 'large';
};

const FavoriteArticle = ({
	slug,
	isFavorited,
	favoritesCount,
	size = 'small',
}: Props) => {
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const isAuth = useAppSelector(selectIsAuth);
	const [favoriteArticle, { isLoading: favLoading }] =
		useFavoriteArticleMutation();
	const [unfavoriteArticle, { isLoading: unfavLoading }] =
		useUnfavoriteArticleMutation();
	const disabled = favLoading || unfavLoading;

	const handleClick = () => {
		if (!isAuth) {
			navigate('/login', {
				state: { returnUrl: pathname + search },
			});
		} else {
			isFavorited ? unfavoriteArticle({ slug }) : favoriteArticle({ slug });
		}
	};

	let content = '';
	if (isFavorited) {
		if (size !== 'small') {
			content += `Unfavorite Article (${favoritesCount})`;
		} else {
			content += favoritesCount;
		}
	} else {
		if (size !== 'small') {
			content += `Favorite Article (${favoritesCount})`;
		} else {
			content += favoritesCount;
		}
	}
	return (
		<Button
			onClick={handleClick}
			disabled={disabled}
			variant={isFavorited ? 'contained' : 'outlined'}
			color="primary"
			size="small"
		>
			<div style={{ display: 'flex', gap: '2px' }}>
				<HeartIcon
					width={20}
					height={20}
				/>
				{content}
			</div>
		</Button>
	);
};

export default memo(FavoriteArticle);
