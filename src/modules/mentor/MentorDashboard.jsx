import { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';
import { useAuth } from '../auth/AuthContext';
import ConfirmModal from '../../shared/ConfirmModal';

function getDefaultDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function MentorDashboard() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(getDefaultDateTime);
  const [lessonForSession, setLessonForSession] = useState('');
  const [summary, setSummary] = useState('');
  const [sessions, setSessions] = useState([]);
  const [sessionsError, setSessionsError] = useState('');
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, session: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchLessons = async () => {
    try {
      const res = await apiClient.get('/lessons');
      setLessons(res.data.lessons || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load lessons');
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient.post('/lessons', {
        title,
        description,
        mentorId: user.id
      });
      setLessons((prev) => [res.data.lesson, ...prev]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lesson');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/sessions', {
        lessonId: lessonForSession,
        date,
        topic,
        summary
      });
      setTopic('');
      setDate(getDefaultDateTime());
      setSummary('');
      // Optionally refresh sessions list if viewing this lesson
      if (lessonForSession) {
        await handleLoadSessions(lessonForSession);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    }
  };

  const handleLoadSessions = async (lessonId) => {
    if (!lessonId) return;
    setSessionsError('');
    setSessionsLoading(true);
    try {
      const res = await apiClient.get(`/lessons/${lessonId}/sessions`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      setSessionsError(err.response?.data?.message || 'Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleDeleteSession = (session) => {
    setDeleteModal({ open: true, session });
  };

  const handleConfirmDeleteSession = async () => {
    if (!deleteModal.session) return;
    setDeleteLoading(true);
    try {
      await apiClient.delete(`/sessions/${deleteModal.session._id}`);
      setDeleteModal({ open: false, session: null });
      if (lessonForSession) {
        await handleLoadSessions(lessonForSession);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete session');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="layout-two-column">
      <div className="card">
        <h2>Create Lesson</h2>
        <form className="form" onSubmit={handleCreateLesson}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Create Lesson</button>
        </form>
      </div>
      <div className="card">
        <h2>Sessions</h2>
        <form className="form" onSubmit={handleCreateSession}>
          <label>
            Lesson
            <select
              value={lessonForSession}
              onChange={(e) => {
                const id = e.target.value;
                setLessonForSession(id);
                setSessions([]);
                if (id) {
                  handleLoadSessions(id);
                }
              }}
              required
            >
              <option value="">Select lesson</option>
              {lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            Topic
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required />
          </label>
          <label>
            Summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Create Session</button>
        </form>
        <div style={{ marginTop: '1.2rem' }}>
          <h3>Existing sessions</h3>
          {sessionsLoading ? (
            <p>Loading sessions...</p>
          ) : sessionsError ? (
            <div className="error">{sessionsError}</div>
          ) : sessions.length === 0 ? (
            <p>No sessions for this lesson yet.</p>
          ) : (
            <ul className="list">
              {sessions.map((s) => (
                <li key={s._id} className="list-item-row">
                  <span className="list-item-content">
                    <strong>{new Date(s.date).toLocaleString()}</strong> — {s.topic}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => handleDeleteSession(s)}
                    title="Delete session"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, session: null })}
        onConfirm={handleConfirmDeleteSession}
        title="Delete session?"
        message={
          deleteModal.session
            ? `Remove session "${deleteModal.session.topic}" (${new Date(deleteModal.session.date).toLocaleString()})?`
            : ''
        }
        confirmLabel={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmDisabled={deleteLoading}
      />
    </div>
  );
}

export default MentorDashboard;

