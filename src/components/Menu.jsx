import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from '../css/menu.module.css'

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleAdministrar = (e) => {
    e.preventDefault();
    
    if (user && user.id_rol === 1) {
      navigate('/administracion');
    } else {
      alert('No tienes permisos para acceder a esta sección. Solo los administradores pueden acceder.');
    }
  };

  const handlePedidos = () => {
    navigate('/realizarpedido');
  };

  const handleCerrarSesion = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className={styles.Menu}>
      <h1 className={styles.Titulo}>Ferrari Menudencias</h1>
      {user && <p>Bienvenido, {user.nombre}</p>}
      
      <button className={styles.BotonMenu} onClick={handlePedidos}>Pedidos</button>
      
      <button className={styles.BotonMenu} onClick={handleAdministrar}>Administrar</button>
      
      <button className={styles.CerrarSesionBoton} onClick={handleCerrarSesion}>Cerrar Sesión</button>
    </div>
  );
}

export default Menu;