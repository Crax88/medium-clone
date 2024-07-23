import { Provider } from 'react-redux';
// I don't like that we pass store here but whatever
import { appStore } from '../store';
import { useMeQuery } from 'entities/session/api/sessionApi';
import { ReactNode } from 'react';

const A = ({ children }: { children: ReactNode }) => {
	useMeQuery();
	return <>{children}</>;
};

export const withStore = (component: () => React.ReactNode) => () =>
	(
		<Provider store={appStore}>
			<A>{component()}</A>
		</Provider>
	);
