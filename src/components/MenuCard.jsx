import { useRef } from 'react';
import { CATEGORY_ICONS } from '../data/seed.js';

export const peso = (n) => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;

export default function MenuCard({ item, onSelect }) {
  const ref = useRef(null);
  const clickable = item.available && onSelect;
  const open = () => onSelect(item);

  const tilt = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * 14}deg`);
    el.style.setProperty('--rx', `${-y * 14}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      ref={ref}
      className={`card menu-card cat-${item.category.replace(/\W/g, '').toLowerCase()} ${item.available ? '' : 'sold-out'} ${clickable ? 'clickable' : ''}`}
      onClick={clickable ? open : undefined}
      onMouseMove={clickable ? tilt : undefined}
      onMouseLeave={clickable ? reset : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } } : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="card-art" aria-hidden="true">
        <span className="art-icon">{CATEGORY_ICONS[item.category] || '☕'}</span>
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3>{item.name}</h3>
          <span className="price">{peso(item.price)}</span>
        </div>
        <p>{item.description}</p>
        <div className="tags">
          <span className="tag">{item.category}</span>
          {item.featured && <span className="tag tag-gold">★ Favorite</span>}
          {!item.available && <span className="tag tag-red">Sold out</span>}
        </div>
        {clickable && <div className="card-cta">Tap to order →</div>}
      </div>
    </article>
  );
}