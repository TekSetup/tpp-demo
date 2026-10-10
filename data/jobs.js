// Mock vacancies. Companies are fictitious (some reuse mock pizzería names).

export const roles = ['pizzaiolo', 'cocinero', 'camarero', 'reparto', 'gerente'];

export const jobs = [
  { id: 1, title: 'Pizzaiolo de horno de leña', role: 'pizzaiolo', company: 'Forno Lavapiés', city: 'madrid', type: 'Jornada completa', salary: '1.800 a 2.100 €/mes', posted: '2026-10-06',
    desc: 'Buscamos pizzaiolo con experiencia en masas de larga fermentación y manejo de horno de leña.',
    reqs: ['2 años de experiencia como pizzaiolo', 'Conocimiento de masa madre', 'Disponibilidad fines de semana'] },
  { id: 2, title: 'Cocinero/a de línea', role: 'cocinero', company: 'La Bottega del Fuoco', city: 'madrid', type: 'Jornada completa', salary: '1.500 a 1.700 €/mes', posted: '2026-10-04',
    desc: 'Incorpórate a un equipo joven. Preparación de mise en place y elaboración de pizza romana.',
    reqs: ['Experiencia en cocina italiana valorada', 'Carné de manipulador de alimentos', 'Trabajo en equipo'] },
  { id: 3, title: 'Camarero/a de sala', role: 'camarero', company: 'Nonna Chueca', city: 'madrid', type: 'Media jornada', salary: '900 a 1.100 €/mes', posted: '2026-10-08',
    desc: 'Atención al cliente en sala y terraza. Buscamos a alguien amable y con ganas de aprender de producto.',
    reqs: ['Experiencia previa en sala', 'Buen trato con el cliente', 'Horario de tarde y noche'] },
  { id: 4, title: 'Gerente de local', role: 'gerente', company: 'Fuoco di Gràcia', city: 'barcelona', type: 'Jornada completa', salary: '2.400 a 2.800 €/mes', posted: '2026-10-01',
    desc: 'Dirige el equipo, el servicio y los números del local. Reportas directamente a propiedad.',
    reqs: ['3 años gestionando restauración', 'Control de costes y escandallos', 'Catalán y castellano'] },
  { id: 5, title: 'Repartidor/a con moto propia', role: 'reparto', company: 'Slice Barceloneta', city: 'barcelona', type: 'Por horas', salary: '11 €/hora + propinas', posted: '2026-10-07',
    desc: 'Reparto en la zona de la Barceloneta y el Born. Turnos de viernes a domingo.',
    reqs: ['Moto propia y carné en regla', 'Conocimiento de la zona', 'Seguro a terceros'] },
  { id: 6, title: 'Pizzaiolo/a ayudante', role: 'pizzaiolo', company: 'Massa Madre Born', city: 'barcelona', type: 'Jornada completa', salary: '1.600 a 1.800 €/mes', posted: '2026-09-30',
    desc: 'Aprende con nuestro maestro pizzaiolo: boleado, estirado y cocción. Opción de formación interna.',
    reqs: ['Ganas de aprender', 'Experiencia en cocina valorada', 'Compromiso y puntualidad'] },
  { id: 7, title: 'Camarero/a con inglés', role: 'camarero', company: 'Slice Playa de las Américas', city: 'tenerife', type: 'Jornada completa', salary: '1.300 a 1.500 €/mes', posted: '2026-10-05',
    desc: 'Atención a clientes internacionales en terraza. Se valora alemán o italiano.',
    reqs: ['Inglés conversacional', 'Experiencia en hostelería turística', 'Disponibilidad inmediata'] },
  { id: 8, title: 'Cocinero/a de pizzería', role: 'cocinero', company: 'Pizzas del Teide', city: 'tenerife', type: 'Jornada completa', salary: '1.400 a 1.600 €/mes', posted: '2026-10-03',
    desc: 'Trabajo con producto canario y receta propia de masa. Formación en el puesto.',
    reqs: ['Experiencia mínima de 1 año', 'Residir en la isla', 'Carné de manipulador'] },
  { id: 9, title: 'Gerente de zona Canarias', role: 'gerente', company: 'Squadra Tutti Per La Pizza', city: 'tenerife', type: 'Jornada completa', salary: '2.200 a 2.600 €/mes', posted: '2026-09-29',
    desc: 'Coordina locales y proveedores del archipiélago, y ayuda a organizar eventos pizzeros.',
    reqs: ['Experiencia en gestión de varios locales', 'Movilidad entre islas', 'Orientación a resultados'] },
];
