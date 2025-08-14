import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialiser le thème au boot
const savedTheme = (localStorage.getItem('theme') as 'light-clean' | 'dark-premium') ?? 'dark-premium';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
