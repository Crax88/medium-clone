import { BrowserRouter } from 'react-router-dom';

export const withRouter = (component: () => React.ReactNode) => () => {
	return <BrowserRouter>{component()}</BrowserRouter>;
};
