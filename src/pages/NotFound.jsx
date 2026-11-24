import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container page">
      <div className="empty">
        <h2>Page not found</h2>
        <p>That page doesn’t exist.</p>
        <Link className="btn btn-primary" to="/">Go home</Link>
      </div>
    </section>
  );
}