export const CATEGORIES = ['Coffee', 'Non-Coffee', 'Pastry', 'Meals'];

export const SIZES = [
  { name: 'Small', extra: 0 },
  { name: 'Medium', extra: 20 },
  { name: 'Large', extra: 40 },
];

export const CATEGORY_ICONS = {
  Coffee: '☕',
  'Non-Coffee': '🧋',
  Pastry: '🥐',
  Meals: '🥪',
};

export const SIZED_CATEGORIES = ['Coffee', 'Non-Coffee'];
export const ORDER_STATUSES = ['Pending', 'Preparing', 'Served', 'Cancelled'];

export const seedMenu = [
  { id: 'm1', name: 'Joe’s Signature Latte', category: 'Coffee', price: 145, description: 'Double espresso, steamed milk and a hint of brown sugar caramel.', available: true, featured: true },
  { id: 'm2', name: 'Americano', category: 'Coffee', price: 110, description: 'Bold espresso topped with hot water. Clean and strong.', available: true, featured: false },
  { id: 'm3', name: 'Spanish Latte', category: 'Coffee', price: 150, description: 'Silky espresso latte sweetened with condensed milk.', available: true, featured: true },
  { id: 'm4', name: 'Iced Matcha', category: 'Non-Coffee', price: 150, description: 'Ceremonial-grade matcha over milk and ice.', available: true, featured: false },
  { id: 'm5', name: 'Dark Chocolate', category: 'Non-Coffee', price: 135, description: 'Rich, thick, and not too sweet.', available: false, featured: false },
  { id: 'm6', name: 'Butter Croissant', category: 'Pastry', price: 95, description: 'Flaky layers baked fresh every morning.', available: true, featured: true },
  { id: 'm7', name: 'Cinnamon Roll', category: 'Pastry', price: 105, description: 'Warm roll with cream cheese glaze.', available: true, featured: false },
  { id: 'm8', name: 'Chicken Pesto Panini', category: 'Meals', price: 220, description: 'Grilled chicken, basil pesto and mozzarella on ciabatta.', available: true, featured: false },
];

export const seedOrders = [
  { id: 'o1', customer: 'Maria Santos', status: 'Preparing', note: 'Less ice please', createdAt: new Date().toISOString(), items: [{ menuId: 'm1', qty: 2 }, { menuId: 'm6', qty: 1 }] },
  { id: 'o2', customer: 'Carlo Reyes', status: 'Pending', note: '', createdAt: new Date().toISOString(), items: [{ menuId: 'm8', qty: 1 }, { menuId: 'm2', qty: 1 }] },
];

export const ADDONS = {
  Coffee: [{ name: 'Extra shot', price: 30 }, { name: 'Oat milk', price: 40 }, { name: 'Vanilla syrup', price: 20 }],
  'Non-Coffee': [{ name: 'Oat milk', price: 40 }, { name: 'Whipped cream', price: 20 }],
  Pastry: [{ name: 'Warm it up', price: 0 }],
  Meals: [{ name: 'Extra cheese', price: 30 }, { name: 'Side fries', price: 60 }],
};