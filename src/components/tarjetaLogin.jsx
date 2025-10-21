import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css";
import Tarjeta from "./tarjeta";

function TarjetaLogin() {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token); // guarda el JWT
        alert("Inicio de sesión exitoso ✅");
        navigate("/menu");
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="Login">
      <h1>Ferrari Menudencias</h1>
      <h3>Sistema de gestión</h3>

      <form onSubmit={handleSubmit}>
        <Tarjeta titulo="E-Mail" />
        <input
          type="email"
          placeholder="Ingrese su correo electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Tarjeta titulo="Contraseña" />
        <input
          type="password"
          placeholder="Ingrese su contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default TarjetaLogin;
