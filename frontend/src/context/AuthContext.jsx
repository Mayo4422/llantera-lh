import {
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000';

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (usuario, contrasena) => {
    setCargando(true);

    try {
      const respuesta = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario,
            contrasena
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo iniciar sesión'
        );
      }

      if (!datos.token || !datos.usuario) {
        throw new Error(
          'El servidor devolvió una respuesta de autenticación inválida'
        );
      }

      setSesion({
        token: datos.token,
        usuario: datos.usuario
      });

      return datos.usuario;

    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = useCallback(() => {
    setSesion(null);
  }, []);

  const token = sesion?.token || null;

  const peticion = useCallback(
    async (ruta, { method = 'GET', body } = {}) => {
      const respuesta = await fetch(`${API_URL}/api${ruta}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: body === undefined ? undefined : JSON.stringify(body)
      });

      let datos;

      try {
        datos = await respuesta.json();
      } catch {
        throw new Error('Respuesta inválida del servidor');
      }

      if (respuesta.status === 401) {
        setSesion(null);
      }

      if (!respuesta.ok || !datos.ok) {
        throw new Error(datos.mensaje || 'Error al consultar el servidor');
      }

      return datos;
    },
    [token]
  );

  const actualizarUsuario = (cambios) => {
    setSesion((anterior) => {
      if (!anterior) {
        return null;
      }

      return {
        ...anterior,
        usuario: {
          ...anterior.usuario,
          ...cambios
        }
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        sesion,
        usuario: sesion?.usuario || null,
        token: sesion?.token || null,
        autenticado: Boolean(sesion?.token),
        cargando,
        iniciarSesion,
        cerrarSesion,
        actualizarUsuario,
        peticion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider'
    );
  }

  return contexto;
}
