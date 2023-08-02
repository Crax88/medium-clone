import { classNames as cn } from '../../../lib';
import { Spinner } from '../../Spinner';
import classes from './PageLoader.module.css';

type Props = {
	className?: string;
};

const PageLoader = ({ className }: Props) => {
	return (
		<div className={cn(classes.page_loader, {}, [className])}>
			<Spinner />
		</div>
	);
};

export default PageLoader;
