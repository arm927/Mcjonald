import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import ItemModal from './components/ItemModal.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Cart from './pages/cart.jsx';
import ManageMenu from './pages/ManageMenu.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import * as api from './services/api.js';

const STAFF_ROLES = ['Admin', 'Staff'];

function RequireStaff({ user, children }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!STAFF_ROLES.includes(user.role)) {
    return (
      <section className="container page">
        <div className="empty">
          <h2>Staff only</h2>
          <p>Your account doesn’t have access to this page.</p>
          <Link className="btn btn-primary" to="/menu">Back to the menu</Link>
        </div>
      </section>
    );
  }
  return children;
}

export default function App() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mcjoe_cart')) || []; } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mcjoe_user')) || null; } catch { return null; }
  });

  const notify = useCallback((message, type = 'ok') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  useEffect(() => {
    Promise.all([api.getMenuItems(), api.getOrders()]).then(([m, o]) => {
      setMenu(m);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    try { localStorage.setItem('mcjoe_cart', JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart]);

  /* ---- auth ---- */
  const startSession = (safe) => {
    setUser(safe);
    try { localStorage.setItem('mcjoe_user', JSON.stringify(safe)); } catch { /* ignore */ }
    notify(`Welcome, ${safe.name}!`);
  };
  const login = async (username, password) => {
    const safe = await api.loginUser(username, password);
    if (!safe) return false;
    startSession(safe);
    return true;
  };
  const signup = async (data) => {
    const safe = await api.registerUser(data); // throws if username is taken
    startSession(safe);
  };
  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('mcjoe_user'); } catch { /* ignore */ }
    notify('Logged out');
  };

  /* ---- cart ---- */
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const addToCart = (line) => {
    const key = [line.menuId, line.size, [...line.addons].sort().join('+'), line.note].join('|');
    setCart((prev) => {
      const found = prev.find((l) => l.key === key);
      return found
        ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l))
        : [...prev, { ...line, key }];
    });
    notify(`${selected?.name || 'Item'} added to cart`);
    setSelected(null);
  };
  const updateQty = (key, qty) =>
    setCart((prev) => (qty < 1 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))));
  const removeLine = (key) => setCart((prev) => prev.filter((l) => l.key !== key));

  /* ---- menu CRUD ---- */
  const addMenuItem = async (data) => {
    const item = await api.createMenuItem(data);
    setMenu((prev) => [item, ...prev]);
    notify(`“${item.name}” added to the menu`);
  };
  const editMenuItem = async (id, data) => {
    const item = await api.updateMenuItem(id, data);
    setMenu((prev) => prev.map((m) => (m.id === id ? item : m)));
    notify(`“${item.name}” updated`);
  };
  const removeMenuItem = async (id) => {
    const name = menu.find((m) => m.id === id)?.name;
    await api.deleteMenuItem(id);
    setMenu((prev) => prev.filter((m) => m.id !== id));
    notify(`“${name}” deleted`, 'warn');
  };

  /* ---- order CRUD ---- */
  const addOrder = async (data) => {
    const order = await api.createOrder(data);
    setOrders((prev) => [order, ...prev]);
    notify(`Order for ${order.customer} created`);
  };
  const editOrder = async (id, data) => {
    const order = await api.updateOrder(id, data);
    setOrders((prev) => prev.map((o) => (o.id === id ? order : o)));
    notify('Order updated');
  };
  const removeOrder = async (id) => {
    await api.deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    notify('Order deleted', 'warn');
  };

  const checkout = async ({ customer, note }) => {
    await addOrder({
      customer,
      note,
      status: 'Pending',
      items: cart.map(({ key, ...line }) => line),
    });
    setCart([]);
  };

  return (
    <div className="app">
      <Navbar cartCount={cartCount} user={user} onLogout={logout} />
      <main>
        {loading ? (
          <p className="loading">Brewing…</p>
        ) : (
          <Routes>
            <Route path="/" element={<Home menu={menu} orders={orders} onSelect={setSelected} />} />
            <Route path="/menu" element={<Menu menu={menu} onSelect={setSelected} />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} menu={menu} user={user} onUpdateQty={updateQty} onRemove={removeLine} onCheckout={checkout} />}
            />
            <Route path="/login" element={<Login user={user} onLogin={login} />} />
            <Route path="/signup" element={<Signup user={user} onSignup={signup} />} />
            <Route
              path="/manage-menu"
              element={
                <RequireStaff user={user}>
                  <ManageMenu menu={menu} onAdd={addMenuItem} onEdit={editMenuItem} onDelete={removeMenuItem} />
                </RequireStaff>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireStaff user={user}>
                  <Orders orders={orders} menu={menu} onAdd={addOrder} onEdit={editOrder} onDelete={removeOrder} />
                </RequireStaff>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      <Footer />
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} onAdd={addToCart} />}
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}