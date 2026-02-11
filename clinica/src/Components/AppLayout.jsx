import { Outlet } from "react-router-dom";
import AppMenu from "./AppMenu";
import Mensaje from "./Mensaje";

//Outlet actua como un hueco donde se renderizan los componentes
// de las rutas
function AppLayout() {
    return (
        <div className="app-container">
            <AppMenu />
            <Mensaje />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;