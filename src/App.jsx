import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './modules/auth/AuthContext';
import LoginPage from './modules/auth/LoginPage';
import SignupPage from './modules/auth/SignupPage';
import ParentDashboard from './modules/parent/ParentDashboard';
import MentorDashboard from './modules/mentor/MentorDashboard';
import SummarizePage from './modules/llm/SummarizePage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <div className="logo-orb" />
          <div>
            <h1 className="app-title">MentorFlow</h1>
            <p className="app-subtitle">Parents, mentors, and students in sync.</p>
          </div>
        </div>
        <nav className="nav-links">
          <Link to="/">Overview</Link>
          {user?.role === 'PARENT' && <Link to="/parent">Parent space</Link>}
          {user?.role === 'MENTOR' && <Link to="/mentor">Mentor space</Link>}
          {user && <Link to="/summarize">Summarize notes</Link>}
        </nav>
        <div className="auth-info">
          {user ? (
            <>
              <span className="user-pill">
                <span className="user-avatar">{user.name?.[0] || '?'}</span>
                <span className="user-meta">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </span>
              </span>
              <button type="button" onClick={logout} className="btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <section className="hero fade-in">
              <div className="hero-grid">
                <div className="hero-copy">
                  <p className="pill pill-soft">Live mentorship workspace</p>
                  <h2>
                    Coordinate parents, mentors, and students
                    <span className="accent"> in one place.</span>
                  </h2>
                  <p className="hero-subtitle">
                    Track students, schedule lessons, and generate concise AI summaries of every
                    session so parents always stay in the loop.
                  </p>
                  <div className="hero-actions">
                    <Link to="/signup" className="btn-primary">
                      Create an account
                    </Link>
                    <Link to="/summarize" className="btn-ghost">
                      Try AI summarizer
                    </Link>
                  </div>
                  <div className="hero-metrics">
                    <div>
                      <span className="metric-value">3</span>
                      <span className="metric-label">Roles connected</span>
                    </div>
                    <div>
                      <span className="metric-value">120-word</span>
                      <span className="metric-label">Smart summaries</span>
                    </div>
                    <div>
                      <span className="metric-value">Zero</span>
                      <span className="metric-label">missed updates</span>
                    </div>
                  </div>
                </div>
                <div className="hero-panel">
                  <div className="card hero-card">
                    <h3>Next steps</h3>
                    <ul className="hero-list">
                      <li>Sign up as a parent or mentor.</li>
                      <li>Create students and lessons in your space.</li>
                      <li>Run a session and summarize the notes with AI.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={['MENTOR']}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summarize"
          element={
            <ProtectedRoute>
              <SummarizePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;

