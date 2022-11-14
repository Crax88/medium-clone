import { createRoot } from 'react-dom/client';
import { App } from 'components/App';
import './styles.css';

const container = document.getElementById('root');

if (!container) {
	throw new Error('Container element not found');
}

const root = createRoot(container);

root.render(<App />);
