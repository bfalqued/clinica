import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function ProtectedRoute({ roles }) {
    //Leo el contexto ya que tengo que saber si esta logueado y que tipo de usuarios es
    const { isAuth, usuario } = useApp();
    //Guardo la página actual
    const location = useLocation();

    //Primer filtro para saber si esta autenticado
    if (!isAuth) {
        //Con replace state recuerdo a donde ibas antes de mandarte a login
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    //Segundo filtro para descubrir si tienes rol, sino al inicio
    if (roles && !roles.includes(usuario.tipo)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;