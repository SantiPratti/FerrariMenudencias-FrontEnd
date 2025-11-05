import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.id_rol !== requiredRole) {
    alert('No tienes permisos para acceder a esta sección');
    return <Navigate to="/menu" replace />;
  }

  return children;
}

export default ProtectedRoute;