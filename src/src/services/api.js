/**
 * Data service layer.
 *
 * The backend (Express + MongoDB) is not built yet, so this file stores data in
 * the browser's localStorage. Every function is async and has the same shape a
 * real REST call would have. When the backend is ready, replace the bodies with
 * fetch/axios calls, e.g.:
 *
 *   export const getMenuItems = () => fetch(`${API_URL}/menu`).then(r => r.json());
 *
 * Nothing else in the app needs to change.
 */
import { seedMenu, seedOrders } from '../data/seed.js';

const KEYS = { menu: 'mcjoe_menu', orders: 'mcjoe_orders' };

const read = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore and fall back to seed */
  }
  write(key, seed);
  return seed;
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: data lasts for this session only */
  }
};

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ---------- Menu items ---------- */
export const getMenuItems = async () => read(KEYS.menu, seedMenu);

export const createMenuItem = async (data) => {
  const list = read(KEYS.menu, seedMenu);
  const item = { ...data, id: newId() };
  write(KEYS.menu, [item, ...list]);
  return item;
};

export const updateMenuItem = async (id, data) => {
  const list = read(KEYS.menu, seedMenu);
  const next = list.map((m) => (m.id === id ? { ...m, ...data, id } : m));
  write(KEYS.menu, next);
  return next.find((m) => m.id === id);
};

export const deleteMenuItem = async (id) => {
  write(KEYS.menu, read(KEYS.menu, seedMenu).filter((m) => m.id !== id));
  return id;
};

/* ---------- Orders ---------- */
export const getOrders = async () => read(KEYS.orders, seedOrders);

export const createOrder = async (data) => {
  const list = read(KEYS.orders, seedOrders);
  const order = { ...data, id: newId(), createdAt: new Date().toISOString() };
  write(KEYS.orders, [order, ...list]);
  return order;
};

export const updateOrder = async (id, data) => {
  const list = read(KEYS.orders, seedOrders);
  const next = list.map((o) => (o.id === id ? { ...o, ...data, id } : o));
  write(KEYS.orders, next);
  return next.find((o) => o.id === id);
};

export const deleteOrder = async (id) => {
  write(KEYS.orders, read(KEYS.orders, seedOrders).filter((o) => o.id !== id));
  return id;
};
