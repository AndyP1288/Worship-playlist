import { Link } from 'react-router-dom';

export default function SongCard({ song }) {
  const keys = [...new Set(song.sheets.map((sheet) => sheet.key))].sort();

  return (
    <Link
      to={`/songs/${song.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
    >
      <h3 className="text-lg font-semibold text-slate-900">{song.title}</h3>
      <p className="text-sm text-slate-500">{song.artist || 'Unknown Artist'}</p>
      <p className="mt-2 text-xs text-teal-700">Keys: {keys.length ? keys.join(', ') : 'None uploaded yet'}</p>
    </Link>
  );
}
