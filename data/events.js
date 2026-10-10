// Mock events and community feed. Dates are ISO strings.

export const events = [
  { id: 1, title: 'PizzaFest Madrid', date: '2026-11-14', time: '11:00', city: 'madrid', venue: 'Matadero Madrid', seed: 31, going: 842,
    desc: 'Un día entero de pizza: showcooking, catas a ciegas, música y los mejores pizzaiolos de la ciudad.' },
  { id: 2, title: 'Campeonato Tutti per la Pizza', date: '2026-11-28', time: '10:00', city: 'barcelona', venue: 'Fira de Barcelona', seed: 32, going: 1210,
    desc: 'El campeonato que nació en 2017 vuelve con categorías clásica, creativa y sin gluten.' },
  { id: 3, title: 'Cata de pizza canaria', date: '2026-11-07', time: '19:30', city: 'tenerife', venue: 'Plaza del Cristo, La Laguna', seed: 33, going: 156,
    desc: 'Cinco pizzas con producto de las islas, maridadas con vinos locales.' },
  { id: 4, title: 'Taller: masa madre para curiosos', date: '2026-12-05', time: '17:00', city: 'madrid', venue: 'Chamberí', seed: 34, going: 64,
    desc: 'Aprende a criar tu masa madre y llévate un starter a casa.' },
  { id: 5, title: 'Noche de pizza y cine', date: '2026-12-12', time: '20:30', city: 'barcelona', venue: 'Poble Sec', seed: 35, going: 98,
    desc: 'Proyección al aire libre con porciones ilimitadas. Trae manta.' },
];

export const feed = [
  { id: 'f1', kind: 'review', user: 'Lucía M.', placeId: 1, rating: 5, text: 'La masa es una maravilla, ligera y con borde alveolado.', date: '2026-09-28' },
  { id: 'f2', kind: 'reco', user: 'Pablo G.', name: 'Pizzería El Tablao', city: 'Sevilla', text: 'Una joya escondida en Triana. ¡Hay que traerla a TPP!', date: '2026-10-03' },
  { id: 'f3', kind: 'review', user: 'Núria B.', placeId: 6, rating: 5, text: 'La mejor napolitana que he probado en Barcelona.', date: '2026-09-30' },
  { id: 'f4', kind: 'review', user: 'Yeray A.', placeId: 10, rating: 5, text: 'La de queso de cabra con mojo, adictiva.', date: '2026-09-27' },
  { id: 'f5', kind: 'reco', user: 'Carmen R.', name: 'Pizzas La Palma', city: 'Santa Cruz de La Palma', text: 'Masa de patata de La Palma. Distinta y deliciosa.', date: '2026-10-05' },
  { id: 'f6', kind: 'review', user: 'Paula G.', placeId: 4, rating: 5, text: 'Sabe a casa de la abuela, aunque la mía no sea siciliana.', date: '2026-10-02' },
];
