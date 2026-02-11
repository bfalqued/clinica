import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function UsuarioPage() {
    const { negocio, pushMensaje } = useApp();
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    const cargar = async () => {
        setUsuarios(await negocio.obtenerUsuarios());
    };

    useEffect(() => {
        cargar();
    }, []);

    const eliminar = async (id) => {
        if (!window.confirm('¿Eliminar usuario?')) return;
        await negocio.eliminarUsuario(id);
        pushMensaje('Usuario eliminado.', 'ok');
        cargar();
    };
    return (
        <>
            <h1>Usuarios</h1>
            <div className="barra-acciones">
                <button className="btn-crear" onClick={() => navigate('/usuarios/new')}>Crear Usuario</button>
            </div>
            <table className="tabla-simple">
                <thead>
                    <tr><th>Username</th><th>Tipo</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id}>
                            <td>{u.username}</td>
                            <td>{u.tipo}</td>
                            <td>
                                <button className="btn-ver" onClick={() => navigate(`/usuarios/${u.id}`)}>Editar</button>{' '}
                                <button className="btn-eliminar" onClick={() => eliminar(u.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default UsuarioPage;