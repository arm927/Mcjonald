import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { peso } from '../components/MenuCard.jsx';
import { CATEGORY_ICONS } from '../data/seed.js';

export default function Cart({ cart, menu, user, onUpdateQty, onRemove, onCheckout }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(user?.name || '');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const lines = cart
    .map((l) => ({ ...l, item: menu.find((m) => m.id === l.menuId) }))
    .filter((l) => l.item);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!customer.trim()) return setError('Customer name is required');
    await onCheckout({ customer: customer.trim(), note: note.trim() });
    navigate('/orders');
  };

  return (
    <section className="container page">
      <div className="section-head">
        <div>
          <h1>Your Cart</h1>
          <p className="muted">{count} {count === 1 ? 'item' : 'items'} in your cart.</p>
        </div>
        <Link className="btn btn-ghost" to="/menu">Add more items</Link>
      </div>

      {lines.length ? (
        <div className="cart-layout">
          <div className="cart-list">
            {lines.map((l) => (
              <article className="card cart-item" key={l.key}>
                <div className="cart-art" aria-hidden="true">{CATEGORY_ICONS[l.item.category] || '☕'}</div>
                <div className="cart-info">
                  <div className="cart-item-head">
                    <div>
                      <h3>{l.item.name}</h3>
                      <span className="muted small">
                        {[l.size, ...(l.addons || [])].filter(Boolean).join(' · ') || l.item.category}
                      </span>
                      {l.note && <div className="note small">“{l.note}”</div>}
                    </div>
                    <span className="price">{peso(l.price)}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button type="button" onClick={() => onUpdateQty(l.key, l.qty - 1)} aria-label="Decrease">−</button>
                      <span>{l.qty}</span>
                      <button type="button" onClick={() => onUpdateQty(l.key, l.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <strong>{peso(l.price * l.qty)}</strong>
                    <button type="button" className="btn btn-sm btn-danger-ghost" onClick={() => onRemove(l.key)}>Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <form className="card cart-summary" onSubmit={placeOrder} noValidate>
            <h3>Order summary</h3>
            <div className="sum-row"><span>Items</span><strong>{count}</strong></div>
            <div className="sum-row cart-total"><span>Total</span><strong>{peso(total)}</strong></div>
            <label>
              Customer name
              <input value={customer} onChange={(e) => { setCustomer(e.target.value); setError(''); }} placeholder="e.g. Ana Dela Cruz" />
              {error && <span className="error">{error}</span>}
            </label>
            <label>
              Note (optional)
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. for here" />
            </label>
            <button type="submit" className="btn btn-primary">Place order</button>
          </form>
        </div>
      ) : (
        <div className="empty">
          <h2>Your cart is empty</h2>
          <p>Pick something from the menu to get started.</p>
          <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
        </div>
      )}
    </section>
  );
}