import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

const SONG_CACHE_KEY = 'worship-song-library-songs';

export function useSongs(userId) {
  const [songs, setSongs] = useState([]);
  const [sheetsBySongId, setSheetsBySongId] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSongs([]);
      setSheetsBySongId({});
      setLoading(false);
      return undefined;
    }

    const songsQuery = query(
      collection(db, 'songs'),
      where('userId', '==', userId),
      orderBy('title', 'asc')
    );

    const unsubscribeSongs = onSnapshot(
      songsQuery,
      (snapshot) => {
        const nextSongs = snapshot.docs.map((songDoc) => ({ id: songDoc.id, ...songDoc.data() }));
        setSongs(nextSongs);
        localStorage.setItem(SONG_CACHE_KEY, JSON.stringify(nextSongs));
        setLoading(false);
      },
      () => {
        const cached = localStorage.getItem(SONG_CACHE_KEY);
        setSongs(cached ? JSON.parse(cached) : []);
        setLoading(false);
      }
    );

    const sheetsQuery = query(collection(db, 'chordSheets'), orderBy('uploadedAt', 'desc'));
    const unsubscribeSheets = onSnapshot(
      sheetsQuery,
      (snapshot) => {
        const grouped = {};
        snapshot.docs.forEach((sheetDoc) => {
          const sheet = { id: sheetDoc.id, ...sheetDoc.data() };
          if (!grouped[sheet.songId]) {
            grouped[sheet.songId] = [];
          }
          grouped[sheet.songId].push(sheet);
        });
        setSheetsBySongId(grouped);
      },
      () => setSheetsBySongId({})
    );

    return () => {
      unsubscribeSongs();
      unsubscribeSheets();
    };
  }, [userId]);

  const songsWithSheets = useMemo(
    () => songs.map((song) => ({ ...song, sheets: sheetsBySongId[song.id] || [] })),
    [songs, sheetsBySongId]
  );

  const addSongWithSheet = async ({ title, artist, key, file }) => {
    if (!userId || !file) {
      return;
    }

    const normalizedTitle = title.trim();
    const normalizedArtist = artist.trim();
    const existingSong = songs.find(
      (song) =>
        song.title.toLowerCase() === normalizedTitle.toLowerCase() &&
        (song.artist || '').toLowerCase() === normalizedArtist.toLowerCase()
    );

    let songId;
    if (existingSong) {
      songId = existingSong.id;
      await updateDoc(doc(db, 'songs', songId), {
        updatedAt: serverTimestamp()
      });
    } else {
      const songDocRef = await addDoc(collection(db, 'songs'), {
        userId,
        title: normalizedTitle,
        artist: normalizedArtist,
        createdAt: serverTimestamp()
      });
      songId = songDocRef.id;
    }

    const fileRef = ref(storage, `chord-sheets/${userId}/${songId}/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const pdfUrl = await getDownloadURL(fileRef);

    await addDoc(collection(db, 'chordSheets'), {
      songId,
      key,
      pdfUrl,
      uploadedAt: serverTimestamp()
    });
  };

  const getSongById = async (songId) => {
    const existing = songsWithSheets.find((song) => song.id === songId);
    if (existing) {
      return existing;
    }

    const songRef = doc(db, 'songs', songId);
    const snap = await getDoc(songRef);
    if (!snap.exists()) {
      return null;
    }

    return { id: snap.id, ...snap.data(), sheets: sheetsBySongId[songId] || [] };
  };

  return { songs: songsWithSheets, loading, addSongWithSheet, getSongById };
}
