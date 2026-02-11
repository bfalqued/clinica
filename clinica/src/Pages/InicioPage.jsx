import { useState } from 'react';

function InicioPage() {
    const articulos = [
        {
            id: 1,
            titulo: 'Gestión de equipos',
            texto: 'Crea equipos con su nombre, ciudad y entrenador para organizar la liga.',
        },
        {
            id: 2,
            titulo: 'Registro de partidos',
            texto: 'Anota los resultados de cada jornada y mantén la competición actualizada.',
        },
        {
            id: 3,
            titulo: 'Clasificación automática',
            texto: 'Consulta puntos, victorias, derrotas y partidos jugados de cada equipo.',
        },
    ];

    const [indice, setIndice] = useState(0);

    return (
        <>
            <h1>Página de Inicio</h1>

            <div className="contenedor-info">
                <p>
                    Aplicación de gestión deportiva con tres módulos: equipos, partidos y
                    clasificación.
                </p>
            </div>

            <div className="carrusel">
                <h3>{articulos[indice].titulo}</h3>
                <p>{articulos[indice].texto}</p>

                <div className="carrusel-botones">
                    <button onClick={() => setIndice((indice - 1 + articulos.length) % articulos.length)}>
                        Anterior
                    </button>
                    <button onClick={() => setIndice((indice + 1) % articulos.length)}>Siguiente</button>
                </div>
            </div>
        </>
    );
}

export default InicioPage;
