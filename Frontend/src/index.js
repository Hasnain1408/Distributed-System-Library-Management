import React from 'react';
import ReactDOM from 'react-dom/client';
import SmartLibrarySystem from './smartLibrary';
import './index.css';

/* Tailwind CSS imports */
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SmartLibrarySystem />
  </React.StrictMode>
);



