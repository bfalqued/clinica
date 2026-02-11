import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function ExpedientesPage() {
    //Leo el contexto global y obtengo el negocio, el número de elementos
    // a mostrar y el set para definir el nuevo número a mostrar en caso de 
    //querer cambiarlo
    const { negocio, pageSize, setPageSize } = useApp();
    //Defino lo siguiente, para almacenar los pacientes, realizar busquedas,
    // definir la página en la cual me encuentro del paginador y definir el total
    // de pacientes, el cual será necesario por ejemplo en el paginador
    const [pacientes, setPacientes] = useState([]);
    const [buscador, setBuscador] = useState('');
    const [pagina, setPagina] = useState(0);
    const [totalPacientes, setTotalPacientes] = useState(0);
    const navigate = useNavigate();

    //El total de paginas lo calculo redondeando hacia arriba
    const totalPaginas = Math.max(1, Math.ceil(totalPacientes / pageSize));

    //Funcion que cada vez que se cambia el filtro, la página o el tamaño de elementos
    //mostrados vuelve a cargar los datos
    useEffect(() => {
        const cargar = async () => {
            //Calculo el inicio de tal forma que si estoy en la pagina 2 y el tamaño
            // es 6 se empezará ha mostrar por el expediente número 6
            const inicio = pagina * pageSize;
            //Realizo  dos veces la llamada, con una obtengo los pacientes a mostrar y
            //con la otra obtengo todos los datos de esta forma puedo obtener el total
            // de pacientes.
            const datos = await negocio.obtenerPacientes(buscador, inicio, pageSize);
            const todos = await negocio.obtenerPacientes(buscador);
            setPacientes(datos);
            setTotalPacientes(todos.length);
        };
        cargar();
    }, [buscador, pagina, pageSize]);

    return (
        <>
            <h1>Expedientes</h1>
            <div className="barra-acciones">
                {/* Aquí, hago que automaticamente al empezar a escribir se vuelva a
                 la primera página ademas, con cada cambio se irá actualizando el buscador  */}
                <input
                    className="buscador"
                    value={buscador}
                    onChange={(e) => {
                        setPagina(0);
                        setBuscador(e.target.value);
                    }}
                    placeholder="Buscar paciente..."
                />
                {/* selector para poder seleccionar el número de elementos que quieres mostrar */}
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={4}>4 / pág</option>
                    <option value={6}>6 / pág</option>
                    <option value={10}>10 / pág</option>
                </select>
            </div>
            
            {/* Creo la tabla, siempre realizada con div */}
            <div className="tabla-div">
                <div className="fila encabezado">
                    <div>Nombre</div>
                    <div>Seguro médico</div>
                    <div>Teléfono</div>
                    <div>Expediente</div>
                </div>

                {pacientes.map((p) => (
                    <div key={p.id} className="fila">
                        <div>{p.nombre}</div>
                        <div>{p.seguroMedico || 'Sin seguro'}</div>
                        <div>{p.telefono}</div>
                        <div>
                            <button
                                className="btn-ver"
                                onClick={() => navigate(`/expedientes/${p.id}`)}
                            >
                                Abrir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Si no hay longitud en el array de pacientes significará que no los hay asi
            que muestro mensaje */}
            {pacientes.length === 0 && <p className="sin-resultados">No hay expedientes para mostrar.</p>}
            
            {/* Creo el contenedor del paginador con dos botones y un span en el medio para
            mostrar el número de la pagina en la que nos encontramos */}
            <div className="paginador">
                {/* En caso de que la pagina sea la numero 0 desactivo el boton y por el caso contrario,
                si resulta que la pagina es la ultima desabilito el boton siguiente */}
                <button className="btn-pagina" disabled={pagina === 0} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
                <span className="info-pagina">Página {pagina + 1} de {totalPaginas}</span>
                <button className="btn-pagina" disabled={pagina >= totalPaginas - 1} onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
            </div>
        </>
    );
}

export default ExpedientesPage;