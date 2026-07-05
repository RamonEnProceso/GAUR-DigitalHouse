# 🏋️ GAUR — Coach Digital de Entrenamiento

**GAUR** es una aplicación web full-stack diseñada para personas que entrenan solas en casa. Permite registrar entrenamientos, hacer seguimiento de medidas corporales, explorar un catálogo de ejercicios y generar rutinas personalizadas con IA.

---

## ✨ Funcionalidades

- **Catálogo de ejercicios** — Explora +30 ejercicios de calistenia, mancuernas y barras con filtros por tipo, dificultad y grupo muscular.
- **Registro de entrenamientos** — Crea sesiones con fecha, notas y series de ejercicios (repeticiones, peso, RPE).
- **Historial de sesiones** — Revisa entrenamientos pasados con detalle de cada serie.
- **Seguimiento de medidas** — Registra peso, cintura, pecho, brazos, muslos y cuello. Visualiza evolución con gráficos.
- **Racha de entrenamiento** — El Dashboard muestra tu racha actual de días consecutivos.
- **Alerta de inactividad** — Si llevas 3+ días sin entrenar, la app te lo notifica.
- **Rutinas con IA** — Configura tu API key (OpenAI, Anthropic, Gemini o DeepSeek) y genera rutinas personalizadas según tu perfil y objetivos.
- **Perfil personalizable** — Edita nombre, edad, altura, peso, descripción y meta fitness.
- **Autenticación con Google** — Inicio de sesión seguro vía Supabase Auth.

---

## 🛠 Stack

### Backend
| Tecnología | Versión |
|-----------|---------|
| **Runtime** | Node.js 20 |
| **Framework** | Express 5 |
| **Lenguaje** | TypeScript 5 |
| **Base de datos** | Supabase PostgreSQL |
| **Autenticación** | Supabase Auth (Google OAuth) |
| **ORM / Cliente DB** | @supabase/supabase-js |

### Frontend
| Tecnología | Versión |
|-----------|---------|
| **Framework** | React 19 |
| **Build tool** | Vite 6 |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | TailwindCSS 4 |
| **Cliente Supabase** | @supabase/supabase-js |
| **Gráficos** | Recharts |

### Infraestructura (Producción)
- **Contenedores** — Docker + Docker Compose
- **Servidor web** — Nginx (proxy inverso para API)
- **Base de datos** — Supabase (PostgreSQL gestionado)

---

## 📦 Estructura del Proyecto

```
GAUR-DigitalHouse/
├── backend/                  # API REST con Express
│   ├── src/
│   │   ├── controllers/      # Lógica de endpoints
│   │   ├── db/               # Cliente Supabase
│   │   ├── middleware/       # Auth middleware (JWT)
│   │   ├── models/           # Capa de datos
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio (IA, inactividad)
│   │   └── types/            # Extensiones de tipos
│   ├── index.ts              # Entry point
│   ├── Dockerfile
│   └── supabase-schema.sql   # Esquema de base de datos
├── frontend/                 # SPA con React + Vite
│   ├── src/
│   │   ├── api/              # Cliente HTTP
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # Auth context
│   │   ├── lib/              # Cliente Supabase
│   │   └── pages/            # Páginas de la aplicación
│   ├── Dockerfile
│   └── nginx.conf            # Configuración de Nginx para producción
├── assets/                   # Documentación y brief
├── docker-compose.yml        # Orquestación de contenedores
└── README.md
```

---

## 🚀 Deploy

### Requisitos
- Docker y Docker Compose
- Supabase project activo (URL y service_role key)

### Variables de Entorno

```bash
# Backend (pasar al contenedor gaur-api)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key
```

### Desplegar

```bash
# Clonar el repositorio
git clone https://github.com/RamonEnProceso/GAUR-DigitalHouse.git
cd GAUR-DigitalHouse

# Crear archivo .env con las variables de Supabase
echo "SUPABASE_URL=tu-url" > .env
echo "SUPABASE_KEY=tu-key" >> .env

# Iniciar contenedores
docker compose up -d

# La app estará disponible en http://localhost
```

### Despliegue en VPS

1. Copiar el repositorio a la VPS
2. Asegurarse de que Docker y Docker Compose están instalados
3. Ejecutar `docker compose up -d` en la raíz del proyecto
4. Configurar Nginx o un proxy en la VPS para apuntar al puerto 80 del contenedor `gaur-frontend`

> **Nota:** El frontend en producción usa el proxy de Nginx para las llamadas a la API (ruta `/api/` → backend), por lo que no necesita `VITE_API_URL`.

---

## 🧪 Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run dev          # http://localhost:3000

# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173 (con proxy a backend)
```

**Base de datos:** Ejecutar `backend/supabase-schema.sql` en el SQL Editor de Supabase para crear tablas y datos semilla.

---

## 📸 Captura de Pantalla

<img width="525" height="1010" alt="image" src="https://github.com/user-attachments/assets/ffc9d37e-702d-433d-9297-1fa73f29bdb2" />

---

## 📄 Licencia

Proyecto académico — Digital House, 2026.
