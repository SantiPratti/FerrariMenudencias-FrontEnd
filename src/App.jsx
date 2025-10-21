import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/tarjetaMenu"; 
import TarjetaLogin from "./components/tarjetaLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TarjetaLogin />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;