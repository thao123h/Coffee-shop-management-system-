import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { ShieldOff, ArrowLeft } from 'lucide-react';

function getDefaultPath(role) {
  switch (role) {
    case 'STAFF':  return '/dashboard/pos';
    case 'ADMIN':  return '/dashboard/admin/users';
    default:       return '/dashboard';
  }
}

export default function Unauthorized() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(getDefaultPath(user?.role));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
            <ShieldOff size={48} className="text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-3">403</h1>
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Không có quyền truy cập
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Bạn không có quyền truy cập trang này.{' '}
          {user && (
            <span>
              Tài khoản của bạn có role{' '}
              <span className="font-semibold text-amber-400">{user.role}</span>.
            </span>
          )}
        </p>

        {/* Role badge */}
        {user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-full text-sm text-gray-300 mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            Đăng nhập với tư cách: <span className="font-semibold text-white">{user.username}</span>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30 active:scale-95"
        >
          <ArrowLeft size={18} />
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
