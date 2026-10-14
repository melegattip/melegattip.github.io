// Historia de Niloft (app de finanzas personales, financial.niloft.com).
// Los números salen del repo; revisarlos si cambia el alcance.

export default {
  slug: "niloft",

  stats: [
    { value: "4 → 1", label: { es: "de microservicios a un monolito modular", en: "from microservices to one modular monolith" } },
    { value: "9", label: { es: "módulos de dominio en el backend", en: "domain modules in the backend" } },
    { value: "25", label: { es: "pantallas en el frontend", en: "screens in the frontend" } },
    { value: "2", label: { es: "monedas: pesos y dólares", en: "currencies: pesos and dollars" } },
  ],

  sections: [
    {
      title: { es: "El problema", en: "The problem" },
      body: [
        {
          es: "Llevar las finanzas personales en Argentina tiene sus particularidades: compras en cuotas que comprometen meses futuros, ingresos y ahorros repartidos entre pesos y dólares, y gastos recurrentes que es fácil perder de vista. Las planillas se abandonan, y las apps pensadas para otros mercados no modelan las cuotas.",
          en: "Managing personal finances in Argentina has its quirks: installment purchases that commit future months, income and savings split between pesos and dollars, and recurring expenses that are easy to lose track of. Spreadsheets get abandoned, and apps built for other markets don't model installments.",
        },
        {
          es: "Niloft cubre ese recorrido: registrar gastos e ingresos, seguir las cuotas pendientes, armar presupuestos y metas de ahorro, y recibir un análisis de adónde se va la plata.",
          en: "Niloft covers that journey: logging expenses and income, tracking pending installments, setting budgets and savings goals, and getting an analysis of where the money goes.",
        },
      ],
    },
    {
      title: { es: "El enfoque", en: "The approach" },
      points: [
        {
          title: { es: "De microservicios a monolito modular", en: "From microservices to a modular monolith" },
          body: {
            es: "La primera versión eran 4 microservicios REST: usuarios, motor, IA y gamificación. Para un equipo de una persona, cuatro deploys y más de una base eran costo sin beneficio. Los consolidé en un monolito en Go con módulos de dominio y una sola base PostgreSQL.",
            en: "The first version was 4 REST microservices: users, engine, AI and gamification. For a one-person team, four deployments and more than one database were cost without benefit. I consolidated them into a Go monolith with domain modules and a single PostgreSQL database.",
          },
        },
        {
          title: { es: "Módulos que no se conocen", en: "Modules that don't know each other" },
          body: {
            es: "Cada módulo —autenticación, transacciones, ahorro, recurrentes, analytics, IA— expone sus rutas y se comunica con el resto por un event bus interno. Los eventos se publican siempre después de persistir.",
            en: "Each module — authentication, transactions, savings, recurring items, analytics, AI — exposes its own routes and talks to the rest through an internal event bus. Events are always published after persisting.",
          },
        },
        {
          title: { es: "Multi-tenant desde el modelo", en: "Multi-tenant from the data model up" },
          body: {
            es: "Cuentas compartidas con roles y permisos, registro de auditoría y aislamiento por tenant. Autenticación con JWT y segundo factor.",
            en: "Shared accounts with roles and permissions, an audit log and per-tenant isolation. Authentication with JWT and a second factor.",
          },
        },
        {
          title: { es: "IA para leer los números", en: "AI to read the numbers" },
          body: {
            es: "Un módulo de IA arma el análisis mensual y recomendaciones a partir de los movimientos, para que el dato no quede sólo en un gráfico.",
            en: "An AI module builds the monthly analysis and recommendations from the user's transactions, so the data doesn't end up as just a chart.",
          },
        },
      ],
    },
    {
      title: { es: "Lo aprendido", en: "What I learned" },
      points: [
        {
          title: { es: "Quitar también es diseñar", en: "Removing is also designing" },
          body: {
            es: "La gamificación —puntos y logros— se veía bien pero no ayudaba a nadie a ordenar sus finanzas. La reemplacé por un nivel financiero más simple y borré el módulo entero.",
            en: "Gamification — points and achievements — looked good but helped no one get their finances in order. I replaced it with a simpler financial level and deleted the whole module.",
          },
        },
        {
          title: { es: "En curso", en: "In progress" },
          body: {
            es: "Suscripciones con planes y la app para Android.",
            en: "Subscriptions with plans, and the Android app.",
          },
        },
      ],
    },
  ],

  stack: ["Go", "Gin", "GORM", "PostgreSQL", "React", "Tailwind CSS", "Docker"],
};
