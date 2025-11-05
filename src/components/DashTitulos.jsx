import { useState, useEffect } from 'react';
import styles from '../css/titulos.module.css'

function ComponenteDash(){
    const [pedidosHoy, setPedidosHoy] = useState(0);
    const [ventasHoy, setVentasHoy] = useState(0);
    const [pendientesHoy, setPendientesHoy] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const ventasRes = await fetch('http://localhost:3000/api/dashboard/ventas-diarias');
            const ventasData = await ventasRes.json();
            setVentasHoy(ventasData[0]?.total_ventas_hoy || 0);

            const pendientesRes = await fetch('http://localhost:3000/api/dashboard/pendientes');
            const pendientesData = await pendientesRes.json();
            setPendientesHoy(pendientesData.length);

            const todosRes = await fetch('http://localhost:3000/api/pedidos');
            const todosData = await todosRes.json();
            
            const hoy = new Date().toLocaleDateString('es-AR');
            const pedidosDeHoy = todosData.filter(p => {
                const fechaPedido = p.fecha;
                return fechaPedido === hoy;
            });
            setPedidosHoy(pedidosDeHoy.length);

            setLoading(false);
        } catch (err) {
            console.error('Error al obtener datos del dashboard:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="comp-contenedor">
                <p>Cargando...</p>
            </div>
        );
    }

    return(
            <div className={styles.Titulos}>
                <div className={styles.PedidosTitulo}>
                    <p className={styles.Numero}>{pedidosHoy}</p>
                    <h3>Pedidos hoy</h3>
                </div>
                <div className={styles.VentasTitulo}>
                    <p className={styles.Numero}>${ventasHoy}</p>
                    <h3>Ventas hoy</h3>
                </div>
                <div className={styles.PendientesTitulo}>
                    <p className={styles.Numero}>{pendientesHoy}</p>
                    <h3>Pedidos pendientes</h3>
                </div>
            </div>
    )
}

export default ComponenteDash