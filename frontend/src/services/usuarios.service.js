
const API_URL = 'http://localhost:3000/api/usuarios';

async function peticion(ruta, token, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opciones.headers
    }
  });

  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('Respuesta inválida del servidor');
  }

  if (!respuesta.ok || !datos.ok) {
    throw new Error(
      datos.mensaje || 'Error al consultar los usuarios'
    );
  }

  return datos;
}

export const usuariosService = {
  listar(token) {
    return peticion('', token);
  },

  obtener(id, token) {
    return peticion(`/${id}`, token);
  },

  crear(usuario, token) {
    return peticion('', token, {
      method: 'POST',
      body: JSON.stringify(usuario)
    });
  },

  actualizar(id, usuario, token) {
    return peticion(`/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(usuario)
    });
  },

  cambiarEstado(id, activo, token) {
    return peticion(`/${id}/estado`, token, {
      method: 'PATCH',
      body: JSON.stringify({ activo })
    });
  },

  restablecerContrasena(id, contrasena, token) {
    return peticion(`/${id}/contrasena`, token, {
      method: 'PATCH',
      body: JSON.stringify({ contrasena })
    });
  }
};
