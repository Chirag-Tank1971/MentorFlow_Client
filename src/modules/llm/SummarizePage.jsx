import { useState } from 'react';
import apiClient from '../../shared/apiClient';

function SummarizePage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [model, setModel] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSummary('');
    setModel('');
    setLoading(true);
    try {
      const res = await apiClient.post('/llm/summarize', { text });
      setSummary(res.data.summary);
      setModel(res.data.model);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Summarize Notes</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Text to summarize
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            required
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div className="summary-box">
          <h3>Summary</h3>
          <p>{summary}</p>
          {model && <small>Model: {model}</small>}
        </div>
      )}
    </div>
  );
}

export default SummarizePage;

