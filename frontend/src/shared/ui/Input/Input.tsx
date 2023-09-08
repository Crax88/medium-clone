import { type InputHTMLAttributes, forwardRef } from 'react';
import { classNames as cn } from '../../lib';
import classes from './Input.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	variant?: 'large' | 'small' | 'default';
	multiline?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { variant = 'default', ...inputProps } = props;
	const cls = cn(classes.form_control, {
		[classes.form_control_large]: variant === 'large',
		[classes.form_control_small]: variant === 'small',
	});
	return (
		<input
			{...inputProps}
			className={cls}
			ref={ref}
		/>
	);
});

export default Input;
