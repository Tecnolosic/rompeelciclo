---
description: Deploying the application to Vercel
---

# Guía de Despliegue en Vercel

Sigue estos pasos para subir tu aplicación a internet de forma gratuita y profesional.

## 1. Preparación del Código
Asegúrate de que tu proyecto está limpio y listo.
1.  En tu terminal (VS Code), ejecuta: `npm run build`
2.  Si no hay errores rojos, tu código está listo.

## 2. Subir a GitHub
Vercel necesita que tu código esté en GitHub para actualizarse automáticamente cuando hagas cambios.
1.  Ve a [GitHub.com](https://github.com) y crea un **Nuevo Repositorio** (ponle un nombre como `rompe-el-ciclo-web`).
2.  No marques "Initialize with README", déjalo vacío.
3.  En tu terminal de VS Code, ejecuta estos comandos uno por uno (reemplaza `TU_USUARIO` y `TU_REPO` con los datos reales de GitHub):

```bash
git init
git add .
git commit -m "Initial commit - Ready for launch"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## 3. Conectar con Vercel
1.  Ve a [Vercel.com](https://vercel.com) y regístrate (o inicia sesión con GitHub).
2.  Haz clic en **"Add New..."** -> **"Project"**.
3.  Verás tu repositorio de GitHub en la lista. Dale al botón **"Import"**.

## 4. Configurar Variables de Entorno (¡CRUCIAL!)
Antes de darle a "Deploy", busca la sección **"Environment Variables"** y despliégala.
Tienes que copiar las claves de tu archivo `.env.local` aquí:

| Name | Value (Copiar de tu .env.local) |
|------|-----------------------------------|
| `VITE_SUPABASE_URL` | `https://slaxvavhc...` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |

*(Nota: No necesitas poner las claves secretas de backend aquí, solo las que empiezan con `VITE_` que usa la app).*

## 5. Lanzamiento
1.  Dale clic a **"Deploy"**.
2.  Espera unos segundos... ¡y verás caer el confeti! 🎉
3.  Vercel te dará una URL (ej: `rompe-el-ciclo.vercel.app`). Esa es tu nueva dirección web.

## 6. Ajuste Final: Lemon Squeezy
Una vez tengas tu URL final:
1.  Ve a **Lemon Squeezy Dashboard**.
2.  Edita tu producto.
3.  En **Confirmation Page**, cambia el link del botón por tu nueva URL de Vercel.
4.  Así, cuando la gente pague, volverá a la web real, no a localhost.
