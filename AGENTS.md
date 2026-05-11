# AmortizationAPP - Documentación del Proyecto

## Descripción
Aplicación web para simulación y cálculo de amortización de créditos. Permite visualizar diferentes métodos de amortización (Francés, Alemán, Americano), generar tablas de amortización, gráficos interactivos y comparar estrategias de inversión vs pago de deuda.

## Stack Tecnológico

### Stack Actual (Full Stack)
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.2.29 | Framework full-stack (App Router) |
| React | 18.2.0 | Framework UI |
| Tailwind CSS | 3 | Estilos |
| Recharts | 3.8.1 | Gráficos |
| jsPDF | 4.2.1 | Exportar PDF |
| Lucide React | 1.7.0 | Iconos |
| Prisma | 6.19.3 | ORM para base de datos |
| NextAuth.js | Latest | Autenticación (Google + Email/Pass) |
| Supabase | - | Base de datos PostgreSQL (pendiente configurar) |

## Estructura del Proyecto

```
AmortizationAPP_Bun/
├── app/
│   ├── layout.jsx                 # Root layout (Next.js)
│   ├── page.jsx                   # Página principal (calculadora)
│   ├── globals.css                # Estilos globales Tailwind
│   ├── auth/
│   │   ├── login/page.jsx         # Página de login
│   │   └── register/page.jsx      # Página de registro
│   ├── dashboard/
│   │   ├── layout.jsx             # Layout del dashboard
│   │   ├── page.jsx               # Listado de escenarios
│   │   └── scenario/
│   │       ├── new/page.jsx       # Crear nuevo escenario
│   │       └── [id]/page.jsx      # Ver/editar escenario
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.js  # NextAuth.js API
│       │   └── register/route.js       # Registro de usuarios
│       └── scenarios/
│           ├── route.js           # GET (listar), POST (crear)
│           └── [id]/route.js      # GET, PUT, DELETE
├── components/
│   ├── auth/
│   │   └── AuthProvider.jsx       # Proveedor de sesión NextAuth
│   ├── dashboard/
│   │   ├── ScenarioCard.jsx       # Card de escenario
│   │   └── ScenarioForm.jsx       # Formulario de escenario
│   ├── layout/
│   │   ├── AppHeader.jsx          # Header de la aplicación
│   │   ├── Footer.jsx             # Footer
│   │   └── SidePanel.jsx          # Panel lateral de configuración
│   ├── panels/
│   │   ├── ConfigPanel.jsx        # Panel de configuración del préstamo
│   │   ├── CustomInstallmentPanel.jsx  # Cuota personalizada
│   │   └── ExtraPaymentsPanel.jsx      # Pagos extra
│   ├── tabs/
│   │   ├── SummaryTab.jsx         # Resumen del préstamo
│   │   ├── TableTab.jsx           # Tabla de amortización
│   │   ├── ChartsTab.jsx          # Gráficos
│   │   └── StrategyTab.jsx        # Análisis invertir vs pagar deuda
│   └── ui/
│       ├── Card.jsx               # Componente Card reutilizable
│       └── InputField.jsx         # Input reutilizable
├── lib/
│   ├── auth.js                    # Configuración NextAuth.js
│   ├── prisma.js                  # Cliente Prisma singleton
│   ├── context/
│   │   ├── LoanContext.jsx        # Estado del préstamo
│   │   ├── UIContext.jsx          # Estado de UI (tabs, drawer)
│   │   └── CalculationsContext.jsx # Cálculos de amortización
│   ├── utils/
│   │   └── formatters.js          # Formateo de moneda y números
│   └── constants/
│       ├── index.js               # Constantes generales
│       └── chartConfig.js         # Configuración de gráficos
├── hooks/
│   ├── useBaselineAmortization.js # Cálculo amortización base
│   ├── useOptimizedAmortization.js # Amortización con pagos extra
│   └── useInvestmentStrategy.js   # Análisis inversión vs deuda
├── prisma/
│   └── schema.prisma              # Modelo de datos
├── next.config.js                 # Configuración Next.js
├── tailwind.config.js             # Configuración Tailwind CSS
├── postcss.config.js              # Configuración PostCSS
├── package.json                   # Dependencias y scripts
├── .env                           # Variables de entorno
└── AGENTS.md                      # Este archivo
```

## Funcionalidades Actuales
- Cálculo de amortización con método Francés, Alemán y Americano
- Tabla de amortización detallada
- Gráficos interactivos (Recharts)
- Análisis de estrategia: Invertir vs Pagar deuda
- Configuración de cuota personalizada
- Pagos extra programados
- Exportar tabla a PDF (jsPDF)
- Responsive design (Tailwind CSS)
- Autenticación de usuarios (Google + Email/Pass)
- Múltiples escenarios de crédito guardados
- Dashboard para gestión de escenarios

## Historial de Cambios

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-05-10 | Crear AGENTS.md | Completado |
| 2026-05-10 | Migrar Vite+React → Next.js 14 | Completado |
| 2026-05-10 | Configurar Supabase + Prisma | Completado |
| 2026-05-10 | Implementar NextAuth.js | Completado |
| 2026-05-10 | Crear API Routes para escenarios | Completado |
| 2026-05-10 | Crear Dashboard y páginas de escenarios | Completado |
| 2026-05-10 | Integrar calculadora con escenarios | Completado |
| Pendiente | Desplegar en Vercel | Pendiente |

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Producción
npm start

# Lint
npm run lint

# Prisma
npx prisma generate      # Generar cliente Prisma
npx prisma migrate dev    # Crear migraciones
npx prisma studio         # Abrir Prisma Studio
```

## Notas de Desarrollo
- Proyecto de aprendizaje: backend + base de datos
- Moneda: COP (Pesos Colombianos)
- Locale: es-CO
- Despliegue objetivo: Vercel
- Migrado de Vite+React a Next.js 14 (App Router)
- Componentes marcados como "use client" para compatibilidad con React Context
- Base de datos: Supabase (PostgreSQL) - pendiente configurar en `.env`
- Autenticación: NextAuth.js con Google + Email/Pass

## Configuración Pendiente

### 1. Supabase (Base de datos)
1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Copiar el `DATABASE_URL` de Settings → Database
4. Actualizar `.env` con el connection string

### 2. Google OAuth (opcional)
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear un proyecto y habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Actualizar `.env` con `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`

### 3. NextAuth Secret
```bash
openssl rand -base64 32
```
Actualizar `NEXTAUTH_SECRET` en `.env`

### 4. Migraciones
```bash
npx prisma migrate dev --name init
```
