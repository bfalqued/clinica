import { NavLink, useNavigate } from "react-router-dom";
//Me creo este contexto global del cual sacaré isAuth,usuario,hasRole,logout
import { useApp } from "../context/AppContext";
import "../index.css";
function AppMenu() {
    //Con esto, saco datos del contexto
    const { isAuth, usuario, hasRole, logout } = useApp();
    const navigate = useNavigate();

    //Función logout, la cual borrará sesión y te mandará al inicio
    const onLogout = () => {
        logout();
        navigate('/');
    };

    //Aqui rederizo la lista de enlaces, mostrando determinado enlace en función
    // de los permisos que se tengan
    return (
        <nav className="navegacion">
            <ul>
                <li><NavLink to="/">Inicio</NavLink></li>

                {!isAuth && (
                    <li><NavLink to="/login">Login</NavLink></li>
                )}

                {hasRole('gestion', 'admin') && (
                    <li><NavLink to="/pacientes">Pacientes</NavLink></li>
                )}

                {hasRole('medico', 'admin') && (
                    <li><NavLink to="/expedientes">Expedientes</NavLink></li>
                )}

                {hasRole('admin') && (
                    <li><NavLink to="/usuarios">Usuarios</NavLink></li>
                )}

                {isAuth && (
                    <li>
                        <button type="button" className="link-btn" onClick={onLogout}>
                            Logout ({usuario.username})
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default AppMenu;