import React, { useState } from 'react';
import bannerImage from '../../../assets/register_banner.webp';
import { useAuth } from '../hook/useAuth';
import { useNavigate, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

.auth-shell { display: flex; height: 100vh; overflow: hidden; background: #fff; font-family: 'Inter', sans-serif; }

/* ── Left Banner ── */
.auth-banner { display: none; position: relative; background: #000; flex: 1; }
.auth-banner img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(30%) brightness(0.85); }
.auth-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 48px; }
.auth-banner-logo { font-weight: 700; font-size: 2rem; letter-spacing: -0.05em; color: #fff; cursor: pointer; text-transform: lowercase; opacity: 0.95; transition: opacity 0.2s; }
.auth-banner-logo:hover { opacity: 1; }

/* ── Right Form Panel ── */
.auth-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; overflow-y: auto; }
.auth-form-wrap { width: 100%; max-width: 380px; }

/* ── Mobile header ── */
.auth-mobile-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px; }
.auth-mobile-logo { font-weight: 700; font-size: 1.4rem; letter-spacing: -0.05em; color: #000; cursor: pointer; text-transform: lowercase; }
.auth-back-btn { font-size: 11px; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 0.06em; background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: 'Inter', sans-serif; }
.auth-back-btn:hover { color: #000; }

/* ── Heading ── */
.auth-heading { margin-bottom: 36px; }
.auth-heading h1 { font-size: 1.75rem; font-weight: 500; color: #111; letter-spacing: -0.03em; margin-bottom: 6px; }
.auth-heading p { font-size: 14px; color: #888; }

/* ── Fields ── */
.auth-fields { display: flex; flex-direction: column; gap: 28px; margin-bottom: 32px; }
.auth-field { display: flex; flex-direction: column; gap: 0; border-bottom: 1px solid #e0e0e0; transition: border-color 0.2s; padding-bottom: 10px; }
.auth-field:focus-within { border-color: #111; }
.auth-field label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.auth-field input { border: none; outline: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 15px; color: #111; }
.auth-field input::placeholder { color: #ccc; }

/* ── Error ── */
.auth-error { font-size: 13px; color: #c0392b; background: #fef2f2; padding: 12px 16px; margin-bottom: 24px; border-left: 3px solid #c0392b; }

/* ── Submit button ── */
.auth-submit { width: 100%; background: #111; color: #fff; border: none; padding: 16px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; transition: background 0.2s; margin-bottom: 16px; }
.auth-submit:hover { background: #000; }
.auth-submit:disabled { background: #ccc; cursor: not-allowed; }

/* ── Divider ── */
.auth-divider { display: flex; align-items: center; gap: 16px; margin: 20px 0; }
.auth-divider-line { flex: 1; height: 1px; background: #eaeaea; }
.auth-divider span { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }

/* ── Google button ── */
.auth-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid #e0e0e0; background: #fff; padding: 13px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #111; text-decoration: none; cursor: pointer; transition: background 0.2s; }
.auth-google:hover { background: #f8f8f8; }

/* ── Footer links ── */
.auth-footer { margin-top: 32px; text-align: center; font-size: 13px; color: #888; }
.auth-footer a, .auth-footer span { color: #111; font-weight: 600; cursor: pointer; text-decoration: none; }
.auth-footer a:hover, .auth-footer span:hover { text-decoration: underline; }
.auth-return { display: block; margin-top: 16px; font-size: 11px; color: #bbb; text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer; transition: color 0.2s; }
.auth-return:hover { color: #555; }

/* ── Responsive ── */
@media (min-width: 1024px) {
  .auth-banner { display: flex; }
  .auth-mobile-header { display: none; }
}
`;

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
            navigate(user?.role === 'seller' ? '/seller/products' : '/', { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid email or password.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-shell">
            <style>{css}</style>

            {/* Left Banner */}
            <div className="auth-banner">
                <img src={bannerImage} alt="Voidwear" />
                <div className="auth-banner-overlay">
                    <span className="auth-banner-logo" onClick={() => navigate('/')}>voidwear.</span>
                </div>
            </div>

            {/* Right Form */}
            <div className="auth-panel">
                <div className="auth-form-wrap">

                    {/* Mobile Header */}
                    <div className="auth-mobile-header">
                        <span className="auth-mobile-logo" onClick={() => navigate('/')}>voidwear.</span>
                        <button className="auth-back-btn" onClick={() => navigate('/')}>← Shop</button>
                    </div>

                    <div className="auth-heading">
                        <h1>Welcome back</h1>
                        <p>Sign in to your Voidwear account.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="auth-fields">
                            <div className="auth-field">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-submit" disabled={submitting}>
                            {submitting ? 'Signing in…' : 'Sign In'}
                        </button>

                        <div className="auth-divider">
                            <div className="auth-divider-line" />
                            <span>Or</span>
                            <div className="auth-divider-line" />
                        </div>

                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`} className="auth-google">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </a>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/register')}>Sign up</span>
                    </div>
                    <span className="auth-return" onClick={() => navigate('/')}>← Continue browsing</span>
                </div>
            </div>
        </div>
    );
};

export default Login;