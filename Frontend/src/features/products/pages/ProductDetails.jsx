import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #f7f7f5; color: #111; overflow-x: hidden; }

.nav { position: sticky; top: 0; z-index: 100; background: rgba(247,247,245,0.9); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 72px; border-bottom: 1px solid rgba(0,0,0,0.05); }
.nav-left { display: flex; align-items: center; gap: 20px; flex: 1; }
.nav-center { flex: 1; display: flex; justify-content: center; }
.nav-right { display: flex; align-items: center; gap: 16px; flex: 1; justify-content: flex-end; }
.nav-logo { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.6rem; letter-spacing: 0.1em; color: #111; cursor: pointer; text-transform: uppercase; }
.btn-pill { background: #111; color: #fff; border: none; padding: 10px 24px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-pill:hover { background: #333; }
.btn-pill-outline { background: transparent; color: #111; border: 1px solid #111; padding: 10px 24px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-pill-outline:hover { background: #111; color: #fff; }

.pdp-container { max-width: 1400px; margin: 0 auto; padding: 60px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; min-height: 80vh; }
.pdp-image-col { position: sticky; top: 120px; display: flex; flex-direction: column; gap: 20px; }
.pdp-main-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
.pdp-thumbnails { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }
.pdp-thumb { width: 100px; aspect-ratio: 4/5; object-fit: cover; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
.pdp-thumb.active { border-color: #111; }
.pdp-info-col { padding-top: 20px; }
.pdp-title { font-family: 'Oswald', sans-serif; font-size: 3.5rem; font-weight: 700; line-height: 1.1; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.02em; }
.pdp-price { font-size: 2rem; font-weight: 800; color: #111; margin-bottom: 8px; }
.pdp-stock { font-size: 14px; color: #009688; font-weight: 600; margin-bottom: 32px; }
.pdp-desc { font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 40px; }
.pdp-section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; color: #111; }
.size-selector { display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap; }
.size-btn { min-width: 50px; height: 50px; padding: 0 16px; border-radius: 25px; border: 1px solid #e0e0e0; background: #fff; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; color: #333; }
.size-btn:hover { border-color: #111; }
.size-btn.selected { background: #111; color: #fff; border-color: #111; }
.variant-btn { display: flex; align-items: center; gap: 12px; padding: 8px 16px 8px 8px; border-radius: 12px; border: 1px solid #e0e0e0; background: #fff; cursor: pointer; transition: all 0.2s; }
.variant-btn:hover { border-color: #999; }
.variant-btn.selected { border-color: #111; background: #fafafa; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.add-to-cart-huge { width: 100%; background: #111; color: #fff; border: none; padding: 24px; border-radius: 100px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: background 0.2s; margin-bottom: 40px; margin-top: 10px; }
.add-to-cart-huge:hover { background: #333; }
.accordion { border-top: 1px solid #e0e0e0; margin-top: 20px; }
.accordion-item { border-bottom: 1px solid #e0e0e0; }
.accordion-header { padding: 24px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 15px; transition: color 0.2s; }
.accordion-header:hover { color: #555; }
.accordion-content { overflow: hidden; max-height: 0; transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease; opacity: 0; font-size: 14px; color: #666; line-height: 1.6; }
.accordion-content.open { max-height: 200px; padding-bottom: 24px; opacity: 1; }
.accordion-icon { transition: transform 0.3s ease; }
.accordion-icon.open { transform: rotate(180deg); }

.footer { background: #f7f7f5; padding: 80px 40px 40px; color: #111; display: flex; flex-direction: column; overflow: hidden; margin-top: 60px; }
.ft-top { display: flex; justify-content: space-between; margin-bottom: 80px; }
.ft-links { display: flex; gap: 120px; }
.ft-col h4 { font-size: 15px; font-weight: 800; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; color: #111; }
.ft-col ul { list-style: none; }
.ft-col li { font-size: 14px; color: #666; margin-bottom: 14px; cursor: pointer; transition: color 0.2s; }
.ft-col li:hover { color: #111; }
.ft-giant { font-family: 'Oswald', sans-serif; font-size: 21vw; font-weight: 700; color: transparent; -webkit-text-stroke: 2px #e5e5e5; text-align: center; line-height: 0.75; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 0.01em; user-select: none; }
.ft-bottom { display: flex; justify-content: space-between; padding-top: 24px; border-top: 1px solid #eaeaea; font-size: 13px; color: #888; font-weight: 500; }
.ft-bottom-links { display: flex; gap: 24px; }

@media (max-width: 992px) {
  .pdp-container { grid-template-columns: 1fr; gap: 40px; }
  .pdp-image-col { position: relative; top: 0; }
}
@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .pdp-container { padding: 40px 20px; }
  .pdp-title { font-size: 2.5rem; }
  .ft-links { flex-direction: column; gap: 40px; }
}
`;

const ProductDetails = () => {
    const {productId} = useParams();
    const navigate = useNavigate();
    const {handleGetProductDetails} = useProducts();
    const user = useSelector(state => state.auth?.user);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Variant Selection State
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (idx) => {
        setOpenAccordion(openAccordion === idx ? null : idx);
    };

    const accordionData = [
      { title: "Return Policy", content: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have original tags attached. Refunds will be processed to the original payment method within 5-7 business days." },
      { title: "Authenticity", content: "Voidwear guarantees 100% authenticity on all products. Every item undergoes a rigorous quality control and authentication process by our expert team before being shipped to you." },
      { title: "Complimentary Shipping", content: "Enjoy free standard shipping on all domestic orders over ₹5,000. Express and international shipping options are available at checkout. Orders are typically processed within 1-2 business days." }
    ];

    useEffect(()=>{
        async function fetchProduct(){
            if(!productId) return;
            setLoading(true);
            try {
               const data = await handleGetProductDetails(productId);
               setProduct(data);

            } catch(e) {
               console.error(e);
            } finally {
               setLoading(false);
            }
        }
        fetchProduct();
    }, [productId]);

    // Update selected attributes whenever a variant is explicitly selected
    useEffect(() => {
        if (product?.variants && selectedVariantIdx !== null) {
            const activeVar = product.variants[selectedVariantIdx];
            if (activeVar?.attributes) {
                const newOpts = {};
                Object.entries(activeVar.attributes).forEach(([key, val]) => {
                    const parts = String(val).split(',').map(s => s.trim());
                    newOpts[key] = parts[0];
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

    if (loading) return <div style={{padding: 100, textAlign: 'center', fontFamily: 'Inter'}}>Loading product...</div>;
    if (!product) return <div style={{padding: 100, textAlign: 'center', fontFamily: 'Inter'}}>Product not found.</div>;

    // --- Variant Logic & Fallbacks ---
    const hasVariants = product.variants && product.variants.length > 0;
    // activeVariant is only set when user has explicitly clicked a variant
    const activeVariant = (hasVariants && selectedVariantIdx !== null)
        ? product.variants[selectedVariantIdx]
        : null;

    // Price: use variant price only if a variant is selected AND it has its own price
    const displayPrice = activeVariant?.price?.amount ? activeVariant.price : product.price;
    // Stock: show variant stock only when a variant is selected
    const stockAvailable = activeVariant ? activeVariant.stock : null;
    
    // Image Fallback
    const getImages = () => {
        let imgs = [];
        // Try active variant images
        if (activeVariant?.images && activeVariant.images.length > 0) {
            imgs = activeVariant.images.map(img => img.url);
        }
        // Fallback to product images
        if (imgs.length === 0 && product?.image && product.image.length > 0) {
            imgs = product.image.map(img => img.url);
        }
        if (imgs.length === 0) {
            imgs = DUMMY_IMAGES;
        }
        return imgs;
    };
    
    const images = getImages();
    // Ensure active image index is valid for current set of images
    const safeActiveImgIdx = activeImgIdx >= images.length ? 0 : activeImgIdx;

    return (
      <div>
        <style>{css}</style>

        <nav className="nav">
          <div className="nav-left">
            <button className="btn-pill-outline" onClick={() => navigate(-1)} style={{border: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0'}}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Shop
            </button>
          </div>
          <div className="nav-center">
            <span className="nav-logo" onClick={() => navigate('/')}>VOIDWEAR</span>
          </div>
          <div className="nav-right">
            {user ? (
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Hello, {user.fullname || 'User'}</span>
            ) : (
              <>
                <button className="btn-pill-outline" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn-pill" onClick={() => navigate('/register')}>Get Started</button>
              </>
            )}
          </div>
        </nav>

        <div className="pdp-container">
          <div className="pdp-image-col">
            <img src={images[safeActiveImgIdx]} alt={product.title} className="pdp-main-img" />
            {images.length > 1 && (
              <div className="pdp-thumbnails">
                {images.map((img, idx) => (
                  <img key={idx} src={img} className={`pdp-thumb ${safeActiveImgIdx === idx ? 'active' : ''}`} onClick={() => setActiveImgIdx(idx)} alt="" />
                ))}
              </div>
            )}
          </div>

          <div className="pdp-info-col">
            <h1 className="pdp-title">{product.title || 'Classic Hoodie'}</h1>
            <div className="pdp-price">{SYM[displayPrice?.currency]||'₹'}{Number(displayPrice?.amount || 0).toLocaleString()}</div>
            {stockAvailable !== null && <div className="pdp-stock">{stockAvailable > 0 ? `${stockAvailable} in stock` : 'Out of Stock'}</div>}
            
            <p className="pdp-desc">{product.description || 'Premium streetwear essential with a perfect modern fit.'}</p>

            {/* --- Variant Selector (always show if variants exist) --- */}
            {hasVariants && (
                <div style={{ marginBottom: '28px' }}>
                    <div className="pdp-section-title">Select Variant</div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {product.variants.map((v, idx) => {
                            const thumb = v.images?.[0]?.url || product.image?.[0]?.url || DUMMY_IMAGES[0];
                            // Build a short label from all attributes (e.g. "Green Check · S")
                            const label = v.attributes
                                ? Object.entries(v.attributes)
                                    .map(([, val]) => String(val).split(',')[0].trim())
                                    .join(' · ')
                                : `Option ${idx + 1}`;
                            const isSelected = selectedVariantIdx === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedVariantIdx(idx);
                                        setActiveImgIdx(0);
                                    }}
                                    className={`variant-btn ${isSelected ? 'selected' : ''}`}
                                >
                                    <img src={thumb} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#111' }}>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- Dynamic Attribute Selectors (shown once a variant is picked) --- */}
            {activeVariant && activeVariant.attributes && (
                <div>
                    {Object.entries(activeVariant.attributes).map(([attrKey, attrVal]) => {
                        const options = String(attrVal).split(',').map(s => s.trim()).filter(Boolean);
                        const isMulti = options.length > 1;
                        return (
                            <div key={attrKey} style={{ marginBottom: '24px' }}>
                                <div className="pdp-section-title">
                                    {attrKey}
                                    {/* Show selected value next to label */}
                                    {isMulti && selectedOptions[attrKey] && (
                                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 8, color: '#666' }}>
                                            — {selectedOptions[attrKey]}
                                        </span>
                                    )}
                                </div>
                                <div className="size-selector">
                                    {isMulti ? (
                                        // Comma-separated → render as clickable buttons
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
                                        // Single value → show as a non-interactive badge (already fixed)
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center',
                                            padding: '6px 16px', borderRadius: '24px',
                                            border: '1px solid #111', background: '#111',
                                            color: '#fff', fontSize: '13px', fontWeight: 600
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

            {/* Fallback size selector for products with no variants at all */}
            {!hasVariants && (
                <>
                    <div className="pdp-section-title">Select Size</div>
                    <div className="size-selector">
                        {['S', 'M', 'L', 'XL'].map(size => (
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

            <button className="add-to-cart-huge">Add to Cart</button>


            <div className="accordion">
              {accordionData.map((item, idx) => (
                <div className="accordion-item" key={idx}>
                  <div className="accordion-header" onClick={() => toggleAccordion(idx)}>
                    <span>{item.title}</span>
                    <svg className={`accordion-icon ${openAccordion === idx ? 'open' : ''}`} width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className={`accordion-content ${openAccordion === idx ? 'open' : ''}`}>{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="ft-top">
            <div className="ft-links">
              <div className="ft-col"><h4>Shop</h4><ul><li>All Products</li><li>New Arrivals</li><li>Best Sellers</li></ul></div>
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