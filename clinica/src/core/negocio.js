const API = {
  pacientes: 'http://localhost:8000/api/pacientes',
  expedientes: 'http://localhost:8000/api/expedientes',
  usuarios: 'http://localhost:8000/api/usuarios',
};

const $negocio = (function () {

  /* =======================
     HELPERS
  ======================= */
  async function request(url, options = {}) {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error API ${res.status}: ${text}`);
    }

    // 204 No Content
    if (res.status === 204) return true;

    // Solo parsear JSON si realmente lo es
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }

    // Si llega aquí → backend devolvió HTML
    const text = await res.text();
    console.error('Respuesta NO JSON:', text);
    throw new Error('La API no devolvió JSON');
  }


  /* =======================
     PACIENTES
  ======================= */
  async function obtenerPacientes(filtro = '', inicio = 0, limite) {
    const params = new URLSearchParams();
    if (filtro) params.append('filtro', filtro);
    if (inicio) params.append('inicio', inicio);
    if (limite !== undefined) params.append('limite', limite);

    return request(`${API.pacientes}?${params.toString()}`);
  }

  async function obtenerPaciente(pacienteId) {
    try {
      return await request(`${API.pacientes}/${pacienteId}`);
    } catch {
      return null;
    }
  }

  async function crearPaciente(objPaciente) {
    const paciente = await request(API.pacientes, {
      method: 'POST',
      body: JSON.stringify(objPaciente),
    });
    return paciente.id;
  }

  async function actualizarPaciente(objPaciente) {
    await request(`${API.pacientes}/${objPaciente.id}`, {
      method: 'PUT',
      body: JSON.stringify(objPaciente),
    });
    return true;
  }

  async function eliminarPaciente(pacienteId) {
    await request(`${API.pacientes}/${pacienteId}`, {
      method: 'DELETE',
    });
    return true;
  }

  /* =======================
     EXPEDIENTES
  ======================= */
  async function obtenerExpediente(pacienteId) {
    try {
      return await request(`${API.expedientes}/paciente/${pacienteId}`);
    } catch {
      return null;
    }
  }

  async function actualizarExpediente(objExpediente) {
    await request(`${API.expedientes}/${objExpediente.id}`, {
      method: 'PUT',
      body: JSON.stringify(objExpediente),
    });
    return true;
  }

  /* =======================
     USUARIOS
  ======================= */
  async function obtenerUsuarios() {
    return request(API.usuarios);
  }

  async function obtenerUsuario(usuarioId) {
    try {
      return await request(`${API.usuarios}/${usuarioId}`);
    } catch {
      return null;
    }
  }

  async function crearUsuario(objUsuario) {
    const usuario = await request(API.usuarios, {
      method: 'POST',
      body: JSON.stringify(objUsuario),
    });
    return usuario.id;
  }

  async function actualizarUsuario(objUsuario) {
    await request(`${API.usuarios}/${objUsuario.id}`, {
      method: 'PUT',
      body: JSON.stringify(objUsuario),
    });
    return true;
  }

  async function eliminarUsuario(usuarioId) {
    await request(`${API.usuarios}/${usuarioId}`, {
      method: 'DELETE',
    });
    return true;
  }

  async function validarUsuario(username, password) {
    try {
      return await request(`${API.usuarios}/validar`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    } catch {
      return false;
    }
  }

  async function limpiarLocalStorage() {
    localStorage.clear();
    return true;
  }

  return {
    obtenerPacientes,
    obtenerPaciente,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,

    obtenerExpediente,
    actualizarExpediente,

    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,

    validarUsuario,
    limpiarLocalStorage
  };
})();

window.$negocio = $negocio;
export default $negocio;
