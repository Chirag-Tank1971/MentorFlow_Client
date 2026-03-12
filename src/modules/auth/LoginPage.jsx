import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../shared/apiClient';
import { useAuth } from './AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      if (response.data.user.role === 'PARENT') {
        navigate('/parent');
      } else if (response.data.user.role === 'MENTOR') {
        navigate('/mentor');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout fade-in">
      <div className="auth-card card">
        <p className="pill pill-soft">Welcome back</p>
        <h2>Sign in to your space</h2>
        <p className="auth-subtitle">
          Access your parent or mentor dashboard, manage lessons, and stay in sync with students.
        </p>
        <form onSubmit={handleSubmit} className="form auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>
        <p className="auth-footer">
          New here?{' '}
          <Link to="/signup" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
      <div className="auth-side">
        <div className="auth-orbit">
          <div className="orbit-dot orbit-dot-lg" />
          <div className="orbit-dot orbit-dot-md" />
          <div className="orbit-dot orbit-dot-sm" />
        </div>
        <div className="auth-copy card">
          <h3>Designed for busy families</h3>
          <p>
            Parents see every booking and summary in one place, while mentors get a focused view of
            their lessons and sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

