import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND_ASSETS } from '../data/categories';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithEmail } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle('customer');
      navigate('/dashboard/customer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard/customer');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('operation-not-allowed')) {
        setError(
          'Email/Password sign-in is not enabled in the Firebase Console yet. Please sign in with Google above, or enable Email/Password under Authentication > Sign-in method in your Firebase Console.'
        );
      } else {
        setError('Invalid email or password. Please try again or use Google Sign-In.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <img
            src={BRAND_ASSETS.logo}
            alt="TailsHug"
            referrerPolicy="no-referrer"
            className="h-10 w-auto mx-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-stone-900 pt-2">Welcome Back to TailsHug</h1>
          <p className="text-xs text-stone-500">
            Sign in to manage your pets, appointments, and provider listings
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#18181B] hover:bg-stone-800 text-white text-sm font-semibold transition-colors"
        >
          Continue with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-stone-200" />
          <span className="shrink mx-3 text-xs text-stone-400">or sign in with email</span>
          <div className="grow border-t border-stone-200" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#F69E40] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-stone-600">
          New to TailsHug?{' '}
          <Link to="/signup" className="text-[#F69E40] font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, registerWithEmail } = useApp();

  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(role);
      navigate(role === 'provider' ? '/become-a-provider' : '/dashboard/customer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerWithEmail(name, email, password, role);
      navigate(role === 'provider' ? '/become-a-provider' : '/dashboard/customer');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('operation-not-allowed')) {
        setError(
          'Email/Password registration is not enabled in the Firebase Console yet. Please click "Sign Up with Google" above, or enable Email/Password under Authentication > Sign-in method in the Firebase Console.'
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <img
            src={BRAND_ASSETS.logo}
            alt="TailsHug"
            referrerPolicy="no-referrer"
            className="h-10 w-auto mx-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-stone-900 pt-2">Create Your TailsHug Account</h1>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF7F2] rounded-xl border border-stone-200">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              role === 'customer' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            I am a Pet Parent
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              role === 'provider' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Service Provider
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#18181B] hover:bg-stone-800 text-white text-sm font-semibold transition-colors"
        >
          Sign Up with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-stone-200" />
          <span className="shrink mx-3 text-xs text-stone-400">or register with email</span>
          <div className="grow border-t border-stone-200" />
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password (min 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#F69E40] hover:bg-[#e58e35] text-white text-sm font-semibold transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F69E40] font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send password reset email.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-5">
        <h1 className="text-2xl font-bold text-stone-900">Reset Your Password</h1>
        <p className="text-xs text-stone-600">
          Enter your registered email address and we’ll send you a password recovery link.
        </p>
        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            Password reset instructions have been sent to {email}.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {error}
              </div>
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F69E40] text-white text-sm font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        )}
        <Link to="/login" className="block text-center text-xs text-[#F69E40] hover:underline">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};
