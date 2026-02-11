import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

function PartidosPage() {
    const [equipos, setEquipos] = useState([]);
    const [partidos, setPartidos] = useState([]);
    const [error, setError] = useState('');
    const [fecha, setFecha] = useState('');

    const [equipoLocalId, setEquipoLocalId] = useState('');
    const [equipoVisitanteId, setEquipoVisitanteId] = useState('');
    const [puntosLocal, setPuntosLocal] = useState('');
    const [puntosVisitante, setPuntosVisitante] = useState('');

    useEffect(() => {
        cargarEquipos();
        cargarPartidos();
    }, []);

    function cargarEquipos() {
        fetch(`${API_URL}/equipos`)
            .then((res) => res.json())
            .then((data) => setEquipos(data));
    }

    function cargarPartidos() {
        fetch(`${API_URL}/partidos`)
            .then((res) => res.json())
            .then((data) => {
                setPartidos(data);
                setError('');
            })
            .catch(() => setError('Error cargando partidos'));
    }

    function crearPartido(e) {
        e.preventDefault();

        if (equipoLocalId === equipoVisitanteId) {
            setError('El equipo local y visitante no pueden ser el mismo');
            return;
        }

        const nuevoPartido = {
            equipoLocalId: Number(equipoLocalId),
            equipoVisitanteId: Number(equipoVisitanteId),
            puntosLocal: Number(puntosLocal),
            puntosVisitante: Number(puntosVisitante),
            fecha,
        };

        fetch(`${API_URL}/partidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPartido),
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 422) {
                        throw new Error('Datos inválidos');
                    }
                    throw new Error('Error al crear partido');
                }
                return res.json();
            })
            .then(() => {
                setEquipoLocalId('');
                setEquipoVisitanteId('');
                setPuntosLocal('');
                setPuntosVisitante('');
                setFecha('');
                cargarPartidos();
            })
            .catch((err) => setError(err.message));
    }

    function borrarPartido(id) {
        if (!window.confirm('¿Seguro que quieres borrar el partido?')) return;

        fetch(`${API_URL}/partidos/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error al borrar partido');
                cargarPartidos();
            })
            .catch((err) => setError(err.message));
    }

    return (
        <div>
            <h2>Partidos</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={crearPartido} className="form-lista">
                <label>
                    Equipo local:
                    <select
                        required
                        value={equipoLocalId}
                        onChange={(e) => setEquipoLocalId(e.target.value)}
                    >
                        <option value="">-- Selecciona --</option>
                        {equipos.map((equipo) => (
                            <option key={equipo.equipoId} value={equipo.equipoId}>
                                {equipo.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Equipo visitante:
                    <select
                        required
                        value={equipoVisitanteId}
                        onChange={(e) => setEquipoVisitanteId(e.target.value)}
                    >
                        <option value="">-- Selecciona --</option>
                        {equipos.map((equipo) => (
                            <option key={equipo.equipoId} value={equipo.equipoId}>
                                {equipo.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Puntos local:
                    <input
                        type="number"
                        required
                        value={puntosLocal}
                        onChange={(e) => setPuntosLocal(e.target.value)}
                    />
                </label>

                <label>
                    Puntos visitante:
                    <input
                        type="number"
                        required
                        value={puntosVisitante}
                        onChange={(e) => setPuntosVisitante(e.target.value)}
                    />
                </label>

                <label>
                    Fecha:
                    <input
                        type="date"
                        required
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </label>

                <button type="submit">Crear partido</button>
            </form>

            <div className="tabla-div">
                <div className="fila encabezado">
                    <div>ID</div>
                    <div>Local</div>
                    <div>Visitante</div>
                    <div>P. Local</div>
                    <div>P. Visitante</div>
                    <div>Fecha</div>
                    <div>Acciones</div>
                </div>

                {partidos.map((partido) => (
                    <div className="fila" key={partido.partidoId}>
                        <div>{partido.partidoId}</div>
                        <div>{partido.equipoLocalId}</div>
                        <div>{partido.equipoVisitanteId}</div>
                        <div>{partido.puntosLocal}</div>
                        <div>{partido.puntosVisitante}</div>
                        <div>{partido.fecha}</div>
                        <div>
                            <button onClick={() => borrarPartido(partido.partidoId)}>
                                Borrar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PartidosPage;
