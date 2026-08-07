// Sourced from Pedal_Database.xlsx (real store/address data the user provided).
// Starbucks & Domino's didn't have listed prices ("you make a reasonable guess"),
// so those are realistic Calgary market-rate estimates — swap in real POS prices
// before launch.

export const STORES = [
  {
    id: 'sobeys-tuscany',
    name: 'Sobeys Tuscany',
    category: 'Grocery',
    logo: require('../../assets/stores/sobeys.png'),
    address: '11300 Tuscany Blvd NW #2020, Calgary, AB T3L 2V7',
    lat: 51.1367,
    lng: -114.2497,
    hours: '7am – 11pm',
    blurb: 'Grocery & fresh produce',
    items: [
      { id: 'sob-cookies', name: 'Cookies (dozen)', price: 5.99, unit: 'ea', weightLb: 1 },
      { id: 'sob-bananas', name: 'Bananas', price: 1.99, unit: 'lb', weightLb: 1 },
      { id: 'sob-milk', name: 'Milk (2L, 2%)', price: 6.99, unit: 'ea', weightLb: 4.5 },
      { id: 'sob-eggs', name: 'Eggs (dozen)', price: 4.99, unit: 'ea', weightLb: 1.5 },
      { id: 'sob-potatoes', name: 'Potatoes', price: 0.99, unit: 'lb', weightLb: 1 },
      { id: 'sob-apples', name: 'Apples', price: 1.49, unit: 'lb', weightLb: 1 },
    ],
  },
  {
    id: 'circlek-tuscany',
    name: 'Circle K Tuscany',
    category: 'Convenience',
    logo: require('../../assets/stores/circlek.png'),
    address: '11300 Tuscany Blvd NW, Calgary, AB T3L 2V7',
    lat: 51.1371,
    lng: -114.2502,
    hours: '24 hours',
    blurb: 'Convenience & snacks',
    items: [
      { id: 'ck-chips', name: 'Chips', price: 2.99, unit: 'ea', weightLb: 0.3 },
      { id: 'ck-candy', name: 'Candy', price: 1.99, unit: 'ea', weightLb: 0.2 },
      { id: 'ck-soda', name: 'Soda', price: 3.99, unit: 'ea', weightLb: 1.2 },
      { id: 'ck-gummies', name: 'Gummies', price: 1.49, unit: 'ea', weightLb: 0.2 },
    ],
  },
  {
    id: 'starbucks-tuscany',
    name: 'Starbucks Tuscany',
    category: 'Coffee',
    logo: require('../../assets/stores/starbucks.png'),
    address: 'Tuscany Market, 11300 Tuscany Blvd NW, Calgary, AB T3L 2Y8',
    lat: 51.1364,
    lng: -114.2490,
    hours: '5:30am – 9pm',
    blurb: 'Coffee & espresso bar',
    items: [
      { id: 'sb-coffee', name: 'Coffee', sizes: { Small: 2.65, Medium: 3.05, Large: 3.35 }, weightLb: 0.8 },
      { id: 'sb-mocha', name: 'Mocha', sizes: { Small: 4.45, Medium: 5.15, Large: 5.65 }, weightLb: 0.8 },
      { id: 'sb-icedlatte', name: 'Iced Latte', sizes: { Small: 4.25, Medium: 4.95, Large: 5.45 }, weightLb: 0.9 },
      { id: 'sb-hotchoc', name: 'Hot Chocolate', sizes: { Small: 3.75, Medium: 4.25, Large: 4.65 }, weightLb: 0.8 },
      { id: 'sb-chai', name: 'Chai Tea', sizes: { Small: 4.15, Medium: 4.75, Large: 5.25 }, weightLb: 0.8 },
      { id: 'sb-matcha', name: 'Matcha', sizes: { Small: 4.65, Medium: 5.35, Large: 5.85 }, weightLb: 0.8 },
    ],
  },
  {
    id: 'dominos-tuscany',
    name: "Domino's Tuscany",
    category: 'Pizza',
    logo: require('../../assets/stores/dominos.png'),
    address: '11300 Tuscany Blvd NW, Calgary, AB T3L 2Y8',
    lat: 51.1373,
    lng: -114.2488,
    hours: '11am – 1am',
    blurb: 'Pizza & sides',
    items: [
      { id: 'dm-pepperoni', name: 'Pepperoni Pizza', sizes: { Small: 9.99, Medium: 12.99, Large: 15.99 }, weightLb: 2 },
      { id: 'dm-cheese', name: 'Cheese Pizza', sizes: { Small: 8.99, Medium: 11.99, Large: 14.99 }, weightLb: 1.8 },
      { id: 'dm-veggie', name: 'Vegetarian Pizza', sizes: { Small: 9.99, Medium: 12.99, Large: 15.99 }, weightLb: 2 },
      { id: 'dm-hawaiian', name: 'Hawaiian Pizza', sizes: { Small: 10.99, Medium: 13.99, Large: 16.99 }, weightLb: 2.1 },
      { id: 'dm-meatlovers', name: 'Meatlovers Pizza', sizes: { Small: 11.99, Medium: 14.99, Large: 17.99 }, weightLb: 2.3 },
      { id: 'dm-breadsticks', name: 'Breadsticks', price: 6.49, unit: 'ea', weightLb: 0.9 },
    ],
  },
];

export const CATEGORIES = ['All', 'Grocery', 'Convenience', 'Coffee', 'Pizza'];
