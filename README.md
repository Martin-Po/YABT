MPX Fullstack Docker Template 🚀
Este es un Boilerplate de Arquitectura Profesional diseñado para acelerar el desarrollo de aplicaciones Full Stack robustas. El stack está optimizado para la productividad, portabilidad y escalabilidad, utilizando un entorno totalmente containerizado.

🛠 Stack Tecnológico
Frontend: React 18 + Vite + Material UI (MUI).

Backend: Node.js + Express.

Base de Datos: PostgreSQL 15.

Testing: Jest + React Testing Library + JSDOM.

Orquestación: Docker & Docker Compose.

✨ Características Principales
Arquitectura de Microservicios: Separación clara entre cliente, servidor y persistencia.

Flujo de Desarrollo Optimizado: Configuración de Hot-Reload mediante polling en Vite, garantizando la sincronización en tiempo real de archivos entre hosts Windows (NTFS) y contenedores Linux.

Dockerización Avanzada:

Multi-stage Builds: Imágenes de producción livianas optimizadas.

Docker Secrets: Gestión segura de credenciales de base de datos y tokens (sin exponerlos en el código fuente).

Autenticación Base: Estructura de Login, protección de rutas y manejo de estado global (AuthContext) ya implementados.

UI Moderna y Accesible: Implementación de Material UI con sistema de alertas globales, diseño responsive y validación de accesibilidad (A11y).

Suite de Pruebas Integrada: Entorno de testing configurado con soporte para componentes de MUI, simulación asíncrona de eventos de usuario (user-event) y mocks de red.

🚀 Inicio Rápido
Requisitos previos
Docker Desktop instalado y en ejecución.

Node.js (opcional, solo si deseas ejecutar scripts locales fuera de Docker).

1. Clonar e Instalar
Bash
git clone https://github.com/Martin-Po/fullstack-docker-mpx-template.git
cd fullstack-docker-mpx-template
2. Variables de Entorno
Renombra el archivo .env.example a .env en la raíz del proyecto (y en las carpetas respectivas si aplica) y ajusta tus credenciales locales:

Code snippet
# Ejemplo de .env
DB_USER=admin
DB_PASSWORD=secretpassword
DB_NAME=mpx_database
JWT_SECRET=tu_secreto_super_seguro
3. Levantar los Contenedores
Ejecuta el siguiente comando en la raíz del proyecto para construir y levantar toda la infraestructura:

Bash
docker-compose up --build
4. Acceder a la Aplicación
Una vez que los contenedores estén corriendo, podrás acceder a los servicios en los siguientes puertos:

Frontend (React/Vite): http://localhost:5173

Backend (API Express): http://localhost:3000

Base de Datos (PostgreSQL): localhost:5432


🧪 Ejecutar las Pruebas (Testing)
El frontend incluye una configuración robusta de Jest para validar la lógica y renderizado de los componentes (especialmente Material UI). Para correr la suite de pruebas:

Si tienes Node instalado localmente:

Bash
cd frontend
npm install
npm test
Si prefieres correrlas dentro del contenedor Docker:

Bash
docker exec -it <nombre_del_contenedor_client> npm test
🛑 Comandos Útiles de Docker
Levantar los servicios en segundo plano: docker-compose up -d

Bajar los servicios y eliminar la red: docker-compose down

Bajar los servicios eliminando también los volúmenes (borra los datos de la DB): docker-compose down -v

Ver los logs del frontend o backend: docker-compose logs -f client o docker-compose logs -f server
