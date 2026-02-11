import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

function ClasificacionPage() {
    const [clasificacion, setClasificacion] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/clasificacion`)
            .then((res) => res.json())
            .then((data) => {
                setClasificacion(data);
                setError('');
            })
            .catch(() => {
                setError('Error cargando clasificación');
            });
    }, []);

    return (
        <div>
            <h2>Clasificación</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="tabla-div">
                <div className="fila encabezado">
                    <div>Equipo</div>
                    <div>Puntos</div>
                    <div>Victorias</div>
                    <div>Derrotas</div>
                    <div>Jugados</div>
                </div>

                {clasificacion.map((registro) => (
                    <div className="fila" key={registro.equipoId}>
                        <div>{registro.nombre}</div>
                        <div>{registro.puntos}</div>
                        <div>{registro.victorias}</div>
                        <div>{registro.derrotas}</div>
                        <div>{registro.partidosJugados}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClasificacionPage;
