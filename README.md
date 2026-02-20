# GoWo - Frontend

Este repositorio contiene la **capa de Cliente (Frontend)** del proyecto GoWo, construida con **Next.js** y **TypeScript** bajo una arquitectura **100% SOA**.

## Tecnologías principales

- Next.js
- React
- TypeScript
- CSS/Tailwind (a definir por el equipo)
- Consumo de API REST vía HTTP/JSON

## Arquitectura

- Este repositorio es **independiente** del backend y de la base de datos.
- La comunicación con el backend se realiza únicamente mediante llamadas HTTP/HTTPS a la API:
  - Ejemplo de base URL (por definir): `https://api.gowo.com/api/v1`
- Puerto de desarrollo por defecto: **3000**.

## Objetivo del Frontend

- Implementar la interfaz de usuario de GoWo.
- Consumir los endpoints definidos en el contrato de la API (login, CRUD de workflows, etc.).
- Manejar autenticación, navegación, filtros, paginación y UX/UI.

## Scripts iniciales (propuestos)

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build

# Servir build de producción
npm start
