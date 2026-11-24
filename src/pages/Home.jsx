import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import MenuCard from '../components/MenuCard.jsx';

export default function Home({ menu, orders, onSelect }) {
  const artRef = useRef(null);
  const featured = menu.filter((m) => m.featured && m.available).slice(0, 3);
  const open = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;

  useEffect(() => {
    const art = artRef.current;
    if (!art || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const find = (sel) => art.querySelectorAll(sel);

    const animations = [
      
      animate(find('.cup-pop'), {
        scale: [0.5, 1],
        opacity: [0, 1],
        rotate: [-20, 0],
        duration: 900,
        ease: 'outBack',
      }),
      
      animate(find('.cup'), {
        translateY: [0, -14],
        rotate: [-3, 3],
        duration: 2600,
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
    
      animate(find('.steam'), {
        translateY: [30, -40],
        scaleX: [1, 2],
        opacity: [{ to: 0.8, duration: 600 }, { to: 0, duration: 1400 }],
        duration: 2000,
        delay: stagger(700),
        loop: true,
        ease: 'outSine',
      }),
    ];

    return () => animations.forEach((a) => a.revert());
  }, []);

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
          <div className="hero-art" ref={artRef} aria-hidden="true">
            <div className="cup-pop"><div className="cup">☕</div></div>
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
          <div className="grid">{featured.map((m) => <MenuCard key={m.id} item={m} onSelect={onSelect} />)}</div>
        ) : (
          <p className="muted">No featured items yet. Mark an item as a favorite in Manage Menu.</p>
        )}
      </section>
    </>
  );
}