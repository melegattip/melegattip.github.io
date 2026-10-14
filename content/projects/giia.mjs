// Historia de GIIA. Sin nombres ni datos de clientes: sólo producto y arquitectura.
// Los números salen del repo (giia-docs/canon); revisarlos si cambia el alcance.

export default {
  slug: "giia",

  stats: [
    { value: "135", label: { es: "endpoints REST en la API", en: "REST endpoints in the API" } },
    { value: "29", label: { es: "tablas, todas con Row-Level Security", en: "tables, all under Row-Level Security" } },
    { value: "4", label: { es: "componentes en un solo artefacto de release", en: "components shipped as a single release artifact" } },
    { value: "18", label: { es: "postmortems documentados con su causa raíz", en: "postmortems written up with their root cause" } },
  ],

  sections: [
    {
      title: { es: "El problema", en: "The problem" },
      body: [
        {
          es: "Una distribuidora PyME suele decidir qué comprar con un mínimo y máximo fijo, o con la intuición del comprador. El resultado es conocido: capital inmovilizado en productos que no rotan y quiebres de stock en los que sí.",
          en: "A small or mid-sized distributor usually decides what to buy from a fixed min/max, or from the buyer's intuition. The outcome is familiar: capital tied up in products that don't move, and stockouts in the ones that do.",
        },
        {
          es: "DDMRP propone otra cosa: buffers dimensionados por el consumo real y el lead time, que se recalculan solos y muestran con un semáforo qué hay que reponer hoy. El método está bien documentado; lo difícil es llevarlo a una empresa que ya tiene su ERP, sus años de datos y ninguna intención de cambiarlos.",
          en: "DDMRP proposes something else: buffers sized by actual consumption and lead time, recalculated on their own, with a traffic light showing what needs replenishing today. The method is well documented; the hard part is bringing it to a company that already has its ERP, years of data, and no intention of replacing either.",
        },
      ],
    },
    {
      title: { es: "El enfoque", en: "The approach" },
      points: [
        {
          title: { es: "El ERP no se toca", en: "The ERP is never touched" },
          body: {
            es: "GIIA se instala al lado del ERP del cliente, no encima. Un middleware en Python lo lee en modo sólo lectura —un guard rechaza cualquier consulta que no sea un SELECT—, traduce los datos al dominio de GIIA y los empuja por REST. El backend no sabe qué ERP hay del otro lado.",
            en: "GIIA sits next to the customer's ERP, not on top of it. A Python middleware reads it in read-only mode — a guard rejects any query that isn't a SELECT — translates the data into GIIA's domain and pushes it over REST. The backend has no idea which ERP is on the other side.",
          },
        },
        {
          title: { es: "Un motor por eventos, idempotente", en: "An event-driven, idempotent engine" },
          body: {
            es: "Cada escritura relevante emite un evento y el motor DDMRP recalcula sólo el buffer del producto afectado, serializado por producto. Los módulos del backend no se llaman entre sí: se comunican únicamente por un event bus interno.",
            en: "Every relevant write emits an event, and the DDMRP engine recalculates only the affected product's buffer, serialized per product. Backend modules never call each other: they talk exclusively through an internal event bus.",
          },
        },
        {
          title: { es: "Multi-tenant en dos capas", en: "Multi-tenancy in two layers" },
          body: {
            es: "Todas las tablas llevan tenant y están protegidas con Row-Level Security de PostgreSQL, además del filtro que aplica la capa de aplicación. RLS es la red de seguridad, no el mecanismo principal.",
            en: "Every table carries a tenant and is protected by PostgreSQL Row-Level Security, on top of the filter applied in the application layer. RLS is the safety net, not the primary mechanism.",
          },
        },
        {
          title: { es: "Producción sin Docker", en: "Production without Docker" },
          body: {
            es: "La primera instalación corre on-premise sobre Windows Server, donde Docker no era una opción. Cada versión es un único artefacto con backend, frontend, migraciones y middleware, verificado por hash. La actualización hace backup, migra, chequea la salud del servicio y vuelve atrás sola si algo falla.",
            en: "The first installation runs on-premise on Windows Server, where Docker was not an option. Each version is a single artifact with backend, frontend, migrations and middleware, verified by hash. The update takes a backup, migrates, health-checks the service and rolls itself back if anything fails.",
          },
        },
      ],
    },
    {
      title: { es: "Lo aprendido", en: "What I learned" },
      points: [
        {
          title: {
            es: "Los datos reales rompen lo que los mocks dejan pasar",
            en: "Real data breaks what mocks let through",
          },
          body: {
            es: "Los tests de integración corren contra un PostgreSQL real en contenedores. Los bugs que más costaron no estaban en las fórmulas sino en los bordes: un encoding asimétrico al leer el ERP, o un snapshot de stock que no veía los movimientos del propio día.",
            en: "Integration tests run against a real PostgreSQL in containers. The costliest bugs were not in the formulas but at the edges: an asymmetric encoding when reading the ERP, or a stock snapshot that missed the current day's movements.",
          },
        },
        {
          title: { es: "Escribir el postmortem es parte del arreglo", en: "Writing the postmortem is part of the fix" },
          body: {
            es: "Cada incidente queda documentado con su causa raíz, y cada decisión de arquitectura con su porqué. Hoy son 18 postmortems y 21 decisiones que evitan discutir dos veces lo mismo.",
            en: "Every incident is written up with its root cause, and every architecture decision with its reasoning. Today that is 18 postmortems and 21 decisions that keep the same debate from happening twice.",
          },
        },
        {
          title: {
            es: "No todo lo que parece un bug de cálculo lo es",
            en: "Not everything that looks like a calculation bug is one",
          },
          body: {
            es: "Una «fórmula vieja» que veía un usuario resultó ser el frontend cacheado por el navegador. Desde entonces, lo primero que se verifica es qué versión está viendo quien reporta.",
            en: "An \"old formula\" a user kept seeing turned out to be the frontend cached by the browser. Since then, the first thing to check is which version the person reporting is actually looking at.",
          },
        },
      ],
    },
  ],

  stack: ["Go", "Chi", "sqlc", "PostgreSQL", "React", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "DDMRP"],
};
