// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function renderComponent() {
  const existingAppContainer = document.getElementById('extension-container');

  // If the app container doesn't exist, proceed with rendering
  if (!existingAppContainer) {
    const appContainer = document.createElement('div');
    appContainer.id = 'extension-container';
    document.body.appendChild(appContainer);

    createRoot(appContainer).render(<App />);
  }
}

renderComponent();
