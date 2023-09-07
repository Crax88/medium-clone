import { ArticleMeta, TArticle } from 'entities/article';
import { selectUser } from 'entities/session';
import { DeleteArticle } from 'features/article/deleteArticle';
import { EditArticle } from 'features/article/editArticle';
import FavoriteArticle from 'features/article/favoriteArticle/ui/FavoriteArticle';
import { FollowProfile } from 'features/profile/followProfile';
import { useAppSelector } from 'shared/model';

type TProps = {
	article: TArticle;
};

const ArticleMetaW = ({ article }: TProps) => {
	const user = useAppSelector(selectUser);

	return (
		<ArticleMeta
			article={article}
			actionsSlot={
				<>
					{user?.username === article.author.username && (
						<>
							<EditArticle slug={article.slug} />
							<DeleteArticle slug={article.slug} />
						</>
					)}
					<FollowProfile
						username={article.author.username}
						following={article.author.following}
					/>
					<FavoriteArticle
						favoritesCount={article.favoritesCount}
						isFavorited={article.favorited}
						slug={article.slug}
						size="large"
					/>
				</>
			}
		/>
	);
};

export default ArticleMetaW;
