// Mock rewards. PLACEHOLDER costs and partners, confirm with client (BRIEFING.md question 9).
// `minLevel` locks a reward until the user reaches that membership level.

export const rewards = [
  { id: 'rw-1', title: '10% de descuento', partner: 'Forno Lavapiés', cost: 40, minLevel: 'bronze', desc: 'En tu próxima pizza, válido de lunes a jueves.', seed: 41 },
  { id: 'rw-2', title: 'Bebida gratis', partner: 'Slice Malasaña', cost: 60, minLevel: 'bronze', desc: 'Una bebida con tu porción favorita.', seed: 42 },
  { id: 'rw-3', title: 'Postre de la casa', partner: 'Fuoco di Gràcia', cost: 90, minLevel: 'bronze', desc: 'Tiramisú o panna cotta a elegir.', seed: 43 },
  { id: 'rw-4', title: '2x1 en pizzas', partner: 'Pizzas del Teide', cost: 150, minLevel: 'silver', desc: 'Dos pizzas por el precio de una. Solo nivel Plata o superior.', seed: 44 },
  { id: 'rw-5', title: 'Entrada al PizzaFest', partner: 'PizzaFest Madrid', cost: 220, minLevel: 'silver', desc: 'Entrada general con degustación incluida.', seed: 45 },
  { id: 'rw-6', title: 'Cena para dos', partner: 'Nonna Chueca', cost: 380, minLevel: 'gold', desc: 'Menú degustación para dos personas. Solo nivel Oro.', seed: 46 },
];
