import { useState, useEffect } from 'react';
import styles from '../css/alertas.module.css'


function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAlertas();
    const interval = setInterval(fetchAlertas, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/stock');
      const data = await res.json();

      const nuevasAlertas = data
        .filter(p => {
          const stockActual = parseFloat(p.stock_actual) || 0;
          const stockMinimo = parseFloat(p.stock_minimo) || 0;
          
          return stockActual <= stockMinimo;
        })
        .map((p) => {
          const stockActual = parseFloat(p.stock_actual) || 0;
          
          return {
            id: p.id_producto,
            tipo: stockActual === 0 ? 'sin-stock' : 'bajo-stock',
            mensaje: stockActual === 0 
              ? `${p.nombre}: Sin stock disponible`
              : `${p.nombre}: Stock bajo (${p.stock_actual}kg / mínimo: ${p.stock_minimo}kg)`
          };
        });
      
      setAlertas(nuevasAlertas);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener alertas:', err);
      setLoading(false);
    }
  };
  
  const cerrarAlerta = (id) => {
    setAlertas(alertas.filter(a => a.id !== id));
  };
  
  if (loading) {
    return (
      <div className={styles.Alertas}>
        <h3>Alertas stock</h3>
        <p>Cargando...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.Alertas}>
      <h3  className={styles.Titulo}>
        Alertas stock 
        {alertas.length > 0 && (
          <span className={styles.Contador}>({alertas.length})</span>
        )}
      </h3>
      {alertas.length === 0 ? (
        <p className={styles.Vacio}>No hay alertas de stock</p>
      ) : (
        <div className={styles.Alerta}>
          {alertas.map((alerta) => (
            <div 
              key={alerta.id} 
              className={`${styles.AlertaTarjeta} ${alerta.tipo === 'sin-stock' ? styles.sinStock : styles.bajoStock}`}
            >
              <span className={styles.Mensaje}>{alerta.mensaje}</span>
              <button 
                className={styles.Cerrar} 
                onClick={() => cerrarAlerta(alerta.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alertas;