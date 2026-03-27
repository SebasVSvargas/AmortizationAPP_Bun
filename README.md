# 💰 Amortization APP - CubePath

Una aplicación web moderna e interactiva para simular, analizar y optimizar estrategias de amortización de préstamos. Calcula tablas de amortización detalladas, visualiza gráficos comparativos y explora diferentes estrategias de pago para tomar decisiones financieras inteligentes.

## 🎯 ¿De qué trata?

**Amortization APP** es una herramienta financiera diseñada para ayudarte a:

- **Simular préstamos** con diferentes parámetros (monto, tasa de interés, plazo)
- **Generar tablas de amortización** detalladas mes a mes
- **Visualizar datos** con gráficos interactivos sobre capital, intereses y saldo pendiente
- **Estrategias de pago** comparando diferentes métodos y sus impactos
- **Pagos adicionales** personalizados para acelerar la liquidación del préstamo
- **Análisis de inversión** considerando el ROI de mantener capital invertido vs. pagar el préstamo

## ☁️ Despliegue en CubePath

Este proyecto está desplegado en **[CubePath](https://cubepath.com/)**, un servicio de VPS en la nube.

### ¿Cómo se desplegó?

1. **Servidor VPS** — Se creó un servidor en CubePath con los $15 de crédito gratuito
2. **Dokploy** — Se instaló Dokploy como plataforma de gestión de despliegues dentro del VPS
3. **Conexión a GitHub** — Se conectó el repositorio de GitHub directamente a Dokploy para despliegue automático
4. **Build automatizado** — Se configuró **Railpack** como build type, que detectó automáticamente el proyecto Vite + React + Bun y ejecutó el build
5. **Dominio** — Se configuró un dominio público a través de Dokploy con Traefik como reverse proxy

### Stack de despliegue

| Componente | Tecnología |
|---|---|
| **Hosting** | CubePath VPS |
| **Orquestador** | Dokploy |
| **Build** | Railpack (detección automática) |
| **Reverse Proxy** | Traefik |
| **Runtime** | Bun + Vite |


## 🚀 Características principales

- **Configuración flexible** - Ajusta monto, tasa de interés y plazo del préstamo
- **Resumen ejecutivo** - Visualiza los datos clave del préstamo de un vistazo
- **Tabla de amortización** - Detalle mes a mes con principal, interés y saldo
- **Gráficos informativos** - Visualización clara de tendencias y composición de pagos
- **Cuotas personalizadas** - Define montos de cuota irregular si es necesario
- **Pagos extraordinarios** - Añade pagos adicionales en meses específicos
- **Análisis de estrategias** - Compara diferentes enfoques de pago
- **Interfaz responsiva** - Funciona perfectamente en desktop, tablet y móvil

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 19.2.4 | Librería de interfaz de usuario |
| **Vite** | 8.0.2 | Bundler y servidor de desarrollo |
| **Bun** | 1.3.11+ | Runtime JavaScript/TypeScript |
| **Tailwind CSS** | 3 | Estilos y diseño responsivo |
| **Recharts** | 3.8.1 | Gráficos y visualización de datos |
| **Lucide React** | 1.7.0 | Iconos modernos |
| **TypeScript** | 5 | Tipado estático |
| **PostCSS** | 8.5.8 | Procesamiento de CSS |
| **Autoprefixer** | 10.4.27 | Compatibilidad de prefijos CSS |

## 📋 Requisitos previos

- **Bun** 1.3.11 o superior ([descargar](https://bun.sh))
- **Node.js** 18+ (opcional, si prefieres usar npm)
- Un navegador web moderno (Chrome, Firefox, Safari, Edge)

## 💻 Instalación y ejecución

### 1. Clonar o descargar el proyecto

```bash
git clone <tu-repositorio>
cd AmortizationAPP_Bun
```

### 2. Instalar dependencias

Con Bun (recomendado):
```bash
bun install
```

O con npm:
```bash
npm install
```

### 3. Ejecutar en desarrollo

Con Bun:
```bash
bun run dev
```

Con npm:
```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173` (el puerto puede variar)

### 4. Construir para producción

```bash
bun run build
```

El resultado se guardará en la carpeta `dist/`

### 5. Previsualizar build de producción

```bash
bun run preview
```

## 📁 Estructura del proyecto

```
src/
├── components/           # Componentes React
│   ├── layout/          # Componentes de estructura
│   │   ├── AppHeader.jsx
│   │   ├── Footer.jsx
│   │   └── SidePanel.jsx
│   ├── panels/          # Paneles de configuración
│   │   ├── ConfigPanel.jsx
│   │   ├── CustomInstallmentPanel.jsx
│   │   └── ExtraPaymentsPanel.jsx
│   ├── tabs/            # Pestañas principales
│   │   ├── ChartsTab.jsx
│   │   ├── StrategyTab.jsx
│   │   ├── SummaryTab.jsx
│   │   └── TableTab.jsx
│   └── ui/              # Componentes de interfaz reutilizables
│       ├── Card.jsx
│       └── InputField.jsx
├── context/             # Context API para estado global
│   ├── CalculationsContext.jsx
│   ├── LoanContext.jsx
│   └── UIContext.jsx
├── hooks/               # Custom React hooks
│   ├── useBaselineAmortization.js
│   ├── useInvestmentStrategy.js
│   └── useOptimizedAmortization.js
├── constants/           # Constantes y configuración
│   ├── chartConfig.js
│   └── index.js
├── utils/               # Funciones de utilidad
│   └── formatters.js
├── App.jsx              # Componente raíz
├── main.jsx             # Punto de entrada
└── index.css            # Estilos globales
```

## 🎨 Cómo usar la aplicación

### Panel lateral (ConfigPanel)
Configura los parámetros básicos del préstamo:
- **Monto del Préstamo**: Capital que necesitas
- **Interés Anual**: Tasa de interés anual del préstamo
- **Plazo**: Número de meses para pagar

### Tab: Resumen
Visualiza información clave:
- Monto total a pagar
- Total de intereses
- Cuota mensual regular
- Información de capacidad de pago

### Tab: Tabla
Tabla detallada mes a mes que muestra:
- Número de mes
- Cuota a pagar
- Principal pagado
- Interés pagado
- Saldo pendiente

### Tab: Gráficos
Visualizaciones interactivas:
- Evolución del saldo pendiente
- Composición de pagos (principal vs interés)
- Curvas de tendencia

### Tab: Estrategia
Analiza y compara diferentes estrategias de pago:
- Pago estándar
- Pagos adicionales
- Diferentes escenarios de inversión

## 🔧 Configuración avanzada

### Agregar pagos extraordinarios
En el panel lateral, puedes añadir pagos adicionales:
1. Selecciona el mes
2. Ingresa el monto del pago extra
3. El sistema recalcula automáticamente la amortización

### Cuota personalizada
Si necesitas una cuota diferente a la estándar:
1. Activa la opción de cuota personalizada
2. Ingresa el monto deseado
3. La tabla se actualiza automáticamente

## 🔄 Estructura del estado (Context)

### LoanContext
Gestiona los parámetros del préstamo y pagos adicionales:
- Monto del préstamo
- Tasa de interés
- Plazo en meses
- Pagos extraordinarios
- Capacidad de inversión

### CalculationsContext
Contiene las funciones de cálculo de amortización

### UIContext
Gestiona el estado de la interfaz:
- Pestaña activa
- Estado de paneles
- Configuración de visualización

## 📊 Hooks personalizados

- **useBaselineAmortization** - Calcula la amortización estándar
- **useInvestmentStrategy** - Analiza estrategias de inversión
- **useOptimizedAmortization** - Optimiza el plan de pago

## 🚀 Optimizaciones incluidas

- **Lazy loading** de componentes
- **Memoización** de cálculos costosos
- **Context splitting** para evitar re-renders innecesarios
- **Tailwind CSS** con purge de estilos no utilizados
- **Vite** con tree-shaking automático

## 📝 Variables de entorno

Actualmente la aplicación no requiere variables de entorno, pero puedes extenderla con:

```env
VITE_API_URL=<tu-api>
VITE_ENV=development
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit (`git commit -m 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo LICENSE para más detalles.

## 💡 Roadmap futuro

- [ ] Exportar tabla a PDF/Excel
- [ ] Historiales de simulaciones guardadas
- [ ] Cálculos con tasa variable
- [ ] Análisis de impuesto a la renta
- [ ] Integración con APIs de tasas de mercado
- [ ] Soporte multiidioma
- [ ] Modo oscuro

## 📧 Soporte

Si tienes preguntas o encuentras problemas:
- 📌 Abre un issue en el repositorio
- 💬 Contacta a través de [svs.sebas2@gmail.com](mailto:svs.sebas2@gmail.com)
---

**Hecho con ❤️ por Sebastian Vargas Suarez para ayudarte a tomar mejores decisiones financieras**
