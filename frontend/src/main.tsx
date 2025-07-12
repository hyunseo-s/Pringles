import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fonts.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
