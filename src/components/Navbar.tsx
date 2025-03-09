import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogIn, LogOut, ClipboardList, ArrowLeft } from 'lucide-react';

function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showBackButton = location.pathname === '/executive';

  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            )}
            <div className="flex items-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              <Link to="/" className="ml-2 text-xl font-semibold text-gray-900">
                EBR Daily Updates
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'ceo' || user.role === 'senior') && (
                  <Link
                    to="/executive"
                    className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900"
                  >
                    Executive View
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900"
              >
                <LogIn className="w-5 h-5 mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;