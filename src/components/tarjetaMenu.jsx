import { useNavigate } from "react-router-dom";
import '../css/menu.css';
import Tarjeta from "./tarjeta";

function Menu() {
  return (
    <div className="BotonMenu">
      <h1>Ferrari Menudencias</h1>
      <form onSubmit="">
        <button>Pedidos</button>
      </form>
      <form onSubmit="">
        <button>Administrar</button>
      </form>
    </div>
  );
}

export default Menu