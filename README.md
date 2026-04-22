# GoWo — Frontend

> Interfaz web del proyecto GoWo. Aplicación Next.js 16 con React 19 y TypeScript que consume la API REST del backend. Implementa autenticación JWT, rutas protegidas, integración con GitHub API y flujos completos para egresados y empresas.

---

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Flujos de usuario](#flujos-de-usuario)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Integración con el Backend](#integración-con-el-backend)
- [Decisiones técnicas](#decisiones-técnicas)

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.x | Framework React con App Router |
| React | 19.x | UI |
| TypeScript | 5.x | Tipado estático |
| CSS Modules | — | Estilos aislados por componente |
| Zod | 4.x | Validación de formularios (client-side) |

---

## Arquitectura

El frontend sigue una **separación estricta de responsabilidades**:

```
frontend/
├── app/               → Páginas (App Router de Next.js)
│   ├── page.tsx       → Landing / Inicio
│   ├── login/         → Autenticación
│   ├── profiles/      → Listado y detalle de egresados
│   └── dashboard/     → Panel egresado/empresa
├── components/
│   ├── Layout/        → Navbar, Footer
│   └── UI/            → Loader, ErrorMessage, Pagination, ProfileCard, SkillBadge
├── context/
│   ├── AuthContext    → Estado global de sesión (user, login, logout)
│   └── ThemeContext   → Dark / Light mode
└── lib/
    ├── http.ts         → httpClient genérico con auto-refresh de token
    ├── authService.ts  → login, register, logout
    ├── profileService.ts → CRUD de perfiles
    ├── requestService.ts → Solicitudes empresa-egresado
    └── githubService.ts  → Repos públicos vía backend proxy
```

---

## Instalación local

**Prerequisitos:** Node.js 18+, backend GoWo corriendo en `localhost:3000`

```bash
# Instalar dependencias
cd frontend
npm install

# Configurar variables de entorno
echo 'NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1' > .env.local

# Levantar en desarrollo
npm run dev -- -p 3002
```

La aplicación corre en `http://localhost:3002`.

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Desarrollo con hot-reload |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Linting con ESLint |

---

## Variables de entorno

Crea `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

En producción (Vercel), agrega esta variable en el dashboard de Vercel apuntando a la URL del backend desplegado.

---

## Flujos de usuario

### Egresado
1. **Registro** → `/` → selecciona rol `egresado`
2. **Login** → obtiene JWT almacenado en `localStorage`
3. **Dashboard** → crea/edita su perfil, agrega skills y usuario de GitHub
4. **Solicitudes recibidas** → acepta o rechaza solicitudes de empresas directamente desde el dashboard
5. **Perfil público** → visible en `/profiles/[id]` con sus repositorios de GitHub en vivo

### Empresa
1. **Registro** → selecciona rol `empresa`
2. **Explorar perfiles** → `/profiles` con paginación
3. **Ver detalle** → `/profiles/[id]` muestra skills + repos de GitHub del egresado
4. **Enviar solicitud** → formulario con descripción mínima de 10 caracteres
5. **Dashboard** → estadísticas en tiempo real: total, aceptadas, pendientes, rechazadas

---

## Integración con el Backend

Toda la comunicación pasa por `lib/http.ts`, un cliente HTTP centralizado que:

- Adjunta el `Authorization: Bearer <token>` automáticamente en rutas protegidas
- Detecta errores `401` y **refresca el access token** automáticamente usando el refresh token
- Si el refresh falla, limpia la sesión y redirige a `/login`
- Lanza errores tipados `ApiError` con `status` y `message`

```
Frontend → httpClient → Bearer Token → Backend API → Respuesta tipada
                    ↓ (401)
              Auto-refresh token
                    ↓ (falla)
              Logout + redirect /login
```

---

## Decisiones técnicas

- **App Router de Next.js:** Permite layouts compartidos, rutas anidadas y client/server components según necesidad.
- **CSS Modules sobre Tailwind:** Control total del diseño sin dependencias externas; los estilos son locales y no generan conflictos.
- **httpClient centralizado:** Elimina la repetición de lógica de autenticación en cada llamada. El auto-refresh es transparente para los servicios.
- **AuthContext sobre Zustand/Redux:** El estado de autenticación es simple y no justifica una librería externa. React Context es suficiente y más fácil de auditar.
- **Separación en servicios (authService, profileService, etc.):** Cada servicio encapsula los llamados a la API de su dominio, facilitando el testing y la sustitución futura.
- **Integración GitHub vía backend:** El frontend nunca llama directamente a GitHub. El backend actúa como proxy, lo que permite agregar caché o rate limiting sin cambiar el frontend.
