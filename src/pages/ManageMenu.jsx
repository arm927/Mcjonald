import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { peso } from '../components/MenuCard.jsx';
import { CATEGORIES } from '../data/seed.js';

const blank = { name: '', category: CATEGORIES[0], price: '', description: '', available: true, featured: false };

function MenuForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...blank, ...initial });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (form.price === '' || Number(form.price) <= 0) err.price = 'Enter a price above 0';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSubmit({ ...form, name: form.name.trim(), description: form.description.trim(), price: Number(form.price) });
  };

  return (
    <form onSubmit={submit} noValidate>
      <label>
        Item name
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Caramel Macchiato" autoFocus />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>
      <div className="row">
        <label>
          Category
          <select value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Price (₱)
          <input type="number" min="0" step="1" value={form.price} onChange={(e) => set('price', e.target.value)} />
          {errors.price && <span className="error">{errors.price}</span>}
        </label>
      </div>
      <label>
        Description
        <textarea rows="3" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="A short, tasty description" />
      </label>
      <div className="checks">
        <label className="check"><input type="checkbox" checked={form.available} onChange={(e) => set('available', e.target.checked)} /> Available today</label>
        <label className="check"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Customer favorite</label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initial ? 'Save changes' : 'Add item'}</button>
      </div>
    </form>
  );
}

export default function ManageMenu({ menu, onAdd, onEdit, onDelete }) {
  const [editing, setEditing] = useState(null); 
  const [deleting, setDeleting] = useState(null);
  const [q, setQ] = useState('');

  const rows = menu.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()));

  const save = async (data) => {
    if (editing === 'new') await onAdd(data);
    else await onEdit(editing.id, data);
    setEditing(null);
  };

  return (
    <section className="container page">
      <div className="section-head">
        <div>
          <h1>Manage Menu</h1>
          <p className="muted">Add, edit or remove what McJoe serves.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>+ Add item</button>
      </div>

      <div className="toolbar">
        <input type="search" placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search items" />
        <span className="muted">{rows.length} item{rows.length !== 1 && 's'}</span>
      </div>

      {rows.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Item</th><th>Category</th><th className="num">Price</th><th>Status</th><th className="actions-col">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td data-label="Item">
                    <b>{m.name}</b>
                    <div className="muted small">{m.description}</div>
                  </td>
                  <td data-label="Category">{m.category}</td>
                  <td data-label="Price" className="num">{peso(m.price)}</td>
                  <td data-label="Status">
                    <span className={`tag ${m.available ? 'tag-green' : 'tag-red'}`}>{m.available ? 'Available' : 'Sold out'}</span>
                    {m.featured && <span className="tag tag-gold">★</span>}
                  </td>
                  <td className="actions-col">
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditing(m)}>Edit</button>
                    <button className="btn btn-sm btn-danger-ghost" onClick={() => setDeleting(m)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty"><p>No items found. Add your first drink or bite!</p></div>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Add menu item' : 'Edit menu item'} onClose={() => setEditing(null)}>
          <MenuForm initial={editing === 'new' ? null : editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete menu item?"
          message={`“${deleting.name}” will be removed from the menu. This can’t be undone.`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => { await onDelete(deleting.id); setDeleting(null); }}
        />
      )}
    </section>
  );
}
