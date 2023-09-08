import { TextareaHTMLAttributes, forwardRef } from 'react';
import { classNames as cn } from '../../lib';
import classes from './Textarea.module.css';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
	const cls = cn(classes.form_control, {
		// [classes.form_control_large]: variant === 'large',
		// [classes.form_control_small]: variant === 'small',
	});
	return (
		<textarea
			{...props}
			ref={ref}
			className={cls}
		></textarea>
	);
});

export default Input;
