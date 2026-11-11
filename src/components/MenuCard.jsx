import { CATEGORY_ICONS } from '../data/seed.js';

export const peso = (n) => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;

export default function MenuCard({ item }) {
  return (
    <article className={`card menu-card cat-${item.category.replace(/\W/g, '').toLowerCase()} ${item.available ? '' : 'sold-out'}`}>
      <div className="card-art" aria-hidden="true">{CATEGORY_ICONS[item.category] || '☕'}</div>
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
      </div>
    </article>
  );
}
