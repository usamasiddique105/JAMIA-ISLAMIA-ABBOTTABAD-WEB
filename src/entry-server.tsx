import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';

export function render() {
  return renderToString(
    <React.StrictMode>
      <ThemeLanguageProvider>
        <App />
      </ThemeLanguageProvider>
    </React.StrictMode>
  );
}
