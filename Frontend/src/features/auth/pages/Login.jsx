import React, { useState } from 'react';
import bannerImage from '../../../assets/register_banner.webp';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Already logged in → redirect away
    if (!loading && user) {
        return <Navigate to={user.role === 'seller' ? '/seller/products' : '/'} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const user = await handleLogin({ email: formData.email, password: formData.password });
            if (user?.role === 'seller') {
                navigate('/seller/products', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid email or password.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-['Inter']">

            {/* Left Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black">
                <img src={bannerImage} alt="Voidwear Banner" className="object-cover w-full h-full" />
                {/* Logo overlay */}
                <div className="absolute inset-0 flex items-end p-10">
                    <span
                        onClick={() => navigate('/')}
                        className="font-['Oswald'] font-bold text-white text-4xl tracking-widest uppercase cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity"
                    >
                        VOIDWEAR
                    </span>
                </div>
            </div>

            {/* Right Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">

                    {/* Mobile logo + back link */}
                    <div className="flex items-center justify-between lg:hidden">
                        <span
                            onClick={() => navigate('/')}
                            className="font-['Oswald'] font-bold text-2xl tracking-widest uppercase cursor-pointer select-none"
                        >
                            VOIDWEAR
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-xs text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            ← Back to shop
                        </button>
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="mt-1 sm:mt-2 text-sm text-gray-500">Sign in to your Voidwear account.</p>
                    </div>

                    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-gray-50 px-2 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        {/* Google */}
                        <a
                            href="http://localhost:5000/api/auth/google"
                            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-transform active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </a>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`flex w-full justify-center rounded-md border border-transparent bg-black py-2.5 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all active:scale-[0.98] ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800 cursor-pointer'}`}
                            >
                                {submitting ? 'Signing in…' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-600 pt-2">
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            className="font-semibold text-black hover:underline cursor-pointer"
                        >
                            Sign up
                        </span>
                    </p>

                    {/* Desktop back to shop link */}
                    <p className="hidden lg:block text-center text-xs text-gray-400">
                        <span
                            onClick={() => navigate('/')}
                            className="hover:text-gray-700 cursor-pointer transition-colors"
                        >
                            ← Continue browsing without signing in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;