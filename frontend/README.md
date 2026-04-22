# GoWo — Frontend

Interfaz web del proyecto GoWo construida con **Next.js 16**, **React 19** y **TypeScript**.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS Modules

## Variables de entorno

Crea un archivo `.env.local` en la carpeta `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

## Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

La aplicación corre en `http://localhost:3001`.

## Estructura

```
frontend/
├── app/              # Páginas (App Router)
│   ├── login/
│   ├── profiles/
│   └── dashboard/
├── components/       # Componentes reutilizables
├── context/          # AuthContext, ThemeContext
└── lib/              # Servicios: authService, profileService, requestService, githubService
```

## Flujos principales

- **Registro / Login** → JWT + Refresh Token
- **Explorar perfiles** → Listado paginado de egresados con skills y repositorios de GitHub
- **Dashboard egresado** → Crear/editar perfil, vincular GitHub, gestionar solicitudes recibidas
- **Dashboard empresa** → Ver estadísticas de solicitudes enviadas y su estado
