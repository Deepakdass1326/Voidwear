import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../../cart/hook/usecart';
import { setUser } from '../../auth/state/auth.slice';
import { logoutUser } from '../../auth/service/auth.api';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #ffffff; color: #000000; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

/* ── Navbar ── */
.nav { position: fixed; top: 0; width: 100%; z-index: 100; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 72px; border-bottom: 1px solid rgba(0,0,0,0.04); transition: all 0.3s ease; }
.nav-left { flex: 1; display: flex; align-items: center; gap: 32px; }
.nav-center { flex: 1; display: flex; justify-content: center; }
.nav-right { flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 24px; }
.nav-logo { font-weight: 700; font-size: 1.3rem; letter-spacing: -0.05em; color: #000; cursor: pointer; text-transform: lowercase; }
.nav-link { font-size: 13px; font-weight: 500; color: #555; text-decoration: none; cursor: pointer; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.05em; background: none; border: none; font-family: 'Inter', sans-serif; }
.nav-link:hover { color: #000; }
.nav-link-logout { font-size: 12px; font-weight: 500; color: #999; text-decoration: none; cursor: pointer; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.05em; background: none; border: none; font-family: 'Inter', sans-serif; }
.nav-link-logout:hover { color: #000; }
.nav-icon { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #000; position: relative; transition: opacity 0.2s; }
.nav-icon:hover { opacity: 0.7; }
.cart-badge { position: absolute; top: -5px; right: -8px; background: #000; color: #fff; font-size: 10px; font-weight: 600; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

/* ── Breadcrumb ── */
.breadcrumb { margin-top: 72px; padding: 24px 40px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
.breadcrumb-link { cursor: pointer; color: #555; transition: color 0.2s; }
.breadcrumb-link:hover { color: #000; }
.breadcrumb-sep { margin: 0 8px; color: #ccc; }
.breadcrumb-current { color: #000; font-weight: 500; }

/* ── PDP Layout ── */
.pdp-container { max-width: 1400px; margin: 0 auto; padding: 0 40px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
.pdp-image-col { position: sticky; top: 100px; display: flex; gap: 20px; height: calc(100vh - 120px); align-items: flex-start; }
.pdp-thumbnails { display: flex; flex-direction: column; gap: 16px; width: 80px; max-height: 100%; overflow-y: auto; padding-right: 4px; }
.pdp-thumbnails::-webkit-scrollbar { width: 4px; }
.pdp-thumbnails::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.pdp-thumb { width: 100%; aspect-ratio: 3/4; object-fit: cover; cursor: pointer; transition: opacity 0.2s; opacity: 0.5; background: #f4f4f4; flex-shrink: 0; }
.pdp-thumb:hover { opacity: 0.8; }
.pdp-thumb.active { opacity: 1; }
.pdp-main-img-wrap { height: 100%; aspect-ratio: 3/4; background: #f4f4f4; overflow: hidden; display: flex; justify-content: center; }
.pdp-main-img { width: 100%; height: 100%; object-fit: cover; }

.pdp-info-col { padding-top: 20px; max-width: 500px; }
.pdp-title { font-size: 2rem; font-weight: 500; line-height: 1.2; margin-bottom: 12px; color: #111; letter-spacing: -0.02em; }
.pdp-price { font-size: 1.25rem; font-weight: 500; color: #111; margin-bottom: 32px; }
.pdp-stock { font-size: 12px; color: #111; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
.pdp-desc { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 40px; }

/* ── Variants & Selectors ── */
.pdp-section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; color: #111; display: flex; justify-content: space-between; align-items: center; }

/* All Variants Row (Color selection usually) */
.all-variants-scroll { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 32px; }
.av-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; }
.av-img { width: 60px; height: 80px; object-fit: cover; transition: all 0.2s; opacity: 0.6; background: #f4f4f4; border-bottom: 2px solid transparent; padding-bottom: 4px; }
.av-img.active { opacity: 1; border-color: #111; }
.av-img:hover { opacity: 1; }
.av-label { font-size: 11px; font-weight: 500; color: #555; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.size-selector { display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap; }
.size-btn { flex: 1; min-width: 60px; height: 48px; border: 1px solid #e0e0e0; background: #fff; font-family: 'Inter', sans-serif; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s; color: #111; display: flex; align-items: center; justify-content: center; }
.size-btn:hover { border-color: #111; }
.size-btn.selected { background: #111; color: #fff; border-color: #111; }

.add-to-cart-huge { width: 100%; background: #111; color: #fff; border: none; padding: 18px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: background 0.3s; margin-bottom: 40px; }
.add-to-cart-huge:hover { background: #000; opacity: 0.8; }
.add-to-cart-huge:disabled { background: #ccc; cursor: not-allowed; color: #fff; opacity: 1; }

/* ── Accordion ── */
.accordion { border-top: 1px solid #e0e0e0; }
.accordion-item { border-bottom: 1px solid #e0e0e0; }
.accordion-header { padding: 20px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 500; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #111; transition: color 0.2s; }
.accordion-header:hover { color: #555; }
.accordion-content { overflow: hidden; max-height: 0; transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.4s ease; opacity: 0; font-size: 13px; color: #666; line-height: 1.6; }
.accordion-content.open { max-height: 300px; padding-bottom: 20px; opacity: 1; }
.accordion-icon { transition: transform 0.3s ease; }
.accordion-icon.open { transform: rotate(180deg); }

/* ── Footer ── */
.footer { border-top: 1px solid #eaeaea; padding: 100px 40px 40px; display: flex; flex-direction: column; gap: 80px; background: #fafafa; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; }
.footer-col h4 { font-size: 12px; font-weight: 600; color: #111; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.footer-col li { font-size: 14px; color: #666; cursor: pointer; transition: color 0.2s; }
.footer-col li:hover { color: #111; }
.newsletter-input { width: 100%; border: none; border-bottom: 1px solid #ccc; padding: 12px 0; outline: none; font-size: 14px; font-family: 'Inter', sans-serif; background: transparent; transition: border-color 0.3s; color: #111; }
.newsletter-input:focus { border-color: #111; }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; color: #888; font-size: 13px; border-top: 1px solid #eaeaea; padding-top: 32px; }
.footer-logo { font-size: 1.5rem; font-weight: 700; color: #111; letter-spacing: -0.05em; text-transform: lowercase; }
.social-links { display: flex; gap: 24px; }
.social-links span { cursor: pointer; transition: color 0.2s; }
.social-links span:hover { color: #111; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .pdp-container { grid-template-columns: 1fr; gap: 40px; }
  .pdp-image-col { position: relative; top: 0; }
  .pdp-info-col { max-width: 100%; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 60px 40px; }
}
@media (max-width: 768px) {
  .nav { padding: 0 24px; height: 64px; }
  .nav-left { display: none; }
  .nav-center { justify-content: flex-start; }
  .breadcrumb { margin-top: 64px; padding: 16px 24px; }
  .pdp-container { padding: 0 24px 60px; }
  .pdp-image-col { flex-direction: column-reverse; gap: 12px; }
  .pdp-thumbnails { flex-direction: row; width: 100%; overflow-x: auto; gap: 8px; }
  .pdp-thumb { width: 60px; aspect-ratio: 3/4; }
  .footer { padding: 80px 24px 32px; gap: 60px; }
  .footer-grid { grid-template-columns: 1fr; gap: 48px; }
  .footer-bottom { flex-direction: column; gap: 24px; align-items: flex-start; }
}
`;

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { handleGetProductDetails } = useProducts();
    const user = useSelector(state => state.auth?.user);
    const cartCount = useSelector(state => state.cart?.items?.length || 0);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(null);

    const { handleAddItem } = useCart();

    const handleLogout = async () => {
        await logoutUser();
        dispatch(setUser(null));
        navigate('/');
    };

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

    if (loading) return (
        <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#888', minHeight: '100vh' }}>
            Loading product...
        </div>
    );
    if (!product) return (
        <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 24 }}>Product not found.</p>
            <button onClick={() => navigate('/')} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Back to Shop
            </button>
        </div>
    );

    const hasVariants = product.variants && product.variants.length > 0;
    const defaultVariant = product.variants?.find(v => v.isDefault);
    const hasRealVariants = product.variants?.some(v => !v.isDefault);
    const activeVariant = (hasRealVariants && selectedVariantIdx !== null) ? product.variants.filter(v => !v.isDefault)[selectedVariantIdx] : null;
    const displayPrice = activeVariant?.price?.amount ? activeVariant.price : product.price;
    const stockAvailable = activeVariant ? activeVariant.stock : defaultVariant?.stock ?? null;

    const getImages = () => {
        if (activeVariant?.images?.length > 0) return activeVariant.images.map(img => img.url);
        if (product?.image?.length > 0) return product.image.map(img => img.url);
        return [];
    };

    const images = getImages();
    const safeActiveImgIdx = activeImgIdx >= images.length ? 0 : activeImgIdx;

    // Build a label for each variant (e.g. "Red · XL")
    const getVariantLabel = (v, idx) => {
        if (!v.attributes) return `Variant ${idx + 1}`;
        return Object.values(v.attributes).map(val => String(val).split(',')[0].trim()).join(' · ');
    };

    const getVariantThumb = (v) => {
        return v.images?.[0]?.url || product.image?.[0]?.url;
    };

    return (
        <div>
            <style>{css}</style>

            {/* Navbar */}
            <nav className="nav">
                <div className="nav-left">
                   <span className="nav-link" onClick={() => navigate('/')}>Shop</span>
                   <span className="nav-link">Collections</span>
                </div>
                <div className="nav-center">
                  <span className="nav-logo" onClick={() => navigate('/')}>voidwear.</span>
                </div>
                <div className="nav-right">
                  {user ? (
                    <>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                        {user.fullname?.split(' ')[0]}
                      </span>
                      {user.role === 'buyer' && (
                        <button className="nav-icon" onClick={() => navigate('/cart')} title="View Cart">
                          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>
                      )}
                      <button className="nav-link-logout" onClick={handleLogout}>Logout</button>
                    </>
                  ) : (
                    <>
                      <span className="nav-link" onClick={() => navigate('/login')}>Login</span>
                      <span className="nav-link" onClick={() => navigate('/register')}>Register</span>
                    </>
                  )}
                </div>
            </nav>

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/')}>All Products</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{product.title}</span>
                {activeVariant && (
                    <>
                        <span className="breadcrumb-sep">/</span>
                        <span className="breadcrumb-current">{getVariantLabel(activeVariant, selectedVariantIdx)}</span>
                    </>
                )}
            </div>

            <div className="pdp-container">
                {/* Image Column */}
                <div className="pdp-image-col">
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
                    <div className="pdp-main-img-wrap">
                        {images.length > 0 && (
                            <img src={images[safeActiveImgIdx]} alt={product.title} className="pdp-main-img" />
                        )}
                    </div>
                </div>

                {/* Info Column */}
                <div className="pdp-info-col">
                    <h1 className="pdp-title">{product.title}</h1>
                    <div className="pdp-price">{SYM[displayPrice?.currency] || '₹'}{Number(displayPrice?.amount || 0).toLocaleString()}</div>
                    
                    {stockAvailable !== null && (
                        <div className="pdp-stock">
                            {stockAvailable > 0 ? `${stockAvailable} In Stock` : 'Out of Stock'}
                        </div>
                    )}
                    
                    <p className="pdp-desc">{product.description}</p>

                    {/* ── All Variants Panel ── only show real variants */}
                    {hasRealVariants && (
                        <div style={{ marginBottom: 40 }}>
                            <div className="pdp-section-title">
                                <span>{product.variants.filter(v => !v.isDefault).length} Variant{product.variants.filter(v => !v.isDefault).length !== 1 ? 's' : ''} Available</span>
                            </div>
                            <div className="all-variants-scroll">
                                {/* Each real variant */}
                                {product.variants.filter(v => !v.isDefault).map((v, idx) => (
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
                    )}

                    {/* ── Dynamic Attribute Selectors ── */}
                    {/* Show active real variant's attributes, or default variant's attributes when no real variant selected */}
                    {(activeVariant?.attributes || (!hasRealVariants && defaultVariant?.attributes)) && (
                        <div style={{ marginBottom: 40 }}>
                            {Object.entries((activeVariant ?? defaultVariant).attributes).map(([attrKey, attrVal]) => {
                                const options = String(attrVal).split(',').map(s => s.trim()).filter(Boolean);
                                const isMulti = options.length > 1;
                                return (
                                    <div key={attrKey}>
                                        <div className="pdp-section-title">
                                            <span>{attrKey}</span>
                                            {isMulti && selectedOptions[attrKey] && (
                                                <span style={{ color: '#888', fontWeight: 400 }}>
                                                    {selectedOptions[attrKey]}
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
                                                <div className="size-btn selected" style={{flex: 'none', padding: '0 24px'}}>
                                                    {options[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}




                    <button onClick={() => {
                        if (!user) {
                            navigate('/login');
                            return;
                        }
                        // Always send a variantId — use activeVariant or fall back to defaultVariant
                        const variantToAdd = activeVariant ?? defaultVariant;
                        if (!variantToAdd) {
                            alert('No variant available for this product');
                            return;
                        }
                        handleAddItem({
                            productId: product._id,
                            variantId: variantToAdd._id,
                        });
                    }} className="add-to-cart-huge">
                        {user ? 'Add to Cart' : 'Login to Add to Cart'}
                    </button>

                    {/* Accordion */}
                    <div className="accordion">
                        {accordionData.map((item, idx) => (
                            <div className="accordion-item" key={idx}>
                                <div className="accordion-header" onClick={() => toggleAccordion(idx)}>
                                    <span>{item.title}</span>
                                    <svg className={`accordion-icon ${openAccordion === idx ? 'open' : ''}`} width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div className={`accordion-content ${openAccordion === idx ? 'open' : ''}`}>{item.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-grid">
                <div className="footer-col">
                    <div className="footer-logo" style={{marginBottom: 16}}>voidwear.</div>
                    <p style={{color: '#666', fontSize: 14, lineHeight: 1.6, maxWidth: 250}}>
                    Redefining contemporary streetwear with minimal design and premium quality.
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Shop</h4>
                    <ul>
                    <li>New Arrivals</li>
                    <li>T-Shirts</li>
                    <li>Hoodies</li>
                    <li>Accessories</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Information</h4>
                    <ul>
                    <li>About Us</li>
                    <li>Shipping & Returns</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Newsletter</h4>
                    <p style={{color: '#666', fontSize: 14, marginBottom: 16}}>Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <input type="email" placeholder="Enter your email" className="newsletter-input" />
                </div>
                </div>
                <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Voidwear. All rights reserved.</span>
                <div className="social-links">
                    <span>Instagram</span>
                    <span>Twitter</span>
                </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetails;