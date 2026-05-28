import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/usecart';
import { useRazorpay } from "react-razorpay";

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #f7f7f5; color: #111; }

/* ── Navbar ── */
.cart-nav { position: sticky; top: 0; z-index: 100; background: rgba(247,247,245,0.95); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; border-bottom: 1px solid rgba(0,0,0,0.07); }
.cart-nav-logo { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.4rem; letter-spacing: 0.1em; color: #111; cursor: pointer; text-transform: uppercase; }
.cart-nav-right { display: flex; align-items: center; gap: 12px; }
.btn-pill { background: #111; color: #fff; border: none; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-pill:hover { background: #333; }
.btn-pill-outline { background: transparent; color: #111; border: 1px solid #111; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-pill-outline:hover { background: #111; color: #fff; }

/* ── Page ── */
.cart-page { min-height: 100vh; background: #f7f7f5; padding: 40px 32px 80px; max-width: 1200px; margin: 0 auto; }
.cart-title { font-family: 'Oswald', sans-serif; font-size: 2rem; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 32px; text-transform: uppercase; }
.cart-count { font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 400; color: #888; margin-left: 12px; text-transform: none; letter-spacing: 0; }

/* ── Layout ── */
.cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
@media (max-width: 860px) { .cart-layout { grid-template-columns: 1fr; } }

/* ── Item Card ── */
.cart-items { display: flex; flex-direction: column; gap: 16px; }
.cart-item { background: #fff; border-radius: 16px; padding: 20px; display: flex; gap: 20px; align-items: flex-start; border: 1px solid rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
.cart-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
.cart-item-img { width: 100px; height: 120px; object-fit: cover; border-radius: 10px; background: #eee; flex-shrink: 0; }
.cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.cart-item-title { font-weight: 600; font-size: 15px; color: #111; line-height: 1.3; }
.cart-item-variant { font-size: 12px; color: #888; font-weight: 400; }
.cart-item-price { font-size: 15px; font-weight: 600; color: #111; margin-top: 4px; }
.cart-item-total { font-size: 13px; color: #555; font-weight: 500; }

/* ── Quantity Controls ── */
.qty-row { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
.qty-control { display: flex; align-items: center; gap: 0; border: 1px solid #ddd; border-radius: 100px; overflow: hidden; }
.qty-btn { background: none; border: none; width: 36px; height: 36px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #111; transition: background 0.15s; }
.qty-btn:hover:not(:disabled) { background: #f0f0f0; }
.qty-btn:disabled { color: #bbb; cursor: not-allowed; }
.qty-num { font-size: 14px; font-weight: 600; min-width: 28px; text-align: center; }
.remove-btn { background: none; border: none; cursor: pointer; color: #999; font-size: 12px; font-weight: 500; padding: 4px 0; text-decoration: underline; transition: color 0.15s; }
.remove-btn:hover { color: #c00; }

/* ── Order Summary ── */
.cart-summary { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid rgba(0,0,0,0.06); position: sticky; top: 80px; }
.summary-title { font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 24px; }
.summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #555; margin-bottom: 14px; }
.summary-divider { border: none; border-top: 1px solid #eee; margin: 18px 0; }
.summary-total-row { display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 700; color: #111; }
.checkout-btn { width: 100%; margin-top: 24px; background: #111; color: #fff; border: none; padding: 16px; border-radius: 100px; font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: 0.04em; transition: background 0.2s; }
.checkout-btn:hover { background: #333; }

/* ── Empty State ── */
.cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; text-align: center; }
.cart-empty-icon { font-size: 64px; opacity: 0.18; }
.cart-empty-title { font-family: 'Oswald', sans-serif; font-size: 1.6rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.cart-empty-sub { font-size: 14px; color: #888; }

/* ── Loading ── */
.cart-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; font-size: 14px; color: #888; }
`;

const DUMMY_IMG = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400';

// ── Aggregation-aware helpers ─────────────────────────────────────────────────
// After aggregation: product details live at item.products (lookup result)
//                    matched variant lives at item.products.variants (single object after $unwind)
//                    pre-computed price lives at item.itemPrice

function getUnitPrice(item) {
    return item?.products?.variants?.price?.amount ?? 0;
}

function getCurrency(item) {
    return item?.products?.variants?.price?.currency ?? 'INR';
}

function getImage(item) {
    // Prefer variant image, fall back to product image, then dummy
    const variantImg = item?.products?.variants?.images?.[0]?.url;
    const productImg = item?.products?.image?.[0]?.url;
    return variantImg || productImg || DUMMY_IMG;
}

function getVariantLabel(item) {
    const attrs = item?.products?.variants?.attributes;
    if (!attrs) return null;
    return Object.values(attrs).map(v => String(v).split(',')[0].trim()).join(' · ');
}

// Extract IDs needed for update/remove API calls
function getProductId(item) {
    // item.products._id is the populated product ObjectId
    return item?.products?._id?.toString();
}

function getVariantId(item) {
    // item.variant is the raw ObjectId ref stored on the cart item
    return item?.variant?.toString();
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CartPage() {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth?.user);
    const items = useSelector(state => state.cart?.items || []);
    // totalPrice and currency come directly from the aggregation via Redux
    const totalPrice = useSelector(state => state.cart?.totalPrice || 0);
    const currency = useSelector(state => state.cart?.currency || 'INR');
    const sym = SYM[currency] || '₹';

    const { handleFetchCart, handleUpdateQuantity, handleRemoveItem, handleCreateOrder,handleVerifyOrder } = useCart();

    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null); // variantId being updated
    const {error, isLoading, Razorpay} = useRazorpay()


    useEffect(() => {
        async function fetchCart() {
            try {
                await handleFetchCart();
            } catch (e) {
                console.error('Failed to fetch cart:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchCart();
    }, []);

    const handleQtyChange = async (item, newQty) => {
        const productId = getProductId(item);
        const variantId = getVariantId(item);
        if (newQty < 1) return;
        setUpdatingId(variantId);
        try {
            await handleUpdateQuantity({ productId, variantId, quantity: newQty });
        } catch (e) {
            console.error('Update failed:', e);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemove = async (item) => {
        const productId = getProductId(item);
        const variantId = getVariantId(item);
        try {
            await handleRemoveItem({ productId, variantId });
        } catch (e) {
            console.error('Remove failed:', e);
        }
    };

    async function handleCheckout(){
        const data = await handleCreateOrder();
        const order = data?.order;
        console.log(order)
        const options = {
      key: "rzp_test_Sut01VoJKutumi",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Voidwear",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async(response) => {
        const isValid = await handleVerifyOrder(response);
        if(isValid){
          navigate(`/order-success?order_id=${response?.razorpay_order_id}`);
        }
       
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: "#111111",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    }

    return (
        <>
            <style>{css}</style>

            {/* Navbar */}
            <nav className="cart-nav">
                <span className="cart-nav-logo" onClick={() => navigate('/')}>Voidwear</span>
                <div className="cart-nav-right">
                    {user ? (
                        <button className="btn-pill-outline" onClick={() => navigate('/')}>Continue Shopping</button>
                    ) : (
                        <button className="btn-pill" onClick={() => navigate('/login')}>Login</button>
                    )}
                </div>
            </nav>

            <div className="cart-page">
                {loading ? (
                    <div className="cart-loading">Loading your cart…</div>
                ) : items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <div className="cart-empty-title">Your cart is empty</div>
                        <div className="cart-empty-sub">Looks like you haven't added anything yet.</div>
                        <button className="btn-pill" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="cart-title">
                            Your Cart
                            <span className="cart-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                        </h1>

                        <div className="cart-layout">
                            {/* Items */}
                            <div className="cart-items">
                                {items.map((item) => {
                                    const productId = getProductId(item);
                                    const variantId = getVariantId(item);
                                    const unitPrice = getUnitPrice(item);
                                    const cur = getCurrency(item);
                                    const s = SYM[cur] || '₹';
                                    const img = getImage(item);
                                    const label = getVariantLabel(item);
                                    const isUpdating = updatingId === variantId;
                                    // itemPrice is pre-calculated by the aggregation pipeline
                                    const itemTotal = item.itemPrice ?? unitPrice * item.quantity;

                                    return (
                                        <div key={`${productId}-${variantId}`} className="cart-item">
                                            <img
                                                src={img}
                                                alt={item.products?.title || 'Product'}
                                                className="cart-item-img"
                                                onError={e => { e.target.src = DUMMY_IMG; }}
                                            />
                                            <div className="cart-item-info">
                                                <div className="cart-item-title">{item.products?.title || '—'}</div>
                                                {label && <div className="cart-item-variant">{label}</div>}
                                                <div className="cart-item-price">{s}{unitPrice.toLocaleString()}</div>
                                                <div className="cart-item-total">
                                                    Total: {s}{itemTotal.toLocaleString()}
                                                </div>

                                                <div className="qty-row">
                                                    <div className="qty-control">
                                                        <button
                                                            id={`qty-dec-${productId}-${variantId}`}
                                                            className="qty-btn"
                                                            disabled={item.quantity <= 1 || isUpdating}
                                                            onClick={() => handleQtyChange(item, item.quantity - 1)}
                                                        >−</button>
                                                        <span className="qty-num">{item.quantity}</span>
                                                        <button
                                                            id={`qty-inc-${productId}-${variantId}`}
                                                            className="qty-btn"
                                                            disabled={isUpdating}
                                                            onClick={() => handleQtyChange(item, item.quantity + 1)}
                                                        >+</button>
                                                    </div>
                                                    <button
                                                        id={`remove-${productId}-${variantId}`}
                                                        className="remove-btn"
                                                        onClick={() => handleRemove(item)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary */}
                            <div className="cart-summary">
                                <div className="summary-title">Order Summary</div>
                                {items.map((item) => {
                                    const productId = getProductId(item);
                                    const variantId = getVariantId(item);
                                    const s = SYM[getCurrency(item)] || '₹';
                                    const itemTotal = item.itemPrice ?? getUnitPrice(item) * item.quantity;
                                    return (
                                        <div key={`${productId}-${variantId}`} className="summary-row">
                                            <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.products?.title || '—'} × {item.quantity}
                                            </span>
                                            <span>{s}{itemTotal.toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                                <hr className="summary-divider" />
                                <div className="summary-total-row">
                                    <span>Subtotal</span>
                                    {/* totalPrice comes directly from the $group stage of the aggregation */}
                                    <span>{sym}{totalPrice.toLocaleString()}</span>
                                </div>
                                <button
                                    id="checkout-btn"
                                    className="checkout-btn"
                                    onClick={() => handleCheckout()}


                                >
                                    Proceed to Checkout →
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

