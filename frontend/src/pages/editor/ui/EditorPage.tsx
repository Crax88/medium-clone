import { ArticleForm } from 'features/article/formArticle';
import classes from './EditorPage.module.css';
import { TArticle, useGetArticleQuery } from 'entities/article';
import { useNavigate, useParams } from 'react-router-dom';

const EditorPage = () => {
	const { slug = '' } = useParams();
	const { data: article, isLoading } = useGetArticleQuery(
		{ slug },
		{ skip: !slug },
	);
	const navigate = useNavigate();
	const handleComplete = (article: TArticle) => {
		navigate(`/article/${article.slug}`);
	};
	if (isLoading) {
		return <div className={classes.container}>Loading...</div>;
	}
	return (
		<div className={classes.container}>
			<div className={classes.form_container}>
				<ArticleForm
					onComplete={handleComplete}
					editArticle={article}
				/>
			</div>
		</div>
	);
};

export default EditorPage;
