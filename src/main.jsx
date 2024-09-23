import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { WatchListProvider } from './context/WatchListContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <WatchListProvider>
        <App />
      </WatchListProvider>
    </ThemeProvider>
  </StrictMode>,
)
