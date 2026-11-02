# Biblioteca Comunitaria

La Biblioteca Comunitaria lleva el control de su catálogo y de los préstamos a sus miembros con este sistema: una API REST en **Express + TypeScript + PostgreSQL** y una SPA en **React + TypeScript**.

El sistema **no funciona como debería**. Tu tarea es dejarlo funcionando según el [comportamiento esperado](#comportamiento-esperado) que se describe abajo.

- Tiempo: **60 minutos**.
- Corrige el código existente; no es necesario rediseñar ni reescribir el proyecto.
- Revisa tanto la app como la API: hay funcionalidades que no tienen pantalla y solo se pueden probar desde Swagger.
- Haz **un commit por cada problema que resuelvas**, con un mensaje que explique la causa.
- Mientras trabajas, explica en voz alta qué estás revisando y por qué.

---

## Requisitos

- Node.js 22 o superior
- pnpm
- PostgreSQL corriendo en tu máquina

## Puesta en marcha

### Backend

```bash
cd backend
pnpm install
cp .env.example .env      # completa DB_PASSWORD y JWT_SECRET
pnpm db:setup             # crea la base biblioteca_db y carga los datos de prueba
pnpm dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

`pnpm db:setup` borra y vuelve a crear las tablas: puedes ejecutarlo cuando quieras volver a los datos iniciales.

### Frontend

En otra terminal:

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

- App: http://localhost:5173

## Usuarios de prueba

| Nombre | Correo | Contraseña | Rol |
|---|---|---|---|
| Administrador | admin@biblioteca.com | admin123 | ADMIN |
| Ana Torres | ana@biblioteca.com | miembro123 | MIEMBRO |
| Luis Pérez | luis@biblioteca.com | miembro123 | MIEMBRO |

## Estructura

```
backend/
├── db/                   schema.sql y script de datos de prueba
└── src/
    ├── config/           pool de conexión a PostgreSQL
    ├── controllers/
    ├── middlewares/      JWT, roles y validaciones con Zod
    ├── models/           consultas SQL
    ├── routes/
    └── index.ts
frontend/
└── src/
    ├── components/
    ├── lib/              instancia de Axios
    ├── pages/
    ├── schemas/          esquemas de Zod de los formularios
    ├── services/         llamadas a la API
    ├── stores/           Zustand
    └── types/
```

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Devuelve `{ token, usuario }` |
| `GET` | `/api/books?search=&page=&limit=` | Público | Lista paginada: `{ data, total, page, totalPages }` |
| `GET` | `/api/books/:id` | Público | Detalle de un libro |
| `POST` | `/api/books` | ADMIN | Registra un libro |
| `POST` | `/api/loans` | MIEMBRO | Registra un préstamo `{ bookId, days }` |
| `GET` | `/api/loans/me` | MIEMBRO | Préstamos del usuario autenticado |
| `GET` | `/api/loans/:id` | MIEMBRO, ADMIN | Detalle de un préstamo |

Las rutas protegidas esperan el header `Authorization: Bearer <token>`.

## Comportamiento esperado

### Sesión

- Iniciar sesión con cualquiera de los usuarios de prueba lleva al catálogo. Con credenciales incorrectas se muestra "Credenciales inválidas".
- Todas las pantallas, excepto el login, requieren sesión. Sin sesión, se redirige a `/login`.
- Recargar la página (F5) mantiene la sesión.
- "Cerrar sesión" vuelve al login.

### Catálogo

- Muestra 8 libros por página, ordenados por título.
- "Anterior" y "Siguiente" cambian de página, y la URL lo refleja (`/?page=2`). Recargar mantiene la página actual.
- La búsqueda filtra por título o autor sin distinguir mayúsculas. Por ejemplo, `borges` devuelve 2 libros y `O'Connor` devuelve 1.

### Detalle y préstamos

- Un MIEMBRO puede pedir prestado un libro por un plazo de 1 a 14 días. Al confirmar, se muestra la fecha de devolución y el número de ejemplares disponibles baja en uno.
- Un libro sin ejemplares disponibles (por ejemplo, *Rayuela*) no se puede pedir prestado.
- "Mis préstamos" lista los préstamos del usuario. Con los datos iniciales, Ana tiene 2 préstamos.
- El ADMIN no ve "Mis préstamos" ni el formulario de préstamo.

### API

- `POST /api/books` responde `401` sin token, `403` si el usuario no es ADMIN, `400` si el body no es válido y `201` con el libro creado. Un libro rechazado no debe guardarse: por ejemplo, después de enviar uno con `title: ""` no debe aparecer en el catálogo.
- `POST /api/loans` responde `400` si los días están fuera del rango 1 a 14, `409` si no hay ejemplares y `201` con el préstamo creado.
- `GET /api/loans/:id` responde `404` si el préstamo no existe o pertenece a otro miembro.
- Cualquier respuesta `500` se considera un fallo.
