import { classNames as cn } from '../../../lib';
import classes from './Spinner.module.css';

type Props = {
	className?: string;
};

const Spinner = ({ className }: Props) => {
	return (
		<div className={cn(classes.lds_ring, {}, [className])}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

export default Spinner;
