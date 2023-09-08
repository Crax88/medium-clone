import { ReactNode, memo } from 'react';
import { useGetPopularTagsQuery, Tag } from 'entities/tag';
import classes from './PopularTags.module.css';

const PopularTags = () => {
	const {
		data: tags,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetPopularTagsQuery();

	let content: ReactNode | null = null;
	if (isLoading) {
		content = <p>Loading tags...</p>;
	} else if (isSuccess) {
		content = tags?.ids.map((id) => (
			<li key={id}>
				<Tag
					variant="contained"
					tag={id as string}
					href={`/?tag=${id}`}
				/>
			</li>
		));
	} else if (isError) {
		content = <p>{JSON.stringify(error)}</p>;
	}
	return (
		<div className={classes.popularTags_container}>
			<p>Popular Tags</p>
			<ul>{content}</ul>
		</div>
	);
};

export default memo(PopularTags);
