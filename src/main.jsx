import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { startAutoUpdate } from './utils/autoUpdate'

// التحديث التلقائي: الموقع يكتشف أي نسخة جديدة منشورة ويحدّث نفسه بدون ريفرش يدوي
startAutoUpdate()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
