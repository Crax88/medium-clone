import { useCreateArticleMutation } from 'entities/article';
import { TArticleCreateDto } from 'entities/article/api/types';
import { ArticleEditor } from 'features/article/editorArticle';
import { useNavigate } from 'react-router-dom';

const defaultArticle: TArticleCreateDto = {
	title: '',
	description: '',
	body: '',
	tagList: [],
};

const NewArticleEditor = () => {
	const navigate = useNavigate();
	const [createArticle, { isLoading, error }] = useCreateArticleMutation();

	const handleCreateArticle = (articleDto: TArticleCreateDto) => {
		createArticle(articleDto)
			.unwrap()
			.then((article) => {
				navigate(`/article/${article.slug}`);
			});
	};

	return (
		<ArticleEditor
			initialArticle={defaultArticle}
			onSubmit={handleCreateArticle}
			isLoading={isLoading}
			error={error}
		/>
	);
};

export default NewArticleEditor;
