import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/MaterialIcons.css';
import './styles/fontawesome.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);