import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function Signup({ user, onSignup }) {
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '', form: '' })); };

  if (user) return <Navigate to="/menu" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Your name is required';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim())) err.username = '3-20 letters, numbers or _';
    if (form.password.length < 6) err.password = 'At least 6 characters';
    if (form.confirm !== form.password) err.confirm = 'Passwords do not match';
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      await onSignup({ name: form.name, username: form.username, password: form.password });
    } catch (ex) {
      setErrors({ form: ex.message });
      setBusy(false);
    }
  };

  return (
    <section className="container page auth-wrap">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <div className="auth-logo" aria-hidden="true">☕</div>
        <h1>Create account</h1>
        <p className="muted">Sign up to order from McJoe.</p>

        <label>
          Your name
          <input value={form.name} onChange={(e) => set('name', e.target.value)} autoFocus autoComplete="name" />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Username
          <input value={form.username} onChange={(e) => set('username', e.target.value)} autoComplete="username" />
          {errors.username && <span className="error">{errors.username}</span>}
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} autoComplete="new-password" />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <label>
          Confirm password
          <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} autoComplete="new-password" />
          {errors.confirm && <span className="error">{errors.confirm}</span>}
        </label>

        {errors.form && <span className="error auth-error">{errors.form}</span>}
        <button type="submit" className="btn btn-primary auth-btn" disabled={busy}>Sign up</button>

        <p className="muted small auth-switch">
          Already have an account? <Link className="link" to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}