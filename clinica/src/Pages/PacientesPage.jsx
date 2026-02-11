import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function PacientesPage() {
    const { negocio, pageSize, setPageSize, pushMensaje } = useApp();
    const [pacientes, setPacientes] = useState([]);
    const [buscador, setBuscador] = useState('');
    const [pagina, setPagina] = useState(0);
    const [totalPacientes, setTotalPacientes] = useState(0);
    const navigate = useNavigate();

    const totalPaginas = Math.max(1, Math.ceil(totalPacientes / pageSize));

    const cargar = async () => {
        const inicio = pagina * pageSize;
        const datos = await negocio.obtenerPacientes(buscador, inicio, pageSize);
        const todos = await negocio.obtenerPacientes(buscador);
        setPacientes(datos);
        setTotalPacientes(todos.length);
    };

    useEffect(() => {
        cargar();
    }, [buscador, pagina, pageSize]);

    const eliminar = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar este paciente?')) return;
        await negocio.eliminarPaciente(id);
        pushMensaje('Paciente eliminado.', 'ok');
        await cargar();
    };

    return (
        <>
            <h1>Pacientes</h1>

            <div className="barra-acciones">
                <input
                    className="buscador"
                    value={buscador}
                    onChange={(e) => {
                        setPagina(0);
                        setBuscador(e.target.value);
                    }}
                    placeholder="Buscar por nombre, dni, email..."
                />
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={4}>4 / pág</option>
                    <option value={6}>6 / pág</option>
                    <option value={10}>10 / pág</option>
                </select>
                <button className="btn-crear" onClick={() => navigate('/pacientes/new')}>
                    Crear Paciente
                </button>
            </div>

            <div className="lista-pacientes">
                {pacientes.map((p) => (
                    <div key={p.id} className="tarjeta-paciente">
                        <div className="datos">
                            <strong>{p.nombre}</strong>
                            <div>DNI: {p.dni}</div>
                            <div>Email: {p.email}</div>
                            <div>Tel: {p.telefono}</div>
                        </div>
                        <div className="acciones">
                            <button onClick={() => navigate(`/pacientes/${p.id}`)}>Editar</button>
                            <button className="btn-eliminar" onClick={() => eliminar(p.id)}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {pacientes.length === 0 && (
                <p className="sin-resultados">No hay pacientes para mostrar.</p>
            )}

            <div className="paginador">
                <button
                    className="btn-pagina"
                    disabled={pagina === 0}
                    onClick={() => setPagina((p) => p - 1)}
                >
                    Anterior
                </button>
                <span className="info-pagina">
                    Página {pagina + 1} de {totalPaginas}
                </span>
                <button
                    className="btn-pagina"
                    disabled={pagina >= totalPaginas - 1}
                    onClick={() => setPagina((p) => p + 1)}
                >
                    Siguiente
                </button>
            </div>
        </>
    );
}

export default PacientesPage;
