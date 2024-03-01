/* eslint-disable indent */
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import Popup from './popup';

function init() {
    const appContainer = document.createElement('div');
    appContainer.style.height = '100vh';
    appContainer.style.background = '#EBDEDE';
    appContainer.style.display = 'flex';
    document.body.appendChild(appContainer);
    if (!appContainer) {
        throw new Error('Can not find AppContainer');
    }
    const root = createRoot(appContainer);
    root.render(<Popup />);
}

init();
