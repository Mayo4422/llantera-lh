import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const VACIO = {
  tiposCliente: [],
  marcas: [],
  modelos: [],
  categorias: [],
  estatus: [],
  estadosSolicitud: [],
  formasPago: [],
  mecanicos: []
};

export function useCatalogos() {
  const { peticion } = useAuth();
  const [catalogos, setCatalogos] = useState(VACIO);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    try {
      const datos = await peticion('/catalogos');
      setCatalogos({ ...VACIO, ...datos });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [peticion]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { catalogos, errorCatalogos: error, recargarCatalogos: recargar };
}
