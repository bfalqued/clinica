import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../Components/AppLayout';
import ClasificacionPage from '../Pages/ClasificacionPage';
import EquiposPage from '../Pages/EquiposPage';
import InicioPage from '../Pages/InicioPage';
import NoPage from '../Pages/NoPage';
import PartidosPage from '../Pages/PartidosPage';

function AppEnrutador() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<InicioPage />} />
                    <Route path="equipos" element={<EquiposPage />} />
                    <Route path="partidos" element={<PartidosPage />} />
                    <Route path="clasificacion" element={<ClasificacionPage />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppEnrutador;
