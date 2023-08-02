import { ReactNode, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'shared/ui';
import { PageLoader } from 'shared/ui/PageLoader';
import { Footer } from 'widgets/Footer';
import { AppHeader } from 'widgets/Header';
import { Navbar } from 'widgets/Navbar';

const ArticlesPage = lazy(() => import('pages/articles'));
const LoginPage = lazy(() => import('pages/login'));
const RegisterPage = lazy(() => import('pages/register'));
const ArticlePage = lazy(() => import('pages/article'));
const EditorPage = lazy(() => import('pages/editor'));

const WithWrapper = ({ children }: { children: ReactNode }) => {
	return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};

export const AppRouting = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Layout
						headerSlot={<AppHeader navbarSlot={<Navbar />} />}
						footerSlot={<Footer />}
					/>
				}
			>
				<Route
					index
					element={
						<WithWrapper>
							<ArticlesPage />
						</WithWrapper>
					}
				/>
				<Route
					path="/feed"
					element={
						<WithWrapper>
							<ArticlesPage />
						</WithWrapper>
					}
				/>
				<Route
					path="/login"
					element={
						<WithWrapper>
							<LoginPage />
						</WithWrapper>
					}
				/>
				<Route
					path="/register"
					element={
						<WithWrapper>
							<RegisterPage />
						</WithWrapper>
					}
				/>
				<Route
					path="/article/:slug"
					element={
						<WithWrapper>
							<ArticlePage />
						</WithWrapper>
					}
				/>
				<Route
					path="/editor/:slug"
					element={
						<WithWrapper>
							<EditorPage />
						</WithWrapper>
					}
				/>
				<Route
					path="/editor"
					element={
						<WithWrapper>
							<EditorPage />
						</WithWrapper>
					}
				/>
				{/* <Route
					path="/feed"
					element={
						<WithWrapper>
							<FeedPage />
						</WithWrapper>
					}
				/> */}
			</Route>
		</Routes>
	);
};
