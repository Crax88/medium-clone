import { ButtonHTMLAttributes } from 'react';
import { classNames as cn } from '../../lib';
import classes from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'contained' | 'outlined';
	color?: 'primary' | 'danger' | 'default';
	size?: 'small' | 'large' | 'default';
}
// type Props = {
// 	children: ReactNode;
// 	onClick?: MouseEventHandler<HTMLButtonElement>;
// 	disabled?: boolean;
// };

const Button = ({
	children,
	variant = 'outlined',
	color = 'default',
	size = 'default',
	...rest
}: Props) => {
	const cls = cn(classes.app_button, {
		[classes.app_button_contained]:
			variant === 'contained' && color === 'default',
		[classes.app_button_primary]: color === 'primary' && variant === 'outlined',
		[classes.app_button_primary_contained]:
			color === 'primary' && variant === 'contained',
		[classes.app_button_danger]: color === 'danger' && variant === 'outlined',
		[classes.app_button_danger_contained]:
			color === 'danger' && variant === 'contained',
		[classes.app_button_small]: size === 'small',
		[classes.app_button_large]: size === 'large',
	});
	return (
		<button
			className={cls}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
