import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProducts';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JYP'];

const inputBase =
    "w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:bg-white font-['Inter'] placeholder-gray-400";

const selectBase =
    "w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:bg-white appearance-none cursor-pointer font-['Inter']";

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

    const [images, setImages] = useState([]);   // { file, preview }
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
            setTimeout(() => navigate("/seller/sellerProducts"), 1500);
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
        <div className="min-h-screen bg-gray-50 font-['Inter'] flex flex-col">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-[60px]">
                <span className="font-['Montserrat'] font-extrabold text-[1.1rem] tracking-[0.18em] uppercase text-gray-900 select-none">
                    Voidwear
                </span>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </nav>

            {/* ── Main ── */}
            <main className="w-full max-w-[760px] mx-auto px-6 py-10 pb-16">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-[1.75rem] font-bold text-gray-900 tracking-tight leading-none">
                        New Product
                    </h1>
                    <p className="mt-1.5 text-sm text-gray-400">
                        Fill in the details to list a product on your store.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                    {/* ── PRODUCT DETAILS ── */}
                    <section className="bg-white border border-gray-200 rounded-xl p-8">
                        <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
                            Product Details
                        </p>

                        <div className="flex flex-col gap-5">

                            {/* Title */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500" htmlFor="title">
                                    Title <span className="text-gray-900 font-semibold">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Oversized Void Tee"
                                    value={form.title}
                                    onChange={handleChange}
                                    className={`${inputBase} ${errors.title ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`}
                                />
                                {errors.title && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.title}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500" htmlFor="description">
                                    Description <span className="text-gray-900 font-semibold">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder="Describe the product — materials, fit, key details..."
                                    value={form.description}
                                    onChange={handleChange}
                                    className={`${inputBase} resize-y min-h-[110px] leading-relaxed ${errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`}
                                />
                                {errors.description && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                        </div>
                    </section>

                    {/* ── PRICING ── */}
                    <section className="bg-white border border-gray-200 rounded-xl p-8">
                        <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
                            Pricing
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* Price Amount */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500" htmlFor="priceAmount">
                                    Amount <span className="text-gray-900 font-semibold">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">
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
                                        className={`${inputBase} pl-7 ${errors.priceAmount ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`}
                                    />
                                </div>
                                {errors.priceAmount && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.priceAmount}
                                    </span>
                                )}
                            </div>

                            {/* Currency */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500" htmlFor="priceCurrency">
                                    Currency
                                </label>
                                <div className="relative">
                                    <select
                                        id="priceCurrency"
                                        name="priceCurrency"
                                        value={form.priceCurrency}
                                        onChange={handleChange}
                                        className={selectBase}
                                    >
                                        {CURRENCIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* ── IMAGES ── */}
                    <section className="bg-white border border-gray-200 rounded-xl p-8">
                        <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
                            Product Images
                        </p>

                        {/* Drop Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-all duration-200 text-center select-none
                ${dragOver
                                    ? 'border-gray-900 bg-gray-50'
                                    : errors.images
                                        ? 'border-red-400 bg-red-50/20'
                                        : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white'
                                }`}
                        >
                            <svg className="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Drop images here, or <span className="text-gray-900 underline underline-offset-2">browse</span>
                                </p>
                                <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP — up to 6 images</p>
                            </div>
                        </div>

                        {errors.images && (
                            <span className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.images}
                            </span>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => addFiles(e.target.files)}
                        />

                        {/* Previews */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {images.map((img, i) => (
                                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={img.preview} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center cursor-pointer border-none"
                                            title="Remove"
                                        >
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        {/* first image badge */}
                                        {i === 0 && (
                                            <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* Add more slot */}
                                {images.length < 6 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-500 transition-all duration-150 cursor-pointer bg-transparent"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* ── ACTION BAR ── */}
                    <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-gray-400">
                            <span className="text-gray-900 font-semibold">*</span> Required fields
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 border border-gray-900 rounded-lg transition-all duration-150
                  ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-700 active:scale-[0.98] cursor-pointer'}`}
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Creating…
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </main>

            {/* ── Toast ── */}
            {toast && (
                <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-2xl animate-[slideUp_0.3s_ease]">
                    {toast}
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

/* ─── Spinner ─── */
function Spinner() {
    return (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
        </svg>
    );
}