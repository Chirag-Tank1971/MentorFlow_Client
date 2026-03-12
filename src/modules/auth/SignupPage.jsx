import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../shared/apiClient';

const ROLES = ['PARENT', 'MENTOR'];

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PARENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/signup', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout fade-in">
      <div className="auth-card card">
        <p className="pill pill-soft">Create account</p>
        <h2>Join MentorFlow</h2>
        <p className="auth-subtitle">
          Choose whether you&apos;re a parent or mentor and we&apos;ll tailor the experience for
          you.
        </p>
        <form onSubmit={handleSubmit} className="form auth-form">
          <label>
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Alex Sharma"
            />
          </label>
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
              placeholder="Create a secure password"
            />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r === 'PARENT' ? 'Parent' : 'Mentor'}
                </option>
              ))}
            </select>
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in
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
          <h3>Three roles, one platform</h3>
          <p>
            Parents create students and book lessons. Mentors design sessions and capture rich notes
            that AI turns into parent-ready summaries.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

