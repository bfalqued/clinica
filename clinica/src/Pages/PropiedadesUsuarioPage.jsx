import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const initial = {
    username: '',
    password: '',
    tipo: 'gestion',
};

function PropiedadesUsuarioPage() {
    const { id } = useParams();
    const esNuevo = id === 'new';
    const { negocio, pushMensaje } = useApp();
    const [usuario, setUsuario] = useState(initial);
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (esNuevo) return;
        negocio.obtenerUsuario(id).then((u) => {
            if (!u) {
                pushMensaje('Usuario no encontrado.', 'error');
                navigate('/usuarios');
                return;
            }
            setUsuario({ ...u, password: u.password || '' });
        });
    }, [id]);

    const validar = () => {
        const e = {};
        if (!usuario.username.trim()) e.username = 'Usuario obligatorio';
        if (!usuario.password.trim()) e.password = 'Contraseña obligatoria';
        if (!['gestion', 'medico', 'admin'].includes(usuario.tipo)) e.tipo = 'Rol inválido';
        return e;
    };

    const guardar = async (ev) => {
        ev.preventDefault();
        const e = validar();
        setErrores(e);
        if (Object.keys(e).length) return;

        if (esNuevo) {
            await negocio.crearUsuario(usuario);
            pushMensaje('Usuario creado.', 'ok');
        } else {
            await negocio.actualizarUsuario({ ...usuario, id: Number(id) });
            pushMensaje('Usuario actualizado.', 'ok');
        }

        navigate('/usuarios');
    };

    const change = (campo, valor) => setUsuario((u) => ({ ...u, [campo]: valor }));

    return (
        <>
            <h1>{esNuevo ? 'Crear usuario' : `Editar usuario #${id}`}</h1>
            <form className="login-form" onSubmit={guardar}>
                <div><label>Username</label><input value={usuario.username} onChange={(e) => change('username', e.target.value)} /></div>
                {errores.username && <p className="error-mensaje">{errores.username}</p>}

                <div><label>Password</label><input value={usuario.password} onChange={(e) => change('password', e.target.value)} /></div>
                {errores.password && <p className="error-mensaje">{errores.password}</p>}

                <div>
                    <label>Tipo</label>
                    <select value={usuario.tipo} onChange={(e) => change('tipo', e.target.value)}>
                        <option value="gestion">gestion</option>
                        <option value="medico">medico</option>
                        <option value="admin">admin</option>
                    </select>
                </div>
                {errores.tipo && <p className="error-mensaje">{errores.tipo}</p>}
                <button type="submit">Guardar</button>
                <button type="button" className="btn-cancelar" onClick={() => navigate('/usuarios')}>Volver</button>
            </form>
        </>
    );
}
export default PropiedadesUsuarioPage;