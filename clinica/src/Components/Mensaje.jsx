import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

function Mensaje() {
    const { mensaje, clearMensaje } = useApp();

    useEffect(() => {
        if (!mensaje) return;
        const t = setTimeout(() => clearMensaje(), 3000);
        return () => clearTimeout(t);
    }, [mensaje, clearMensaje]);

    if (!mensaje) return null;

    return <div className={`mensaje mensaje-${mensaje.tipo}`}>{mensaje.texto}</div>;
}

export default Mensaje;