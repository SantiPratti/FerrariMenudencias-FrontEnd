import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './components/Login'
import Registro from './components/Registro'
import Proteccion from './components/ProtegerRutas'
import Administracion from './components/Administrar'
import RealizarPedido from './components/RealizarPedido'
import Menu from './components/Menu'
import './css/main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/menu" element={<Proteccion><Menu /></Proteccion>} />
        <Route path="/realizarpedido" element={
          <Proteccion>
            <RealizarPedido />
          </Proteccion>} />
        <Route path="/administracion" element={
          <Proteccion requiredRole={1}>
            <Administracion />
          </Proteccion>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)