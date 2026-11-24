import { useMemo, useState } from 'react';
import MenuCard from '../components/MenuCard.jsx';
import { CATEGORIES } from '../data/seed.js';

export default function Menu({ menu, onSelect }) {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');

  const shown = useMemo(
    () =>
      menu.filter(
        (m) =>
          (cat === 'All' || m.category === cat) &&
          (m.name + ' ' + m.description).toLowerCase().includes(q.trim().toLowerCase())
      ),
    [menu, cat, q]
  );

  return (
    <section className="container page">
      <h1>Our Menu</h1>
      <p className="muted">Everything is made to order. Prices in Philippine pesos.</p>

      <div className="toolbar">
        <div className="chips" role="tablist">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search the menu…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search menu"
        />
      </div>

      {shown.length ? (
        <div className="grid">
          {shown.map((m) => <MenuCard key={m.id} item={m} onSelect={onSelect} />)}
        </div>
      ) : (
        <div className="empty"><p>Nothing matches your search.</p></div>
      )}
    </section>
  );
}
