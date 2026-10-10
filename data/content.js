// Mock learning content. Videos and audio are simulated (no real media).

export const recipes = [
  { id: 'rec-1', title: 'Masa napolitana en casa', minutes: 12, level: 'Fácil', seed: 11, desc: 'Hidratación, reposo y cómo estirar sin rodillo para un borde aireado.' },
  { id: 'rec-2', title: 'Salsa de tomate en 10 minutos', minutes: 6, level: 'Fácil', seed: 12, desc: 'La salsa justa para tu pizza: tomate, sal, aceite y nada más.' },
  { id: 'rec-3', title: 'Pizza al taglio con harina integral', minutes: 15, level: 'Media', seed: 13, desc: 'Una masa jugosa para cortar en cuadrados y cargar de toppings.' },
  { id: 'rec-4', title: 'Cómo preparar masa sin gluten', minutes: 14, level: 'Media', seed: 14, desc: 'Mezcla de harinas y psyllium para una base que se sostiene.' },
  { id: 'rec-5', title: 'Pizza canaria con queso de cabra', minutes: 9, level: 'Fácil', seed: 15, desc: 'Queso de cabra, cebolla caramelizada y un toque de mojo verde.' },
];

export const courses = [
  { id: 'cur-1', title: 'Fundamentos de la masa', seed: 21, desc: 'De la harina a la masa perfecta, paso a paso.',
    lessons: [ { id: 'cur-1-1', title: 'Harinas y fuerza (W)', min: 8 }, { id: 'cur-1-2', title: 'Hidratación y amasado', min: 10 }, { id: 'cur-1-3', title: 'Fermentación y reposo', min: 12 } ] },
  { id: 'cur-2', title: 'Horno y cocción', seed: 22, desc: 'Controla temperatura y tiempos en horno de leña y eléctrico.',
    lessons: [ { id: 'cur-2-1', title: 'Horno de leña: preparar el fuego', min: 9 }, { id: 'cur-2-2', title: 'Horno eléctrico profesional', min: 7 } ] },
  { id: 'cur-3', title: 'Atención y servicio en pizzería', seed: 23, desc: 'Claves para sala, reparto y experiencia del cliente.',
    lessons: [ { id: 'cur-3-1', title: 'Cómo recibir al cliente', min: 6 }, { id: 'cur-3-2', title: 'Gestión de quejas', min: 8 }, { id: 'cur-3-3', title: 'Reparto sin errores', min: 7 } ] },
  { id: 'cur-4', title: 'Seguridad alimentaria básica', seed: 24, desc: 'Higiene, alérgenos y trazabilidad explicados fácil.',
    lessons: [ { id: 'cur-4-1', title: 'Higiene y manipulación', min: 10 }, { id: 'cur-4-2', title: 'Alérgenos y sin gluten', min: 9 } ] },
];

export const podcast = {
  name: 'TuttiPerLaPizza The Podcast',
  tagline: 'Entrevistas, cultura pizzera y las historias detrás de cada horno.',
  episodes: [
    { id: 'pod-1', title: 'El origen de la pizza napolitana', guest: 'Con una maestra pizzaiola', minutes: 32, desc: 'De Nápoles al mundo: historia, técnica y tradición.' },
    { id: 'pod-2', title: 'Abrir una pizzería con poco presupuesto', guest: 'Con un emprendedor madrileño', minutes: 41, desc: 'Errores, aciertos y números reales de un primer año.' },
    { id: 'pod-3', title: 'Masa madre: paciencia y carácter', guest: 'Con un panadero artesano', minutes: 28, desc: 'Cómo cuidar tu masa madre y por qué cambia el sabor.' },
    { id: 'pod-4', title: 'Pizza en las islas', guest: 'Con pizzeros de Canarias', minutes: 36, desc: 'Producto local, turismo y comunidad pizzera isleña.' },
    { id: 'pod-5', title: 'Sin gluten, sin renunciar al sabor', guest: 'Con una nutricionista', minutes: 30, desc: 'Qué harinas funcionan y cómo evitar contaminación cruzada.' },
    { id: 'pod-6', title: 'Campeonatos de pizza: detrás del telón', guest: 'Con jueces y concursantes', minutes: 45, desc: 'Cómo se juzga una pizza y qué se vive en un campeonato.' },
  ],
};
