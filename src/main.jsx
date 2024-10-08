import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { WatchListProvider } from './contexts/WatchListContext.jsx'
import { ToastProvider } from './contexts/ToastContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <WatchListProvider>
          <App />
        </WatchListProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
