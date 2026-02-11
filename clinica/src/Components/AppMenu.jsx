import { NavLink } from 'react-router-dom';

function AppMenu() {
    return (
        <nav className="navegacion">
            <ul>
                <li><NavLink to="/">Inicio</NavLink></li>
                <li><NavLink to="/equipos">Equipos</NavLink></li>
                <li><NavLink to="/partidos">Partidos</NavLink></li>
                <li><NavLink to="/clasificacion">Clasificación</NavLink></li>
            </ul>
        </nav>
    );
}

export default AppMenu;
