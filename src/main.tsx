import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SmoothScrollProvider } from './lib/smoothScroll';
import './styles/index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <SmoothScrollProvider>
        <App />
      </SmoothScrollProvider>
    </StrictMode>,
  );
}
