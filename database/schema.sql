-- =====================================================================
-- Sistema de Información Web para la Coordinación Operativa
-- Llantas y Servicios La Huerta
-- Base de datos: llantera_lh  (MySQL 8.0 o superior)
-- 18 tablas: 8 catálogos + 10 de operación, normalizadas a 3FN
-- =====================================================================

DROP DATABASE IF EXISTS llantera_lh;
CREATE DATABASE llantera_lh
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE llantera_lh;

-- ---------------------------------------------------------------------
-- CATÁLOGOS
-- ---------------------------------------------------------------------

CREATE TABLE rol (
  id_rol        TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(30)      NOT NULL,
  descripcion   VARCHAR(150)     NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uq_rol_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE tipo_cliente (
  id_tipo_cliente TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre          VARCHAR(20)      NOT NULL,
  PRIMARY KEY (id_tipo_cliente),
  UNIQUE KEY uq_tipo_cliente_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE marca (
  id_marca  SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre    VARCHAR(40)       NOT NULL,
  PRIMARY KEY (id_marca),
  UNIQUE KEY uq_marca_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE modelo (
  id_modelo INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  id_marca  SMALLINT UNSIGNED NOT NULL,
  nombre    VARCHAR(60)       NOT NULL,
  PRIMARY KEY (id_modelo),
  UNIQUE KEY uq_modelo_marca_nombre (id_marca, nombre),
  CONSTRAINT fk_modelo_marca FOREIGN KEY (id_marca) REFERENCES marca (id_marca)
) ENGINE=InnoDB;

CREATE TABLE tipo_garantia (
  id_tipo_garantia TINYINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre           VARCHAR(40)       NOT NULL,
  dias             SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_tipo_garantia),
  UNIQUE KEY uq_tipo_garantia_nombre (nombre),
  CONSTRAINT ck_tipo_garantia_dias CHECK (dias > 0)
) ENGINE=InnoDB;

CREATE TABLE estatus_orden (
  id_estatus TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(30)      NOT NULL,
  secuencia  TINYINT UNSIGNED NOT NULL,
  color_hex  CHAR(7)          NOT NULL,
  PRIMARY KEY (id_estatus),
  UNIQUE KEY uq_estatus_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE estado_solicitud (
  id_estado_solicitud TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre              VARCHAR(40)      NOT NULL,
  PRIMARY KEY (id_estado_solicitud),
  UNIQUE KEY uq_estado_solicitud_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE forma_pago (
  id_forma_pago TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(30)      NOT NULL,
  PRIMARY KEY (id_forma_pago),
  UNIQUE KEY uq_forma_pago_nombre (nombre)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- OPERACIÓN
-- ---------------------------------------------------------------------

CREATE TABLE usuario (
  id_usuario              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nombre_completo         VARCHAR(100)     NOT NULL,
  usuario                 VARCHAR(30)      NOT NULL,
  contrasena_hash         CHAR(60)         NOT NULL,
  id_rol                  TINYINT UNSIGNED NOT NULL,
  activo                  BOOLEAN          NOT NULL DEFAULT TRUE,
  debe_cambiar_contrasena BOOLEAN          NOT NULL DEFAULT TRUE,
  ultimo_acceso           DATETIME         NULL,
  fecha_creacion          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_usuario (usuario),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
) ENGINE=InnoDB;

CREATE TABLE cliente (
  id_cliente      INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nombre_completo VARCHAR(120)     NOT NULL,
  telefono        CHAR(10)         NOT NULL,
  correo          VARCHAR(120)     NULL,
  id_tipo_cliente TINYINT UNSIGNED NOT NULL,
  fecha_registro  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo          BOOLEAN          NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_cliente),
  KEY ix_cliente_nombre (nombre_completo),
  KEY ix_cliente_telefono (telefono),
  CONSTRAINT ck_cliente_telefono CHECK (telefono REGEXP '^[0-9]{10}$'),
  CONSTRAINT fk_cliente_tipo FOREIGN KEY (id_tipo_cliente) REFERENCES tipo_cliente (id_tipo_cliente)
) ENGINE=InnoDB;

CREATE TABLE vehiculo (
  id_vehiculo    INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  id_cliente     INT UNSIGNED      NOT NULL,
  id_modelo      INT UNSIGNED      NOT NULL,
  anio           SMALLINT UNSIGNED NOT NULL,
  color          VARCHAR(30)       NOT NULL,
  placas         VARCHAR(10)       NULL,
  fecha_registro DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo         BOOLEAN           NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_vehiculo),
  UNIQUE KEY uq_vehiculo_placas (placas),
  CONSTRAINT ck_vehiculo_anio CHECK (anio BETWEEN 1950 AND 2100),
  CONSTRAINT fk_vehiculo_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente),
  CONSTRAINT fk_vehiculo_modelo  FOREIGN KEY (id_modelo)  REFERENCES modelo (id_modelo)
) ENGINE=InnoDB;

CREATE TABLE categoria_servicio (
  id_categoria     SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre           VARCHAR(60)       NOT NULL,
  descripcion      VARCHAR(200)      NULL,
  id_tipo_garantia TINYINT UNSIGNED  NOT NULL,
  activa           BOOLEAN           NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_categoria),
  UNIQUE KEY uq_categoria_nombre (nombre),
  CONSTRAINT fk_categoria_garantia FOREIGN KEY (id_tipo_garantia) REFERENCES tipo_garantia (id_tipo_garantia)
) ENGINE=InnoDB;

CREATE TABLE orden_servicio (
  id_orden             INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  id_vehiculo          INT UNSIGNED      NOT NULL,
  id_categoria         SMALLINT UNSIGNED NOT NULL,
  id_estatus           TINYINT UNSIGNED  NOT NULL,
  id_mecanico          INT UNSIGNED      NULL,
  id_usuario_registro  INT UNSIGNED      NOT NULL,
  fecha_llegada        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kilometraje_ingreso  INT UNSIGNED      NOT NULL,
  problema_reportado   VARCHAR(500)      NOT NULL,
  requiere_diagnostico BOOLEAN           NOT NULL DEFAULT FALSE,
  diagnostico          TEXT              NULL,
  observaciones        VARCHAR(300)      NULL,
  motivo_cancelacion   VARCHAR(200)      NULL,
  PRIMARY KEY (id_orden),
  KEY ix_orden_estatus_llegada (id_estatus, fecha_llegada),
  KEY ix_orden_mecanico (id_mecanico),
  CONSTRAINT fk_orden_vehiculo  FOREIGN KEY (id_vehiculo)         REFERENCES vehiculo (id_vehiculo),
  CONSTRAINT fk_orden_categoria FOREIGN KEY (id_categoria)        REFERENCES categoria_servicio (id_categoria),
  CONSTRAINT fk_orden_estatus   FOREIGN KEY (id_estatus)          REFERENCES estatus_orden (id_estatus),
  CONSTRAINT fk_orden_mecanico  FOREIGN KEY (id_mecanico)         REFERENCES usuario (id_usuario),
  CONSTRAINT fk_orden_registro  FOREIGN KEY (id_usuario_registro) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE historial_estatus (
  id_historial INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  id_orden     INT UNSIGNED     NOT NULL,
  id_estatus   TINYINT UNSIGNED NOT NULL,
  id_usuario   INT UNSIGNED     NOT NULL,
  fecha_hora   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comentario   VARCHAR(200)     NULL,
  PRIMARY KEY (id_historial),
  KEY ix_historial_orden (id_orden, fecha_hora),
  CONSTRAINT fk_historial_orden   FOREIGN KEY (id_orden)   REFERENCES orden_servicio (id_orden),
  CONSTRAINT fk_historial_estatus FOREIGN KEY (id_estatus) REFERENCES estatus_orden (id_estatus),
  CONSTRAINT fk_historial_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE solicitud_pieza (
  id_solicitud        INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  id_orden            INT UNSIGNED      NOT NULL,
  nombre_pieza        VARCHAR(100)      NOT NULL,
  cantidad            SMALLINT UNSIGNED NOT NULL,
  nota                VARCHAR(200)      NULL,
  id_estado_solicitud TINYINT UNSIGNED  NOT NULL,
  id_usuario_solicita INT UNSIGNED      NOT NULL,
  fecha_solicitud     DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario_atiende  INT UNSIGNED      NULL,
  fecha_atencion      DATETIME          NULL,
  PRIMARY KEY (id_solicitud),
  KEY ix_solicitud_orden (id_orden),
  CONSTRAINT ck_solicitud_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_solicitud_orden    FOREIGN KEY (id_orden)            REFERENCES orden_servicio (id_orden),
  CONSTRAINT fk_solicitud_estado   FOREIGN KEY (id_estado_solicitud) REFERENCES estado_solicitud (id_estado_solicitud),
  CONSTRAINT fk_solicitud_solicita FOREIGN KEY (id_usuario_solicita) REFERENCES usuario (id_usuario),
  CONSTRAINT fk_solicitud_atiende  FOREIGN KEY (id_usuario_atiende)  REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE cobro_entrega (
  id_cobro             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  id_orden             INT UNSIGNED     NOT NULL,
  codigo_nota          VARCHAR(30)      NOT NULL,
  total_cobrado        DECIMAL(10,2)    NOT NULL,
  id_forma_pago        TINYINT UNSIGNED NOT NULL,
  descuento            DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  motivo_descuento     VARCHAR(200)     NULL,
  id_usuario_descuento INT UNSIGNED     NULL,
  id_usuario_registro  INT UNSIGNED     NOT NULL,
  fecha_entrega        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cliente_conforme     BOOLEAN          NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id_cobro),
  UNIQUE KEY uq_cobro_orden (id_orden),
  UNIQUE KEY uq_cobro_codigo_nota (codigo_nota),
  CONSTRAINT ck_cobro_total     CHECK (total_cobrado >= 0),
  CONSTRAINT ck_cobro_descuento CHECK (descuento >= 0 AND descuento <= total_cobrado),
  CONSTRAINT fk_cobro_orden     FOREIGN KEY (id_orden)             REFERENCES orden_servicio (id_orden),
  CONSTRAINT fk_cobro_forma     FOREIGN KEY (id_forma_pago)        REFERENCES forma_pago (id_forma_pago),
  CONSTRAINT fk_cobro_descuento FOREIGN KEY (id_usuario_descuento) REFERENCES usuario (id_usuario),
  CONSTRAINT fk_cobro_registro  FOREIGN KEY (id_usuario_registro)  REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE notificacion (
  id_notificacion   INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  id_orden          INT UNSIGNED     NOT NULL,
  tipo              ENUM('PIEZA_SOLICITADA','AUTORIZACION','VEHICULO_TERMINADO',
                         'CAMBIO_ESTATUS','ORDEN_ASIGNADA') NOT NULL,
  mensaje           VARCHAR(200)     NOT NULL,
  id_rol_destino    TINYINT UNSIGNED NOT NULL,
  id_usuario_origen INT UNSIGNED     NOT NULL,
  fecha_hora        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion),
  KEY ix_notificacion_rol_fecha (id_rol_destino, fecha_hora),
  CONSTRAINT fk_notificacion_orden  FOREIGN KEY (id_orden)          REFERENCES orden_servicio (id_orden),
  CONSTRAINT fk_notificacion_rol    FOREIGN KEY (id_rol_destino)    REFERENCES rol (id_rol),
  CONSTRAINT fk_notificacion_origen FOREIGN KEY (id_usuario_origen) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE notificacion_lectura (
  id_notificacion INT UNSIGNED NOT NULL,
  id_usuario      INT UNSIGNED NOT NULL,
  fecha_lectura   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion, id_usuario),
  CONSTRAINT fk_lectura_notificacion FOREIGN KEY (id_notificacion) REFERENCES notificacion (id_notificacion),
  CONSTRAINT fk_lectura_usuario      FOREIGN KEY (id_usuario)      REFERENCES usuario (id_usuario)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- DATOS INICIALES DE LOS CATÁLOGOS
-- ---------------------------------------------------------------------

INSERT INTO rol (id_rol, nombre, descripcion) VALUES
  (1, 'Taller',              'Cambia estatus, registra diagnósticos, solicita piezas y avisa al terminar.'),
  (2, 'Recepción',           'Registra clientes, vehículos y órdenes; atiende piezas, cobro y entrega; accede al inventario.'),
  (3, 'Superadministradora', 'Funciones de Recepción, administración de usuarios y descuentos a clientes de mayoreo.');

INSERT INTO tipo_cliente (id_tipo_cliente, nombre) VALUES
  (1, 'Normal'),
  (2, 'Mayoreo');

INSERT INTO tipo_garantia (id_tipo_garantia, nombre, dias) VALUES
  (1, 'Servicio general', 30),
  (2, 'Llantas',          730);

INSERT INTO estatus_orden (id_estatus, nombre, secuencia, color_hex) VALUES
  (1, 'Recibido',            1, '#64748B'),
  (2, 'En diagnóstico',      2, '#F59E0B'),
  (3, 'En proceso',          3, '#2563EB'),
  (4, 'Esperando refacción', 4, '#DC2626'),
  (5, 'Terminado',           5, '#16A34A'),
  (6, 'Entregado',           6, '#0F172A'),
  (7, 'Cancelado',           7, '#9CA3AF');

INSERT INTO estado_solicitud (id_estado_solicitud, nombre) VALUES
  (1, 'Solicitada'),
  (2, 'Pendiente de autorización'),
  (3, 'No autorizada'),
  (4, 'Entregada');

INSERT INTO forma_pago (id_forma_pago, nombre) VALUES
  (1, 'Efectivo'),
  (2, 'Transferencia'),
  (3, 'Tarjeta'),
  (4, 'Crédito'),
  (5, 'De contado');

INSERT INTO categoria_servicio (nombre, descripcion, id_tipo_garantia) VALUES
  ('Cambio de llantas',          'Montaje, balanceo y calibración de neumáticos.',      2),
  ('Alineación y balanceo',      'Alineación computarizada y balanceo de ruedas.',      1),
  ('Frenos',                     'Revisión y cambio de balatas, discos y líquido.',     1),
  ('Afinación',                  'Cambio de bujías, filtros y revisión general.',       1),
  ('Suspensión',                 'Revisión y cambio de amortiguadores y componentes.',  1),
  ('Cambio de aceite',           'Cambio de aceite y filtro.',                          1),
  ('Reparación de ponchadura',   'Reparación de neumáticos ponchados.',                 1),
  ('Diagnóstico general',        'Revisión para identificar la falla reportada.',       1);

INSERT INTO marca (id_marca, nombre) VALUES
  (1, 'Chevrolet'), (2, 'Ford'), (3, 'Honda'), (4, 'Mazda'),
  (5, 'Nissan'), (6, 'Toyota'), (7, 'Volkswagen');

INSERT INTO modelo (id_marca, nombre) VALUES
  (1, 'Aveo'), (2, 'Ranger'), (2, 'Transit'), (3, 'Civic'), (3, 'CR-V'),
  (4, 'Mazda 3'), (5, 'Tsuru'), (5, 'NP300'), (5, 'Versa'),
  (6, 'Hilux'), (7, 'Jetta');

-- Superadministradora inicial
-- usuario: admin  ·  contraseña temporal: Cambiar2026!  (se pide cambiarla en el primer acceso)
INSERT INTO usuario (nombre_completo, usuario, contrasena_hash, id_rol, activo, debe_cambiar_contrasena) VALUES
  ('Sandra Cortés García', 'admin',
   '$2b$10$4pinDxYaNvPcMk/gJ/7gHuRkADZuDgDneNB8RQo4w/ZzYPbW.Hndq', 3, TRUE, TRUE);