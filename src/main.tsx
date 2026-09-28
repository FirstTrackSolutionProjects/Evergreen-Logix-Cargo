import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found. Ensure index.html has <div id="root"></div>.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);