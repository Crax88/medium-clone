import { withProviders } from './providers';
import { AppRouting } from './routing';
import 'shared/base.css';

const App = () => {
	return (
		<div className="app">
			<AppRouting />
		</div>
	);
};

export default withProviders(App) as React.ElementType;
