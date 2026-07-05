# Pendiente de commitear y desplegar

## 1. Hacer commit de TODO

Ejecuta esto desde la raíz del proyecto:

```bash
git add -A
git commit -m "feat: DeepSeek como proveedor IA, Docker Compose, README y limpieza de gitignore"
git push origin main
```

## 2. Verificar que el frontend compila

```bash
cd frontend
npm run build
```

## 3. Desplegar con Docker

```bash
docker compose up -d
```

## 4. Probar desde la URL de producción
- Abrir http://localhost
- Iniciar sesión con Google
- Probar el flujo CRUD completo

## Resumen de cambios realizados en esta sesión

### ✅ DeepSeek como proveedor IA
- **`frontend/src/pages/Profile.tsx`** — Añadida opción DeepSeek al `<select>` de proveedores
- **`backend/src/services/ai-routine.service.ts`** — Añadida URL `api.deepseek.com/v1/chat/completions` y reutilización del handler OpenAI-compatible con modelo por defecto `deepseek-chat`

### ✅ Dockerización completa
- **`backend/Dockerfile`** — Multi-stage builder (tsc) + runner (node:20-alpine)
- **`backend/.dockerignore`** — Excluye node_modules, dist, .env
- **`frontend/Dockerfile`** — Multi-stage builder (Vite) + runner (nginx:alpine)
- **`frontend/nginx.conf`** — Sirve SPA + proxy `/api/` → gaur-api:3000
- **`frontend/.dockerignore`** — Excluye node_modules, dist, .env
- **`docker-compose.yml`** — Servicios gaur-api + gaur-frontend en red compartida

### ✅ README y limpieza
- **`README.md`** — Completo con descripción, stack, estructura, instrucciones de deploy
- **`.gitignore`** — Reespecificado para cubrir dist/, node_modules/, .env sin el genérico `*.js`
