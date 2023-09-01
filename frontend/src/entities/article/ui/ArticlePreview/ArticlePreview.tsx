import { Link } from 'react-router-dom';
import { type TArticle } from '../../model/types';
import classes from './ArticlePreview.module.css';
import { ReactNode } from 'react';
import { Tag } from 'entities/tag';

type Props = {
	article: TArticle;
	meta: ReactNode;
};

const ArticlePreview = ({ article, meta }: Props) => {
	return (
		<article className={classes.articlePreview}>
			{meta}
			<Link
				to={`/article/${article.slug}`}
				className={classes.previewLink}
			>
				<h2>{article.title}</h2>
				<p>{article.description}</p>
				<span>Read more...</span>

				<div className={classes.bottom}>
					<ul
						style={{
							listStyle: 'none',
							display: 'flex',
							gap: '0.2rem',
						}}
					>
						{article.tagList.map((tag) => (
							<li key={tag}>
								<Tag
									tag={tag}
									variant="outlined"
								/>
							</li>
						))}
					</ul>
				</div>
			</Link>
		</article>
	);
};

export default ArticlePreview;
