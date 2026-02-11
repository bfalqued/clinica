import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../Components/AppLayout';
import ProtectedRoute from '../Components/ProtectedRoute';
import ExpedientesPage from '../Pages/ExpedientesPage';
import InicioPage from '../Pages/InicioPage';
import LoginPage from '../Pages/LoginPage';
import NoPage from '../Pages/NoPage';
import PacientesPage from '../Pages/PacientesPage';
import PropiedadesExpedientePage from '../Pages/PropiedadesExpedientePage';
import PropiedadesPacientePage from '../Pages/PropiedadesPacientePage';
import PropiedadesUsuarioPage from '../Pages/PropiedadesUsuarioPage';
import UsuarioPage from '../Pages/UsuarioPage';

function AppEnrutador() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<InicioPage />} />
                    <Route path="login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute roles={['gestion', 'admin']} />}>
                        <Route path="pacientes" element={<PacientesPage />} />
                        <Route path="pacientes/:id" element={<PropiedadesPacientePage />} />
                    </Route>

                    <Route element={<ProtectedRoute roles={['medico', 'admin']} />}>
                        <Route path="expedientes" element={<ExpedientesPage />} />
                        <Route path="expedientes/:id" element={<PropiedadesExpedientePage />} />
                    </Route>

                    <Route element={<ProtectedRoute roles={['admin']} />}>
                        <Route path="usuarios" element={<UsuarioPage />} />
                        <Route path="usuarios/:id" element={<PropiedadesUsuarioPage />} />
                    </Route>

                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default AppEnrutador;