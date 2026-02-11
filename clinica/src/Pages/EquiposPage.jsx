import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

function EquiposPage() {
    const [equipos, setEquipos] = useState([]);
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [entrenador, setEntrenador] = useState('');

    useEffect(() => {
        cargarEquipos();
    }, []);

    function cargarEquipos() {
        fetch(`${API_URL}/equipos`)
            .then((res) => res.json())
            .then((data) => {
                setEquipos(data);
                setError('');
            })
            .catch(() => {
                setError('Error cargando equipos');
            });
    }

    function crearEquipo(e) {
        e.preventDefault();

        if (
            nombre.trim() === '' ||
            ciudad.trim() === '' ||
            entrenador.trim() === ''
        ) {
            setError('Todos los campos son obligatorios');
            return;
        }

        fetch(`${API_URL}/equipos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre.trim(),
                ciudad: ciudad.trim(),
                entrenador: entrenador.trim(),
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error al crear equipo');
                return res.json();
            })
            .then(() => {
                setNombre('');
                setCiudad('');
                setEntrenador('');
                cargarEquipos();
            })
            .catch((err) => setError(err.message));
    }

    function borrarEquipo(id) {
        if (!window.confirm('¿Seguro que quieres borrar el equipo?')) return;

        fetch(`${API_URL}/equipos/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 409) {
                        throw new Error('El equipo tiene partidos asociados');
                    }
                    throw new Error('Error al borrar el equipo');
                }
                cargarEquipos();
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div>
            <h2>Equipos</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={crearEquipo} className="form-lista">
                <label>
                    Nombre:
                    <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </label>

                <label>
                    Ciudad:
                    <input
                        type="text"
                        required
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                    />
                </label>

                <label>
                    Entrenador:
                    <input
                        type="text"
                        required
                        value={entrenador}
                        onChange={(e) => setEntrenador(e.target.value)}
                    />
                </label>

                <button type="submit">Crear equipo</button>
            </form>

            <div className="tabla-div">
                <div className="fila encabezado">
                    <div>ID</div>
                    <div>Nombre</div>
                    <div>Ciudad</div>
                    <div>Entrenador</div>
                    <div>Acciones</div>
                </div>

                {equipos.map((equipo) => (
                    <div className="fila" key={equipo.equipoId}>
                        <div>{equipo.equipoId}</div>
                        <div>{equipo.nombre}</div>
                        <div>{equipo.ciudad}</div>
                        <div>{equipo.entrenador}</div>
                        <div>
                            <button onClick={() => borrarEquipo(equipo.equipoId)}>
                                Borrar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EquiposPage;
