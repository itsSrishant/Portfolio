import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SmoothScrollProvider } from './lib/smoothScroll';
import './styles/index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}
