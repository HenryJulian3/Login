# Login

Este es un proyecto de ejemplo para implementar un sistema de inicio de sesión utilizando Node.js, Express y MongoDB.

## Requisitos previos

- Node.js v14 o superior
- MongoDB

## 📦 Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/HenryJulian3/Login.git
   cd Login
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

   ```ini
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/login
   SECRET_KEY=your_secret_key
   ```

## 🚀 Uso

1. Inicia el servidor:

   ```sh
   npm start
   ```

2. Abre tu navegador y ve a `http://localhost:3000` para acceder a la aplicación.

## 📂 Estructura del proyecto

- `app.js`: Configuración principal de la aplicación.
- `routes/`: Define las rutas de la aplicación.
- `models/`: Define los modelos de Mongoose.
- `views/`: Contiene las vistas de la aplicación (utilizando EJS).

## 🎯 Características

- Registro de usuarios
- Inicio de sesión
- Autenticación de sesiones utilizando cookies y sesiones

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## 📜 Licencia

Este proyecto está bajo la Licencia MIT.
