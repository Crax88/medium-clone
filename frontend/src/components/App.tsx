import { ChangeEvent, FormEvent, useState } from 'react';

export const App = () => {
	const [values, setValues] = useState({ email: '', username: '' });
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		alert(JSON.stringify(values));
	};

	return (
		<div>
			<h1>Hello from App</h1>
			<form onSubmit={handleSubmit}>
				<input
					value={values.email}
					name="email"
					onChange={handleChange}
				/>
				<input
					value={values.username}
					name="username"
					onChange={handleChange}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};
