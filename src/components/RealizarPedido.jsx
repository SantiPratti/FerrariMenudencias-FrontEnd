import React, { useState, useEffect } from 'react';
import styles from '../css/rpedidos.module.css'
import styles2 from '../css/stock.module.css'

function Pedido({ onEnviar = () => {}, usuario = "Cliente" }) {
  const [seleccionados, setSeleccionados] = useState([]);
  const [fecha, setFecha] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [cantidades, setCantidades] = useState({});
  const [telefono, setTelefono] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/stock');
      const data = await res.json();
      setProductos(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setLoading(false);
    }
  };

  const abrirPopup = (e) => {
    e.preventDefault();
    if (seleccionados.length && fecha) {
      const nuevasCantidades = {};
      seleccionados.forEach(p => {
        nuevasCantidades[p] = cantidades[p] || '';
      });
      setCantidades(nuevasCantidades);
      setMostrarPopup(true);
    } else {
      alert('Seleccioná al menos un producto y una fecha');
    }
  };

  const actualizarCantidad = (producto, valor) => {
    setCantidades({
      ...cantidades,
      [producto]: valor
    });
  };

  const confirmarPedido = async () => {
    const todosConCantidad = seleccionados.every(p => cantidades[p] && parseFloat(cantidades[p]) > 0);
    
    if (!todosConCantidad) {
      alert('Todos los productos deben tener una cantidad mayor a 0 kg');
      return;
    }

    if (!telefono.trim()) {
      alert('Por favor ingresá un número de teléfono');
      return;
    }

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !user.id_usuario) {
      alert('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      const productosMap = productos.reduce((acc, p) => {
        acc[p.nombre] = p;
        return acc;
      }, {});

      const productosPedido = seleccionados.map(nombreProd => {
        const producto = productosMap[nombreProd];
        const cantidad = parseFloat(cantidades[nombreProd]);
        return {
          id_producto: producto.id_producto,
          cantidad: cantidad,
          precio_unitario: producto.precio
        };
      });

      const total = productosPedido.reduce((sum, p) => {
        return sum + (p.cantidad * p.precio_unitario);
      }, 0);

      const pedidoData = {
        id_usuario: user.id_usuario,
        productos: productosPedido,
        total: total,
        id_estado: 1
      };

      const res = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
      });

      const data = await res.json();

      if (res.ok) {
        onEnviar({ 
          productos: productosPedido, 
          fecha, 
          usuario: user.nombre, 
          telefono,
          total
        });
        
        setSeleccionados([]);
        setFecha('');
        setCantidades({});
        setTelefono('');
        setMostrarPopup(false);
        alert('Pedido enviado correctamente. Nos estaremos comunicando con usted para realizar el pago.');
      } else {
        alert(`Error al crear el pedido: ${data.error}`);
      }
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      alert('Error de conexión al enviar el pedido');
    }
  };

  const cancelarPopup = () => {
    setMostrarPopup(false);
  };

  if (loading) {
    return (
      <div className="pedido">
        <h1>Cargando productos...</h1>
      </div>
    );
  }

  return (
    <div className={styles.PedidosComponente}>
      <h1>Bienvenido!</h1>
      <div className={styles.Pedido}>
        <h2>Realizar Pedido</h2>
        <form onSubmit={abrirPopup}>
            <div className={styles.Titulos}>
                <label className={styles.LabelFecha}>Fecha de la realizacion del pedido:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div><br />
            <label className={styles.LabelProductos}>Productos ({seleccionados.length}):</label>
            <div className={styles.Productos}>
                {productos.map(p => (
                    <label key={p.id_producto} className={seleccionados.includes(p.nombre) ? 'sel' : ''}>
                    <input 
                        type="checkbox" 
                        checked={seleccionados.includes(p.nombre)}
                        onChange={() => setSeleccionados(
                            seleccionados.includes(p.nombre) ? seleccionados.filter(x => x !== p.nombre) : [...seleccionados, p.nombre]
                        )} 
                    />
                    {p.nombre} - ${p.precio}/kg
                    </label>
                ))}
            </div>
            <button className={styles.Boton} type="submit">Confirmar</button>
        </form>
      </div>

      {mostrarPopup && (
        <div className={styles.Sobreponer} onClick={cancelarPopup}>
          <div className={styles.PopUp} onClick={(e) => e.stopPropagation()}>
            <h3>Completá los datos del pedido</h3>
            
            <div>
              <label>Número de teléfono:</label>
              <input 
                type="tel" 
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="2364123456"
              />
            </div>

            <label>Cantidad de cada producto:</label>
            <div className={styles.PopUpProductos}>
              {seleccionados.map(nombreProd => {
                const producto = productos.find(p => p.nombre === nombreProd);
                return (
                  <div key={nombreProd} className={styles.PopUpItem}>
                    <label>{nombreProd} (${producto?.precio}/kg):</label>
                    <div>
                      <input 
                        type="number" 
                        step="0.1"
                        value={cantidades[nombreProd] || ''}
                        onChange={(e) => actualizarCantidad(nombreProd, e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <button className={styles.Boton} onClick={cancelarPopup}>
                Cancelar
              </button>
              <button className={styles.Boton} onClick={confirmarPedido}>
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedido;