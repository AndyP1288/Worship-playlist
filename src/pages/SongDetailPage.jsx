import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSongs } from '../hooks/useSongs';

export default function SongDetailPage() {
  const { songId } = useParams();
  const { user } = useAuth();
  const { getSongById } = useSongs(user?.uid);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadSong = async () => {
      const loadedSong = await getSongById(songId);
      if (mounted) {
        setSong(loadedSong);
        setLoading(false);
      }
    };

    loadSong();
    return () => {
      mounted = false;
    };
  }, [songId, getSongById]);

  const keys = useMemo(() => {
    if (!song) {
      return [];
    }
    return [...new Set(song.sheets.map((sheet) => sheet.key))].sort();
  }, [song]);

  const printSheet = (pdfUrl) => {
    const printWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (loading) {
    return <p>Loading song details...</p>;
  }

  if (!song) {
    return (
      <div>
        <p>Song not found.</p>
        <Link to="/songs" className="text-teal-700 underline">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-xl bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold">{song.title}</h1>
      <p className="text-slate-600">Artist: {song.artist || 'Unknown Artist'}</p>
      <p className="text-slate-700">Keys available: {keys.join(', ') || 'None yet'}</p>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Chord Sheet PDFs</h2>
        <div className="space-y-3">
          {song.sheets.map((sheet) => (
            <article key={sheet.id} className="rounded-md border border-slate-200 p-3">
              <p className="mb-2 text-sm font-semibold">Key: {sheet.key}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={sheet.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  View PDF
                </a>
                <a
                  href={sheet.pdfUrl}
                  download
                  className="rounded bg-slate-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Download PDF
                </a>
                <button
                  type="button"
                  onClick={() => printSheet(sheet.pdfUrl)}
                  className="rounded bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Print PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Link to="/add-song" className="inline-block rounded bg-teal-700 px-4 py-2 text-white">
        Add another key version
      </Link>
    </div>
  );
}
