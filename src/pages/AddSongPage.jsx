import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSongs } from '../hooks/useSongs';

const musicalKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function AddSongPage() {
  const { user } = useAuth();
  const { addSongWithSheet } = useSongs(user?.uid);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [songKey, setSongKey] = useState('C');
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pdfFile) {
      setError('Please upload a PDF chord sheet.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await addSongWithSheet({ title, artist, key: songKey, file: pdfFile });
      navigate('/songs');
    } catch (submitError) {
      setError(submitError.message || 'Could not save the song.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Add Song</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Song Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="artist" className="mb-1 block text-sm font-medium">
            Artist (optional)
          </label>
          <input
            id="artist"
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="key" className="mb-1 block text-sm font-medium">
            Key
          </label>
          <select
            id="key"
            value={songKey}
            onChange={(event) => setSongKey(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {musicalKeys.map((keyOption) => (
              <option key={keyOption} value={keyOption}>
                {keyOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pdf" className="mb-1 block text-sm font-medium">
            PDF Chord Sheet
          </label>
          <input
            id="pdf"
            type="file"
            required
            accept="application/pdf"
            onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Song'}
        </button>
      </form>
    </div>
  );
}
