import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function navClass({ isActive }) {
  return `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-teal-700">
            Worship Song Library
          </Link>
          <div className="flex items-center gap-2">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/songs" className={navClass}>
              Song Library
            </NavLink>
            <NavLink to="/add-song" className={navClass}>
              Add Song
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-600">Signed in as {user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Logout
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
