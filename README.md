# Amortization APP

Aplicación web para simulación y cálculo de amortización de créditos. Permite visualizar diferentes métodos de amortización (Francés, Alemán, Americano), generar tablas detalladas, gráficos interactivos y comparar estrategias de inversión vs pago de deuda. Los usuarios pueden registrarse, guardar escenarios y retomar sus simulaciones desde cualquier dispositivo.

## Características principales

- **Calculadora de amortización** — Métodos Francés (cuota fija), Alemán (cuota decreciente) y Americano (solo interés)
- **Tabla de amortización** — Detalle mes a mes con principal, interés y saldo pendiente
- **Gráficos interactivos** — Visualización de evolución del saldo, composición de pagos y tendencias
- **Análisis de estrategias** — Comparación entre invertir capital vs pagar deuda anticipadamente
- **Cuota personalizada** — Define montos de cuota superiores a la estándar
- **Pagos extra programados** — Añade abonos puntuales en meses específicos
- **Autenticación de usuarios** — Registro e inicio de sesión con email/password o Google
- **Guardado de escenarios** — Guarda y carga simulaciones con todos sus parámetros
- **Dashboard de escenarios** — Gestiona, renombra y elimina escenarios guardados
- **Exportar a PDF** — Descarga la tabla de amortización como documento PDF
- **Diseño responsivo** — Funciona en desktop, tablet y móvil

## Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 14.2.29 | Framework full-stack (App Router) |
| React | 18.2.0 | Framework UI |
| Tailwind CSS | 3 | Estilos y diseño responsivo |
| Recharts | 3.8.1 | Gráficos y visualización de datos |
| Prisma | 6.19.3 | ORM para base de datos |
| NextAuth.js | 4.24.14 | Autenticación (Google + Email/Password) |
| Supabase | — | Base de datos PostgreSQL en la nube |
| jsPDF | 4.2.1 | Exportar tabla a PDF |
| Lucide React | 1.7.0 | Iconos modernos |

## Requisitos previos

- **Node.js** 18 o superior
- **npm** (viene con Node.js)
- Una cuenta en [Supabase](https://supabase.com) (plan gratuito) o PostgreSQL local

## Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd AmortizationAPP_Bun
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://postgres:password@host:5432/amortizationapp"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-aqui"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Generar cliente Prisma

```bash
npx prisma generate
```

### 5. Crear las tablas en la base de datos

```bash
npx prisma migrate dev --name init
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

## Estructura del proyecto

```
app/
├── layout.jsx                         # Root layout
├── page.jsx                           # Calculadora principal
├── auth/
│   ├── login/page.jsx                 # Página de login
│   └── register/page.jsx             # Página de registro
├── dashboard/
│   ├── layout.jsx                     # Layout protegido del dashboard
│   ├── page.jsx                       # Listado de escenarios
│   └── scenario/
│       ├── new/page.jsx               # Crear nuevo escenario
│       └── [id]/page.jsx              # Ver/editar escenario
└── api/
    ├── auth/
    │   ├── [...nextauth]/route.js     # NextAuth API
    │   └── register/route.js          # Registro de usuarios
    └── scenarios/
        ├── route.js                   # GET (listar), POST (crear)
        └── [id]/route.js             # GET, PUT, DELETE

components/
├── auth/AuthProvider.jsx              # Proveedor de sesión NextAuth
├── dashboard/
│   ├── ScenarioCard.jsx               # Card de escenario
│   └── ScenarioForm.jsx              # Formulario de escenario
├── layout/
│   ├── AppHeader.jsx                  # Header principal
│   ├── Footer.jsx                     # Footer
│   └── SidePanel.jsx                 # Panel lateral de configuración
├── panels/
│   ├── ConfigPanel.jsx                # Configuración del préstamo
│   ├── CustomInstallmentPanel.jsx     # Cuota personalizada
│   └── ExtraPaymentsPanel.jsx         # Pagos extra
├── tabs/
│   ├── SummaryTab.jsx                 # Resumen del préstamo
│   ├── TableTab.jsx                   # Tabla de amortización
│   ├── ChartsTab.jsx                  # Gráficos
│   └── StrategyTab.jsx               # Análisis inversión vs deuda
└── ui/
    ├── Card.jsx                       # Card reutilizable
    └── InputField.jsx                 # Input reutilizable

lib/
├── auth.js                            # Configuración NextAuth.js
├── prisma.js                          # Cliente Prisma singleton
├── context/
│   ├── LoanContext.jsx                # Estado del préstamo
│   ├── UIContext.jsx                  # Estado de UI
│   └── CalculationsContext.jsx        # Cálculos de amortización
├── utils/formatters.js                # Formateo de moneda y números
└── constants/
    ├── index.js                       # Constantes generales
    └── chartConfig.js                 # Configuración de gráficos

hooks/
├── useBaselineAmortization.js         # Cálculo amortización base
├── useOptimizedAmortization.js        # Amortización con pagos extra
└── useInvestmentStrategy.js           # Análisis inversión vs deuda

prisma/
├── schema.prisma                      # Modelo de datos
└── migrations/                        # Migraciones de la base de datos
```

## Cómo usar la aplicación

### Calculadora principal

La aplicación abre directamente la calculadora. Desde ahí puedes:

1. **Configurar el préstamo** — Usa el panel lateral para ajustar monto, tasa de interés y plazo
2. **Explorar las pestañas** — Resumen, Tabla, Gráficos y Estrategia
3. **Agregar pagos extra** — Programa abonos puntuales en meses específicos
4. **Activar cuota superior** — Define una cuota mensual mayor a la estándar
5. **Guardar el escenario** — Si estás logueado, guarda los valores actuales con un nombre

### Autenticación

- Desde la calculadora, haz clic en **"Registrarse"** o **"Iniciar Sesión"**
- Puedes crear una cuenta con email/password o usar Google OAuth
- Una vez logueado, puedes guardar y cargar escenarios

### Dashboard de escenarios

- Haz clic en **"Mis Escenarios"** para ver tus simulaciones guardadas
- Haz clic en una card para cargar el escenario en la calculadora
- Pasa el mouse sobre una card para renombrar o eliminar

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | URL de conexión a PostgreSQL (Supabase o local) |
| `NEXTAUTH_URL` | Sí | URL base de la aplicación |
| `NEXTAUTH_SECRET` | Sí | Secret para firmar los JWT |
| `GOOGLE_CLIENT_ID` | No | Client ID de Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | Client Secret de Google OAuth |

## Hooks personalizados

- **useBaselineAmortization** — Calcula la amortización estándar según el método seleccionado
- **useOptimizedAmortization** — Calcula la amortización considerando pagos extra y cuota personalizada
- **useInvestmentStrategy** — Analiza la estrategia de invertir capital vs pagar deuda anticipadamente

## Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit (`git commit -m 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## Roadmap futuro

- [ ] Soporte para tasa de interés variable
- [ ] Comparación de múltiples escenarios lado a lado
- [ ] Exportar gráficos a PDF
- [ ] Notificaciones de pagos programados
- [ ] Soporte multiidioma
- [ ] Modo oscuro

## Licencia

Este proyecto está bajo la licencia MIT. Ver archivo LICENSE para más detalles.

## Soporte

Si tienes preguntas o encuentras problemas:
- Abre un issue en el repositorio
- Contacta a través de [svs.sebas2@gmail.com](mailto:svs.sebas2@gmail.com)

---

**Hecho por Sebastian Vargas Suarez**
