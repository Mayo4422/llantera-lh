# Proyecto: Sistema de Información Web para la Coordinación Operativa de Llantas y Servicios La Huerta

## Objetivo
Desarrollar un sistema web para mejorar la comunicación en los procesos de prestación y cobro de servicios en Llantas y Servicios La Huerta.

## Problema operativo
El taller trabaja en dos edificios. Puede ocurrir que un servicio o material se considere cobrado en caja sin quedar registrado correctamente, generando pérdidas. Además, los mecánicos se desplazan para solicitar materiales. El sistema debe mejorar coordinación, comunicación y trazabilidad.

## Tecnologías conocidas
- Frontend: React + Vite.
- Backend: Node.js + Express.
- Base de datos: MySQL 8.4.
- Autenticación: JWT.
- Hash de contraseñas: bcrypt.
- Iconos: lucide-react.
- Desarrollo: Windows 11, PowerShell y VS Code.
- Frontend local: http://localhost:5173
- API local: http://localhost:3000
- Repositorio conocido: https://github.com/Mayo4422/llantera-lh

## Roles conocidos (verificar en el esquema/código)
- Mecánico (id_rol=1): atiende órdenes, registra diagnósticos, solicita piezas y finaliza servicios.
- Cajero (id_rol=2): registra clientes, vehículos y órdenes; atiende solicitudes y confirma entregas.
- Administrador (id_rol=3): administra usuarios, supervisa órdenes y gestiona la operación.

## Módulos previstos
Autenticación, usuarios, roles, clientes, vehículos, órdenes de servicio, solicitudes de piezas, cobros/entregas, historial de estados y notificaciones.

Estados de orden previamente reportados: Recibido, En diagnóstico, En proceso, Esperando refacción, Terminado, Entregado y Cancelado. Verificar los valores reales antes de utilizarlos.

## Flujo operativo que debe guiar el diseño
El mecánico registra/atiende la orden, comunica diagnóstico y solicita piezas cuando sea necesario. El cajero atiende la solicitud y gestiona el cobro y la entrega. La orden debe tener trazabilidad hasta quedar Entregada. No diseñar un módulo de cobro aislado del flujo acordado sin justificarlo.

## Estado reportado por el usuario
Pruebas aprobadas:
- Login correcto e incorrecto, protección de rutas, cierre de sesión, cambio de contraseña e invalidación de tokens antiguos.
- Usuarios: listar, crear, editar, restablecer contraseña, buscar y proteger la propia cuenta.
- Roles: visualizar, restringir acciones y aplicar cambios de rol.
- Clientes: registro temporal en React, búsqueda, validación, cancelar y contador.

Pendiente:
- Activar/desactivar usuarios.
- Vehículos: listado, formulario, relación cliente/marca/modelo y operaciones.
- Órdenes: listado, creación, asignación, estados e historial.
- Solicitudes de piezas: listado, creación, cambio de estado y consulta.
- Cobros/entregas: control, cobro, entrega y forma de pago.
- Historial y notificaciones: consulta, cambios, listado y marcar como leído.

Este estado es un reporte manual, no una auditoría. Distingue siempre entre implementado y probado, implementado no probado, parcial, solo interfaz/datos simulados, no implementado y bloqueado.

## Reglas obligatorias
1. Inspecciona el repositorio y esquema SQL antes de cambiar código.
2. No inventes tablas, columnas, rutas, estados, roles ni relaciones.
3. No cambies nombres ni elimines funcionalidades existentes sin explicar impacto.
4. No ejecutes ALTER, DROP, TRUNCATE ni migraciones destructivas sin aprobación explícita.
5. No leas, imprimas, copies ni compartas valores de .env, contraseñas, tokens, JWT_SECRET ni hashes.
6. Usa consultas parametrizadas y valida entradas también en backend.
7. Aplica permisos en backend, no solo ocultando botones en frontend.
8. Implementa cada módulo de extremo a extremo y prueba persistencia real.
9. Haz cambios pequeños; explica archivos y alcance antes de editar.
10. Trabaja en español, con instrucciones concretas y comandos PowerShell completos.
11. Al terminar, informa archivos modificados, comportamiento, pruebas ejecutadas, resultados y pendientes.
12. No declares funcional una pantalla solo porque renderice.

## Primer trabajo
Lee PROMPT_INICIAL_CLAUDE.txt y realiza primero una auditoría sin modificar archivos.
