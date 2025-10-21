import React from "react";
import "../css/tarjeta.css";

function Tarjeta({
  titulo,
  subtitulo,
  imagen,
  children,
  actions = [],
  onClick,
  className = "",
  style = {},
}) {
  return (
    <article
      className={`tarjeta-root ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? "boton" : "region"}
      tabIndex={onClick ? 0 : -1}
    >
      {imagen && (
        <div className="card-imagen">
          <img src={imagen} alt={titulo || "tarjeta imagen"} />
        </div>
      )}

      <div className="tarjeta-body">
        {titulo && <h3 className="tarjeta-titulo">{titulo}</h3>}
        {subtitulo && <p className="tarjeta-subtitulo">{subtitulo}</p>}

        <div className="tarjeta-content">{children}</div>

        {actions.length > 0 && (
          <div className="tarjeta-actions">
            {actions.map((a, i) => (
              <button
                key={i}
                className="tarjeta-action-boton"
                onClick={(e) => {
                  e.stopPropagation();
                  a.onClick && a.onClick(e);
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default Tarjeta