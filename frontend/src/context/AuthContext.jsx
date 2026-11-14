
import {
  createContext,
  useContext,
  useState
} from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000';

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Iniciar sesión con el backend
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

  // Cerrar sesión
  const cerrarSesion = () => {
    setSesion(null);
  };

  // Actualizar los datos del usuario autenticado
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
        actualizarUsuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder a la autenticación
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider'
    );
  }

  return contexto;
}
