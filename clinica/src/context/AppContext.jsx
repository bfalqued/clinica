import { createContext, useContext, useMemo, useState } from 'react';
import $negocio from '../core/negocio';
// import '../index.css';

//Creo el contexto donde estará la info compartida
const AppContext = createContext(null);

//Constantes para saber cuantos registros mostrar y como se llama la sesion
const DEFAULT_PAGE_SIZE = 6;
const SESSION_KEY = 'clinica.session';
const PAGE_SIZE_KEY = 'clinica.pageSize';

//Función para leer la sesion que he guardado
function readSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

//Función para leer cuantos elementos desea mostrar el usuario,
//por defecto pongo 6 elementos
function readPageSize() {
    const raw = Number(localStorage.getItem(PAGE_SIZE_KEY));
    return Number.isInteger(raw) && raw > 0 ? raw : DEFAULT_PAGE_SIZE;
}

//Es lo que va a envolver toda la aplicación en main.jsx de tal forma que todo lo que este
//dentro podrá utilizar useApp
export function AppProvider({ children }) {
    //Constantes con los datos del usuario logueado,mensaje y registros a mostrar
    const [usuario, setUsuario] = useState(readSession);
    const [mensaje, setMensaje] = useState(null);
    const [pageSize, setPageSizeState] = useState(readPageSize);

    //Esta función se encarga de preguntar a negocio si el usuario es válido, en caso 
    //afirmativo se realiza el loguin
    const login = async (username, password) => {
        const validado = await $negocio.validarUsuario(username, password);
        if (!validado) {
            return { ok: false, error: 'Credenciales incorrectas.' };
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(validado));
        setUsuario(validado);
        return { ok: true };
    };

    //Con esto lo que hago es que desde cualquier parte de la app
    //se puede hacer un pushMensaje y mostrarlo con el componente mensaje
    const pushMensaje = (texto, tipo = 'info') => {
        setMensaje({ texto, tipo, ts: Date.now() });
    };

    //Borra la sesión,limpia usuario y lanza un aviso
    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        setUsuario(null);
        pushMensaje('Sesión cerrada correctamente.', 'info');
    };

    //Ademas, limpio el mensaje
    const clearMensaje = () => setMensaje(null);

    //Aztualizo el tamaño de registros que muestro
    const setPageSize = (size) => {
        setPageSizeState(size);
        localStorage.setItem(PAGE_SIZE_KEY, String(size));
    };

    //Esto es lo que utilizo en el menu para comprobar los roles
    const hasRole = (...roles) => Boolean(usuario) && roles.includes(usuario.tipo);

    //Aquí es donde decido que es lo que los demas pueden usar
    const value = {
        usuario,
        isAuth: Boolean(usuario),
        login,
        logout,
        hasRole,
        negocio: $negocio,
        mensaje,
        pushMensaje,
        clearMensaje,
        pageSize,
        setPageSize,
    }

    //Aqui lo que hago es devolverlo haciendo que todo lo que haya dentro tiene acceso
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

//Hook personalizado que utilizo para no escribir codigo de mas
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error('useApp debe usarse dentro de AppProvider');
    }
    return ctx;
}