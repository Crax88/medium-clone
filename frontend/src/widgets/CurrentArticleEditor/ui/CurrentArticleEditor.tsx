import {
	TArticle,
	useGetArticleQuery,
	useUpdateArticleMutation,
} from 'entities/article';
import { TArticleCreateDto } from 'entities/article/api/types';
import { ArticleEditor } from 'features/article/editorArticle';
import { useNavigate } from 'react-router-dom';

type TProps = {
	slug: TArticle['slug'];
};

const CurrentArticleEditor = ({ slug }: TProps) => {
	const navigate = useNavigate();
	const [updateArticle, { isLoading, error }] = useUpdateArticleMutation();
	const {
		data: article,
		isLoading: articleLoading,
		error: articleError,
	} = useGetArticleQuery({ slug });

	const handleCreateArticle = (articleDto: TArticleCreateDto) => {
		updateArticle({ slug, values: articleDto })
			.unwrap()
			.then((article) => {
				navigate(`/article/${article.slug}`);
			});
	};

	return (
		<ArticleEditor
			initialArticle={{
				title: article?.title ?? '',
				description: article?.description ?? '',
				body: article?.body ?? '',
				tagList: article?.tagList ?? [],
			}}
			onSubmit={handleCreateArticle}
			isLoading={isLoading || articleLoading}
			error={error || articleError}
		/>
	);
};

export default CurrentArticleEditor;
