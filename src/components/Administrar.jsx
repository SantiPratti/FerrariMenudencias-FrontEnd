import { useState } from 'react';
import styles from '../css/administrar.module.css'
import Header from './Header';
import Titulos from './DashTitulos';
import Alertas from './Alertas'
import StockComponente from './Stock'
import PedidosComponente from './Pedidos'

function Componentes() { 
    const [paginaActual, setPaginaActual] = useState('Dashboard');

  return (
    <div>
      <Header 
        paginaActual={paginaActual} 
        setPaginaActual={setPaginaActual} 
      />

      <main>    
        {paginaActual === 'Dashboard' && <Dashboard />}
        {paginaActual === 'Stock' && <Stock />}
        {paginaActual === 'Pedidos' && <Pedidos />}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className={styles.Dashboard}>
      <Titulos />
      <Alertas />
    </div>    
  );
}

function Stock(){
    return(
       <div className={styles.Stock}>
          <StockComponente />
       </div>
    )
}

function Pedidos(){
    return(
      <div className={styles.Pedidos}>
        <PedidosComponente />
      </div>
    )
} 

export default Componentes