import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

export default function Login({ user, onLogin }) {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isStaff = user && user.role !== 'Customer';
  const from = location.state?.from || (isStaff ? '/orders' : '/menu');
  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return setError('Enter your username and password');
    const ok = await onLogin(username, password);
    if (!ok) setError('Wrong username or password');
  };

  return (
    <section className="container page auth-wrap">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <div className="auth-logo" aria-hidden="true">☕</div>
        <h1>Welcome back</h1>
        <p className="muted">Log in to your McJoe account.</p>

        <label>
          Username
          <input value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} autoFocus autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} autoComplete="current-password" />
        </label>

        {error && <span className="error auth-error">{error}</span>}
        <button type="submit" className="btn btn-primary auth-btn">Log in</button>

        <p className="muted small auth-switch">
          No account yet? <Link className="link" to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  );
}