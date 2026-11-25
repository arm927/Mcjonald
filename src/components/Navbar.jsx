import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders', staff: true },
  { to: '/manage-menu', label: 'Manage Menu', staff: true },
];

export default function Navbar({ cartCount = 0, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const isStaff = user && user.role !== 'Customer';

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">☕</span>
          <span>
            McJoe<small>a cafe</small>
          </span>
        </Link>
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.filter((l) => !l.staff || isStaff).map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
              {l.label}
              {l.to === '/cart' && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          ))}
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button type="button" className="nav-logout" onClick={() => { close(); onLogout(); }}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Log in</NavLink>
              <NavLink to="/signup" onClick={close}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}