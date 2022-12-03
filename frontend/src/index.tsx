import { createRoot } from 'react-dom/client';

import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'App';

const container = document.getElementById('root');

if (!container) {
	throw new Error('Container element not found');
}

const root = createRoot(container);

root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
