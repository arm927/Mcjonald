import { useState } from 'react';
import Modal from './Modal.jsx';
import { peso } from './MenuCard.jsx';
import { CATEGORY_ICONS, SIZES, SIZED_CATEGORIES, ADDONS } from '../data/seed.js';

export default function ItemModal({ item, onClose, onAdd }) {
  const hasSizes = SIZED_CATEGORIES.includes(item.category);
  const addonList = ADDONS[item.category] || [];

  const [size, setSize] = useState(hasSizes ? SIZES[0].name : '');
  const [addons, setAddons] = useState([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const sizeExtra = hasSizes ? SIZES.find((s) => s.name === size).extra : 0;
  const addonExtra = addonList.filter((a) => addons.includes(a.name)).reduce((s, a) => s + a.price, 0);
  const unitPrice = Number(item.price) + sizeExtra + addonExtra;

  const toggleAddon = (name) =>
    setAddons((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]));

  const submit = (e) => {
    e.preventDefault();
    onAdd({ menuId: item.id, size, addons, qty, note: note.trim(), price: unitPrice });
  };

  return (
    <Modal title={item.name} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="item-hero" aria-hidden="true">{CATEGORY_ICONS[item.category] || '☕'}</div>
        <p className="muted">{item.description}</p>

        {hasSizes && (
          <fieldset>
            <legend>Size</legend>
            <div className="chips">
              {SIZES.map((s) => (
                <button
                  type="button"
                  key={s.name}
                  className={`chip ${size === s.name ? 'active' : ''}`}
                  onClick={() => setSize(s.name)}
                >
                  {s.name}{s.extra ? ` +${peso(s.extra)}` : ''}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {addonList.length > 0 && (
          <fieldset>
            <legend>Add-ons</legend>
            {addonList.map((a) => (
              <label className="check addon" key={a.name}>
                <input type="checkbox" checked={addons.includes(a.name)} onChange={() => toggleAddon(a.name)} />
                {a.name}
                <span className="muted">{a.price ? `+${peso(a.price)}` : 'free'}</span>
              </label>
            ))}
          </fieldset>
        )}

        <label>
          Special instructions (optional)
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. less ice, no sugar" />
        </label>

        <div className="qty-row">
          <span>Quantity</span>
          <div className="quantity-control">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
          </div>
        </div>

        <div className="total-bar"><span>Total</span><b>{peso(unitPrice * qty)}</b></div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Add to cart</button>
        </div>
      </form>
    </Modal>
  );
}