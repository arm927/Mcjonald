import { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import ManageMenu from './pages/ManageMenu.jsx';
import Orders from './pages/Orders.jsx';
import NotFound from './pages/NotFound.jsx';
import * as api from './services/api.js';

export default function App() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

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

  return (
    <div className="app">
      <Navbar />
      <main>
        {loading ? (
          <p className="loading">Brewing…</p>
        ) : (
          <Routes>
            <Route path="/" element={<Home menu={menu} orders={orders} />} />
            <Route path="/menu" element={<Menu menu={menu} />} />
            <Route
              path="/manage-menu"
              element={<ManageMenu menu={menu} onAdd={addMenuItem} onEdit={editMenuItem} onDelete={removeMenuItem} />}
            />
            <Route
              path="/orders"
              element={<Orders orders={orders} menu={menu} onAdd={addOrder} onEdit={editOrder} onDelete={removeOrder} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      <Footer />
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}
