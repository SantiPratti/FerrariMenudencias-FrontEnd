import { useState } from 'react'
import styles from '../css/header.module.css'

function Header({paginaActual, setPaginaActual}){
    const [menuAbierto, setMenuAbierto] = useState(false);
    const tarjetas = ['Dashboard','Stock','Pedidos']

    const handleClick = (tarjeta) => {
        setPaginaActual(tarjeta);
        setMenuAbierto(false); // Cierra el menú al seleccionar
    }

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    }

    return(
        <header className={styles.Header}>
            <button className={styles.MenuToggle} onClick={toggleMenu}>
                {menuAbierto ? '✕' : '☰'}
            </button>
            <nav className={`${styles.Secciones} ${menuAbierto ? styles.abierto : ''}`}>
                {tarjetas.map((tarjeta) => (
                    <button 
                    className={paginaActual === tarjeta ? `${styles.Boton} ${styles.TarjetaActiva}` : styles.Boton}
                    key={tarjeta}
                    onClick={() => handleClick(tarjeta)}>
                        {tarjeta}
                    </button>
                )) }
            </nav>
        </header>
    )
}

export default Header