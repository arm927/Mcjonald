import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { peso } from '../components/MenuCard.jsx';
import { ORDER_STATUSES } from '../data/seed.js';

const orderTotal = (order, menu) =>
  order.items.reduce((sum, line) => sum + (menu.find((m) => m.id === line.menuId)?.price || 0) * line.qty, 0);

function OrderForm({ initial, menu, onSubmit, onCancel }) {
  const [customer, setCustomer] = useState(initial?.customer || '');
  const [status, setStatus] = useState(initial?.status || 'Pending');
  const [note, setNote] = useState(initial?.note || '');
  const [lines, setLines] = useState(initial?.items?.length ? initial.items : [{ menuId: '', qty: 1 }]);
  const [errors, setErrors] = useState({});

  const setLine = (i, patch) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const removeLine = (i) => setLines((ls) => (ls.length === 1 ? ls : ls.filter((_, idx) => idx !== i)));
  const total = orderTotal({ items: lines }, menu);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!customer.trim()) err.customer = 'Customer name is required';
    const valid = lines.filter((l) => l.menuId);
    if (!valid.length) err.items = 'Add at least one item';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit({ customer: customer.trim(), status, note: note.trim(), items: valid.map((l) => ({ menuId: l.menuId, qty: Number(l.qty) || 1 })) });
  };

  return (
    <form onSubmit={submit} noValidate>
      <label>
        Customer name
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Ana Dela Cruz" autoFocus />
        {errors.customer && <span className="error">{errors.customer}</span>}
      </label>

      <fieldset>
        <legend>Items</legend>
        {lines.map((l, i) => (
          <div className="line" key={i}>
            <select value={l.menuId} onChange={(e) => setLine(i, { menuId: e.target.value })} aria-label="Menu item">
              <option value="">Choose an item…</option>
              {menu.map((m) => (
                <option key={m.id} value={m.id} disabled={!m.available && m.id !== l.menuId}>
                  {m.name} — {peso(m.price)}{m.available ? '' : ' (sold out)'}
                </option>
              ))}
            </select>
            <input type="number" min="1" value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value })} aria-label="Quantity" />
            <button type="button" className="icon-btn" onClick={() => removeLine(i)} aria-label="Remove line">✕</button>
          </div>
        ))}
        {errors.items && <span className="error">{errors.items}</span>}
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setLines((ls) => [...ls, { menuId: '', qty: 1 }])}>+ Add another item</button>
      </fieldset>

      <div className="row">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Note (optional)
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. oat milk" />
        </label>
      </div>

      <div className="total-bar"><span>Total</span><b>{peso(total)}</b></div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initial ? 'Save changes' : 'Place order'}</button>
      </div>
    </form>
  );
}

export default function Orders({ orders, menu, onAdd, onEdit, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('All');

  const shown = orders.filter((o) => filter === 'All' || o.status === filter);

  const save = async (data) => {
    if (editing === 'new') await onAdd(data);
    else await onEdit(editing.id, data);
    setEditing(null);
  };

  return (
    <section className="container page">
      <div className="section-head">
        <div>
          <h1>Orders</h1>
          <p className="muted">Take new orders and track them from counter to table.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>+ New order</button>
      </div>

      <div className="chips">
        {['All', ...ORDER_STATUSES].map((s) => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s} <span className="count">{s === 'All' ? orders.length : orders.filter((o) => o.status === s).length}</span>
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="orders">
          {shown.map((o) => (
            <article className="card order" key={o.id}>
              <div className="order-head">
                <div>
                  <h3>{o.customer}</h3>
                  <span className="muted small">
                    #{o.id.slice(-4).toUpperCase()} · {new Date(o.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <select
                  className={`status status-${o.status.toLowerCase()}`}
                  value={o.status}
                  onChange={(e) => onEdit(o.id, { status: e.target.value })}
                  aria-label="Order status"
                >
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <ul className="lines">
                {o.items.map((l, i) => {
                  const m = menu.find((x) => x.id === l.menuId);
                  return (
                    <li key={i}>
                      <span>{l.qty} × {m ? m.name : <em>Removed item</em>}</span>
                      <span>{peso((m?.price || 0) * l.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              {o.note && <p className="note">“{o.note}”</p>}
              <div className="order-foot">
                <b>{peso(orderTotal(o, menu))}</b>
                <div>
                  <button className="btn btn-sm btn-ghost" onClick={() => setEditing(o)}>Edit</button>
                  <button className="btn btn-sm btn-danger-ghost" onClick={() => setDeleting(o)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty"><p>No {filter === 'All' ? '' : filter.toLowerCase() + ' '}orders yet.</p></div>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'New order' : 'Edit order'} onClose={() => setEditing(null)}>
          <OrderForm initial={editing === 'new' ? null : editing} menu={menu} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete order?"
          message={`Order for ${deleting.customer} will be permanently removed.`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => { await onDelete(deleting.id); setDeleting(null); }}
        />
      )}
    </section>
  );
}
