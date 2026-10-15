// ÚNICA fuente de verdad del sitio. Todo texto visible sale de acá (y de content/projects/).
// Cada campo traducible es { es, en }; lo que no cambia entre idiomas va como string.
// Después de editar: `node build.mjs` (o `node serve-dev.mjs`, que rebuildea solo).

export default {
  site: "https://pablomelegatti.com",
  updated: "2026-10", // AAAA-MM — se muestra en el pie como "Actualizado"

  name: "Pablo Melegatti",
  role: "Software Engineer",
  focus: { es: "Backend · IA · Microservicios", en: "Backend · AI · Microservices" },
  photo: "/img/pablo.jpg",
  ogImage: "/og.png", // 1200×630, la tarjeta que se ve al compartir el link (ver README)

  hero: {
    headline: {
      es: "Me apasiona emprender desafíos que aporten valor a la vida de las personas y organizaciones.",
      en: "I'm passionate about taking on challenges that add value to the lives of people and organizations.",
    },
    // Los datos que van en píldoras debajo de la frase.
    facts: [
      { label: { es: "Ahora", en: "Now" }, value: "Software Engineer · Mercado Libre" },
      {
        label: { es: "Además", en: "Also" },
        value: "Freelance · Niloft",
      },
    ],
  },

  contact: {
    email: "melegattip@gmail.com",
    linkedin: "https://www.linkedin.com/in/melegattip",
    github: "https://github.com/melegattip",
    // Access key de https://web3forms.com (es pública por diseño). Vacía = no se muestra el
    // formulario y en su lugar va un botón que abre el cliente de correo.
    web3formsKey: "",
  },

  meta: {
    title: {
      es: "Pablo Melegatti — Software Engineer · Backend, IA, Microservicios",
      en: "Pablo Melegatti — Software Engineer · Backend, AI, Microservices",
    },
    description: {
      es: "Software Engineer en Mercado Libre y freelance en Niloft. Backend en Go, microservicios, sistemas distribuidos y desarrollo aumentado con IA. Experiencia, proyectos y contacto.",
      en: "Software Engineer at Mercado Libre and freelance at Niloft. Go backends, microservices, distributed systems and AI-augmented development. Experience, projects and contact.",
    },
  },

  about: [
    {
      es: "Ingeniería de software, con experiencia construyendo sistemas backend escalables y soluciones de desarrollo aumentado con IA en entornos productivos de alto tráfico. Especializado en arquitectura de microservicios, APIs REST, sistemas distribuidos y automatización.",
      en: "Software engineering, with experience building scalable backend systems and AI-augmented development solutions in high-traffic production environments. Specialized in microservices architecture, REST APIs, distributed systems, and automation.",
    },
    {
      es: "Con experiencia como feature owner, en estrategias de testing y en monitoreo de producción. Foco en performance, confiabilidad y entrega continua.",
      en: "Experienced in feature ownership, testing strategies, and production monitoring. Strong focus on performance, reliability, and continuous delivery.",
    },
    {
      es: "En paralelo diseño, construyo y opero productos propios de punta a punta bajo la marca Niloft: del modelo de datos y la API al deploy y el soporte en producción.",
      en: "On the side I design, build and run my own products end to end under the Niloft brand: from the data model and the API to deployment and production support.",
    },
  ],

  // `icon` = una clave de ICON en src/lib.mjs.
  howIWork: [
    {
      icon: "flag",
      title: { es: "Dueño de la feature", en: "Feature ownership" },
      text: {
        es: "Tomo el problema completo: requerimientos, diseño, entrega y lo que pasa después en producción.",
        en: "I take the whole problem: requirements, design, delivery and what happens afterwards in production.",
      },
    },
    {
      icon: "sparkles",
      title: { es: "IA como herramienta de ingeniería", en: "AI as an engineering tool" },
      text: {
        es: "La uso para automatizar desarrollo y operación, con especificaciones y tests como red de contención.",
        en: "I use it to automate development and operations, with specs and tests as the safety net.",
      },
    },
    {
      icon: "check",
      title: { es: "Testing como parte del diseño", en: "Testing as part of the design" },
      text: {
        es: "Unitarios, de integración y funcionales; contra una base real cuando el mock esconde el problema.",
        en: "Unit, integration and functional tests; against a real database when a mock would hide the problem.",
      },
    },
    {
      icon: "activity",
      title: { es: "Producción primero", en: "Production first" },
      text: {
        es: "Observabilidad, releases versionadas y rollback. Lo que no se puede operar no está terminado.",
        en: "Observability, versioned releases and rollback. If it can't be operated, it isn't finished.",
      },
    },
  ],

  experience: [
    {
      company: "Mercado Libre",
      roles: [
        {
          title: "Software Engineer (AI-Augmented)",
          from: "2025-01",
          to: null,
          stack: [
            "Go",
            "Backend",
            { es: "Feature ownership", en: "Feature ownership" },
            { es: "Flujos con IA", en: "AI workflows" },
            { es: "Automatización", en: "Automation" },
          ],
          bullets: [
            {
              es: "Feature owner: defino requerimientos y lidero el ciclo completo de entrega de cada feature.",
              en: "Act as Feature Owner, defining requirements and leading the feature delivery lifecycle.",
            },
            {
              es: "Implemento flujos de ingeniería aumentados con IA para automatizar tareas de desarrollo y de operación.",
              en: "Implement AI-augmented engineering workflows to automate development and operational tasks.",
            },
            {
              es: "Diseño servicios en Go para credit scoring, escalables y confiables.",
              en: "Design Go services for credit scoring, built to scale and stay reliable.",
            },
            {
              es: "Impulso iniciativas de innovación que mejoran la productividad de ingeniería y los procesos de automatización.",
              en: "Drive innovation initiatives improving engineering productivity and automation processes.",
            },
            {
              es: "Colaboro con equipos multidisciplinarios para optimizar los pipelines de desarrollo.",
              en: "Collaborate with cross-functional teams to optimize development pipelines.",
            },
          ],
        },
        {
          title: "Software Developer",
          from: "2022-06",
          to: "2025-01",
          stack: [
            "Go",
            "REST APIs",
            { es: "Microservicios", en: "Microservices" },
            "Testing",
            { es: "Observabilidad", en: "Observability" },
            "Scrum",
          ],
          bullets: [
            {
              es: "Desarrollé microservicios backend en Go en entornos productivos de alta escala.",
              en: "Developed backend microservices using Go in high-scale production environments.",
            },
            {
              es: "Diseñé e implementé APIs REST siguiendo principios de arquitectura de microservicios.",
              en: "Designed and implemented REST APIs following microservices architecture principles.",
            },
            {
              es: "Armé estrategias de testing automatizado: tests unitarios, de integración y funcionales.",
              en: "Built automated testing strategies including unit, integration, and functional tests.",
            },
            {
              es: "Gestioné los procesos de deploy entre los ambientes de testing y producción.",
              en: "Managed deployment processes across testing and production environments.",
            },
            {
              es: "Monitoreé la performance de los sistemas con dashboards de observabilidad y métricas de producción.",
              en: "Monitored system performance using observability dashboards and production metrics.",
            },
            {
              es: "Trabajé en equipos Scrum con entrega continua de features a producción.",
              en: "Collaborated in Scrum teams delivering continuous production features.",
            },
          ],
        },
      ],
    },
    {
      company: "Grupo Sancor Seguros",
      roles: [
        {
          title: "Software Developer",
          from: "2021-04",
          to: "2022-06",
          stack: ["C#", ".NET Framework", "NHibernate", "SQL Server", "Web services"],
          bullets: [
            {
              es: "Desarrollé funcionalidades backend y web para sistemas corporativos de seguros.",
              en: "Developed backend and web application features for enterprise insurance systems.",
            },
            {
              es: "Implementé y mantuve web services y componentes de aplicación.",
              en: "Implemented and maintained web services and application components.",
            },
            {
              es: "Resolví incidentes en los ambientes de producción y mantenimiento.",
              en: "Resolved production and maintenance environment issues.",
            },
            {
              es: "Analicé requerimientos y documenté soluciones técnicas.",
              en: "Analyzed requirements and documented technical solutions.",
            },
            {
              es: "Participé en el diseño de features y en mejoras de los sistemas.",
              en: "Participated in feature design and system improvements.",
            },
            {
              es: "Stack: .NET Framework, SQL Server y arquitecturas enterprise.",
              en: "Worked with .NET Framework, SQL Server, and enterprise architectures.",
            },
          ],
        },
      ],
    },
    {
      company: "Niloft",
      note: { es: "Freelance", en: "Freelance" },
      roles: [
        {
          title: "Software Engineer (AI-Augmented)",
          from: "2020-06",
          to: null,
          stack: ["Go", "React", "PostgreSQL", "SDD"],
          bullets: [
            {
              es: "Diseño, construyo y opero productos propios y sistemas para clientes, de punta a punta: modelo de datos, API, frontend, deploy y soporte en producción.",
              en: "Design, build and run my own products and client systems end to end: data model, API, frontend, deployment and production support.",
            },
            {
              es: "Lidero el desarrollo de GIIA, una plataforma SaaS de gestión de inventario basada en DDMRP que ya está en producción.",
              en: "Lead the development of GIIA, a DDMRP-based SaaS inventory management platform already running in production.",
            },
            {
              es: "Trabajo con una metodología guiada por especificaciones y aumentada con IA (SDD), con tests unitarios y de integración e integración continua.",
              en: "Work with a spec-driven, AI-augmented methodology (SDD), with unit and integration testing and continuous integration.",
            },
          ],
        },
      ],
    },
  ],

  // `story` = nombre del archivo en content/projects/ con la historia completa (opcional).
  projects: [
    // Sólo información pública: lo que dijo Pablo (equipo backend, en Go) y la nota del blog
    // de Mercado Pago sobre el score. Nada interno: ni arquitectura, ni volúmenes, ni modelos.
    {
      name: "Credit Scoring",
      kind: { es: "Fintech", en: "Fintech" },
      role: { es: "Equipo backend · Mercado Libre", en: "Backend team · Mercado Libre" },
      status: { es: "En producción", en: "In production" },
      url: "https://www.mercadopago.com.mx/blog/como-mejorar-score-crediticio",
      // Texto del link cuando el dominio solo no alcanza para saber adónde lleva.
      urlLabel: { es: "Blog de Mercado Pago", en: "Mercado Pago blog" },
      summary: {
        es: "Backend en Go del score crediticio de Mercado Pago: el puntaje que resume el comportamiento crediticio de una persona y con el que se decide si accede a un crédito y en qué condiciones.",
        en: "Go backend for Mercado Pago's credit score: the number that sums up a person's credit behavior and decides whether they get credit and on what terms.",
      },
      tags: ["Go", { es: "Microservicios", en: "Microservices" }, "REST APIs", { es: "Observabilidad", en: "Observability" }],
    },
    {
      name: "GIIA",
      story: "giia",
      kind: { es: "Producto SaaS", en: "SaaS product" },
      role: { es: "Lead developer · Niloft", en: "Lead developer · Niloft" },
      status: { es: "En producción", en: "In production" },
      url: "https://giia.com.ar",
      summary: {
        es: "Plataforma de gestión de inventario basada en DDMRP para retail y distribución PyME en LATAM. Analiza la operación y le dice al comprador, todos los días, qué reponer, cuánto y cuándo.",
        en: "DDMRP-based inventory management platform for SMB retail and distribution in LATAM. It analyzes the operation and tells the buyer, every day, what to replenish, how much and when.",
      },
      bullets: [
        {
          es: "API REST en Go sobre PostgreSQL con aislamiento multi-tenant por Row-Level Security; frontend en React y TypeScript.",
          en: "REST API in Go on PostgreSQL with multi-tenant isolation through Row-Level Security; React and TypeScript frontend.",
        },
        {
          es: "Middleware en Python que lee el ERP del cliente (solo lectura) y sincroniza los datos con la plataforma.",
          en: "Python middleware that reads the customer's ERP (read-only) and syncs its data into the platform.",
        },
        {
          es: "En producción on-premise, con releases versionadas, actualización automática y soporte operativo.",
          en: "Running in production on-premise, with versioned releases, automatic updates and operational support.",
        },
      ],
      tags: ["Go", "PostgreSQL", "React", "TypeScript", "Python", "DDMRP"],
    },
    {
      name: "Niloft",
      story: "niloft",
      kind: { es: "App de finanzas personales", en: "Personal finance app" },
      role: { es: "Creador y desarrollador", en: "Creator & developer" },
      status: { es: "Online", en: "Live" },
      url: "https://financial.niloft.com",
      summary: {
        es: "App de finanzas personales para controlar gastos, cuotas y ahorros, en pesos o en dólares, con análisis asistido por IA.",
        en: "Personal finance app to track expenses, installments and savings, in pesos or dollars, with AI-assisted analysis.",
      },
      bullets: [
        {
          es: "Backend en Go: monolito modular (autenticación con JWT y 2FA, transacciones, presupuestos, metas de ahorro, recurrentes, analytics e IA) con event bus interno, consolidado a partir de 4 microservicios REST.",
          en: "Go backend: modular monolith (JWT and 2FA authentication, transactions, budgets, savings goals, recurring items, analytics and AI) with an internal event bus, consolidated from 4 REST microservices.",
        },
        {
          es: "Multi-tenant, con frontend React responsive e integración continua con tests y cobertura.",
          en: "Multi-tenant, with a responsive React frontend and continuous integration with tests and coverage.",
        },
      ],
      tags: ["Go", "React", "PostgreSQL", { es: "IA", en: "AI" }, "SDD"],
    },
    {
      name: { es: "ERP / punto de venta", en: "ERP / point of sale" },
      kind: { es: "Trabajo para cliente", en: "Client work" },
      role: { es: "Mantenimiento y evolución", en: "Maintenance & evolution" },
      status: { es: "En producción", en: "In production" },
      summary: {
        es: "Sistema de gestión comercial en producción para un comercio minorista: proveedores, productos, stock, compras, ventas y clientes, con facturación electrónica ante AFIP e importación de ventas de Mercado Libre.",
        en: "Business management system in production for a retail store: suppliers, products, stock, purchasing, sales and customers, with electronic invoicing through AFIP (Argentina's tax agency) and Mercado Libre sales import.",
      },
      bullets: [
        {
          es: "Mantenimiento y evolución de un sistema heredado: tests automatizados, integración continua y proceso de release.",
          en: "Maintenance and evolution of an inherited system: automated tests, continuous integration and a release process.",
        },
      ],
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
    },
  ],

  skills: [
    { label: { es: "Lenguajes", en: "Languages" }, items: ["Go", "Java", "C#", "SQL"] },
    {
      label: { es: "Backend", en: "Backend" },
      items: [
        { es: "APIs REST", en: "REST APIs" },
        { es: "Arquitectura de microservicios", en: "Microservices architecture" },
        { es: "Sistemas distribuidos", en: "Distributed systems" },
      ],
    },
    {
      label: { es: "Frameworks y herramientas", en: "Frameworks & tools" },
      items: ["Spring Boot", ".NET Framework", "NHibernate", "React"],
    },
    {
      label: { es: "Bases de datos", en: "Databases" },
      items: ["PostgreSQL", "MySQL", "SQL Server", { es: "Key-value stores", en: "Key-value stores" }],
    },
    {
      label: { es: "Testing", en: "Testing" },
      items: [
        { es: "Unitario", en: "Unit" },
        { es: "Integración", en: "Integration" },
        { es: "Funcional", en: "Functional" },
      ],
    },
    { label: { es: "DevOps", en: "DevOps" }, items: ["CI/CD", "Git", "Docker"] },
    { label: { es: "Observabilidad", en: "Observability" }, items: ["Datadog", "Kibana", "New Relic"] },
    {
      label: { es: "Metodologías", en: "Methodologies" },
      items: ["Scrum", "Kanban", "Spec-Driven Development"],
    },
    {
      label: { es: "IA y automatización", en: "AI & automation" },
      items: [
        { es: "Flujos de desarrollo asistidos por IA", en: "AI-assisted development workflows" },
        { es: "Pipelines de automatización", en: "Automation pipelines" },
      ],
    },
    {
      label: { es: "Habilidades blandas", en: "Soft skills" },
      items: [
        { es: "Trabajo en equipo", en: "Teamwork" },
        { es: "Liderazgo", en: "Leadership" },
        { es: "Resolución creativa de problemas", en: "Creative problem-solving" },
        { es: "Investigación", en: "Research" },
        { es: "Proactividad", en: "Proactivity" },
      ],
    },
  ],

  education: [
    {
      title: { es: "Analista en Computación", en: "Computer Analyst" },
      place: "Universidad Nacional de Río Cuarto",
      from: "2015",
      to: "2018",
    },
  ],

  // Cursos y certificaciones. Vacío = el bloque no se muestra.
  // Formato: { title: "…", issuer: "…", year: "2025", url: "https://…" (opcional) }
  certifications: [],

  languages: [
    { name: { es: "Español", en: "Spanish" }, level: { es: "Nativo", en: "Native" } },
    { name: { es: "Inglés", en: "English" }, level: { es: "Competencia profesional", en: "Working proficiency" } },
  ],

  // Fuera del código. `icon` = clave de ICON en src/lib.mjs; `tone` = color del sitio.
  offTopic: [
    { icon: "music", tone: "amber", text: { es: "Trompetista, baterista y vocalista", en: "Trumpeter, drummer and vocalist" } },
    { icon: "cross", tone: "violet", text: { es: "Líder espiritual cristiano", en: "Christian spiritual leader" } },
    { icon: "heart", tone: "rose", text: { es: "Esposo", en: "Husband" } },
    { icon: "ball", tone: "teal", text: { es: "Fútbol 5", en: "Five-a-side football" } },
    { icon: "dumbbell", tone: "sky", text: { es: "Gym", en: "Gym" } },
  ],
};
