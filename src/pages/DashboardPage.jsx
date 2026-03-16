import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import { useAuth } from '../hooks/useAuth';
import { useSongs } from '../hooks/useSongs';

export default function DashboardPage() {
  const { user } = useAuth();
  const { songs, loading } = useSongs(user?.uid);
  const [query, setQuery] = useState('');

  const filteredSongs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return songs;
    }

    return songs.filter((song) => {
      const artist = (song.artist || '').toLowerCase();
      return song.title.toLowerCase().includes(normalized) || artist.includes(normalized);
    });
  }, [songs, query]);

  const recentSongs = useMemo(() => [...songs].slice(0, 5), [songs]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Dashboard</h2>
        <SearchBar value={query} onChange={setQuery} placeholder="Search songs by title or artist" />
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">Recently used songs</h3>
        {recentSongs.length ? (
          <ul className="space-y-2">
            {recentSongs.map((song) => (
              <li key={song.id} className="rounded-md border border-slate-200 px-3 py-2">
                {song.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No songs yet. Add your first song.</p>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Song list</h3>
        {loading ? <p>Loading songs...</p> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
}
