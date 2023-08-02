import { Link } from 'react-router-dom';
import { TTag } from '../model/types';
import { classNames } from 'shared/lib';
import classes from './Tag.module.css';

type Props = {
	variant: 'contained' | 'outlined';
	tag: TTag;
	href?: string;
};

const Tag = ({ variant, tag, href }: Props) => {
	const cls = classNames(classes.tag_default, {
		[classes.tag_contained]: variant === 'contained',
		[classes.tag_outlined]: variant === 'outlined',
	});

	return href ? (
		<Link
			className={cls}
			to={href}
		>
			{tag}
		</Link>
	) : (
		<span className={cls}>{tag}</span>
	);
};

export default Tag;
