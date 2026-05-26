import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProducts';

const CURRENCY_SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JYP: '¥' };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

.spd-shell { min-height: 100vh; background: #f7f7f5; display: flex; flex-direction: column; }

/* Navbar */
.spd-nav { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; }
.spd-nav-left { display: flex; align-items: center; gap: 16px; }
.spd-logo { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 1.1rem; letter-spacing: 0.18em; text-transform: uppercase; color: #111; user-select: none; }
.spd-nav-back { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #f9fafb; border: none; cursor: pointer; transition: all 0.2s; color: #6b7280; margin-left: -8px; }
.spd-nav-back:hover { background: #f3f4f6; color: #111; }

/* Main */
.spd-main { width: 100%; max-width: 960px; margin: 0 auto; padding: 40px 24px 64px; display: flex; flex-direction: column; gap: 32px; }

/* Product Header */
.spd-header-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 24px; }
@media(min-width: 768px) { .spd-header-card { flex-direction: row; } }
.spd-header-img { width: 100%; aspect-ratio: 1; border-radius: 8px; border: 1px solid #f3f4f6; object-fit: cover; }
@media(min-width: 768px) { .spd-header-img { width: 200px; flex-shrink: 0; } }
.spd-header-no-img { width: 100%; aspect-ratio: 1; border-radius: 8px; background: #f9fafb; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #9ca3af; }
@media(min-width: 768px) { .spd-header-no-img { width: 200px; flex-shrink: 0; } }
.spd-header-info { display: flex; flex-direction: column; justify-content: center; }
.spd-header-title { font-size: 1.5rem; font-weight: 700; color: #111; line-height: 1.2; }
.spd-header-desc { font-size: 14px; color: #6b7280; margin-top: 12px; line-height: 1.6; }
.spd-header-meta { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 12px; }
.spd-meta-tag { display: inline-flex; items-center; background: #f9fafb; border: 1px solid #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #111; }
.spd-meta-date { display: inline-flex; items-center; background: #f9fafb; border: 1px solid #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #6b7280; font-weight: 500; }

/* Variants Section */
.spd-variants-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.spd-variants-title { font-size: 1.25rem; font-weight: 700; color: #111; }
.spd-btn-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #111; background: #fff; border: 1px solid #e5e7eb; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
.spd-btn-toggle:hover { background: #f9fafb; border-color: #d1d5db; }

/* Variant Form */
.spd-form { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.spd-form-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 20px; }
.spd-form-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 20px; }
@media(min-width: 768px) { .spd-form-grid { grid-template-columns: 1fr 1fr; } }
.spd-field { display: flex; flex-direction: column; gap: 6px; }
.spd-label { font-size: 12px; font-weight: 600; color: #6b7280; }
.spd-input-wrap { position: relative; }
.spd-input { width: 100%; padding: 10px 12px; font-size: 14px; color: #111; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; }
.spd-input:focus { border-color: #111; background: #fff; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }
.spd-currency-symbol { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #9ca3af; font-weight: 500; }
.spd-input-with-symbol { padding-left: 28px; }

/* Form Images */
.spd-images-label { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
.spd-images-list { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.spd-image-item { position: relative; width: 64px; height: 64px; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; }
.spd-image-item img { width: 100%; height: 100%; object-fit: cover; }
.spd-image-remove { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; cursor: pointer; border: none; color: #fff; }
.spd-image-item:hover .spd-image-remove { opacity: 1; }
.spd-image-add { width: 64px; height: 64px; border-radius: 8px; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; cursor: pointer; background: transparent; color: #9ca3af; transition: all 0.2s; }
.spd-image-add:hover { background: #f9fafb; border-color: #9ca3af; color: #6b7280; }

/* Attributes */
.spd-attrs { padding-top: 20px; border-top: 1px solid #f3f4f6; margin-bottom: 20px; }
.spd-attr-row { display: flex; gap: 8px; margin-bottom: 8px; }
.spd-attr-input { flex: 1; padding: 10px 12px; font-size: 14px; color: #111; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; }
.spd-attr-input:focus { border-color: #111; background: #fff; }
.spd-attr-remove { width: 40px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.spd-attr-remove:hover:not(:disabled) { background: #fef2f2; border-color: #fca5a5; }
.spd-attr-remove:disabled { color: #d1d5db; cursor: not-allowed; }
.spd-attr-add { font-size: 12px; font-weight: 600; color: #6b7280; background: none; border: none; cursor: pointer; padding-top: 8px; transition: color 0.2s; font-family: 'Inter', sans-serif; }
.spd-attr-add:hover { color: #111; }

.spd-form-footer { padding-top: 20px; border-top: 1px solid #f3f4f6; display: flex; justify-content: flex-end; }
.spd-btn-submit { font-size: 12px; font-weight: 600; color: #fff; background: #111; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: background 0.2s; font-family: 'Inter', sans-serif; }
.spd-btn-submit:hover { background: #374151; }

/* Variant Cards */
.spd-variants-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media(min-width: 640px) { .spd-variants-grid { grid-template-columns: 1fr 1fr; } }
@media(min-width: 1024px) { .spd-variants-grid { grid-template-columns: 1fr 1fr 1fr; } }

.spd-vcard { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; transition: border-color 0.2s; }
.spd-vcard:hover { border-color: #d1d5db; }
.spd-vcard-imgs { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 4px; }
.spd-vcard-imgs::-webkit-scrollbar { display: none; }
.spd-vcard-img { width: 44px; height: 44px; border-radius: 6px; border: 1px solid #f3f4f6; object-fit: cover; flex-shrink: 0; }

.spd-vcard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.spd-vcard-price { display: flex; align-items: center; gap: 6px; }
.spd-vcard-price-main { font-size: 14px; font-weight: 700; color: #111; }
.spd-vcard-price-base { font-size: 10px; font-weight: 500; color: #9ca3af; }
.spd-vcard-attrs { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
.spd-vcard-attr { font-size: 10px; font-weight: 600; background: #f3f4f6; color: #4b5563; padding: 4px 8px; border-radius: 4px; }

.spd-vcard-footer { border-top: 1px solid #f3f4f6; padding-top: 12px; margin-top: auto; display: flex; align-items: center; justify-content: space-between; }
.spd-vcard-stock-label { font-size: 12px; font-weight: 500; color: #6b7280; }
.spd-vcard-stock-ctrl { display: flex; align-items: center; gap: 4px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2px; }
.spd-vcard-stock-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; border-radius: 6px; cursor: pointer; color: #6b7280; transition: all 0.15s; }
.spd-vcard-stock-btn:hover { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); color: #111; }
.spd-vcard-stock-val { font-size: 13px; font-weight: 600; color: #111; width: 32px; text-align: center; }

/* Empty State */
.spd-empty { background: #fff; border: 1px dashed #d1d5db; border-radius: 12px; padding: 64px 24px; text-align: center; }
.spd-empty-icon { width: 48px; height: 48px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #9ca3af; }
.spd-empty-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 6px; }
.spd-empty-desc { font-size: 12px; color: #6b7280; max-width: 320px; margin: 0 auto; line-height: 1.5; }

/* Loading State */
.spd-loading { min-height: 100vh; background: #f9fafb; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; }
.spd-loading-text { font-size: 14px; color: #6b7280; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

/* Error State */
.spd-error { min-height: 100vh; background: #f9fafb; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; font-family: 'Inter', sans-serif; }
.spd-error-text { font-size: 14px; color: #6b7280; }
.spd-error-btn { font-size: 12px; font-weight: 600; color: #fff; background: #111; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; }
`;

const SellerProductDetail = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { handleGetProductDetails, handleAddProductVariants } = useProducts();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Variant form state
    const [showVariantForm, setShowVariantForm] = useState(false);
    const [newVariant, setNewVariant] = useState({
        price: { amount: '', currency: 'INR' },
        stock: 0,
        attributes: [{ key: '', value: '' }],
        images: []
    });

    async function fetchProduct() {
        if (!productId) return;
        setLoading(true);
        try {
            const data = await handleGetProductDetails(productId);
            setProduct(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const handleUpdateStock = async (variantId, newStock) => {
        console.log(`Updating stock for variant ${variantId} to ${newStock}`);

        // Optimistic UI update
        setProduct(prev => {
            const updatedVariants = prev.variants.map(v =>
                v._id === variantId ? { ...v, stock: newStock } : v
            );
            return { ...prev, variants: updatedVariants };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (newVariant.images.length + files.length > 6) {
            alert("You can only upload up to 6 images per variant.");
            return;
        }

        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file) // Create local URL for preview
        }));

        setNewVariant(prev => ({
            ...prev,
            images: [...prev.images, ...newImages].slice(0, 6)
        }));
    };

    const removeImage = (index) => {
        setNewVariant(prev => {
            const updated = [...prev.images];
            URL.revokeObjectURL(updated[index].url); // Clean up memory
            updated.splice(index, 1);
            return { ...prev, images: updated };
        });
    };

    const handleCreateVariant = async (e) => {
        e.preventDefault();

        // Filter out empty attributes
        const validAttributes = newVariant.attributes.filter(attr => attr.key.trim() && attr.value.trim());

        if (validAttributes.length === 0) {
            alert("Please provide at least one valid attribute (e.g., Color, Size).");
            return;
        }

        const attributesMap = {};
        validAttributes.forEach(attr => {
            attributesMap[attr.key.trim()] = attr.value.trim();
        });

        const variantData = {
            priceAmount: Number(newVariant.price.amount),
            stock: Number(newVariant.stock),
            attributes: attributesMap,
            images: newVariant.images
        };
        try {
            const updatedProduct = await handleAddProductVariants(productId, variantData);

            setProduct(updatedProduct)

            setNewVariant({
                price: { amount: '', currency: 'INR' },
                stock: 0,
                attributes: [{ key: '', value: '' }],
                images: []
            })

            setShowVariantForm(false);
            alert("Variant created successfully");

        } catch (error) {
            console.error('Error creating variant:', error);
            alert("Failed to create variant. Please try again.");
        }

        setNewVariant({
            price: { amount: '', currency: 'INR' },
            stock: 0,
            attributes: [{ key: '', value: '' }],
            images: []
        });
        setShowVariantForm(false);
    };

    const addAttribute = () => {
        setNewVariant(prev => ({
            ...prev,
            attributes: [...prev.attributes, { key: '', value: '' }]
        }));
    };

    const updateAttribute = (index, field, value) => {
        const newAttrs = [...newVariant.attributes];
        newAttrs[index][field] = value;
        setNewVariant(prev => ({ ...prev, attributes: newAttrs }));
    };

    const removeAttribute = (index) => {
        const newAttrs = [...newVariant.attributes];
        newAttrs.splice(index, 1);
        setNewVariant({ ...newVariant, attributes: newAttrs });
    };

    if (loading) {
        return (
            <div className="spd-loading">
                <style>{css}</style>
                <p className="spd-loading-text">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="spd-error">
                <style>{css}</style>
                <p className="spd-error-text">Product not found.</p>
                <button onClick={() => navigate('/seller/products')} className="spd-error-btn">Back to Products</button>
            </div>
        );
    }

    const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? '₹';
    const mainImages = product.image?.length > 0 ? product.image : product.images || [];

    return (
        <div className="spd-shell">
            <style>{css}</style>

            {/* Navbar */}
            <nav className="spd-nav">
                <div className="spd-nav-left">
                    <button onClick={() => { if (window.history.length > 1) { navigate(-1); } else { navigate('/seller/products'); } }} className="spd-nav-back">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="spd-logo">Voidwear</span>
                </div>
            </nav>

            {/* Main */}
            <main className="spd-main">

                {/* Product Basic Info */}
                <div className="spd-header-card">
                    {mainImages.length > 0 ? (
                        <img src={mainImages[0].url} alt={product.title} className="spd-header-img" />
                    ) : (
                        <div className="spd-header-no-img">No image</div>
                    )}
                    <div className="spd-header-info">
                        <h1 className="spd-header-title">{product.title}</h1>
                        <p className="spd-header-desc">{product.description}</p>
                        <div className="spd-header-meta">
                            <div className="spd-meta-tag">
                                Base Price: {symbol}{Number(product.price?.amount).toLocaleString('en-IN')}
                            </div>
                            <div className="spd-meta-date">
                                Created: {new Date(product.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div>
                    <div className="spd-variants-header">
                        <h2 className="spd-variants-title">Product Variants</h2>
                        <button onClick={() => setShowVariantForm(!showVariantForm)} className="spd-btn-toggle">
                            {showVariantForm ? (
                                <>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                    Add Variant
                                </>
                            )}
                        </button>
                    </div>

                    {/* New Variant Form */}
                    {showVariantForm && (
                        <form onSubmit={handleCreateVariant} className="spd-form">
                            <h3 className="spd-form-title">Create New Variant</h3>

                            <div className="spd-form-grid">
                                <div className="spd-field">
                                    <label className="spd-label">Price Amount (Optional)</label>
                                    <div className="spd-input-wrap">
                                        <span className="spd-currency-symbol">{CURRENCY_SYMBOL[newVariant.price.currency]}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Falls back to base price"
                                            value={newVariant.price.amount}
                                            onChange={e => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                                            className="spd-input spd-input-with-symbol"
                                        />
                                    </div>
                                </div>
                                <div className="spd-field">
                                    <label className="spd-label">Initial Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newVariant.stock}
                                        onChange={e => setNewVariant({ ...newVariant, stock: e.target.value })}
                                        className="spd-input"
                                    />
                                </div>
                            </div>

                            {/* Images Upload (Max 6) */}
                            <div style={{ marginBottom: '20px' }}>
                                <label className="spd-images-label" style={{ display: 'block' }}>Variant Images (Max 6, Optional)</label>
                                <div className="spd-images-list">
                                    {newVariant.images.map((img, idx) => (
                                        <div key={idx} className="spd-image-item">
                                            <img src={img.url} alt="" />
                                            <button type="button" onClick={() => removeImage(idx)} className="spd-image-remove">
                                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {newVariant.images.length < 6 && (
                                        <label className="spd-image-add">
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Attributes */}
                            <div className="spd-attrs">
                                <label className="spd-label" style={{ display: 'block', marginBottom: '8px' }}>Attributes * (At least one required)</label>
                                {newVariant.attributes.map((attr, idx) => (
                                    <div key={idx} className="spd-attr-row">
                                        <input
                                            type="text"
                                            placeholder="e.g. Color, Size"
                                            value={attr.key}
                                            onChange={e => updateAttribute(idx, 'key', e.target.value)}
                                            className="spd-attr-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="e.g. Red, XL"
                                            value={attr.value}
                                            onChange={e => updateAttribute(idx, 'value', e.target.value)}
                                            className="spd-attr-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAttribute(idx)}
                                            disabled={newVariant.attributes.length === 1}
                                            className="spd-attr-remove"
                                        >
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addAttribute} className="spd-attr-add">+ Add another attribute</button>
                            </div>

                            {/* Submit */}
                            <div className="spd-form-footer">
                                <button type="submit" className="spd-btn-submit">Save Variant</button>
                            </div>
                        </form>
                    )}

                    {/* Variants List */}
                    {product.variants && product.variants.length > 0 ? (
                        <div className="spd-variants-grid">
                            {product.variants.map((variant, idx) => {
                                const hasVariantPrice = variant.price && variant.price.amount !== undefined && variant.price.amount !== null;
                                const displayCurrency = hasVariantPrice ? CURRENCY_SYMBOL[variant.price.currency] : symbol;
                                const displayAmount = hasVariantPrice ? variant.price.amount : product.price?.amount;

                                return (
                                    <div key={variant._id || idx} className="spd-vcard">
                                        {/* Images Preview in Card */}
                                        {variant.images && variant.images.length > 0 && (
                                            <div className="spd-vcard-imgs">
                                                {variant.images.map((img, i) => (
                                                    <img key={i} src={img.url} className="spd-vcard-img" alt="variant" />
                                                ))}
                                            </div>
                                        )}

                                        {/* Variant Info */}
                                        <div className="spd-vcard-header">
                                            <div>
                                                <div className="spd-vcard-price">
                                                    <span className="spd-vcard-price-main">
                                                        {displayCurrency}{Number(displayAmount).toLocaleString('en-IN')}
                                                    </span>
                                                    {!hasVariantPrice && <span className="spd-vcard-price-base">(Base Price)</span>}
                                                </div>
                                                <div className="spd-vcard-attrs">
                                                    {variant.attributes && Object.entries(variant.attributes).map(([key, val]) => (
                                                        <span key={key} className="spd-vcard-attr">{key}: {val}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stock management */}
                                        <div className="spd-vcard-footer">
                                            <span className="spd-vcard-stock-label">Stock Available</span>
                                            <div className="spd-vcard-stock-ctrl">
                                                <button
                                                    onClick={() => handleUpdateStock(variant._id, Math.max(0, variant.stock - 1))}
                                                    className="spd-vcard-stock-btn"
                                                >
                                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                                </button>
                                                <span className="spd-vcard-stock-val">{variant.stock}</span>
                                                <button
                                                    onClick={() => handleUpdateStock(variant._id, variant.stock + 1)}
                                                    className="spd-vcard-stock-btn"
                                                >
                                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="spd-empty">
                            <div className="spd-empty-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="spd-empty-title">No variants created yet</p>
                            <p className="spd-empty-desc">Add variants for different sizes, colors, or styles to track their stock individually.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SellerProductDetail;