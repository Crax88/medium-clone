import classes from './EditorPage.module.css';
import { useParams } from 'react-router-dom';
import { CurrentArticleEditor } from 'widgets/CurrentArticleEditor';
import { NewArticleEditor } from 'widgets/NewArticleEditor';

const EditorPage = () => {
	const { slug = '' } = useParams();

	return (
		<div className={classes.container}>
			<div className={classes.form_container}>
				{!slug && <NewArticleEditor />}
				{slug && <CurrentArticleEditor slug={slug} />}
			</div>
		</div>
	);
};

export default EditorPage;
