const ROLES = {
  MECANICO: 1,
  CAJERO: 2,
  ADMINISTRADOR: 3
};

class ErrorApi extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

const idValido = (valor) => {
  const numero = Number(valor);

  return (
    Number.isSafeInteger(numero) &&
    numero > 0 &&
    numero <= 4294967295
  );
};

const exigirId = (valor, campo = 'ID') => {
  if (!idValido(valor)) {
    throw new ErrorApi(400, `${campo} no válido`);
  }

  return Number(valor);
};

const textoOpcional = (valor, max, campo) => {
  if (valor === undefined || valor === null) return null;

  if (typeof valor !== 'string') {
    throw new ErrorApi(400, `${campo} no válido`);
  }

  const limpio = valor.trim();

  if (limpio.length > max) {
    throw new ErrorApi(
      400,
      `${campo} no debe superar ${max} caracteres`
    );
  }

  return limpio || null;
};

const textoObligatorio = (valor, min, max, campo) => {
  if (typeof valor !== 'string') {
    throw new ErrorApi(400, `${campo} es obligatorio`);
  }

  const limpio = valor.trim();

  if (limpio.length < min || limpio.length > max) {
    throw new ErrorApi(
      400,
      `${campo} debe tener entre ${min} y ${max} caracteres`
    );
  }

  return limpio;
};

const booleano = (valor) =>
  valor === true || valor === 1 || valor === '1' ? 1 : 0;

const manejar = (controlador) => async (req, res) => {
  try {
    await controlador(req, res);
  } catch (error) {
    if (error instanceof ErrorApi) {
      return res.status(error.status).json({
        ok: false,
        mensaje: error.message
      });
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ya existe un registro con esos datos'
      });
    }

    if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      return res.status(400).json({
        ok: false,
        mensaje: 'Los datos no cumplen las reglas de la base de datos'
      });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        ok: false,
        mensaje: 'Uno de los registros relacionados no existe'
      });
    }

    console.error(`Error en ${req.method} ${req.originalUrl}:`, error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  ROLES,
  ErrorApi,
  idValido,
  exigirId,
  textoOpcional,
  textoObligatorio,
  booleano,
  manejar
};
