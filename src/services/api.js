/**
 * Data service layer (localStorage for now).
 * When the Express + MongoDB backend is ready, replace the bodies with fetch calls.
 */
import { seedMenu, seedOrders, USERS } from '../data/seed.js';

const KEYS = { menu: 'mcjoe_menu', orders: 'mcjoe_orders', users: 'mcjoe_users' };

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

const sha256 = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

/* ---------- Users ---------- */
export const registerUser = async ({ name, username, password }) => {
  const uname = username.trim().toLowerCase();
  const users = read(KEYS.users, []);
  if (USERS.some((u) => u.username === uname) || users.some((u) => u.username === uname)) {
    throw new Error('That username is already taken');
  }
  const user = { username: uname, name: name.trim(), role: 'Customer', passwordHash: await sha256(password) };
  write(KEYS.users, [...users, user]);
  return { username: user.username, name: user.name, role: user.role };
};

export const loginUser = async (username, password) => {
  const uname = username.trim().toLowerCase();

  // built-in staff accounts
  const staff = USERS.find((u) => u.username === uname && u.password === password);
  if (staff) return { username: staff.username, name: staff.name, role: staff.role };

  // accounts created on the Sign up page
  const hash = await sha256(password);
  const found = read(KEYS.users, []).find((u) => u.username === uname && u.passwordHash === hash);
  return found ? { username: found.username, name: found.name, role: found.role } : null;
};

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