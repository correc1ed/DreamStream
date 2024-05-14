import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <BrowserRouter basename={baseUrl}>
        <App />
    </BrowserRouter>
);

reportWebVitals();
