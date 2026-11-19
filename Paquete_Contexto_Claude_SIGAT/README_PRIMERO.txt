PAQUETE DE CONTEXTO PARA CLAUDE CODE

1. Extrae este ZIP en la raíz de tu proyecto:
   C:\Users\angel\Desktop\RESIDENCIA\Llantera\Llantera-code
2. Ejecuta desde PowerShell en esa raíz:
   powershell -ExecutionPolicy Bypass -File .\PREPARAR_CONTEXTO.ps1
3. El script crea CONTEXTO_CLAUDE con el código relevante del frontend/backend, inventario y esquema SQL (solo estructura, sin datos).
4. Abre la raíz del proyecto con Claude Code.
5. Claude debe leer CLAUDE.md y PROMPT_INICIAL_CLAUDE.txt.

SEGURIDAD:
No compartas .env, contraseñas, tokens, claves JWT, hashes, certificados ni datos reales de clientes.
El script excluye .env, node_modules, .git, dist y build. Revisa CONTEXTO_CLAUDE antes de compartirlo.
Este ZIP no contiene el código fuente actual: el script lo recopila desde tu PC.
