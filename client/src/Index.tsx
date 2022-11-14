import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootNode = document.getElementById('app');
if (rootNode) {
  ReactDOM.createRoot(rootNode).render(<App />);
}
