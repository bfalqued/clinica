import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const initial = {
    id: 0,
    pacienteId: 0,
    fechaApertura: '',
    antecedentes: '',
    diagnosticos: '',
    tratamientos: '',
    observaciones: '',
};

function PropiedadesExpedientePage() {
    const { id } = useParams();
    const { negocio, pushMensaje } = useApp();
    const navigate = useNavigate();
    const [expediente, setExpediente] = useState(initial);
    const [paciente, setPaciente] = useState(null);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        const cargar = async () => {
            const p = await negocio.obtenerPaciente(id);
            const e = await negocio.obtenerExpediente(id);
            if (!p || !e) {
                pushMensaje('Expediente no encontrado.', 'error');
                navigate('/expedientes');
                return;
            }
            setPaciente(p);
            setExpediente(e);
        };
        cargar();
    }, [id]);

    const validar = () => {
        const e = {};
        if (!expediente.fechaApertura) e.fechaApertura = 'Fecha de apertura obligatoria';
        return e;
    };

    const guardar = async (ev) => {
        ev.preventDefault();
        const e = validar();
        setErrores(e);
        if (Object.keys(e).length) return;
        await negocio.actualizarExpediente(expediente);
        pushMensaje('Expediente actualizado.', 'ok');
        navigate('/expedientes');
    };

    const change = (campo, valor) => setExpediente((x) => ({ ...x, [campo]: valor }));

    return (
        <>
            <h1>Propiedades del Expediente</h1>
            {paciente && (
                <div className="contenedor-info">
                    <strong>{paciente.nombre}</strong> · DNI {paciente.dni} · {paciente.telefono}
                </div>
            )}

            <form className="login-form" onSubmit={guardar}>
                <div><label>Fecha apertura</label><input type="date" value={expediente.fechaApertura || ''} onChange={(e) => change('fechaApertura', e.target.value)} /></div>
                {errores.fechaApertura && <p className="error-mensaje">{errores.fechaApertura}</p>}

                <div><label>Antecedentes</label><textarea value={expediente.antecedentes || ''} onChange={(e) => change('antecedentes', e.target.value)} /></div>
                <div><label>Diagnósticos</label><textarea value={expediente.diagnosticos || ''} onChange={(e) => change('diagnosticos', e.target.value)} /></div>
                <div><label>Tratamientos</label><textarea value={expediente.tratamientos || ''} onChange={(e) => change('tratamientos', e.target.value)} /></div>
                <div><label>Observaciones</label><textarea value={expediente.observaciones || ''} onChange={(e) => change('observaciones', e.target.value)} /></div>
                <button type="submit">Guardar</button>
                <button type="button" className="btn-cancelar" onClick={() => navigate('/expedientes')}>Volver</button>
            </form>
        </>
    );
}

export default PropiedadesExpedientePage;