import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStored = localStorage.getItem('user');

  let username = 'User';
  try {
    if (userStored) {
      const parsed = JSON.parse(userStored);
      username = parsed.username || parsed.name || 'User';
    }
  } catch (e) {
    username = 'User';
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 py-3.5 px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-[#1a62ff] text-white font-black text-base w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
          E
        </div>
        <span className="text-lg font-black text-slate-800 tracking-tight">EstateHub</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-xs font-bold text-slate-600">
        <Link to="/properties" className="hover:text-blue-600 transition">
          Properties
        </Link>

        {token ? (
          <>
            <Link to="/add-property" className="hover:text-blue-600 transition">
              + Add Property
            </Link>
            <Link to="/messages" className="hover:text-blue-600 transition flex items-center gap-1">
              💬 Inbox
            </Link>
            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold">
              👤 {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 transition">
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-[#1a62ff] hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;