import type { Article, Author, Comment, Match, Team, Source } from './types';

export const authors: Author[] = [
  { id: 'a1', name: 'Carlos Martínez', avatar: 'https://images.pexels.com/photos/2206170/pexels-photo-2206170.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Editor jefe de Deportes. Especialista en fútbol internacional y LaLiga.', role: 'Editor Jefe Deportes' },
  { id: 'a2', name: 'Laura Sánchez', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Periodista de tecnología e IA. Cubre los avances en inteligencia artificial.', role: 'Editora Tecnología' },
  { id: 'a3', name: 'Javier Ruiz', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Corresponsal internacional. Cubre Europa y Oriente Medio.', role: 'Corresponsal Internacional' },
  { id: 'a4', name: 'María García', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Especialista en economía y mercados financieros.', role: 'Editora Economía' },
  { id: 'a5', name: 'Diego Fernández', avatar: 'https://images.pexels.com/photos/1222298/pexels-photo-1222298.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Periodista de motor. Apasionado de la Fórmula 1 y MotoGP.', role: 'Editor Motor' },
  { id: 'a6', name: 'Sofía López', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Cubre el mundo del entretenimiento, cine y streaming.', role: 'Editora Entretenimiento' },
  { id: 'a7', name: 'Pablo Ortega', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Especialista en NBA y baloncesto internacional.', role: 'Editor NBA' },
  { id: 'a8', name: 'Elena Torres', avatar: 'https://images.pexels.com/photos/38554/girls-fashion-fashion-photography-38554.jpeg?auto=compress&cs=tinysrgb&w=150', bio: 'Periodista de ciencia y salud. Doctora en biomedicina.', role: 'Editora Ciencia y Salud' },
];

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const articles: Article[] = [
  {
    id: '1',
    slug: 'real-madrid-firma-goleada-champions-final',
    title: 'El Real Madrid firma una goleada histórica en la final de la Champions League',
    subtitle: 'El equipo blanco se proclama campeón de Europa por decimoquinta vez con un partido memorable',
    summary: 'El Real Madrid ha conquistado la Champions League con una victoria aplastante que demuestra el dominio del equipo blanco en Europa.',
    content: `<p>El Real Madrid ha vuelto a hacer historia en la Champions League con una victoria aplastante que confirma su dominio en el fútbol europeo. El equipo blanco, dirigido por Carlo Ancelotti, demostró una vez más por qué es el rey de Europa.</p>
<h2>Un partido para la historia</h2>
<p>Desde el primer minuto, el Real Madrid mostró su intención de dominar el partido. La posesión del balón y la presión alta fueron clave para desactivar al rival, que nunca encontró su ritmo en el encuentro.</p>
<p>Los goles llegaron en ráfaga, demostrando la pegada del equipo. Vinicius Jr. fue el protagonista indiscutible con dos goles y una asistencia, mientras que Bellingham completó una actuación magistral en el mediocampo.</p>
<h2>Ancelotti: "Este equipo es único"</h2>
<p>El técnico italiano destacó la actitud del equipo: "Estoy muy orgulloso de estos jugadores. Han demostrado un nivel de compromiso y calidad que hace que este equipo sea único en la historia del fútbol".</p>
<p>El capitán del Real Madrid, Nacho, recogió el trofeo entre los aplausos de los aficionados que llenaban el estadio. La celebración se prolongó durante horas en el césped y en los vestuarios.</p>
<h2>Una temporada de récord</h2>
<p>Esta Champions League corona una temporada de récord para el Real Madrid, que ha logrado el doblete con la Liga y la máxima competición continental. El equipo ha batido numerosos registros a lo largo de la campaña.</p>
<p>La directiva ya trabaja en la planificación de la próxima temporada, con el objetivo de seguir reforzando un plantel que ha demostrado ser el mejor de Europa. El mercado de fichajes promete ser movido en el Santiago Bernabéu.</p>`,
    excerpt: 'El equipo blanco se proclama campeón de Europa por decimoquinta vez con un partido memorable ante su eterno rival.',
    metaDescription: 'El Real Madrid gana la Champions League con una goleada histórica. Vinicius y Bellingham protagonistas. Lee el análisis completo del partido.',
    image: img(46798),
    imageAlt: 'Jugadores del Real Madrid celebrando la victoria en la final de la Champions League',
    category: 'Real Madrid',
    categorySlug: 'real-madrid',
    subcategory: 'champions-league',
    tags: ['Real Madrid', 'Champions League', 'Carlo Ancelotti', 'Vinicius Jr', 'Bellingham', 'Fútbol'],
    author: authors[0],
    publishedAt: '2026-07-04T18:30:00Z',
    updatedAt: '2026-07-04T19:45:00Z',
    readingTime: 4,
    views: 245680,
    comments: 1247,
    shares: 8920,
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    source: 'Marca',
    sourceUrl: 'https://example.com/source1',
    relatedIds: ['2', '3', '4', '5'],
  },
  {
    id: '2',
    slug: 'barcelona-presenta-nuevo-fichaje-estrella',
    title: 'El FC Barcelona presenta su nuevo fichaje estrella para la próxima temporada',
    subtitle: 'El club culé ha cerrado el fichaje por 80 millones de euros tras semanas de negociación',
    summary: 'El FC Barcelona ha hecho oficial la incorporación de un nuevo jugador estrella que refuerza el proyecto deportivo.',
    content: `<p>El FC Barcelona ha hecho oficial la presentación de su nuevo fichaje estrella para la próxima temporada en un evento multitudinario en el Camp Nou.</p>
<h2>Un fichaje de garantías</h2>
<p>El jugador llega procedente de la liga italiana por una cantidad cercana a los 80 millones de euros, convirtiéndose en uno de los fichajes más caros de la historia del club culé.</p>
<p>El director deportivo del Barcelona destacó la calidad del jugador y su importancia para el proyecto: "Es un jugador que encaja perfectamente en nuestro estilo de juego y que nos va a dar muchas alegrías".</p>
<h2>El proyecto de Xavi</h2>
<p>Este fichaje refuerza el proyecto deportivo liderado por Xavi Hernández, que busca devolver al Barcelona a la cima del fútbol europeo tras una temporada complicada.</p>
<p>El técnico barcelonista ya ha diseñado el nuevo sistema táctico que aprovechará al máximo las cualidades del nuevo jugador, que se integrará inmediatamente en la dinámica del equipo.</p>`,
    excerpt: 'El club culé ha cerrado el fichaje por 80 millones de euros tras semanas de negociación con el club italiano.',
    metaDescription: 'El FC Barcelona presenta su nuevo fichaje estrella por 80 millones. Análisis del fichaje y su impacto en el proyecto de Xavi.',
    image: img(274506),
    imageAlt: 'Nuevo fichaje del FC Barcelona posando con la camiseta del club en el Camp Nou',
    category: 'Barcelona',
    categorySlug: 'barcelona',
    subcategory: 'mercado-fichajes',
    tags: ['FC Barcelona', 'Fichajes', 'LaLiga', 'Xavi', 'Mercado de fichajes'],
    author: authors[0],
    publishedAt: '2026-07-04T16:00:00Z',
    readingTime: 3,
    views: 187340,
    comments: 856,
    shares: 4520,
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    source: 'Mundo Deportivo',
    sourceUrl: 'https://example.com/source2',
    relatedIds: ['1', '3', '5', '6'],
  },
  {
    id: '3',
    slug: 'atletico-madrid-renueva-contrato-entrenador',
    title: 'El Atlético de Madrid renueva el contrato de su entrenador hasta 2028',
    subtitle: 'El club del Metropolitano confía en el proyecto del técnico para los próximos años',
    summary: 'El Atlético de Madrid ha anunciado la renovación de contrato de su entrenador hasta 2028.',
    content: `<p>El Atlético de Madrid ha hecho oficial la renovación de contrato de su entrenador hasta 2028, en una muestra de confianza hacia el proyecto deportivo del técnico.</p>
<h2>Un proyecto a largo plazo</h2>
<p>El club colchonero ha querido asegurar la continuidad del entrenador que ha transformado el estilo de juego del equipo en los últimos años.</p>
<p>La renovación incluye una cláusula de rescisión importante y un proyecto deportivo ambicioso que busca devolver al Atlético a lo más alto del fútbol español y europeo.</p>`,
    excerpt: 'El club del Metropolitano confía en el proyecto del técnico para los próximos años tras una temporada exitosa.',
    metaDescription: 'El Atlético de Madrid renueva a su entrenador hasta 2028. Detalles del contrato y el proyecto deportivo del club colchonero.',
    image: img(47730),
    imageAlt: 'Entrenador del Atlético de Madrid celebrando en el banquillo del Metropolitano',
    category: 'Atlético de Madrid',
    categorySlug: 'atletico-madrid',
    tags: ['Atlético de Madrid', 'LaLiga', 'Renovación', 'Diego Simeone'],
    author: authors[0],
    publishedAt: '2026-07-04T14:30:00Z',
    readingTime: 2,
    views: 98230,
    comments: 423,
    shares: 1840,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'AS',
    sourceUrl: 'https://example.com/source3',
    relatedIds: ['1', '2', '4'],
  },
  {
    id: '4',
    slug: 'seleccion-espanola-clasifica-eurocopa-final',
    title: 'La Selección Española se clasifica para la final de la Eurocopa',
    subtitle: 'La Roja logra una victoria épica en la prórroga y jugará la final del torneo continental',
    summary: 'La Selección Española de fútbol ha logrado clasificarse para la final de la Eurocopa tras una victoria épica.',
    content: `<p>La Selección Española ha logrado una clasificación épica para la final de la Eurocopa tras vencer en la prórroga con un gol decisivo en los últimos minutos.</p>
<h2>Un partido emocionante</h2>
<p>El partido fue un auténtico espectáculo de ida y vuelta, con dos equipos que ofrecieron un fútbol de altísimo nivel. España demostró su mejor versión y supo sufrir cuando fue necesario.</p>
<p>Los jóvenes talentos del equipo fueron los protagonistas, con una actuación estelar de los mediocampistas que controlaron el tempo del encuentro.</p>`,
    excerpt: 'La Roja logra una victoria épica en la prórroga y jugará la final del torneo continental.',
    metaDescription: 'La Selección Española se clasifica para la final de la Eurocopa con una victoria épica. Análisis del partido y la final.',
    image: img(390853),
    imageAlt: 'Jugadores de la Selección Española celebrando el gol de la clasificación',
    category: 'Selección Española',
    categorySlug: 'seleccion-espanola',
    tags: ['Selección Española', 'Eurocopa', 'La Roja', 'Fútbol'],
    author: authors[0],
    publishedAt: '2026-07-04T12:00:00Z',
    readingTime: 3,
    views: 156780,
    comments: 678,
    shares: 3210,
    isBreaking: true,
    isFeatured: false,
    isTrending: true,
    source: 'Marca',
    sourceUrl: 'https://example.com/source4',
    relatedIds: ['1', '5', '6'],
  },
  {
    id: '5',
    slug: 'laliga-clasificacion-actualizada-jornada',
    title: 'LaLiga: clasificación actualizada tras la última jornada',
    subtitle: 'Analizamos la situación de los equipos de LaLiga EA Sports tras los últimos resultados',
    summary: 'Repaso completo a la clasificación de LaLiga tras la última jornada con el análisis de cada equipo.',
    content: `<p>La jornada de LaLiga EA Sports ha dejado importantes movimientos en la clasificación, con varios equipos que han cambiado de posición tras los últimos resultados.</p>
<h2>Cabeza de la clasificación</h2>
<p>Los equipos de cabeza mantienen la lucha por el título con diferencias mínimas. La competición se ha vuelto muy igualada y cualquier error puede ser decisivo.</p>
<h2>Zona de descenso</h2>
<p>En la zona baja, la lucha por la permanencia está más viva que nunca con varios equipos que se juegan la salvación en las últimas jornadas.</p>`,
    excerpt: 'Analizamos la situación de los equipos de LaLiga EA Sports tras los últimos resultados de la jornada.',
    metaDescription: 'Clasificación de LaLiga EA Sports actualizada tras la última jornada. Análisis de la lucha por el título y el descenso.',
    image: img(47756),
    imageAlt: 'Estadio de fútbol durante un partido de LaLiga con los jugadores en el césped',
    category: 'LaLiga',
    categorySlug: 'laliga',
    tags: ['LaLiga', 'Clasificación', 'Fútbol', 'EA Sports'],
    author: authors[0],
    publishedAt: '2026-07-04T10:00:00Z',
    readingTime: 5,
    views: 89450,
    comments: 234,
    shares: 1230,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'AS',
    sourceUrl: 'https://example.com/source5',
    relatedIds: ['1', '2', '3', '6'],
  },
  {
    id: '6',
    slug: 'premier-league-fichaje-estrella-verano',
    title: 'Premier League: el fichaje estrella del verano se confirma',
    subtitle: 'Uno de los grandes clubes de la Premier League ha cerrado el fichaje más caro de la temporada',
    summary: 'La Premier League registra el fichaje más caro del verano con un traspaso millonario.',
    content: `<p>La Premier League ha registrado el fichaje más caro del verano con un traspaso que supera los 100 millones de euros.</p>
<h2>Un movimiento histórico</h2>
<p>El club inglés ha hecho un esfuerzo económico importante para incorporar al jugador que era uno de los objetivos prioritarios del mercado.</p>
<p>El jugador llega procedente de una liga europea y se compromete con el club inglés por las próximas cinco temporadas.</p>`,
    excerpt: 'Uno de los grandes clubes de la Premier League ha cerrado el fichaje más caro de la temporada.',
    metaDescription: 'Premier League: fichaje estrella del verano confirmado por más de 100 millones. Detalles del traspaso y análisis.',
    image: img(274506),
    imageAlt: 'Estadio de la Premier League lleno durante un partido',
    category: 'Premier League',
    categorySlug: 'premier-league',
    tags: ['Premier League', 'Fichajes', 'Fútbol', 'Inglaterra'],
    author: authors[0],
    publishedAt: '2026-07-04T09:00:00Z',
    readingTime: 3,
    views: 72340,
    comments: 312,
    shares: 980,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: 'BBC Sport',
    sourceUrl: 'https://example.com/source6',
    relatedIds: ['1', '2', '5'],
  },
  {
    id: '7',
    slug: 'openai-lanza-nuevo-modelo-gpt-revolucionario',
    title: 'OpenAI lanza un nuevo modelo de IA que revoluciona el sector tecnológico',
    subtitle: 'La nueva versión promete capacidades sin precedentes en razonamiento y comprensión del lenguaje',
    summary: 'OpenAI ha presentado un nuevo modelo de inteligencia artificial que promete revolucionar el sector.',
    content: `<p>OpenAI ha presentado oficialmente su nuevo modelo de inteligencia artificial, que promete capacidades sin precedentes en razonamiento, comprensión del lenguaje y generación de contenido.</p>
<h2>Capacidades mejoradas</h2>
<p>El nuevo modelo ofrece mejoras significativas en comparación con su predecesor, con una capacidad de razonamiento que se acerca a la humana en muchas tareas complejas.</p>
<p>Los benchmarks iniciales muestran mejoras del 30% en razonamiento lógico y del 45% en comprensión de contexto, lo que sitúa a este modelo por delante de la competencia.</p>
<h2>Implicaciones para la industria</h2>
<p>Este lanzamiento tiene importantes implicaciones para la industria de la IA, con un impacto que se extiende desde la atención al cliente hasta la creación de contenido y la programación.</p>
<p>Los expertos del sector ya analizan las posibles aplicaciones de este nuevo modelo en diferentes campos, desde la medicina hasta la educación.</p>`,
    excerpt: 'La nueva versión promete capacidades sin precedentes en razonamiento y comprensión del lenguaje natural.',
    metaDescription: 'OpenAI lanza un nuevo modelo de IA revolucionario con capacidades mejoradas de razonamiento. Análisis del impacto en el sector tecnológico.',
    image: img(8386440),
    imageAlt: 'Representación visual de inteligencia artificial con circuitos y luces',
    category: 'IA',
    categorySlug: 'ia',
    tags: ['OpenAI', 'Inteligencia Artificial', 'GPT', 'Tecnología', 'IA'],
    author: authors[1],
    publishedAt: '2026-07-04T15:00:00Z',
    readingTime: 4,
    views: 134560,
    comments: 567,
    shares: 4320,
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    source: 'The Verge',
    sourceUrl: 'https://example.com/source7',
    relatedIds: ['8', '9', '10'],
  },
  {
    id: '8',
    slug: 'apple-presenta-nuevo-iphone-con-inteligencia-artificial',
    title: 'Apple presenta el nuevo iPhone con funciones de inteligencia artificial integradas',
    subtitle: 'La compañía de Cupertino revoluciona su smartphone con capacidades de IA en el dispositivo',
    summary: 'Apple ha presentado el nuevo iPhone con funciones avanzadas de inteligencia artificial integradas.',
    content: `<p>Apple ha presentado oficialmente el nuevo iPhone con funciones de inteligencia artificial integradas directamente en el dispositivo, marcando un antes y un después en la evolución del smartphone.</p>
<h2>Apple Intelligence</h2>
<p>La nueva función, denominada Apple Intelligence, permite realizar tareas avanzadas de IA directamente en el dispositivo sin necesidad de conexión a internet, garantizando la privacidad del usuario.</p>
<p>Las capacidades incluyen generación de texto, resumen de notificaciones, edición avanzada de fotos y un Siri completamente renovado con capacidades de razonamiento.</p>
<h2>Características técnicas</h2>
<p>El nuevo iPhone incorpora un procesador más potente específicamente diseñado para las tareas de IA, con un motor neuronal mejorado que multiplica el rendimiento.</p>`,
    excerpt: 'La compañía de Cupertino revoluciona su smartphone con capacidades de IA en el dispositivo.',
    metaDescription: 'Apple presenta el nuevo iPhone con Apple Intelligence. Funciones de IA integradas, características técnicas y análisis completo.',
    image: img(788946),
    imageAlt: 'Nuevo iPhone de Apple con funciones de inteligencia artificial',
    category: 'Apple',
    categorySlug: 'apple',
    tags: ['Apple', 'iPhone', 'Inteligencia Artificial', 'Tecnología', 'Smartphone'],
    author: authors[1],
    publishedAt: '2026-07-04T13:00:00Z',
    readingTime: 4,
    views: 112340,
    comments: 445,
    shares: 2890,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: '9to5Mac',
    sourceUrl: 'https://example.com/source8',
    relatedIds: ['7', '9', '10'],
  },
  {
    id: '9',
    slug: 'google-lanza-android-nueva-version',
    title: 'Google lanza la nueva versión de Android con funciones inéditas',
    subtitle: 'La actualización más importante de los últimos años llega con mejoras de seguridad y privacidad',
    summary: 'Google ha lanzado la nueva versión de Android con funciones inéditas y mejoras de seguridad.',
    content: `<p>Google ha lanzado oficialmente la nueva versión de Android, considerada la actualización más importante de los últimos años.</p>
<h2>Funciones inéditas</h2>
<p>La nueva versión incluye funciones inéditas como el modo de privacidad avanzada, la integración mejorada con asistente de IA y nuevas opciones de personalización.</p>
<h2>Mejoras de seguridad</h2>
<p>La seguridad ha sido uno de los focos principales de esta actualización, con nuevas protecciones contra malware y phishing.</p>`,
    excerpt: 'La actualización más importante de los últimos años llega con mejoras de seguridad y privacidad.',
    metaDescription: 'Google lanza la nueva versión de Android con funciones inéditas. Mejoras de seguridad, privacidad y análisis completo.',
    image: img(1092644),
    imageAlt: 'Smartphone con la nueva versión de Android mostrando la interfaz',
    category: 'Android',
    categorySlug: 'android',
    tags: ['Google', 'Android', 'Tecnología', 'Smartphone', 'Sistema operativo'],
    author: authors[1],
    publishedAt: '2026-07-04T11:30:00Z',
    readingTime: 3,
    views: 78930,
    comments: 234,
    shares: 1560,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: '9to5Google',
    sourceUrl: 'https://example.com/source9',
    relatedIds: ['7', '8', '10'],
  },
  {
    id: '10',
    slug: 'nvidia-supera-mercado-chips-ia',
    title: 'Nvidia supera el mercado de chips de IA con un nuevo récord de ventas',
    subtitle: 'La compañía lidera el sector de los procesadores para inteligencia artificial con cifras récord',
    summary: 'Nvidia ha batido todos los récords de ventas en el mercado de chips para inteligencia artificial.',
    content: `<p>Nvidia ha superado todos los récords de ventas en el mercado de chips para inteligencia artificial, consolidando su posición de liderazgo en el sector.</p>
<h2>Cifras récord</h2>
<p>La compañía ha reportado ingresos trimestrales que superan todas las expectativas del mercado, con un crecimiento interanual superior al 200%.</p>
<h2>El futuro del sector</h2>
<p>El dominio de Nvidia en el mercado de chips de IA tiene importantes implicaciones para el futuro del sector tecnológico.</p>`,
    excerpt: 'La compañía lidera el sector de los procesadores para inteligencia artificial con cifras récord.',
    metaDescription: 'Nvidia supera el mercado de chips de IA con récord de ventas. Análisis del crecimiento y el futuro del sector.',
    image: img(7988079),
    imageAlt: 'Procesador de Nvidia para inteligencia artificial',
    category: 'Tecnología',
    categorySlug: 'tecnologia',
    tags: ['Nvidia', 'IA', 'Chips', 'Tecnología', 'Procesadores'],
    author: authors[1],
    publishedAt: '2026-07-04T08:00:00Z',
    readingTime: 3,
    views: 95670,
    comments: 312,
    shares: 2340,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: 'TechCrunch',
    sourceUrl: 'https://example.com/source10',
    relatedIds: ['7', '8', '9'],
  },
  {
    id: '11',
    slug: 'formula-1-gran-premio-verano-resultados',
    title: 'Fórmula 1: emocionante Gran Premio de verano con final de infarto',
    subtitle: 'La carrera ha dejado un resultado sorprendente que cambia el panorama del mundial',
    summary: 'La Fórmula 1 ha vivido un Gran Premio de verano emocionante con un final de infarto.',
    content: `<p>La Fórmula 1 ha vivido un Gran Premio de verano emocionante con un final de infarto que ha cambiado el panorama del mundial.</p>
<h2>Una carrera de infarto</h2>
<p>La carrera ha sido una de las más emocionantes de la temporada, con adelantamientos, estrategia y drama hasta la última vuelta.</p>
<h2>El mundial se aprieta</h2>
<p>El resultado de esta carrera ha cambiado completamente el panorama del mundial, con la lucha por el título más apretada que nunca.</p>`,
    excerpt: 'La carrera ha dejado un resultado sorprendente que cambia el panorama del mundial.',
    metaDescription: 'Fórmula 1: Gran Premio de verano con final de infarto. Resultados, análisis y clasificación del mundial.',
    image: img(2526145),
    imageAlt: 'Coches de Fórmula 1 compitiendo en el Gran Premio de verano',
    category: 'Fórmula 1',
    categorySlug: 'formula-1',
    tags: ['Fórmula 1', 'Gran Premio', 'Motor', 'Carreras'],
    author: authors[4],
    publishedAt: '2026-07-04T17:00:00Z',
    readingTime: 4,
    views: 67890,
    comments: 234,
    shares: 1230,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Motorsport.com',
    sourceUrl: 'https://example.com/source11',
    relatedIds: ['12', '13'],
  },
  {
    id: '12',
    slug: 'motogp-carrera-emocionante-resultados',
    title: 'MotoGP: carrera emocionante con final de infarto en el circuito',
    subtitle: 'El piloto español logra una victoria histórica tras una remontada espectacular',
    summary: 'MotoGP ha vivido una carrera emocionante con una victoria histórica del piloto español.',
    content: `<p>MotoGP ha vivido una carrera emocionante con un final de infarto en el que el piloto español ha logrado una victoria histórica tras una remontada espectacular.</p>
<h2>Remontada espectacular</h2>
<p>El piloto español ha realizado una remontada espectacular desde la séptima posición para lograr la victoria en un final de infarto.</p>
<h2>Clasificación del mundial</h2>
<p>Esta victoria cambia el panorama del mundial de MotoGP, con el piloto español recortando distancias con el líder.</p>`,
    excerpt: 'El piloto español logra una victoria histórica tras una remontada espectacular.',
    metaDescription: 'MotoGP: carrera emocionante con victoria histórica del piloto español. Resultados, remontada y clasificación del mundial.',
    image: img(2526145),
    imageAlt: 'Motocicletas de MotoGP compitiendo en el circuito',
    category: 'MotoGP',
    categorySlug: 'motogp',
    tags: ['MotoGP', 'Motor', 'Carreras', 'Motociclismo'],
    author: authors[4],
    publishedAt: '2026-07-04T15:30:00Z',
    readingTime: 3,
    views: 54320,
    comments: 178,
    shares: 890,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Motorsport.com',
    sourceUrl: 'https://example.com/source12',
    relatedIds: ['11', '13'],
  },
  {
    id: '13',
    slug: 'tenis-torneo-gran-slam-resultados',
    title: 'Tenis: el español se clasifica para la final del Gran Slam',
    subtitle: 'El tenista español logra una victoria épica y jugará la final del torneo',
    summary: 'El tenista español se ha clasificado para la final de un Gran Slam tras una victoria épica.',
    content: `<p>El tenista español se ha clasificado para la final de un Gran Slam tras una victoria épica en semifinales.</p>
<h2>Victoria épica</h2>
<p>El tenista español ha logrado una victoria épica en cinco sets tras más de cuatro horas de partido.</p>
<h2>La final</h2>
<p>El tenista español se enfrentará en la final al número uno del mundo, en lo que promete ser un partido histórico.</p>`,
    excerpt: 'El tenista español logra una victoria épica y jugará la final del torneo.',
    metaDescription: 'Tenis: el español se clasifica para la final del Gran Slam. Victoria épica en cinco sets y análisis del partido.',
    image: img(143203),
    imageAlt: 'Tenista español celebrando la victoria en la cancha',
    category: 'Tenis',
    categorySlug: 'tenis',
    tags: ['Tenis', 'Gran Slam', 'Tenista español', 'Final'],
    author: authors[4],
    publishedAt: '2026-07-04T14:00:00Z',
    readingTime: 3,
    views: 43210,
    comments: 145,
    shares: 670,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Tennis World',
    sourceUrl: 'https://example.com/source13',
    relatedIds: ['11', '12'],
  },
  {
    id: '14',
    slug: 'nba-finals-resultados-jugadores',
    title: 'NBA: resultados de las finales con actuaciones estelares',
    subtitle: 'Los jugadores estrella brillan en las finales de la NBA con actuaciones memorables',
    summary: 'Las finales de la NBA están dejando actuaciones estelares de los jugadores más importantes.',
    content: `<p>Las finales de la NBA están dejando actuaciones estelares de los jugadores más importantes de la liga.</p>
<h2>Actuaciones estelares</h2>
<p>Los jugadores estrella están brillando en las finales con actuaciones memorables que están decidiendo los partidos.</p>
<h2>El serie de la final</h2>
<p>El serie de la final está igualado y promete ser uno de los más emocionantes de los últimos años.</p>`,
    excerpt: 'Los jugadores estrella brillan en las finales de la NBA con actuaciones memorables.',
    metaDescription: 'NBA: resultados de las finales con actuaciones estelares. Análisis de los partidos y los jugadores más destacados.',
    image: img(274516),
    imageAlt: 'Jugadores de la NBA durante un partido de las finales',
    category: 'NBA',
    categorySlug: 'nba',
    tags: ['NBA', 'Baloncesto', 'Finales', 'Playoffs'],
    author: authors[6],
    publishedAt: '2026-07-04T13:30:00Z',
    readingTime: 4,
    views: 87650,
    comments: 312,
    shares: 1890,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: 'ESPN',
    sourceUrl: 'https://example.com/source14',
    relatedIds: ['11', '12', '13'],
  },
  {
    id: '15',
    slug: 'economia-mercados-financieros-analisis',
    title: 'Economía: los mercados financieros reaccionan a los últimos datos económicos',
    subtitle: 'El Ibex y las principales bolsas europeas registran subidas tras los datos macroeconómicos',
    summary: 'Los mercados financieros reaccionan positivamente a los últimos datos económicos publicados.',
    content: `<p>Los mercados financieros han reaccionado positivamente a los últimos datos económicos publicados, con el Ibex y las principales bolsas europeas registrando subidas.</p>
<h2>Datos macroeconómicos</h2>
<p>Los datos macroeconómicos publicados han superado las expectativas de los analistas, lo que ha generado optimismo en los mercados.</p>
<h2>Perspectivas</h2>
<p>Los analistas revisan al alza sus previsiones para los próximos meses tras estos datos positivos.</p>`,
    excerpt: 'El Ibex y las principales bolsas europeas registran subidas tras los datos macroeconómicos.',
    metaDescription: 'Economía: mercados financieros reaccionan a los últimos datos. Análisis del Ibex, bolsas europeas y perspectivas.',
    image: img(534216),
    imageAlt: 'Gráfico de mercados financieros con subidas en el Ibex y bolsas europeas',
    category: 'Economía',
    categorySlug: 'economia',
    tags: ['Economía', 'Mercados', 'Ibex', 'Bolsa', 'Finanzas'],
    author: authors[3],
    publishedAt: '2026-07-04T12:30:00Z',
    readingTime: 4,
    views: 54320,
    comments: 156,
    shares: 890,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Cinco Días',
    sourceUrl: 'https://example.com/source15',
    relatedIds: ['16', '17'],
  },
  {
    id: '16',
    slug: 'negocios-empresa-tecnologica-financiacion',
    title: 'Negocios: una empresa tecnológica española logra una financiación récord',
    subtitle: 'La startup española cierra una ronda de financiación de 100 millones de euros',
    summary: 'Una startup tecnológica española ha cerrado una ronda de financiación récord de 100 millones de euros.',
    content: `<p>Una startup tecnológica española ha cerrado una ronda de financiación récord de 100 millones de euros, lo que la convierte en uno de los unicornios del país.</p>
<h2>Ronda de financiación</h2>
<p>La ronda de financiación ha sido liderada por fondos de inversión internacionales, lo que demuestra el atractivo del ecosistema tecnológico español.</p>
<h2>Planes de expansión</h2>
<p>La empresa planea utilizar los fondos para expandirse internacionalmente y reforzar su equipo.</p>`,
    excerpt: 'La startup española cierra una ronda de financiación de 100 millones de euros.',
    metaDescription: 'Negocios: startup tecnológica española logra financiación récord de 100 millones. Análisis de la ronda y planes de expansión.',
    image: img(3183150),
    imageAlt: 'Oficina de una startup tecnológica española con el equipo trabajando',
    category: 'Negocios',
    categorySlug: 'negocios',
    tags: ['Negocios', 'Startup', 'Financiación', 'Tecnología', 'España'],
    author: authors[3],
    publishedAt: '2026-07-04T11:00:00Z',
    readingTime: 3,
    views: 34560,
    comments: 89,
    shares: 450,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Expansión',
    sourceUrl: 'https://example.com/source16',
    relatedIds: ['15', '17'],
  },
  {
    id: '17',
    slug: 'salud-descubrimiento-cientifico-importante',
    title: 'Salud: un descubrimiento científico importante abre nuevas esperanzas',
    subtitle: 'Un equipo de investigadores logra un avance que podría cambiar el tratamiento de enfermedades',
    summary: 'Un descubrimiento científico importante abre nuevas esperanzas para el tratamiento de enfermedades.',
    content: `<p>Un equipo de investigadores ha logrado un avance científico que podría cambiar el tratamiento de varias enfermedades, abriendo nuevas esperanzas para millones de pacientes.</p>
<h2>Avance científico</h2>
<p>El avance, publicado en una revista científica de prestigio, permite un mejor entendimiento de las enfermedades y abre nuevas vías de tratamiento.</p>
<h2>Implicaciones médicas</h2>
<p>Las implicaciones médicas de este descubrimiento son enormes y podrían cambiar la vida de millones de personas.</p>`,
    excerpt: 'Un equipo de investigadores logra un avance que podría cambiar el tratamiento de enfermedades.',
    metaDescription: 'Salud: descubrimiento científico importante abre nuevas esperanzas. Avance en el tratamiento de enfermedades y análisis.',
    image: img(8431211),
    imageAlt: 'Investigadores en un laboratorio realizando experimentos científicos',
    category: 'Salud',
    categorySlug: 'salud',
    tags: ['Salud', 'Ciencia', 'Investigación', 'Medicina'],
    author: authors[7],
    publishedAt: '2026-07-04T10:30:00Z',
    readingTime: 4,
    views: 45670,
    comments: 134,
    shares: 780,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'El Mundo',
    sourceUrl: 'https://example.com/source17',
    relatedIds: ['15', '16', '18'],
  },
  {
    id: '18',
    slug: 'ciencia-descubrimiento-espacial-importante',
    title: 'Ciencia: un descubrimiento espacial importante cambia nuestra comprensión del universo',
    subtitle: 'El telescopio espacial ha captado imágenes que revelan nuevos datos sobre el cosmos',
    summary: 'Un descubrimiento espacial importante cambia nuestra comprensión del universo.',
    content: `<p>El telescopio espacial ha captado imágenes que revelan nuevos datos sobre el cosmos, cambiando nuestra comprensión del universo.</p>
<h2>Imágenes reveladoras</h2>
<p>Las imágenes captadas por el telescopio espacial muestran detalles nunca antes vistos del universo, lo que permite a los científicos avanzar en su comprensión.</p>
<h2>Implicaciones científicas</h2>
<p>Este descubrimiento tiene importantes implicaciones científicas que podrían cambiar nuestra comprensión del cosmos.</p>`,
    excerpt: 'El telescopio espacial ha captado imágenes que revelan nuevos datos sobre el cosmos.',
    metaDescription: 'Ciencia: descubrimiento espacial importante cambia nuestra comprensión del universo. Imágenes del telescopio y análisis.',
    image: img(73840),
    imageAlt: 'Imagen del espacio captada por el telescopio espacial mostrando galaxias',
    category: 'Ciencia',
    categorySlug: 'ciencia',
    tags: ['Ciencia', 'Espacio', 'Telescopio', 'Universo', 'Astronomía'],
    author: authors[7],
    publishedAt: '2026-07-04T09:30:00Z',
    readingTime: 4,
    views: 67890,
    comments: 178,
    shares: 1230,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: 'National Geographic',
    sourceUrl: 'https://example.com/source18',
    relatedIds: ['17', '19'],
  },
  {
    id: '19',
    slug: 'streaming-nueva-serie-exito-audiencia',
    title: 'Streaming: una nueva serie se convierte en el éxito de la temporada',
    subtitle: 'La producción original de la plataforma de streaming bate récords de audiencia',
    summary: 'Una nueva serie se ha convertido en el éxito de la temporada en una plataforma de streaming.',
    content: `<p>Una nueva serie se ha convertido en el éxito de la temporada en una plataforma de streaming, batiendo récords de audiencia.</p>
<h2>Récord de audiencia</h2>
<p>La serie ha batido récords de audiencia en la plataforma de streaming, convirtiéndose en la producción más vista del año.</p>
<h2>Segunda temporada</h2>
<p>El éxito de la serie ha llevado a la plataforma a confirmar una segunda temporada que se estrenará el próximo año.</p>`,
    excerpt: 'La producción original de la plataforma de streaming bate récords de audiencia.',
    metaDescription: 'Streaming: nueva serie se convierte en el éxito de la temporada. Récord de audiencia y confirmación de segunda temporada.',
    image: img(2873493),
    imageAlt: 'Escena de la nueva serie de éxito en la plataforma de streaming',
    category: 'Streaming',
    categorySlug: 'streaming',
    tags: ['Streaming', 'Series', 'TV', 'Audiencia'],
    author: authors[5],
    publishedAt: '2026-07-04T08:30:00Z',
    readingTime: 3,
    views: 78930,
    comments: 234,
    shares: 1560,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: 'Variety',
    sourceUrl: 'https://example.com/source19',
    relatedIds: ['20', '21'],
  },
  {
    id: '20',
    slug: 'peliculas-estreno-cine-taquilla',
    title: 'Películas: el estreno del verano arrasa en la taquilla mundial',
    subtitle: 'La superproducción bate récords de recaudación en su primer fin de semana',
    summary: 'El estreno del verano está arrasando en la taquilla mundial batiendo récords de recaudación.',
    content: `<p>El estreno del verano está arrasando en la taquilla mundial, batiendo récords de recaudación en su primer fin de semana.</p>
<h2>Récord de taquilla</h2>
<p>La superproducción ha batido récords de recaudación en su primer fin de semana, convirtiéndose en el estreno más exitoso del año.</p>
<h2>Críticas positivas</h2>
<p>La película ha recibido críticas muy positivas por parte de la prensa especializada y del público.</p>`,
    excerpt: 'La superproducción bate récords de recaudación en su primer fin de semana.',
    metaDescription: 'Películas: estreno del verano arrasa en la taquilla mundial. Récord de recaudación y críticas positivas.',
    image: img(2873493),
    imageAlt: 'Cartel de la película estreno del verano en la taquilla',
    category: 'Películas',
    categorySlug: 'peliculas',
    tags: ['Cine', 'Películas', 'Taquilla', 'Estreno'],
    author: authors[5],
    publishedAt: '2026-07-04T07:30:00Z',
    readingTime: 3,
    views: 56780,
    comments: 167,
    shares: 980,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Hollywood Reporter',
    sourceUrl: 'https://example.com/source20',
    relatedIds: ['19', '21'],
  },
  {
    id: '21',
    slug: 'series-nueva-temporada-estreno',
    title: 'Series: la nueva temporada más esperada llega por fin',
    subtitle: 'La serie más esperada del año estrena su nueva temporada con gran expectación',
    summary: 'La serie más esperada del año estrena su nueva temporada con gran expectación.',
    content: `<p>La serie más esperada del año estrena su nueva temporada con gran expectación por parte de los fans.</p>
<h2>Gran expectación</h2>
<p>La nueva temporada de la serie más esperada del año ha llegado con gran expectación por parte de los fans, que llevaban años esperando este momento.</p>
<h2>Recepción</h2>
<p>La recepción por parte de la crítica y del público ha sido muy positiva, superando las expectativas.</p>`,
    excerpt: 'La serie más esperada del año estrena su nueva temporada con gran expectación.',
    metaDescription: 'Series: nueva temporada más esperada llega por fin. Estreno, expectación y recepción de la crítica y público.',
    image: img(2873493),
    imageAlt: 'Imagen promocional de la nueva temporada de la serie',
    category: 'Series',
    categorySlug: 'series',
    tags: ['Series', 'TV', 'Estreno', 'Temporada'],
    author: authors[5],
    publishedAt: '2026-07-04T06:30:00Z',
    readingTime: 3,
    views: 64530,
    comments: 198,
    shares: 1230,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Entertainment Weekly',
    sourceUrl: 'https://example.com/source21',
    relatedIds: ['19', '20'],
  },
  {
    id: '22',
    slug: 'viajes-destinos-verano-recomendados',
    title: 'Viajes: los destinos de verano más recomendados para este año',
    subtitle: 'Seleccionamos los mejores destinos para tus vacaciones de verano en España y Europa',
    summary: 'Seleccionamos los mejores destinos de verano para tus vacaciones en España y Europa.',
    content: `<p>Seleccionamos los mejores destinos de verano para tus vacaciones en España y Europa, con opciones para todos los gustos y presupuestos.</p>
<h2>Destinos de playa</h2>
<p>Para los amantes de la playa, recomendamos algunos de los mejores destinos costeros de España y Europa.</p>
<h2>Destinos de interior</h2>
<p>Para quienes prefieren el interior, hay opciones increíbles que combinan cultura, gastronomía y naturaleza.</p>`,
    excerpt: 'Seleccionamos los mejores destinos para tus vacaciones de verano en España y Europa.',
    metaDescription: 'Viajes: destinos de verano más recomendados. Selección de los mejores destinos de playa e interior en España y Europa.',
    image: img(3601425),
    imageAlt: 'Playa paradisíaca de España como destino de verano recomendado',
    category: 'Viajes',
    categorySlug: 'viajes',
    tags: ['Viajes', 'Verano', 'Vacaciones', 'Turismo', 'España'],
    author: authors[5],
    publishedAt: '2026-07-03T18:00:00Z',
    readingTime: 5,
    views: 34560,
    comments: 89,
    shares: 670,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'Travel',
    sourceUrl: 'https://example.com/source22',
    relatedIds: ['17', '18'],
  },
  {
    id: '23',
    slug: 'videojuegos-lanzamiento-mas-esperado',
    title: 'Videojuegos: el lanzamiento más esperado del año bate récords de ventas',
    subtitle: 'El nuevo videojuego ha superado todas las expectativas en su primer fin de semana',
    summary: 'El lanzamiento más esperado del año en videojuegos bate récords de ventas.',
    content: `<p>El lanzamiento más esperado del año en videojuegos ha batido récords de ventas en su primer fin de semana, superando todas las expectativas.</p>
<h2>Récord de ventas</h2>
<p>El nuevo videojuego ha superado todas las expectativas de ventas en su primer fin de semana, convirtiéndose en el lanzamiento más exitoso del año.</p>
<h2>Críticas excelentes</h2>
<p>El videojuego ha recibido críticas excelentes por parte de la prensa especializada y de los jugadores.</p>`,
    excerpt: 'El nuevo videojuego ha superado todas las expectativas en su primer fin de semana.',
    metaDescription: 'Videojuegos: lanzamiento más esperado del año bate récords de ventas. Análisis del éxito y críticas.',
    image: img(4419140),
    imageAlt: 'Imagen del videojuego más esperado del año',
    category: 'Videojuegos',
    categorySlug: 'videojuegos',
    tags: ['Videojuegos', 'Gaming', 'Lanzamiento', 'Ventas'],
    author: authors[1],
    publishedAt: '2026-07-03T16:00:00Z',
    readingTime: 3,
    views: 87650,
    comments: 312,
    shares: 2340,
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    source: 'IGN',
    sourceUrl: 'https://example.com/source23',
    relatedIds: ['7', '8', '9'],
  },
  {
    id: '24',
    slug: 'internacional-cumbre-global-importante',
    title: 'Internacional: cumbre global con decisiones importantes para el futuro',
    subtitle: 'Los líderes mundiales acuerdan medidas clave en la cumbre internacional',
    summary: 'Una cumbre global ha tomado decisiones importantes para el futuro del planeta.',
    content: `<p>Una cumbre global ha tomado decisiones importantes para el futuro del planeta, con acuerdos clave entre los líderes mundiales.</p>
<h2>Acuerdos clave</h2>
<p>Los líderes mundiales han acordado medidas clave en la cumbre internacional que tendrán un impacto significativo en el futuro.</p>
<h2>Implicaciones globales</h2>
<p>Las decisiones tomadas en esta cumbre tendrán implicaciones globales que afectarán a millones de personas.</p>`,
    excerpt: 'Los líderes mundiales acuerdan medidas clave en la cumbre internacional.',
    metaDescription: 'Internacional: cumbre global con decisiones importantes. Acuerdos clave de los líderes mundiales y análisis.',
    image: img(51054),
    imageAlt: 'Cumbre internacional con líderes mundiales reunidos',
    category: 'Internacional',
    categorySlug: 'internacional',
    tags: ['Internacional', 'Cumbre', 'Política', 'Líderes mundiales'],
    author: authors[2],
    publishedAt: '2026-07-03T14:00:00Z',
    readingTime: 4,
    views: 56780,
    comments: 234,
    shares: 1230,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'BBC News',
    sourceUrl: 'https://example.com/source24',
    relatedIds: ['25'],
  },
  {
    id: '25',
    slug: 'espana-noticias-actualidad-nacional',
    title: 'España: las noticias más importantes de la actualidad nacional',
    subtitle: 'Repasamos los acontecimientos más relevantes de la semana en España',
    summary: 'Repaso completo a las noticias más importantes de la actualidad nacional.',
    content: `<p>Repasamos los acontecimientos más relevantes de la semana en España, con un análisis completo de la actualidad nacional.</p>
<h2>Actualidad nacional</h2>
<p>Las noticias más importantes de la semana en España abarcan desde la política hasta la economía y la sociedad.</p>
<h2>Análisis completo</h2>
<p>Ofrecemos un análisis completo de la actualidad nacional con expertos en cada materia.</p>`,
    excerpt: 'Repasamos los acontecimientos más relevantes de la semana en España.',
    metaDescription: 'España: noticias más importantes de la actualidad nacional. Repaso completo y análisis de los acontecimientos.',
    image: img(138804),
    imageAlt: 'Vista de una ciudad española con monumentos emblemáticos',
    category: 'España',
    categorySlug: 'espana',
    tags: ['España', 'Actualidad', 'Nacional', 'Noticias'],
    author: authors[2],
    publishedAt: '2026-07-03T12:00:00Z',
    readingTime: 5,
    views: 45670,
    comments: 156,
    shares: 890,
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    source: 'El País',
    sourceUrl: 'https://example.com/source25',
    relatedIds: ['24'],
  },
];

export const comments: Comment[] = [
  { id: 'c1', articleId: '1', author: 'Roberto Pérez', avatar: 'https://images.pexels.com/photos/2206170/pexels-photo-2206170.jpeg?auto=compress&cs=tinysrgb&w=100', content: '¡Qué partido señores! El Madrid es el rey de Europa. ¡Vamos blanco!', createdAt: '2026-07-04T19:00:00Z', likes: 234 },
  { id: 'c2', articleId: '1', author: 'Ana López', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'Vinicius está en el mejor momento de su carrera. Qué jugadorazo.', createdAt: '2026-07-04T19:15:00Z', likes: 156 },
  { id: 'c3', articleId: '1', author: 'Miguel Torres', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'Ancelotti es el mejor entrenador de la historia del Madrid. No hay debate.', createdAt: '2026-07-04T19:30:00Z', likes: 89 },
  { id: 'c4', articleId: '7', author: 'Carmen Ruiz', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'La IA va a cambiarlo todo. Hay que estar preparados.', createdAt: '2026-07-04T15:30:00Z', likes: 145 },
  { id: 'c5', articleId: '7', author: 'Pedro Sánchez', avatar: 'https://images.pexels.com/photos/1222298/pexels-photo-1222298.jpeg?auto=compress&cs=tinysrgb&w=100', content: 'OpenAI está revolucionando el sector. Impresionante el avance.', createdAt: '2026-07-04T16:00:00Z', likes: 78 },
];

export const teams: Team[] = [
  { id: 't1', name: 'Real Madrid', shortName: 'RMA', slug: 'real-madrid', league: 'LaLiga', logo: 'https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg?auto=compress&cs=tinysrgb&w=200', colors: '#FEBE10', stadium: 'Santiago Bernabéu', manager: 'Carlo Ancelotti', position: 1, played: 38, won: 28, drawn: 6, lost: 4, points: 90 },
  { id: 't2', name: 'FC Barcelona', shortName: 'BAR', slug: 'barcelona', league: 'LaLiga', logo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=200', colors: '#A50044', stadium: 'Spotify Camp Nou', manager: 'Xavi Hernández', position: 2, played: 38, won: 26, drawn: 7, lost: 5, points: 85 },
  { id: 't3', name: 'Atlético de Madrid', shortName: 'ATM', slug: 'atletico-madrid', league: 'LaLiga', logo: 'https://images.pexels.com/photos/47730/pexels-photo-47730.jpeg?auto=compress&cs=tinysrgb&w=200', colors: '#CB3524', stadium: 'Cívitas Metropolitano', manager: 'Diego Simeone', position: 3, played: 38, won: 24, drawn: 8, lost: 6, points: 80 },
];

export const matches: Match[] = [
  { id: 'm1', homeTeam: 'Real Madrid', awayTeam: 'FC Barcelona', homeScore: 3, awayScore: 1, date: '2026-07-04T20:00:00Z', status: 'finished', competition: 'LaLiga', venue: 'Santiago Bernabéu' },
  { id: 'm2', homeTeam: 'Atlético de Madrid', awayTeam: 'Sevilla', homeScore: 2, awayScore: 0, date: '2026-07-04T18:00:00Z', status: 'finished', competition: 'LaLiga', venue: 'Cívitas Metropolitano' },
  { id: 'm3', homeTeam: 'Manchester City', awayTeam: 'Liverpool', date: '2026-07-05T17:30:00Z', status: 'scheduled', competition: 'Premier League', venue: 'Etihad Stadium' },
  { id: 'm4', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', date: '2026-07-05T20:00:00Z', status: 'scheduled', competition: 'Bundesliga', venue: 'Allianz Arena' },
];

export const sources: Source[] = [
  { id: 's1', name: 'Marca', url: 'https://e00-marca.com/rss', type: 'rss', category: 'Deportes', priority: 10, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1247, errors: 0, language: 'es' },
  { id: 's2', name: 'AS', url: 'https://as.com/rss', type: 'rss', category: 'Deportes', priority: 9, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1156, errors: 0, language: 'es' },
  { id: 's3', name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/rss', type: 'rss', category: 'Deportes', priority: 8, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 987, errors: 0, language: 'es' },
  { id: 's4', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss', type: 'rss', category: 'Internacional', priority: 9, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 2103, errors: 0, language: 'en' },
  { id: 's5', name: 'The Guardian', url: 'https://content.guardianapis.com', type: 'guardian', category: 'Internacional', priority: 8, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1876, errors: 0, language: 'en' },
  { id: 's6', name: 'New York Times', url: 'https://api.nytimes.com', type: 'nyt', category: 'Internacional', priority: 9, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1543, errors: 0, language: 'en' },
  { id: 's7', name: 'NewsAPI', url: 'https://newsapi.org/v2', type: 'newsapi', category: 'General', priority: 7, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 3421, errors: 0, language: 'es' },
  { id: 's8', name: 'GNews', url: 'https://gnews.io/api/v4', type: 'gnews', category: 'General', priority: 7, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 2876, errors: 0, language: 'es' },
  { id: 's9', name: 'TheNewsAPI', url: 'https://api.thenewsapi.com', type: 'thenewsapi', category: 'General', priority: 6, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1987, errors: 0, language: 'es' },
  { id: 's10', name: 'Mediastack', url: 'http://api.mediastack.com/v1', type: 'mediastack', category: 'General', priority: 6, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1654, errors: 0, language: 'es' },
  { id: 's11', name: 'Currents API', url: 'https://api.currentsapi.services/v1', type: 'currents', category: 'General', priority: 5, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1234, errors: 0, language: 'es' },
  { id: 's12', name: 'Bing News', url: 'https://api.bing.microsoft.com/v7.0/news', type: 'bing', category: 'General', priority: 7, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 2543, errors: 0, language: 'es' },
  { id: 's13', name: 'Google News ES', url: 'https://news.google.com/rss?hl=es', type: 'google', category: 'General', priority: 8, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 3210, errors: 0, language: 'es' },
  { id: 's14', name: 'ESPN Deportes', url: 'https://www.espn.com/es/deportes/rss', type: 'rss', category: 'Deportes', priority: 7, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1432, errors: 0, language: 'es' },
  { id: 's15', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', type: 'rss', category: 'Tecnología', priority: 8, isActive: true, lastFetched: '2026-07-04T19:00:00Z', articlesFetched: 1876, errors: 0, language: 'en' },
  { id: 's16', name: 'TechCrunch', url: 'https://techcrunch.com/feed', type: 'rss', category: 'Tecnología', priority: 7, isActive: false, lastFetched: '2026-07-04T15:00:00Z', articlesFetched: 987, errors: 3, language: 'en' },
];

export const getArticleBySlug = (slug: string) => articles.find(a => a.slug === slug);
export const getArticleById = (id: string) => articles.find(a => a.id === id);
export const getArticlesByCategory = (categorySlug: string) =>
  articles.filter(a => a.categorySlug === categorySlug);
export const getFeaturedArticles = () => articles.filter(a => a.isFeatured);
export const getBreakingNews = () => articles.filter(a => a.isBreaking);
export const getTrendingArticles = () => articles.filter(a => a.isTrending);
export const getMostReadArticles = () => [...articles].sort((a, b) => b.views - a.views);
export const getMostCommentedArticles = () => [...articles].sort((a, b) => b.comments - a.comments);
export const getRelatedArticles = (article: Article, limit = 4) => {
  if (article.relatedIds) {
    const related = article.relatedIds.map(id => getArticleById(id)).filter(Boolean) as Article[];
    if (related.length >= limit) return related.slice(0, limit);
  }
  return articles
    .filter(a => a.id !== article.id && a.categorySlug === article.categorySlug)
    .slice(0, limit);
};
export const getCommentsByArticle = (articleId: string) =>
  comments.filter(c => c.articleId === articleId);
export const searchArticles = (query: string) => {
  const q = query.toLowerCase();
  return articles.filter(
    a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
  );
};
