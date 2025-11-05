import { useState, useEffect } from "react"
import styles from '../css/pedidos.module.css'
import styles2 from '../css/stock.module.css'

function Pedidos(){
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        fetchPedidos();
        fetchEstados();
    }, []);

    const fetchPedidos = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/pedidos');
            const data = await res.json();
            
            const pedidosTransformados = data.map(p => ({
                id: p.id_pedido,
                fecha: p.fecha,
                cliente: p.cliente,
                telefono: p.telefono,
                productosStr: p.productos,
                total: p.total,
                estado: p.estado
            }));
            
            setPedidos(pedidosTransformados);
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener pedidos:', err);
            setLoading(false);
        }
    };

    const fetchEstados = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/estados');
            const data = await res.json();
            setEstados(data);
        } catch (err) {
            console.error('Error al obtener estados:', err);
            setEstados([
                { id_estado: 1, nombre_estado: 'Pendiente' },
                { id_estado: 2, nombre_estado: 'En preparación' },
                { id_estado: 3, nombre_estado: 'Enviado' },
                { id_estado: 4, nombre_estado: 'Entregado' },
                { id_estado: 5, nombre_estado: 'Cancelado' }
            ]);
        }
    };

    const cambiarEstado = async (idPedido, nuevoEstadoId) => {
        const estadoNombre = estados.find(e => e.id_estado === parseInt(nuevoEstadoId))?.nombre_estado;
        
        if (parseInt(nuevoEstadoId) === 4) {
            const confirmar = window.confirm(
                `¿Confirmar pedido como ENTREGADO?\n\nEl stock sera actualizado respectivamente.`
            );
            if (!confirmar) return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/pedidos/${idPedido}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_estado: nuevoEstadoId })
            });

            const data = await res.json();

            if (res.ok) {
                setPedidos(pedidos.map(p => 
                    p.id === idPedido ? { ...p, estado: estadoNombre } : p
                ));

                if (data.stock_actualizado) {
                    alert('Pedido marcado como entregado y stock actualizado correctamente');
                } else {
                    alert('Estado del pedido actualizado correctamente');
                }
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            alert('Error de conexión al actualizar el estado');
        }
    };

    const descargarComprobante = async (idPedido) => {
        try {
            const res = await fetch(`http://localhost:3000/api/comprobante/${idPedido}`);
            
            if (!res.ok) {
                throw new Error('Error al generar el comprobante');
            }

            const blob = await res.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `comprobante_${idPedido}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error al descargar comprobante:', err);
            alert('Error al generar el comprobante');
        }
    };

    const getEstadoClass = (estado) => {
        switch(estado) {
            case 'Pendiente': return 'estado-pendiente';
            case 'En preparación': return 'estado-preparacion';
            case 'Enviado': return 'estado-enviado';
            case 'Entregado': return 'estado-entregado';
            case 'Cancelado': return 'estado-cancelado';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="Pedidos">
                <h2>Pedidos</h2>
                <p>
                    Cargando pedidos...
                </p>
            </div>
        );
    }

    return(
        <div className={styles.Pedidos}>
            <h2>Pedidos</h2>
            <div className={styles2.TablaContenedor}>
                <table className={styles2.Tabla}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Comprobante</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay pedidos registrados
                                </td>
                            </tr>
                        ) : (
                            pedidos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.fecha}</td>
                                    <td>{p.cliente}</td>
                                    <td>
                                        {p.telefono && p.telefono !== 'Sin teléfono' ? (
                                            <a 
                                                href={`https://wa.me/54${p.telefono.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="telefono-link"
                                                title="Abrir WhatsApp"
                                            >
                                                {p.telefono}
                                            </a>
                                        ) : (
                                            <span>
                                                Sin teléfono
                                            </span>
                                        )}
                                    </td>
                                    <td>{p.productosStr}</td>
                                    <td>${p.total}</td>
                                    <td>
                                        <select 
                                            className="select-estado"
                                            value={estados.find(e => e.nombre_estado === p.estado)?.id_estado || ''}
                                            onChange={(e) => cambiarEstado(p.id, e.target.value)}
                                        >
                                            {estados.map(e => (
                                                <option key={e.id_estado} value={e.id_estado}>
                                                    {e.nombre_estado}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button 
                                            className={styles2.Boton}
                                            onClick={() => descargarComprobante(p.id)}
                                        >
                                            Generar Comprobante
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Pedidos