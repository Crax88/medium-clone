import { Layout } from 'components/Layout';
import { HomePage } from 'pages/HomePage';
import { LoginPage } from 'pages/LoginPage';
import { RegisterPage } from 'pages/RegisterPage';
import { Route, Routes } from 'react-router-dom';
import { styled } from '@linaria/react';
import './styles.css';
import { globalCss } from 'global';
const Wrapper = styled.div`
	color: #373a3c;
`;
export const App = () => {
	return (
		<div className={globalCss}>
			<Wrapper>
				<Routes>
					<Route
						path="/"
						element={<Layout />}
					>
						<Route
							index
							path="/"
							element={<HomePage />}
						/>
						<Route
							path="/login"
							element={<LoginPage />}
						/>
						<Route
							path="/register"
							element={<RegisterPage />}
						/>
					</Route>
				</Routes>
			</Wrapper>
		</div>
	);
};
