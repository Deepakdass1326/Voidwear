import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #f7f7f5; color: #111; }

/* ── Navbar ── */
.os-nav { position: sticky; top: 0; z-index: 100; background: rgba(247,247,245,0.95); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; border-bottom: 1px solid rgba(0,0,0,0.07); }
.os-nav-logo { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.4rem; letter-spacing: 0.1em; color: #111; cursor: pointer; text-transform: uppercase; }
.os-btn-pill { background: #111; color: #fff; border: none; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.os-btn-pill:hover { background: #333; }
.os-btn-pill-outline { background: transparent; color: #111; border: 1px solid #111; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.os-btn-pill-outline:hover { background: #111; color: #fff; }

/* ── Page ── */
.os-page { min-height: 100vh; background: #f7f7f5; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }

/* ── Card ── */
.os-card { background: #fff; border-radius: 24px; border: 1px solid rgba(0,0,0,0.06); padding: 56px 48px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.06); animation: os-fadeup 0.5s ease both; }
@keyframes os-fadeup { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

/* ── Check Icon ── */
.os-check-wrap { width: 80px; height: 80px; border-radius: 50%; background: #111; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; animation: os-popin 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes os-popin { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.os-check-icon { width: 36px; height: 36px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.os-check-path { stroke-dasharray: 50; stroke-dashoffset: 50; animation: os-draw 0.5s 0.35s ease forwards; }
@keyframes os-draw { to { stroke-dashoffset: 0; } }

/* ── Text ── */
.os-title { font-family: 'Oswald', sans-serif; font-size: 2rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 12px; }
.os-sub { font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 32px; }

/* ── Order ID Chip ── */
.os-id-wrap { background: #f7f7f5; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; text-align: left; }
.os-id-label { font-size: 11px; font-weight: 600; color: #888; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
.os-id-value { font-size: 13px; font-weight: 600; color: #111; font-family: 'Inter', monospace; word-break: break-all; }

/* ── Divider ── */
.os-divider { border: none; border-top: 1px solid #eee; margin: 0 0 32px; }

/* ── Actions ── */
.os-actions { display: flex; flex-direction: column; gap: 12px; }
.os-btn-full { width: 100%; padding: 15px; border-radius: 100px; font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: 0.04em; transition: all 0.2s; border: none; }
.os-btn-primary { background: #111; color: #fff; }
.os-btn-primary:hover { background: #333; }
.os-btn-secondary { background: transparent; color: #111; border: 1px solid #ddd !important; }
.os-btn-secondary:hover { border-color: #111 !important; }

/* ── Steps ── */
.os-steps { display: flex; align-items: flex-start; justify-content: center; gap: 0; margin-bottom: 32px; }
.os-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; position: relative; }
.os-step:not(:last-child)::after { content: ''; position: absolute; top: 11px; left: calc(50% + 12px); right: calc(-50% + 12px); height: 1px; background: #111; }
.os-step-dot { width: 22px; height: 22px; border-radius: 50%; background: #111; display: flex; align-items: center; justify-content: center; z-index: 1; }
.os-step-dot span { font-size: 10px; color: #fff; font-weight: 700; }
.os-step-label { font-size: 10px; font-weight: 500; color: #888; text-align: center; line-height: 1.3; }
.os-step-label.active { color: #111; font-weight: 600; }

@media (max-width: 560px) {
  .os-card { padding: 40px 24px; }
  .os-title { font-size: 1.6rem; }
}
`;

export default function OrderSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // tiny delay so animation triggers after mount
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <style>{css}</style>

            {/* Navbar */}
            <nav className="os-nav">
                <span className="os-nav-logo" onClick={() => navigate('/')}>Voidwear</span>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="os-btn-pill-outline" onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            </nav>

            <div className="os-page">
                <div className="os-card">

                    {/* Animated check */}
                    <div className="os-check-wrap">
                        <svg className="os-check-icon" viewBox="0 0 24 24">
                            <path className="os-check-path" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="os-title">Order Confirmed!</h1>
                    <p className="os-sub">
                        Thank you for shopping with Voidwear. Your order has been placed
                        and is being prepared with care.
                    </p>

                    {/* Order ID */}
                    {orderId && (
                        <div className="os-id-wrap">
                            <div className="os-id-label">Order ID</div>
                            <div className="os-id-value">{orderId}</div>
                        </div>
                    )}

                    {/* Progress steps */}
                    <div className="os-steps">
                        {[
                            { label: 'Confirmed', num: '✓' },
                            { label: 'Processing', num: '2' },
                            { label: 'Shipped', num: '3' },
                            { label: 'Delivered', num: '4' },
                        ].map((step, i) => (
                            <div className="os-step" key={i}>
                                <div className="os-step-dot"><span>{step.num}</span></div>
                                <div className={`os-step-label${i === 0 ? ' active' : ''}`}>{step.label}</div>
                            </div>
                        ))}
                    </div>

                    <hr className="os-divider" />

                    {/* Actions */}
                    <div className="os-actions">
                        <button
                            id="continue-shopping-btn"
                            className="os-btn-full os-btn-primary"
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping →
                        </button>
                        <button
                            id="view-orders-btn"
                            className="os-btn-full os-btn-secondary"
                            style={{ border: '1px solid #ddd' }}
                            onClick={() => navigate('/orders')}
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}