import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function LoginPage() {
    //Ya que necesito comprobar la validez del usuario y la contraseña introducidos
    //creo una constante para usuario y contraseña
    const [username, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    //Ademas, introduzco la constante Error con la cual mostraré
    // el error de inicio de sesión en caso de que sea así
    const [error, setError] = useState('');
    
    //Ahora, leo el contexto para hacer login, comprobar si estoy autentificado y para
    //subir un mensaje 
    const { login, isAuth, pushMensaje } = useApp();

    //Utilizo dos constantes, con la primera podré mover al usuario a otra página
    // y con la segunda puedo saber a que página quería ir el usuario antes del login
    const navigate = useNavigate();
    const location = useLocation();

    //Si ya esta logueado lo saco del login
    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    //Función que me servirá para cuando envie el formulario
    const onSubmit = async (e) => {
        //Evito que el navegador recargue la página
        // y limipio errores antiguos
        e.preventDefault();
        setError('');

        //Obtengo el resultado del login el cual validará el usuario
        const resultado = await login(username.trim(), password);
        if (!resultado.ok) {
            setError(resultado.error);
            return;
        }

        //Mando una notificación global
        pushMensaje('Bienvenido al sistema.', 'ok');

        //Con esto hago que si alguien me mando al loguin desde alguna otra página vuelva a esa página, si no 
        //vuelvo al inicio
        const destino = location.state?.from?.pathname || '/';
        navigate(destino, { replace: true });
    };

    return (
        <>
            <h1>Login</h1>
            <form className="login-form" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Ingresa tu usuario"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>

                {error && <p className="error-mensaje">{error}</p>}

                <button type="submit">
                    Iniciar Sesión
                </button>
            </form>
        </>
    )
}

export default LoginPage;