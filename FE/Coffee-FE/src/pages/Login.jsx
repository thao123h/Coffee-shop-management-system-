import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { t } from "../i18n";

import { Coffee, Lock, User } from "lucide-react";
import { loginApi } from "../service/AuthService";
import { AuthContext } from "../lib/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  // Trim để tránh nhập toàn space
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  // Validate rỗngs
  if (!trimmedUsername || !trimmedPassword) {
    setError(t('pleaseEnterBoth'));
    return;
  }

  // Validate length
  if (trimmedUsername.length > 50) {
    setError("Username must be less than or equal to 50 characters");
    return;
  }

  if (trimmedPassword.length > 20) {
    setError("Password must be less than or equal to 20 characters");
    return;
  }

  // diagnostic log
  console.log("Login submit pressed", {
    username: trimmedUsername,
    password: trimmedPassword,
  });

  try {
    const user = await loginApi(trimmedUsername, trimmedPassword);
    console.log("loginApi response", user);

    login(user);

    if (user) {
      navigate("/dashboard");
    } else {
      setError(t('invalidCredentials'));
    }
  } catch (err) {
    console.error("Error calling loginApi", err);
    setError(
      err?.response?.data?.message || "Failed to call login API. Check console."
    );
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-lg mb-4">
            <Coffee size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('coffeePOS')}</h1>
          <p className="text-gray-600">{t('signInManage')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('username')}
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                  placeholder={t('enterYourUsername')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                  placeholder={t('enterYourPassword')}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
            >
              {t('signIn')}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {t('demoCredentials')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          © 2026 Hệ thống Coffee POS. Đã đăng ký bản quyền.
        </p>
      </div>
    </div>
  );
}
