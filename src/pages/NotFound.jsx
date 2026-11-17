import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container page empty">
      <h1>404</h1>
      <p>This page went cold. Let’s get you back to the counter.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </section>
  );
}
