import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoanProvider } from './context/LoanContext';
import { UIProvider } from './context/UIContext';
import { CalculationsProvider } from './context/CalculationsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <LoanProvider>
        <CalculationsProvider>
          <App />
        </CalculationsProvider>
      </LoanProvider>
    </UIProvider>
  </React.StrictMode>
);
