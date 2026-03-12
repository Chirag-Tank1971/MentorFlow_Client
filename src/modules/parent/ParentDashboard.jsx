import { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';
import ConfirmModal from '../../shared/ConfirmModal';

function ParentDashboard() {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, booking: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get('/students');
      setStudents(res.data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await apiClient.get('/lessons');
      setLessons(res.data.lessons || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load lessons');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchLessons();
    fetchBookings();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/students', { name, age: Number(age) });
      setName('');
      setAge('');
      await fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);
    try {
      await apiClient.post('/bookings', {
        studentId: selectedStudentId,
        lessonId: selectedLessonId
      });
      setBookingSuccess('Lesson booked for student.');
      await fetchBookings();
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDeleteBooking = (booking) => {
    setDeleteModal({ open: true, booking });
  };

  const handleConfirmDeleteBooking = async () => {
    if (!deleteModal.booking) return;
    setDeleteLoading(true);
    try {
      await apiClient.delete(`/bookings/${deleteModal.booking._id}`);
      setDeleteModal({ open: false, booking: null });
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="layout-two-column">
      <div className="card">
        <h2>Create Student</h2>
        <form className="form" onSubmit={handleCreateStudent}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Age
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={1}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
      <div className="card">
        <h2>My Students</h2>
        {students.length === 0 ? (
          <p>No students yet.</p>
        ) : (
          <ul className="list">
            {students.map((s) => (
              <li key={s._id}>
                {s.name} (age {s.age})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card">
        <h2>My Bookings</h2>
        <p className="card-subtitle">Which student is booked for which lesson</p>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul className="list">
            {bookings.map((b) => (
              <li key={b._id} className="list-item-row">
                <span className="list-item-content">
                  <strong>{b.student?.name}</strong> → {b.lesson?.title}
                </span>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => handleDeleteBooking(b)}
                  title="Cancel booking"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card">
        <h2>Book Lesson for Student</h2>
        {students.length === 0 || lessons.length === 0 ? (
          <p>Create at least one student and have at least one lesson available first.</p>
        ) : (
          <form className="form" onSubmit={handleCreateBooking}>
            <label>
              Student
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (age {s.age})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lesson
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
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
            {bookingError && <div className="error">{bookingError}</div>}
            {bookingSuccess && <div className="success">{bookingSuccess}</div>}
            <button type="submit" disabled={bookingLoading}>
              {bookingLoading ? 'Booking...' : 'Book lesson'}
            </button>
          </form>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, booking: null })}
        onConfirm={handleConfirmDeleteBooking}
        title="Cancel booking?"
        message={
          deleteModal.booking
            ? `Remove ${deleteModal.booking.student?.name} from ${deleteModal.booking.lesson?.title}?`
            : ''
        }
        confirmLabel={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmDisabled={deleteLoading}
      />
    </div>
  );
}

export default ParentDashboard;

