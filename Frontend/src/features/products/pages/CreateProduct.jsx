import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProducts';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JYP'];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

.cp-shell { min-height: 100vh; background: #f7f7f5; display: flex; flex-direction: column; }

/* Navbar */
.cp-nav { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; }
.cp-logo { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 1.1rem; letter-spacing: 0.18em; text-transform: uppercase; color: #111; user-select: none; }
.cp-nav-back { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #6b7280; background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: 'Inter', sans-serif; }
.cp-nav-back:hover { color: #111; }

/* Main */
.cp-main { width: 100%; max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
.cp-header { margin-bottom: 32px; }
.cp-title { font-size: 1.75rem; font-weight: 700; color: #111; letter-spacing: -0.02em; line-height: 1; }
.cp-subtitle { margin-top: 6px; font-size: 14px; color: #9ca3af; }

/* Form Sections */
.cp-form { display: flex; flex-direction: column; gap: 20px; }
.cp-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; }
.cp-section-title { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }

.cp-field-group { display: flex; flex-direction: column; gap: 20px; }
.cp-field-row { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media(min-width: 640px) { .cp-field-row { grid-template-columns: 1fr 1fr; } }

.cp-field { display: flex; flex-direction: column; gap: 6px; }
.cp-label { font-size: 12px; font-weight: 500; color: #6b7280; }
.cp-label span { color: #111; font-weight: 600; }
.cp-input-wrap { position: relative; }
.cp-input { width: 100%; padding: 10px 12px; font-size: 14px; color: #111; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; }
.cp-input:focus { border-color: #111; background: #fff; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }
.cp-input::placeholder { color: #9ca3af; }
.cp-input-error { border-color: #f87171 !important; }
.cp-input-error:focus { box-shadow: 0 0 0 2px rgba(248,113,113,0.1) !important; }

.cp-currency-symbol { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #9ca3af; font-weight: 500; user-select: none; }
.cp-input-with-symbol { padding-left: 28px; }

.cp-select { appearance: none; cursor: pointer; }
.cp-select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #9ca3af; pointer-events: none; }

.cp-error-msg { font-size: 12px; color: #ef4444; display: flex; align-items: center; gap: 4px; margin-top: 4px; }

/* Dropzone */
.cp-dropzone { border: 2px dashed #e5e7eb; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 56px 20px; cursor: pointer; transition: all 0.2s; text-align: center; user-select: none; background: #f9fafb; }
.cp-dropzone:hover { border-color: #9ca3af; background: #fff; }
.cp-dropzone-active { border-color: #111; background: #f9fafb; }
.cp-dropzone-error { border-color: #f87171; background: rgba(254,242,242,0.5); }
.cp-dropzone svg { width: 36px; height: 36px; color: #d1d5db; }
.cp-dropzone-text { font-size: 14px; font-weight: 500; color: #6b7280; }
.cp-dropzone-text span { color: #111; text-decoration: underline; text-underline-offset: 2px; }
.cp-dropzone-sub { font-size: 12px; color: #d1d5db; margin-top: 4px; }

/* Image Previews */
.cp-preview-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
.cp-preview-item { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
.cp-preview-item img { width: 100%; height: 100%; object-fit: cover; }
.cp-preview-remove { position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: opacity 0.15s; }
.cp-preview-item:hover .cp-preview-remove { opacity: 1; }
.cp-preview-remove svg { width: 20px; height: 20px; color: #fff; }
.cp-preview-badge { position: absolute; bottom: 4px; left: 4px; font-size: 9px; font-weight: 600; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 6px; border-radius: 4px; }
.cp-preview-add { width: 80px; height: 80px; border-radius: 8px; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; color: #d1d5db; background: transparent; cursor: pointer; transition: all 0.15s; }
.cp-preview-add:hover { border-color: #9ca3af; color: #6b7280; }

/* Action Bar */
.cp-action-bar { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; }
.cp-req-text { font-size: 12px; color: #9ca3af; }
.cp-req-text span { color: #111; font-weight: 600; }
.cp-actions { display: flex; align-items: center; gap: 12px; }
.cp-btn-cancel { padding: 10px 20px; font-size: 14px; font-weight: 500; color: #6b7280; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
.cp-btn-cancel:hover { background: #f9fafb; border-color: #d1d5db; }
.cp-btn-submit { display: flex; align-items: center; gap: 8px; padding: 10px 24px; font-size: 14px; font-weight: 600; color: #fff; background: #111; border: 1px solid #111; border-radius: 8px; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
.cp-btn-submit:hover:not(:disabled) { background: #374151; }
.cp-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* Toast */
.cp-toast { position: fixed; bottom: 32px; right: 32px; z-index: 100; display: flex; align-items: center; gap: 8px; background: #111; color: #fff; font-size: 14px; font-weight: 500; padding: 12px 20px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function CreateProduct() {
    const navigate = useNavigate();
    const { handleCreateProduct } = useProducts();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });

    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    /* ── helpers ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const addFiles = (files) => {
        const allowed = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .slice(0, 6 - images.length)
            .map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...allowed]);
        setErrors(prev => ({ ...prev, images: '' }));
    };

    const removeImage = (idx) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[idx].preview);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    /* ── validation ── */
    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Product title is required';
        if (!form.description.trim()) errs.description = 'Description is required';
        if (!form.priceAmount || isNaN(form.priceAmount) || Number(form.priceAmount) <= 0)
            errs.priceAmount = 'Enter a valid price';
        if (images.length === 0) errs.images = 'Add at least one product image';
        return errs;
    };

    /* ── submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('priceAmount', form.priceAmount);
            formData.append('priceCurrency', form.priceCurrency);
            images.forEach(({ file }) => formData.append('images', file));

            await handleCreateProduct(formData);
            showToast('✓  Product created successfully');
            setTimeout(() => navigate("/seller/products"), 1500);
        } catch {
            showToast('❌  Failed to create product. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="cp-shell">
            <style>{css}</style>

            {/* Navbar */}
            <nav className="cp-nav">
                <span className="cp-logo">Voidwear</span>
                <button type="button" onClick={() => navigate(-1)} className="cp-nav-back">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </nav>

            {/* Main */}
            <main className="cp-main">
                <div className="cp-header">
                    <h1 className="cp-title">New Product</h1>
                    <p className="cp-subtitle">Fill in the details to list a product on your store.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="cp-form">
                    {/* PRODUCT DETAILS */}
                    <section className="cp-section">
                        <p className="cp-section-title">Product Details</p>
                        <div className="cp-field-group">
                            <div className="cp-field">
                                <label className="cp-label" htmlFor="title">Title <span>*</span></label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Oversized Void Tee"
                                    value={form.title}
                                    onChange={handleChange}
                                    className={`cp-input ${errors.title ? 'cp-input-error' : ''}`}
                                />
                                {errors.title && (
                                    <span className="cp-error-msg">
                                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.title}
                                    </span>
                                )}
                            </div>

                            <div className="cp-field">
                                <label className="cp-label" htmlFor="description">Description <span>*</span></label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    placeholder="Describe the product — materials, fit, key details..."
                                    value={form.description}
                                    onChange={handleChange}
                                    className={`cp-input ${errors.description ? 'cp-input-error' : ''}`}
                                    style={{ resize: 'vertical', minHeight: '110px', lineHeight: '1.5' }}
                                />
                                {errors.description && (
                                    <span className="cp-error-msg">
                                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section className="cp-section">
                        <p className="cp-section-title">Pricing</p>
                        <div className="cp-field-row">
                            <div className="cp-field">
                                <label className="cp-label" htmlFor="priceAmount">Amount <span>*</span></label>
                                <div className="cp-input-wrap">
                                    <span className="cp-currency-symbol">
                                        {form.priceCurrency === 'INR' ? '₹' : form.priceCurrency === 'USD' ? '$' : form.priceCurrency === 'EUR' ? '€' : form.priceCurrency === 'GBP' ? '£' : '¥'}
                                    </span>
                                    <input
                                        id="priceAmount"
                                        name="priceAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={form.priceAmount}
                                        onChange={handleChange}
                                        className={`cp-input cp-input-with-symbol ${errors.priceAmount ? 'cp-input-error' : ''}`}
                                    />
                                </div>
                                {errors.priceAmount && (
                                    <span className="cp-error-msg">
                                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.priceAmount}
                                    </span>
                                )}
                            </div>

                            <div className="cp-field">
                                <label className="cp-label" htmlFor="priceCurrency">Currency</label>
                                <div className="cp-input-wrap">
                                    <select
                                        id="priceCurrency"
                                        name="priceCurrency"
                                        value={form.priceCurrency}
                                        onChange={handleChange}
                                        className="cp-input cp-select"
                                    >
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <svg className="cp-select-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* IMAGES */}
                    <section className="cp-section">
                        <p className="cp-section-title">Product Images</p>
                        
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`cp-dropzone ${dragOver ? 'cp-dropzone-active' : ''} ${errors.images ? 'cp-dropzone-error' : ''}`}
                        >
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <div>
                                <p className="cp-dropzone-text">Drop images here, or <span>browse</span></p>
                                <p className="cp-dropzone-sub">PNG, JPG, WEBP — up to 6 images</p>
                            </div>
                        </div>

                        {errors.images && (
                            <span className="cp-error-msg" style={{ marginTop: '8px' }}>
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {errors.images}
                            </span>
                        )}

                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} />

                        {images.length > 0 && (
                            <div className="cp-preview-grid">
                                {images.map((img, i) => (
                                    <div key={i} className="cp-preview-item">
                                        <img src={img.preview} alt={`preview-${i}`} />
                                        <button type="button" onClick={() => removeImage(i)} className="cp-preview-remove" title="Remove">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        {i === 0 && <span className="cp-preview-badge">Cover</span>}
                                    </div>
                                ))}
                                {images.length < 6 && (
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="cp-preview-add">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* ACTION BAR */}
                    <div className="cp-action-bar">
                        <p className="cp-req-text"><span>*</span> Required fields</p>
                        <div className="cp-actions">
                            <button type="button" onClick={() => navigate(-1)} className="cp-btn-cancel">Cancel</button>
                            <button type="submit" disabled={loading} className="cp-btn-submit">
                                {loading ? (
                                    <>
                                        <Spinner /> Creating…
                                    </>
                                ) : (
                                    <>
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>

            {/* Toast */}
            {toast && <div className="cp-toast">{toast}</div>}
        </div>
    );
}

function Spinner() {
    return (
        <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </svg>
    );
}