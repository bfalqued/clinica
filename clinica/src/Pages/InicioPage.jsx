import { useState } from "react";

import "../index.css";
function InicioPage() {
    //Datos que se mostrarán en el carrusel
    const articulos = [
        {
            id: 1,
            titulo: 'Atención médica personalizada',
            texto: 'Cuidamos de cada paciente con un enfoque humano y profesional.',
        },
        {
            id: 2,
            titulo: 'Historial clínico digital',
            texto: 'Accede a los expedientes médicos de forma rápida y segura.',
        },
        {
            id: 3,
            titulo: 'Profesionales cualificados',
            texto: 'Nuestro equipo está formado por especialistas con amplia experiencia.',
        },
    ];

    //Aqui se definirá que elemento del array se muestra
    const [indice, setIndice] = useState(0);

    return (
        <>
            <h1>Página de Inicio</h1>

            <div className="contenedor-info">
                <p>
                    Aplicación de gestión clínica con control por roles: gestión de pacientes,
                    edición de expedientes y administración de usuarios.
                </p>
            </div>

            <div className="carrusel">
                <h3>{articulos[indice].titulo}</h3>
                <p>{articulos[indice].texto}</p>

                <div className="carrusel-botones">
                    {/* Utilizo el % para volver al inicio cuando se pasa del 0 hacia atras ademas el + es para evitar
                     números negativos */}
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