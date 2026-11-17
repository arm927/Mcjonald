import { Link } from 'react-router-dom';
import MenuCard from '../components/MenuCard.jsx';

export default function Home({ menu, orders }) {
  const featured = menu.filter((m) => m.featured && m.available).slice(0, 3);
  const open = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">Small batch · Big heart</p>
            <h1>Good coffee,<br />good company.</h1>
            <p className="lead">
              McJoe is the neighborhood spot for slow mornings, long chats and a cup that’s made right.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary">See the menu</Link>
              <Link to="/orders" className="btn btn-light">Take an order</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="cup">☕</div>
            <div className="steam s1" /><div className="steam s2" /><div className="steam s3" />
          </div>
        </div>
      </section>

      <section className="container stats">
        <div className="stat"><b>{menu.length}</b><span>Items on the menu</span></div>
        <div className="stat"><b>{menu.filter((m) => m.available).length}</b><span>Available today</span></div>
        <div className="stat"><b>{open}</b><span>Open orders</span></div>
      </section>

      <section className="container page">
        <div className="section-head">
          <h2>Customer favorites</h2>
          <Link to="/menu" className="link">View full menu →</Link>
        </div>
        {featured.length ? (
          <div className="grid">{featured.map((m) => <MenuCard key={m.id} item={m} />)}</div>
        ) : (
          <p className="muted">No featured items yet. Mark an item as a favorite in Manage Menu.</p>
        )}
      </section>
    </>
  );
}
