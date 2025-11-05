import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/login.module.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/menu');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = () => {
    navigate('/registro');
  };

  return (
    <div className={styles.Login}>
      <h1 className={styles.Titulo}>Ferrari Menudencias</h1>
      <h2 className={styles.Subtitulo}>Sistema de gestión</h2>
      <form onSubmit={handleSubmit}>
        <h3 className={styles.Label}>E-Mail</h3>
        <input 
          type="email" 
          placeholder="Ingrese su correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <h3 className={styles.Label}>Contraseña</h3>
        <input 
          type="password" 
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}    
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button className={styles.LoginBoton} type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
        <button 
          className={styles.RegisterBoton}
          type="button" 
          onClick={handleRegistro}
          disabled={loading}
        >
          Registrarse como Cliente
        </button>
      </form>
    </div>
  );
}

export default Login;