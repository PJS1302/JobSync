import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password, role });
      const destination =
        location.state?.from?.pathname ||
        (res.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setRole('student');
    setEmail('alex.rivera@example.edu');
    setPassword('password123');
    setError(null);
  };

  const fillDemoAdmin = () => {
    setRole('admin');
    setEmail('admin@jobsync.edu');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-xl shadow-blue-500/25 mb-4 ring-1 ring-white/20">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          JobSync
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Campus Placement & AI Resume Screening Platform
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800/80 space-y-6">
          {/* Role Toggle Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>🎓</span>
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                role === 'admin'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>💼</span>
              <span>Placement Officer</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
              <span className="text-sm font-bold shrink-0">⚠️</span>
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {role === 'student' ? 'Student Email' : 'Officer Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={role === 'student' ? 'alex.rivera@example.edu' : 'admin@jobsync.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm placeholder-slate-500 transition-colors"
                />
                <span className="absolute right-3 top-3 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Password Field with "See Icon" Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setError('Contact campus placement coordinator for password resets.')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm placeholder-slate-500 transition-colors"
                />
                {/* Password See / Hide Icon Button */}
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 p-1 rounded-md text-slate-400 hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye slash icon (hide)
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Eye icon (show)
                    <svg className="w-5 h-5 text-slate-400 hover:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                Keep me signed in on this workstation
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className={`w-full font-bold shadow-lg ${
                  role === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 to-indigo-600 shadow-amber-500/25'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25'
                }`}
                loading={loading}
              >
                {loading ? 'Authenticating...' : `Sign in to ${role === 'admin' ? 'Officer Portal' : 'Student Portal'}`}
              </Button>
            </div>
          </form>

          {/* Demo 1-Click Credentials Strip */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 text-center mb-2.5 uppercase tracking-wider">
              Quick Test Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 font-semibold transition-all text-center flex flex-col items-center gap-0.5"
              >
                <span className="text-blue-400">🎓 Student Demo</span>
                <span className="text-[10px] text-slate-400">Alex Rivera</span>
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 font-semibold transition-all text-center flex flex-col items-center gap-0.5"
              >
                <span className="text-amber-400">💼 Officer Demo</span>
                <span className="text-[10px] text-slate-400">Dr. K. Raman</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Register candidate profile →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
