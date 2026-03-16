import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import { useAuth } from '../hooks/useAuth';
import { useSongs } from '../hooks/useSongs';

export default function SongLibraryPage() {
  const { user } = useAuth();
  const { songs, loading } = useSongs(user?.uid);
  const [query, setQuery] = useState('');

  const sortedFilteredSongs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...songs]
      .filter((song) => {
        if (!normalized) {
          return true;
        }

        return (
          song.title.toLowerCase().includes(normalized) ||
          (song.artist || '').toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [songs, query]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Song Library</h1>
      <SearchBar value={query} onChange={setQuery} placeholder="Filter songs alphabetically" />
      {loading ? <p>Loading songs...</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {sortedFilteredSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
      {!loading && !sortedFilteredSongs.length ? (
        <p className="text-sm text-slate-500">No matching songs found.</p>
      ) : null}
    </div>
  );
}
