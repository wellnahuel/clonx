# Clon X

Clone de la red social X (Twitter) construido con Next.js 16, React 19, HeroUI v3 y Tailwind CSS v4. Autenticación con GitHub (NextAuth v5) y base de datos en Neon (PostgreSQL serverless).

## 🚀 Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + HeroUI v3 + Tailwind CSS v4 |
| Auth | NextAuth v5 (Auth.js) con GitHub OAuth (JWT strategy) |
| Base de datos | Neon (PostgreSQL serverless) vía `@neondatabase/serverless` |
| Package manager | npm |
| Animación/Iconos | Tabler Icons |

## ✨ Funcionalidades

- **Auth con GitHub**: login/logout con sesión JWT, protección de rutas vía proxy (`src/proxy.ts`).
- **Feed de tweets**: timeline con los posts de los usuarios.
- **Favoritos (likes)**: toggle por usuario con contador, tabla `favorites`.
- **Retweets**: re-post con referencia al original (`retweet_of_id`).
- **Replies**: responder a un tweet (patrón Twitter, anidadas 1 nivel, `reply_to_id`).
- **Avatares circulares** que enlazan al perfil de GitHub del autor.
- **Dark / Light mode**: toggle persistente (localStorage) que respeta la preferencia del sistema, sin flash (FOUC).
- **UI pulida**: estados hover/focus consistentes.

## 📦 Estructura relevante

```
src/
├── auth.ts                  # Config de NextAuth (providers, callbacks JWT)
├── proxy.ts                 # Protección de rutas (Next 16 proxy/middleware)
├── lib/
│   └── neon.ts              # Cliente SQL de Neon (neon())
├── app/
│   ├── api/auth/[...nextauth]/route.ts   # Route handler de NextAuth
│   ├── components/          # card-post, list-post, compose-post, user-menu, theme-toggle...
│   ├── actions/             # add-post, toggle-favorite, create-retweet
│   └── page.tsx             # Feed principal
└── types/
    ├── posts.ts             # Tipos de Post/Reply/User
    └── next-auth.d.ts       # Extensión de tipos de sesión
```

## 🗄️ Base de datos (Neon)

Esquema en la database `clonx` del proyecto Neon:

- **`users`**: `id (uuid PK)`, `name`, `user_name (UNIQUE, login GitHub)`, `avatar_url`, `email`, `created_at`
- **`posts`**: `id (uuid PK)`, `content`, `created_at`, `user_id (FK users)`, `retweet_of_id (FK posts)`, `reply_to_id (FK posts)`
- **`favorites`**: `post_id (FK posts)`, `user_id (FK users)`, `created_at`, PK `(post_id, user_id)`

El `user_name` es la clave de lookup: al hacer login, NextAuth busca al usuario por `user_name` (con fallback por email) y reutiliza el UUID existente para preservar las relaciones (posts/favorites/replies).

> Nota: no hay sistema de migraciones; el DDL se aplica manualmente con `psql` contra Neon.

## 🛠️ Setup local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env.local` con las variables:

```env
GITHUB_CLIENT_ID=tu_client_id
GITHUB_CLIENT_SECRET=tu_client_secret
AUTH_SECRET=generar_con_openssl_rand_base64_32
AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://.../clonx?sslmode=require
```

3. Levantar el dev server:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Configurar la OAuth App de GitHub

- **Redirect URI (dev)**: `http://localhost:3000/api/auth/callback/github`
- **Redirect URI (prod)**: `https://<tu-dominio>/api/auth/callback/github`

## ☁️ Deploy en Vercel

El proyecto está pensado para Vercel. Configurar las mismas env vars de arriba (con `AUTH_URL` apuntando al dominio de producción). El build usa npm (`npm install` / `next build`).

## 🔧 Scripts

```bash
npm run dev      # Dev server
npm run build    # Build de producción
npm start        # Servir el build de producción
```
