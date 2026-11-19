require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
const usuariosRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json({ limit: '20kb' }));

app.get('/api/salud', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS estatus FROM estatus_orden'
    );

    res.json({
      ok: true,
      estatus: rows[0].estatus
    });
  } catch (error) {
    console.error('Error de conexión:', error.message);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar la base de datos'
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/catalogos', require('./routes/catalogos.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/vehiculos', require('./routes/vehiculos.routes'));

app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, mensaje: 'JSON inválido' });
  }

  console.error('Error no controlado:', error);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});
