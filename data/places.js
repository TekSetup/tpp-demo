// Mock pizzerías. All names, addresses and reviews are fictitious.
// Shaped like a future API response. `map` is the pin position (0-100) on the schematic city map.

export const places = [
  { id: 1, name: 'Forno Lavapiés', city: 'madrid', area: 'Lavapiés', address: 'Calle del Ave María 18', hours: '12:30 - 23:30', open: true, rating: 4.8, reviewCount: 312, styles: ['napolitana', 'vegana'], price: '€€', km: 0.6, isNew: false, map: { x: 52, y: 62 },
    desc: 'Horno de leña y masa de 72 horas. Margarita de manual y una carta vegetal que sorprende.',
    reviews: [
      { user: 'Lucía M.', rating: 5, text: 'La masa es una maravilla, ligera y con borde alveolado. Repetiré seguro.', date: '2026-09-28' },
      { user: 'Andrés P.', rating: 5, text: 'Margarita perfecta. Ojo con la cola del sábado, merece la pena.', date: '2026-09-12' },
      { user: 'Marta S.', rating: 4, text: 'Muy buena, aunque el local es pequeño y el ruido se nota.', date: '2026-08-30' } ] },
  { id: 2, name: 'La Bottega del Fuoco', city: 'madrid', area: 'Chamberí', address: 'Calle de Fuencarral 142', hours: '13:00 - 00:00', open: true, rating: 4.6, reviewCount: 187, styles: ['romana'], price: '€€', km: 1.4, isNew: false, map: { x: 40, y: 30 },
    desc: 'Pizza romana al taglio y en pala, con ingredientes de pequeños productores italianos.',
    reviews: [
      { user: 'Javier R.', rating: 5, text: 'La pala de mortadela y pistacho es otro nivel.', date: '2026-09-20' },
      { user: 'Elena V.', rating: 4, text: 'Crujiente por fuera y tierna por dentro. Precio justo.', date: '2026-09-02' } ] },
  { id: 3, name: 'Slice Malasaña', city: 'madrid', area: 'Malasaña', address: 'Calle del Pez 9', hours: '12:00 - 01:00', open: false, rating: 4.4, reviewCount: 241, styles: ['new-york'], price: '€', km: 1.1, isNew: false, map: { x: 36, y: 44 },
    desc: 'Porciones gigantes al estilo Nueva York, para comer andando o en la barra.',
    reviews: [
      { user: 'Diego C.', rating: 4, text: 'Porción enorme y barata. Perfecta tras un concierto.', date: '2026-09-15' },
      { user: 'Sara L.', rating: 5, text: 'La de pepperoni, crujiente y con mucho queso.', date: '2026-08-21' } ] },
  { id: 4, name: 'Nonna Chueca', city: 'madrid', area: 'Chueca', address: 'Calle de Augusto Figueroa 24', hours: '13:30 - 23:00', open: true, rating: 4.7, reviewCount: 96, styles: ['siciliana'], price: '€€€', km: 1.8, isNew: true, map: { x: 58, y: 40 },
    desc: 'Sfincione y pizza siciliana de masa gruesa, receta de familia desde Palermo.',
    reviews: [
      { user: 'Paula G.', rating: 5, text: 'Sabe a casa de la abuela, aunque la mía no sea siciliana.', date: '2026-10-02' } ] },
  { id: 5, name: 'Basilico Verde', city: 'madrid', area: 'Retiro', address: 'Calle de Ibiza 35', hours: '12:30 - 23:00', open: true, rating: 4.5, reviewCount: 143, styles: ['vegana', 'sin-gluten'], price: '€€', km: 2.6, isNew: true, map: { x: 70, y: 56 },
    desc: 'Cocina 100% vegetal y masa sin gluten certificada. Cero cruces, cero dudas.',
    reviews: [
      { user: 'Irene T.', rating: 5, text: 'Por fin una pizza sin gluten que no parece cartón.', date: '2026-09-25' },
      { user: 'Raúl D.', rating: 4, text: 'Queso vegano muy conseguido.', date: '2026-09-07' } ] },

  { id: 6, name: 'Fuoco di Gràcia', city: 'barcelona', area: 'Gràcia', address: 'Carrer de Verdi 71', hours: '13:00 - 23:30', open: true, rating: 4.8, reviewCount: 274, styles: ['napolitana'], price: '€€', km: 0.5, isNew: false, map: { x: 50, y: 28 },
    desc: 'Napolitana auténtica con harinas de Nápoles y tomate San Marzano.',
    reviews: [
      { user: 'Núria B.', rating: 5, text: 'La mejor napolitana que he probado en Barcelona.', date: '2026-09-30' },
      { user: 'Pau F.', rating: 5, text: 'Terraza preciosa y servicio muy cercano.', date: '2026-09-10' } ] },
  { id: 7, name: 'Massa Madre Born', city: 'barcelona', area: 'El Born', address: 'Carrer dels Flassaders 15', hours: '12:30 - 23:00', open: true, rating: 4.6, reviewCount: 158, styles: ['romana', 'vegana'], price: '€€', km: 1.2, isNew: false, map: { x: 62, y: 55 },
    desc: 'Masa madre de más de 5 años y fermentaciones largas. Opciones veganas a diario.',
    reviews: [
      { user: 'Marc J.', rating: 5, text: 'Se nota la masa madre, digestiva y sabrosa.', date: '2026-09-18' } ] },
  { id: 8, name: 'Il Cantuccio Eixample', city: 'barcelona', area: 'Eixample', address: 'Carrer d’Aragó 260', hours: '13:00 - 00:00', open: false, rating: 4.3, reviewCount: 211, styles: ['napolitana', 'sin-gluten'], price: '€€', km: 1.9, isNew: false, map: { x: 40, y: 48 },
    desc: 'Trattoria familiar con horno de leña y una carta sin gluten bien resuelta.',
    reviews: [
      { user: 'Clara O.', rating: 4, text: 'Buena opción sin gluten, la masa no se rompe.', date: '2026-09-05' } ] },
  { id: 9, name: 'Slice Barceloneta', city: 'barcelona', area: 'La Barceloneta', address: 'Passeig de Joan de Borbó 32', hours: '12:00 - 01:00', open: true, rating: 4.2, reviewCount: 305, styles: ['new-york'], price: '€', km: 2.8, isNew: true, map: { x: 74, y: 72 },
    desc: 'Pizza a porciones junto al mar. Rápida, generosa y con mucho ambiente.',
    reviews: [
      { user: 'Tom H.', rating: 4, text: 'Ideal para comer en la playa. Cola rápida.', date: '2026-10-01' } ] },

  { id: 10, name: 'Pizzas del Teide', city: 'tenerife', area: 'Santa Cruz', address: 'Calle del Castillo 40', hours: '12:30 - 23:30', open: true, rating: 4.7, reviewCount: 129, styles: ['napolitana'], price: '€€', km: 0.7, isNew: false, map: { x: 66, y: 40 },
    desc: 'Napolitana con productos canarios: queso de cabra palmero y mojo verde de la casa.',
    reviews: [
      { user: 'Yeray A.', rating: 5, text: 'La de queso de cabra con mojo, adictiva.', date: '2026-09-27' },
      { user: 'Cristina N.', rating: 4, text: 'Producto local y servicio amable.', date: '2026-09-09' } ] },
  { id: 11, name: 'Isla Margherita', city: 'tenerife', area: 'La Laguna', address: 'Calle Herradores 21', hours: '13:00 - 23:00', open: true, rating: 4.5, reviewCount: 88, styles: ['romana', 'vegana'], price: '€€', km: 1.5, isNew: true, map: { x: 42, y: 36 },
    desc: 'Romana en pala y opciones vegetales en el casco histórico de La Laguna.',
    reviews: [
      { user: 'Aday M.', rating: 5, text: 'Ambientazo en el casco y pizza deliciosa.', date: '2026-09-29' } ] },
  { id: 12, name: 'Forno La Laguna', city: 'tenerife', area: 'La Laguna', address: 'Calle San Agustín 58', hours: '12:00 - 22:30', open: false, rating: 4.4, reviewCount: 102, styles: ['napolitana', 'sin-gluten'], price: '€€', km: 1.7, isNew: false, map: { x: 36, y: 52 },
    desc: 'Horno de leña y opción sin gluten. Local pequeño con mucho cariño.',
    reviews: [
      { user: 'Nayra P.', rating: 4, text: 'Trato familiar, la masa sin gluten está muy lograda.', date: '2026-08-26' } ] },
  { id: 13, name: 'Slice Playa de las Américas', city: 'tenerife', area: 'Adeje', address: 'Avenida Rafael Puig 12', hours: '12:00 - 01:00', open: true, rating: 4.1, reviewCount: 176, styles: ['new-york', 'siciliana'], price: '€€', km: 4.2, isNew: false, map: { x: 28, y: 76 },
    desc: 'Porciones y pizza siciliana a pocos pasos de la playa, con terraza.',
    reviews: [
      { user: 'Hanna K.', rating: 4, text: 'Great slices after the beach. Staff speaks English too.', date: '2026-09-14' } ] },
];

export const styleIds = ['napolitana', 'romana', 'new-york', 'siciliana', 'sin-gluten', 'vegana'];
