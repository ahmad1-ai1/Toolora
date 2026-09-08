// Ensure window.fetch is writable if defined with only a getter in sandboxed preview environments
if (typeof window !== 'undefined') {
  try {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch') || Object.getOwnPropertyDescriptor(Window.prototype, 'fetch');
    if (desc && desc.get && !desc.set) {
      let cur = window.fetch;
      Object.defineProperty(window, 'fetch', {
        get: () => cur,
        set: (fn: typeof fetch) => { cur = fn; },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (_) {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
