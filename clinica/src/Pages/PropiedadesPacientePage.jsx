import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

//Defino el estado inicial del formulario
const initial = {
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    sexo: 'Masculino',
    direccion: '',
    seguroMedico: '',
};

function PropiedadesPacientePage() {
    //Con esto compruebo si es crear o editar, en caso de que me venga new es crear
    const { id } = useParams();
    const esNuevo = id === 'new';

    //Me traigo negocio para hacer las operaciones que necesite
    const { negocio, pushMensaje } = useApp();
    const [paciente, setPaciente] = useState(initial);
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        //Si es nuevo no cargas nada
        if (esNuevo) return;

        //En caso de que me venga el paciente, lo obtengo, si no se encuentra lanzo error,
        //en caso contrario relleno el formulario
        negocio.obtenerPaciente(id).then((data) => {
            if (!data) {
                pushMensaje('Paciente no encontrado.', 'error');
                navigate('/pacientes');
                return;
            }
            //Como seguro medico es la unica opcional es la que puede venir vacía
            setPaciente({ ...data, seguroMedico: data.seguroMedico || '' });
        });
    }, [id]);

    //Con esta funcion valido todos los campos que hay
    const validar = () => {
        const e = {};
        if (!paciente.nombre.trim()) e.nombre = 'Nombre obligatorio';
        if (!/^\d{7,10}$/.test(String(paciente.dni))) e.dni = 'DNI inválido';
        if (!/^\S+@\S+\.\S+$/.test(paciente.email)) e.email = 'Email inválido';
        if (!paciente.telefono.trim()) e.telefono = 'Teléfono obligatorio';
        if (!paciente.fechaNacimiento) e.fechaNacimiento = 'Fecha obligatoria';
        if (!paciente.direccion.trim()) e.direccion = 'Dirección obligatoria';
        return e;
    };

    //Segun si es nuevo o no cambio el titulo
    const titulo = useMemo(() => (esNuevo ? 'Crear paciente' : `Editar paciente #${id}`), [esNuevo, id]);

    //Función para el envio del formulario
    const onSubmit = async (e) => {
        e.preventDefault();
        //Aqui lo que hago es que si hay errores paras
        const eVal = validar();
        setErrores(eVal);
        if (Object.keys(eVal).length) return;

        //En caso de ser nuevo creo el paciente y muestro mensaje global, en caso contrario
        //actualizo el paciente
        if (esNuevo) {
            await negocio.crearPaciente(paciente);
            pushMensaje('Paciente creado correctamente.', 'ok');
        } else {
            await negocio.actualizarPaciente({ ...paciente, id: Number(id) });
            pushMensaje('Paciente actualizado correctamente.', 'ok');
        }

        navigate('/pacientes');
    };

    //Función para cambiar valores del formulario e ir guardandolos en el array de pacientes
    const change = (campo, valor) => setPaciente((p) => ({ ...p, [campo]: valor }));

    return (
        <>
            <h1>{titulo}</h1>
            <form className="login-form" onSubmit={onSubmit}>
                <div><label>Nombre</label><input value={paciente.nombre} onChange={(e) => change('nombre', e.target.value)} /></div>
                {errores.nombre && <p className="error-mensaje">{errores.nombre}</p>}

                <div><label>DNI</label><input value={paciente.dni} onChange={(e) => change('dni', e.target.value)} /></div>
                {errores.dni && <p className="error-mensaje">{errores.dni}</p>}

                <div><label>Email</label><input value={paciente.email} onChange={(e) => change('email', e.target.value)} /></div>
                {errores.email && <p className="error-mensaje">{errores.email}</p>}

                <div><label>Teléfono</label><input value={paciente.telefono} onChange={(e) => change('telefono', e.target.value)} /></div>
                {errores.telefono && <p className="error-mensaje">{errores.telefono}</p>}

                <div><label>Fecha nacimiento</label><input type="date" value={paciente.fechaNacimiento} onChange={(e) => change('fechaNacimiento', e.target.value)} /></div>
                {errores.fechaNacimiento && <p className="error-mensaje">{errores.fechaNacimiento}</p>}

                <div>
                    <label>Sexo</label>
                    <select value={paciente.sexo} onChange={(e) => change('sexo', e.target.value)}>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div><label>Dirección</label><input value={paciente.direccion} onChange={(e) => change('direccion', e.target.value)} /></div>
                {errores.direccion && <p className="error-mensaje">{errores.direccion}</p>}

                <div><label>Seguro médico</label><input value={paciente.seguroMedico} onChange={(e) => change('seguroMedico', e.target.value)} /></div>
                <button type="submit">Guardar</button>
                <button type="button" className="btn-cancelar" onClick={() => navigate('/pacientes')}>Volver</button>
            </form>
        </>
    );
}

export default PropiedadesPacientePage;