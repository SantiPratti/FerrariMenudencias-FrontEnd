import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/login.module.css'
import styles2 from '../css/register.module.css'

function TarjetaRegistro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.nombre || !formData.email || !formData.password || !formData.telefono) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (!/^\d+$/.test(formData.telefono)) {
      setError('El teléfono debe contener solo números');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          id_rol: 2
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/');
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  return (
    <div className={styles2.Register}>
      <h1 className={styles.Titulo}>Ferrari Menudencias</h1>
      <h2 className={styles.Subtitulo}>Registro de Cliente</h2>
      <form className={styles2.Complementos} onSubmit={handleSubmit}>
        <div className={styles2.Campos}>
          <h3 className={styles2.Label}>Nombre Completo</h3>
          <input 
            className={styles2.inputRegister}
            type="text" 
            name="nombre"
            placeholder="Ingrese su nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles2.Campos}>
          <h3 className={styles2.Label}>E-Mail</h3>
          <input 
            type="email" 
            className={styles2.inputRegister}
            name="email"
            placeholder="Ingrese su correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles2.Campos}>
          <h3 className={styles2.Label}>Telefono</h3>
          <input 
            type="tel" 
            className={styles2.inputRegister}
            name="telefono"
            placeholder="Ej: 2364123456"
            value={formData.telefono}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>


          <div className={styles2.CamposContraseña}>
            <h3 className={styles2.Label}>Contraseña</h3>
            <input 
              className={styles2.inputRegister}
              type="password" 
              name="password"
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles2.CamposContraseña}>
            <h3 className={styles2.Label}>Confirmar contraseña</h3>
            <input 
              className={styles2.inputRegister}
              type="password" 
              name="confirmarPassword"
              placeholder="Confirme su contraseña"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

        {error && <p>{error}</p>}
      </form>
      <div className={styles2.Botones}>
          <button className={styles.LoginBoton} type="button" onClick={handleVolver} disabled={loading}>Volver al Login</button>
          <button className={styles.RegisterBoton} type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        </div>
    </div>
  );
}

export default TarjetaRegistro;