import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import './index.css';
import AppEnrutador from './routers/AppEnrutador.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AppEnrutador />
    </AppProvider>
  </StrictMode>,
)
