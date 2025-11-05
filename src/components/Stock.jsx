import { useState, useEffect } from "react";
import styles from '../css/stock.module.css'

function Stock() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(null);
  const [mostrar, setMostrar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(null);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/stock');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const getEstado = (producto) => {
    const stockActual = parseFloat(producto.stock_actual);
    const stockMinimo = parseFloat(producto.stock_minimo);
    
    if (stockActual === 0) return 'sin-stock';
    if (stockActual < stockMinimo) return 'bajo-stock';
    return 'ok';
  };

  const getEstadoTexto = (producto) => {
    const estado = getEstado(producto);
    if (estado === 'ok') return 'Stock OK';
    if (estado === 'bajo-stock') return 'Bajo stock';
    return 'Sin stock';
  };

  const guardarProducto = async () => {
    if (!form.nombre || !form.actual || !form.minimo || !form.precio) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const body = {
      nombre: form.nombre,
      cantidad_disponible: parseFloat(form.actual),
      stock_minimo: parseFloat(form.minimo),
      precio: parseFloat(form.precio)
    };

    try {
      if (editando) {
        await fetch(`http://localhost:3000/api/stock/${editando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        await fetch('http://localhost:3000/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }
      setMostrar(false);
      setForm({});
      setEditando(null);
      fetchProductos();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar el producto');
    }
  };

  const editar = (id) => {
    const producto = productos.find(p => p.id_producto === id);
    setForm({
      nombre: producto.nombre,
      actual: producto.stock_actual,
      minimo: producto.stock_minimo,
      precio: producto.precio
    });
    setEditando(id);
    setMostrar(true);
    setMenuAbierto(null);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;
    
    try {
      await fetch(`http://localhost:3000/api/stock/${id}`, { method: 'DELETE' });
      fetchProductos();
      setMenuAbierto(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto');
    }
  };

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  return (
    <div className={styles.StockComponente}>
        <div className={styles.HeaderTabla}>
            <h2 className={styles.Titulo}>Control de Stock</h2>
            <div className={styles.AgregarProducto}>
            <button className={styles.BotonAgregar} onClick={() => { setMostrar(true); setEditando(null); setForm({}) }}>
            Agregar producto
            </button>
            {mostrar && (
            <div>
                <div className={styles.Sobreponer} onClick={() => setMostrar(false)}></div>
                <div className={styles.PopUp}>
                <h2>{editando ? 'Editar producto' : 'Agregar producto'}</h2>
                <label>Nombre del Producto</label>
                <input
                    placeholder="Ingrese producto"
                    value={form.nombre || ''}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                />
                <label>Stock inicial (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    placeholder="Ingrese stock"
                    value={form.actual || ''}
                    onChange={e => setForm({ ...form, actual: e.target.value })}
                />
                <label>Stock Mínimo (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    placeholder="Ingrese stock mínimo"
                    value={form.minimo || ''}
                    onChange={e => setForm({ ...form, minimo: e.target.value })}
                />
                <label>Precio por kg</label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ingrese precio"
                    value={form.precio || ''}
                    onChange={e => setForm({ ...form, precio: e.target.value })}
                />
                <div>
                    <button className={styles.BotonesPopUp} onClick={guardarProducto}>Guardar</button>
                    <button className={styles.BotonesPopUp} onClick={() => setMostrar(false)}>Cancelar</button>
                </div>
                </div>
            </div>
            )}
            </div>
        </div>
        
        <div className={styles.TablaContenedor}>
            <table className={styles.Tabla}>
                <thead>
                    <tr>
                    <th>Producto</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                    <th>Precio por kg</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.length === 0 ? (
                    <tr>
                        <td colSpan="6">No hay productos registrados</td>
                    </tr>
                    ) : (
                    productos.map(p => (
                        <tr key={p.id_producto}>
                        <td>{p.nombre}</td>
                        <td>{p.stock_actual}kg</td>
                        <td>{p.stock_minimo}kg</td>
                        <td>${p.precio}</td>
                        <td className={styles[getEstado(p)]}>
                            {getEstadoTexto(p)}
                        </td>
                          <td>
                            <div className={styles.AccionesDesktop}>
                              <button 
                                className={styles.Boton} 
                                onClick={() => editar(p.id_producto)}
                              >
                                Editar
                              </button>
                              <button 
                                className={styles.Boton} 
                                onClick={() => eliminar(p.id_producto)}
                              >
                                Eliminar
                              </button>
                            </div>

                            <div className={styles.AccionesMobile}>
                              {menuAbierto === p.id_producto && (
                                <div 
                                  className={styles.Sobreponer} 
                                  onClick={() => setMenuAbierto(null)}
                                  style={{ backgroundColor: 'transparent', zIndex: 99 }}
                                />
                              )}
                              <div className={styles.MenuAccionesContainer}>
                                <button 
                                  className={styles.MenuToggle}
                                  onClick={() => toggleMenu(p.id_producto)}
                                >
                                  ⋮
                                </button>
                                {menuAbierto === p.id_producto && (
                                  <div className={styles.MenuAcciones}>
                                    <button onClick={() => editar(p.id_producto)}>
                                      Editar
                                    </button>
                                    <button onClick={() => eliminar(p.id_producto)}>
                                      Eliminar
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default Stock;