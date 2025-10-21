import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import Menu from './components/tarjetaMenu'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <center>
    <Menu />
    </center>
  </StrictMode>
)
