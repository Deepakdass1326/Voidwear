import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hook/usecart';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.orders-page {
    min-height: 100vh;
    background: #f7f7f5;
    font-family: 'Inter', sans-serif;
    color: #111;
    padding-bottom: 80px;
}

/* Navbar */
.orders-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 72px;
}
.orders-logo {
    font-weight: 700;
    font-size: 1.3rem;
    letter-spacing: -0.05em;
    color: #111;
    text-transform: lowercase;
    cursor: pointer;
}
.orders-nav-back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.orders-nav-back:hover {
    color: #111;
}

/* Main Container */
.orders-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 24px;
}

.orders-header {
    margin-bottom: 40px;
}
.orders-title {
    font-size: 2.2rem;
    font-weight: 600;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
}
.orders-subtitle {
    color: #666;
    font-size: 14px;
}

/* Order Card */
.order-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.order-card:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
    transform: translateY(-2px);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 20px;
    margin-bottom: 24px;
}

.order-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.order-id {
    font-size: 12px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.order-date {
    font-size: 15px;
    font-weight: 500;
    color: #111;
}

.order-status-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}
.order-total {
    font-size: 1.1rem;
    font-weight: 600;
    color: #111;
}
.status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.status-success {
    background: #dcfce7;
    color: #166534;
}
.status-pending {
    background: #fef08a;
    color: #854d0e;
}
.status-failed {
    background: #fee2e2;
    color: #991b1b;
}

/* Order Items */
.order-items {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.order-item {
    display: flex;
    gap: 20px;
    align-items: center;
}
.item-image {
    width: 80px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    background: #f4f4f4;
}
.item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.item-title {
    font-size: 15px;
    font-weight: 500;
    color: #111;
}
.item-meta {
    font-size: 13px;
    color: #666;
}
.item-price {
    font-size: 14px;
    font-weight: 600;
    color: #111;
    margin-top: 4px;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    background: #fff;
    border: 1px dashed #d1d5db;
    border-radius: 12px;
}
.empty-icon {
    width: 48px;
    height: 48px;
    color: #d1d5db;
    margin-bottom: 16px;
}
.empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
}
.empty-text {
    color: #666;
    font-size: 14px;
    margin-bottom: 24px;
}
.shop-btn {
    background: #111;
    color: #fff;
    border: none;
    padding: 12px 28px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
}
.shop-btn:hover {
    background: #333;
}

/* Loading */
.loader-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
}
.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #111;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 640px) {
    .orders-container { padding: 40px 16px; }
    .order-card { padding: 20px; }
    .order-header { flex-direction: column; gap: 16px; align-items: flex-start; }
    .order-status-wrap { align-items: flex-start; }
}
`;

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const Orders = () => {
    const navigate = useNavigate();
    const { handleGetUserOrders } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await handleGetUserOrders();
                setOrders(data || []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="orders-page">
            <style>{css}</style>

            <nav className="orders-nav">
                <span className="orders-logo" onClick={() => navigate('/')}>voidwear.</span>
                <button type="button" onClick={() => navigate(-1)} className="orders-nav-back">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </nav>

            <div className="orders-container">
                <div className="orders-header">
                    <h1 className="orders-title">Order History</h1>
                    <p className="orders-subtitle">View and track your recent purchases.</p>
                </div>

                {loading ? (
                    <div className="loader-wrap"><div className="spinner"></div></div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <h2 className="empty-title">No orders yet</h2>
                        <p className="empty-text">You haven't made any purchases yet.</p>
                        <button className="shop-btn" onClick={() => navigate('/')}>Start Shopping</button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-meta">
                                        <span className="order-id">Order #{order.razorpay?.orderId || order._id.slice(-8)}</span>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="order-status-wrap">
                                        <span className="order-total">
                                            {SYM[order.price?.currency] || '₹'}{Number(order.price?.amount || 0).toLocaleString('en-IN')}
                                        </span>
                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.orderItems?.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <img 
                                                src={item.image?.[0]?.url || 'https://via.placeholder.com/80x100?text=No+Image'} 
                                                alt={item.title} 
                                                className="item-image" 
                                            />
                                            <div className="item-details">
                                                <span className="item-title">{item.title}</span>
                                                <span className="item-meta">Qty: {item.quantity}</span>
                                                <span className="item-price">
                                                    {SYM[item.price?.currency] || '₹'}{Number(item.price?.amount || 0).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
