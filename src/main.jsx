import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { WatchListProvider } from './context/WatchListContext.jsx'
import { ToastProvider } from './context/ToastContext';

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
