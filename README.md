# Worship Song Library

Worship Song Library is a Progressive Web App (PWA) for church musicians to manage worship songs and chord sheet PDFs by key. It includes Firebase Authentication, Firestore data storage, Firebase Storage file uploads, and offline-friendly behavior.

## Tech Stack

- React + Vite
- React Router
- Tailwind CSS
- Firebase Authentication
- Firestore Database
- Firebase Storage
- PWA support (manifest + service worker)

## 1) Install dependencies

```bash
npm install
```

## 2) Configure Firebase

1. Create a Firebase project.
2. Enable **Email/Password** in Authentication.
3. Create a Firestore database.
4. Enable Firebase Storage.
5. Update `src/firebase/firebaseConfig.js` if you want to use a different Firebase project.

### Firestore collections

The app uses these collections and fields:

- `users`
  - `userId`
  - `email`
  - `createdAt`
- `songs`
  - `userId`
  - `title`
  - `artist`
  - `createdAt`
- `chordSheets`
  - `songId`
  - `key`
  - `pdfUrl`
  - `uploadedAt`

## 3) Run development server

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## 4) Build the app (PWA-ready assets)

```bash
npm run build
```

Then preview production build:

```bash
npm run preview
```

## PWA behavior

- `public/manifest.json` enables install metadata for mobile/desktop.
- `public/sw.js` caches app shell and local pages for offline navigation.
- Song list data is cached in `localStorage` for fallback when Firestore is unreachable.

## Notes

- Add songs with title + optional artist + key + PDF.
- If a song with the same title and artist exists, uploading adds another key version instead of creating a duplicate song.
