import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts';
import { addToCart } from '../../cart/hook/usecart';
const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #f7f7f5; color: #111; overflow-x: hidden; }

/* ── Navbar ── */
.nav { position: sticky; top: 0; z-index: 100; background: rgba(247,247,245,0.95); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; border-bottom: 1px solid rgba(0,0,0,0.07); }
.nav-left { display: flex; align-items: center; gap: 16px; flex: 1; }
.nav-center { flex: 1; display: flex; justify-content: center; }
.nav-right { display: flex; align-items: center; gap: 12px; flex: 1; justify-content: flex-end; }
.nav-logo { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.4rem; letter-spacing: 0.1em; color: #111; cursor: pointer; text-transform: uppercase; }
.btn-pill { background: #111; color: #fff; border: none; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-pill:hover { background: #333; }
.btn-pill-outline { background: transparent; color: #111; border: 1px solid #111; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-pill-outline:hover { background: #111; color: #fff; }
.cart-icon-btn { position: relative; background: none; border: none; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.15s; color: #111; }
.cart-icon-btn:hover { background: rgba(0,0,0,0.06); }
.cart-badge { position: absolute; top: -2px; right: -2px; background: #111; color: #fff; font-size: 10px; font-weight: 700; min-width: 17px; height: 17px; border-radius: 100px; display: flex; align-items: center; justify-content: center; padding: 0 4px; line-height: 1; }

/* ── Breadcrumb ── */
.breadcrumb { display: flex; align-items: center; gap: 8px; padding: 10px 32px; font-size: 11.5px; color: #999; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(247,247,245,0.8); }
.breadcrumb-link { cursor: pointer; color: #888; transition: color 0.2s; }
.breadcrumb-link:hover { color: #111; }
.breadcrumb-sep { color: #ccc; }
.breadcrumb-current { color: #111; font-weight: 500; }

/* ── PDP Layout ── */
.pdp-container { max-width: 1060px; margin: 0 auto; padding: 28px 32px 48px; display: grid; grid-template-columns: 4.2fr 5.8fr; gap: 48px; align-items: start; }
.pdp-image-col { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 12px; }
.pdp-main-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
.pdp-thumbnails { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.pdp-thumb { width: 60px; aspect-ratio: 3/4; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0; opacity: 0.6; }
.pdp-thumb:hover { opacity: 0.9; }
.pdp-thumb.active { border-color: #111; opacity: 1; }
.pdp-info-col { padding-top: 4px; }
.pdp-title { font-family: 'Oswald', sans-serif; font-size: 1.8rem; font-weight: 700; line-height: 1.15; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.02em; }
.pdp-price { font-size: 1.25rem; font-weight: 700; color: #111; margin-bottom: 6px; }
.pdp-stock { font-size: 12px; color: #009688; font-weight: 600; margin-bottom: 16px; }
.pdp-desc { font-size: 13.5px; color: #555; line-height: 1.6; margin-bottom: 24px; }
.pdp-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; color: #111; }
.size-selector { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.size-btn { min-width: 40px; height: 40px; padding: 0 12px; border-radius: 20px; border: 1px solid #e0e0e0; background: #fff; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; color: #333; }
.size-btn:hover { border-color: #111; }
.size-btn.selected { background: #111; color: #fff; border-color: #111; }
.variant-btn { display: flex; align-items: center; gap: 8px; padding: 6px 12px 6px 6px; border-radius: 8px; border: 1px solid #e0e0e0; background: #fff; cursor: pointer; transition: all 0.2s; }
.variant-btn:hover { border-color: #999; }
.variant-btn.selected { border-color: #111; background: #fafafa; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.add-to-cart-huge { width: 100%; background: #111; color: #fff; border: none; padding: 15px; border-radius: 100px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: background 0.2s; margin-bottom: 24px; margin-top: 4px; }
.add-to-cart-huge:hover { background: #333; }

/* ── All Variants Panel ── */
.all-variants-panel { border: 1px solid #eaeaea; border-radius: 10px; padding: 12px 14px; margin-bottom: 24px; background: #fafafa; }
.all-variants-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
.av-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; flex-shrink: 0; }
.av-img { width: 50px; height: 64px; object-fit: cover; border-radius: 6px; border: 2px solid transparent; transition: all 0.2s; opacity: 0.7; }
.av-img.active { border-color: #111; opacity: 1; }
.av-img:hover { border-color: #999; opacity: 1; }
.av-label { font-size: 10px; font-weight: 500; color: #666; text-align: center; max-width: 50px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── Accordion ── */
.accordion { border-top: 1px solid #eaeaea; margin-top: 8px; }
.accordion-item { border-bottom: 1px solid #eaeaea; }
.accordion-header { padding: 15px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 13px; transition: color 0.2s; }
.accordion-header:hover { color: #555; }
.accordion-content { overflow: hidden; max-height: 0; transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease; opacity: 0; font-size: 12.5px; color: #666; line-height: 1.6; }
.accordion-content.open { max-height: 220px; padding-bottom: 15px; opacity: 1; }
.accordion-icon { transition: transform 0.3s ease; }
.accordion-icon.open { transform: rotate(180deg); }

/* ── Footer ── */
.footer { background: #f7f7f5; padding: 40px 32px 20px; color: #111; display: flex; flex-direction: column; overflow: hidden; margin-top: 40px; border-top: 1px solid #eaeaea; }
.ft-top { display: flex; justify-content: space-between; margin-bottom: 32px; gap: 32px; }
.ft-links { display: flex; gap: 48px; }
.ft-col h4 { font-size: 11.5px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #111; }
.ft-col ul { list-style: none; }
.ft-col li { font-size: 12.5px; color: #666; margin-bottom: 8px; cursor: pointer; transition: color 0.2s; }
.ft-col li:hover { color: #111; }
.ft-giant { font-family: 'Oswald', sans-serif; font-size: 15vw; font-weight: 700; color: transparent; -webkit-text-stroke: 1.5px #e8e8e8; text-align: center; line-height: 0.8; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.01em; user-select: none; }
.ft-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #eaeaea; font-size: 11.5px; color: #999; font-weight: 500; }
.ft-bottom-links { display: flex; gap: 16px; }
.ft-bottom-links span { cursor: pointer; transition: color 0.2s; }
.ft-bottom-links span:hover { color: #111; }

/* ── Tablet ── */
@media (max-width: 1024px) {
  .pdp-container { padding: 24px 24px 40px; gap: 32px; grid-template-columns: 1fr 1fr; }
  .pdp-title { font-size: 1.6rem; }
  .ft-links { gap: 32px; }
  .breadcrumb { padding: 10px 24px; }
}
@media (max-width: 860px) {
  .pdp-container { grid-template-columns: 1fr; gap: 24px; max-width: 600px; }
  .pdp-image-col { position: relative; top: 0; }
  .pdp-main-img { aspect-ratio: 4/3; border-radius: 12px; }
  .pdp-title { font-size: 1.5rem; }
}
@media (max-width: 768px) {
  .nav { padding: 0 16px; height: 54px; }
  .nav-logo { font-size: 1.2rem; }
  .breadcrumb { padding: 8px 16px; }
  .pdp-container { padding: 16px 14px 32px; }
  .pdp-title { font-size: 1.4rem; }
  .pdp-price { font-size: 1.15rem; }
  .add-to-cart-huge { padding: 14px; font-size: 12px; }
  .ft-top { flex-direction: column; gap: 24px; }
  .ft-links { flex-wrap: wrap; gap: 24px; }
  .footer { padding: 32px 16px 20px; margin-top: 24px; }
  .ft-bottom { flex-direction: column; gap: 10px; align-items: flex-start; }
}
`;

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { handleGetProductDetails } = useProducts();
    const user = useSelector(state => state.auth?.user);
    const cartCount = useSelector(state => state.cart?.items?.length || 0);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(null);

    const { handleAddItem } = addToCart()

    // Smart back navigation — use history if available, otherwise go home
    const handleBack = () => {
        const from = location.state?.from;
        if (from) {
            navigate(from);
        } else if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const toggleAccordion = (idx) => setOpenAccordion(openAccordion === idx ? null : idx);

    const accordionData = [
        { title: "Return Policy", content: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have original tags attached. Refunds will be processed to the original payment method within 5-7 business days." },
        { title: "Authenticity", content: "Voidwear guarantees 100% authenticity on all products. Every item undergoes a rigorous quality control and authentication process before being shipped to you." },
        { title: "Complimentary Shipping", content: "Enjoy free standard shipping on all domestic orders over ₹5,000. Express and international shipping options are available at checkout." }
    ];

    useEffect(() => {
        async function fetchProduct() {
            if (!productId) return;
            setLoading(true);
            try {
                const data = await handleGetProductDetails(productId);
                setProduct(data);
                setSelectedVariantIdx(null);
                setSelectedOptions({});
                setActiveImgIdx(0);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [productId]);

    // Sync attribute options when variant changes
    useEffect(() => {
        if (product?.variants && selectedVariantIdx !== null) {
            const activeVar = product.variants[selectedVariantIdx];
            if (activeVar?.attributes) {
                const newOpts = {};
                Object.entries(activeVar.attributes).forEach(([key, val]) => {
                    newOpts[key] = String(val).split(',')[0].trim();
                });
                setSelectedOptions(newOpts);
            }
        } else {
            setSelectedOptions({});
        }
    }, [selectedVariantIdx, product]);

    const DUMMY_IMAGES = [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200'
    ];

    if (loading) return (
        <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#888', background: '#f7f7f5', minHeight: '100vh' }}>
            Loading product...
        </div>
    );
    if (!product) return (
        <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f7f7f5' }}>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 24 }}>Product not found.</p>
            <button onClick={() => navigate('/')} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 100, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                Back to Shop
            </button>
        </div>
    );

    const hasVariants = product.variants && product.variants.length > 0;
    const activeVariant = (hasVariants && selectedVariantIdx !== null) ? product.variants[selectedVariantIdx] : null;
    const displayPrice = activeVariant?.price?.amount ? activeVariant.price : product.price;
    const stockAvailable = activeVariant ? activeVariant.stock : null;

    const getImages = () => {
        if (activeVariant?.images?.length > 0) return activeVariant.images.map(img => img.url);
        if (product?.image?.length > 0) return product.image.map(img => img.url);
        return DUMMY_IMAGES;
    };

    const images = getImages();
    const safeActiveImgIdx = activeImgIdx >= images.length ? 0 : activeImgIdx;

    // Build a label for each variant (e.g. "Red · XL")
    const getVariantLabel = (v, idx) => {
        if (!v.attributes) return `Variant ${idx + 1}`;
        return Object.values(v.attributes).map(val => String(val).split(',')[0].trim()).join(' · ');
    };

    const getVariantThumb = (v) => {
        return v.images?.[0]?.url || product.image?.[0]?.url || DUMMY_IMAGES[0];
    };

    return (
        <div>
            <style>{css}</style>

            {/* Navbar */}
            <nav className="nav">
                <div className="nav-left">
                    <button
                        className="btn-pill-outline"
                        onClick={handleBack}
                        style={{ border: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', background: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Back</span>
                    </button>
                </div>
                <div className="nav-center">
                    <span className="nav-logo" onClick={() => navigate('/')}>VOIDWEAR</span>
                </div>
                <div className="nav-right">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>Hello, {user.fullname || 'User'}</span>
                            {user.role === 'buyer' && (
                                <button id="pdp-cart-btn" className="cart-icon-btn" onClick={() => navigate('/cart')} title="View Cart">
                                    <i className="ri-shopping-bag-3-line" style={{ fontSize: 22 }}></i>
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="btn-pill-outline" onClick={() => navigate('/login')}>Sign In</button>
                            <button className="btn-pill" onClick={() => navigate('/register')}>Get Started</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/')}>All Products</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{product.title}</span>
                {activeVariant && (
                    <>
                        <span className="breadcrumb-sep">›</span>
                        <span className="breadcrumb-current">{getVariantLabel(activeVariant, selectedVariantIdx)}</span>
                    </>
                )}
            </div>

            <div className="pdp-container">
                {/* Image Column */}
                <div className="pdp-image-col">
                    <img src={images[safeActiveImgIdx]} alt={product.title} className="pdp-main-img" />
                    {images.length > 1 && (
                        <div className="pdp-thumbnails">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    className={`pdp-thumb ${safeActiveImgIdx === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImgIdx(idx)}
                                    alt=""
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Column */}
                <div className="pdp-info-col">
                    <h1 className="pdp-title">{product.title}</h1>
                    <div className="pdp-price">{SYM[displayPrice?.currency] || '₹'}{Number(displayPrice?.amount || 0).toLocaleString()}</div>
                    {stockAvailable !== null && (
                        <div className="pdp-stock">
                            {stockAvailable > 0 ? `${stockAvailable} in stock` : 'Out of Stock'}
                        </div>
                    )}
                    <p className="pdp-desc">{product.description}</p>

                    {/* ── All Variants Panel ── */}
                    {hasVariants && (
                        <div style={{ marginBottom: 24 }}>
                            <div className="pdp-section-title">
                                {product.variants.length} Variant{product.variants.length !== 1 ? 's' : ''} Available
                            </div>
                            <div className="all-variants-panel">
                                <div className="all-variants-scroll">
                                    {/* "Base product" option */}
                                    <div className="av-item" onClick={() => { setSelectedVariantIdx(null); setActiveImgIdx(0); }}>
                                        <img
                                            src={product.image?.[0]?.url || DUMMY_IMAGES[0]}
                                            className={`av-img ${selectedVariantIdx === null ? 'active' : ''}`}
                                            alt="Base"
                                        />
                                        <span className="av-label">Base</span>
                                    </div>
                                    {/* Each variant */}
                                    {product.variants.map((v, idx) => (
                                        <div
                                            key={idx}
                                            className="av-item"
                                            onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }}
                                        >
                                            <img
                                                src={getVariantThumb(v)}
                                                className={`av-img ${selectedVariantIdx === idx ? 'active' : ''}`}
                                                alt={getVariantLabel(v, idx)}
                                            />
                                            <span className="av-label">{getVariantLabel(v, idx)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Dynamic Attribute Selectors (shown once a variant is picked) ── */}
                    {activeVariant?.attributes && (
                        <div>
                            {Object.entries(activeVariant.attributes).map(([attrKey, attrVal]) => {
                                const options = String(attrVal).split(',').map(s => s.trim()).filter(Boolean);
                                const isMulti = options.length > 1;
                                return (
                                    <div key={attrKey} style={{ marginBottom: 20 }}>
                                        <div className="pdp-section-title">
                                            {attrKey}
                                            {isMulti && selectedOptions[attrKey] && (
                                                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 8, color: '#666' }}>
                                                    — {selectedOptions[attrKey]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="size-selector">
                                            {isMulti ? (
                                                options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [attrKey]: opt }))}
                                                        className={`size-btn ${selectedOptions[attrKey] === opt ? 'selected' : ''}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))
                                            ) : (
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center',
                                                    padding: '6px 16px', borderRadius: 24,
                                                    border: '1px solid #111', background: '#111',
                                                    color: '#fff', fontSize: 13, fontWeight: 600
                                                }}>
                                                    {options[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Fallback size selector */}
                    {!hasVariants && (
                        <>
                            <div className="pdp-section-title">Select Size</div>
                            <div className="size-selector">
                                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedOptions['Size'] === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedOptions(prev => ({ ...prev, Size: size }))}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <button onClick={() => {
                        if (!activeVariant) {
                            alert("Please select a variant first");
                            return;
                        }
                        handleAddItem({
                            productId: product._id,
                            variantId: activeVariant._id,
                        })
                    }}
                    
                    
                    
                    
                    className="add-to-cart-huge">Add to Cart</button>

                    {/* Accordion */}
                    <div className="accordion">
                        {accordionData.map((item, idx) => (
                            <div className="accordion-item" key={idx}>
                                <div className="accordion-header" onClick={() => toggleAccordion(idx)}>
                                    <span>{item.title}</span>
                                    <svg className={`accordion-icon ${openAccordion === idx ? 'open' : ''}`} width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div className={`accordion-content ${openAccordion === idx ? 'open' : ''}`}>{item.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="ft-top">
                    <div className="ft-links">
                        <div className="ft-col"><h4>Shop</h4><ul><li onClick={() => navigate('/')}>All Products</li><li>New Arrivals</li><li>Best Sellers</li></ul></div>
                        <div className="ft-col"><h4>Company</h4><ul><li>About Us</li><li>Careers</li><li>Press</li></ul></div>
                        <div className="ft-col"><h4>Support</h4><ul><li>Contact</li><li>Returns</li><li>FAQ</li></ul></div>
                    </div>
                </div>
                <div className="ft-giant">VOIDWEAR</div>
                <div className="ft-bottom">
                    <span>© {new Date().getFullYear()} Voidwear. All rights reserved.</span>
                    <div className="ft-bottom-links"><span>Terms of Service</span><span>Privacy Policy</span></div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetails;