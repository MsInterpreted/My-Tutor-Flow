import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// ULTRA-SIMPLIFIED - NO BLOCKING CODE
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
