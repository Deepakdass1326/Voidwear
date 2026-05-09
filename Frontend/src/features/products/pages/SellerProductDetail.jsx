import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProducts';

const CURRENCY_SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JYP: '¥' };

const SellerProductDetail = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { handleGetProductDetails } = useProducts();

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

        // Price is optional, if no amount provided, we don't attach price (falls back to base price)
        const priceObj = newVariant.price.amount 
            ? { ...newVariant.price, amount: Number(newVariant.price.amount) } 
            : null;

        const variantData = {
            _id: 'local_' + Date.now(), // Generate local ID
            price: priceObj,
            stock: Number(newVariant.stock),
            attributes: attributesMap,
            images: newVariant.images // Save local preview URLs
        };

        // Save locally to state
        setProduct(prev => ({
            ...prev,
            variants: [...(prev.variants || []), variantData]
        }));

        // Reset form
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
        setNewVariant({...newVariant, attributes: newAttrs});
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Inter']">
                <p className="text-sm text-gray-500 animate-pulse">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-['Inter']">
                <p className="text-sm text-gray-500 mb-4">Product not found.</p>
                <button onClick={() => navigate('/seller/sellerProducts')} className="text-xs font-semibold text-white bg-gray-900 px-4 py-2 rounded-lg">Back to Products</button>
            </div>
        );
    }

    const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? '₹';
    const mainImages = product.image?.length > 0 ? product.image : product.images || [];

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter'] flex flex-col">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-[60px]">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/seller/sellerProducts')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="font-['Montserrat'] font-extrabold text-[1.1rem] tracking-[0.18em] uppercase text-gray-900 select-none">
                        Voidwear
                    </span>
                </div>
            </nav>

            {/* ── Main ── */}
            <main className="w-full max-w-[960px] mx-auto px-6 py-10 pb-16 flex flex-col gap-8">
                
                {/* Product Basic Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 shrink-0">
                        {mainImages.length > 0 ? (
                            <img src={mainImages[0].url} alt={product.title} className="w-full aspect-square object-cover rounded-lg border border-gray-100" />
                        ) : (
                            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                No image
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <div className="inline-flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                                <span className="text-sm font-semibold text-gray-900">Base Price: {symbol}{Number(product.price?.amount).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="inline-flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-xs text-gray-500">
                                Created: {new Date(product.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Product Variants</h2>
                        <button 
                            onClick={() => setShowVariantForm(!showVariantForm)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all px-4 py-2 rounded-lg"
                        >
                            {showVariantForm ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Variant
                                </>
                            )}
                        </button>
                    </div>

                    {/* New Variant Form */}
                    {showVariantForm && (
                        <form onSubmit={handleCreateVariant} className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Create New Variant</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price Amount (Optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{CURRENCY_SYMBOL[newVariant.price.currency]}</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            step="0.01"
                                            placeholder="Falls back to base price if empty"
                                            value={newVariant.price.amount}
                                            onChange={e => setNewVariant({...newVariant, price: {...newVariant.price, amount: e.target.value}})}
                                            className="w-full pl-7 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Initial Stock</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        value={newVariant.stock}
                                        onChange={e => setNewVariant({...newVariant, stock: e.target.value})}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Images Upload (Max 6) */}
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Variant Images (Max 6, Optional)</label>
                                <div className="flex flex-wrap gap-3 mb-2">
                                    {newVariant.images.map((img, idx) => (
                                        <div key={idx} className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden group">
                                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {newVariant.images.length < 6 && (
                                        <label className="w-16 h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Attributes */}
                            <div className="mb-4 border-t border-gray-100 pt-4">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Attributes <span className="text-red-500">*</span> (At least one required)</label>
                                {newVariant.attributes.map((attr, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Color, Size" 
                                            value={attr.key}
                                            onChange={e => updateAttribute(idx, 'key', e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-black transition-colors"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Red, XL" 
                                            value={attr.value}
                                            onChange={e => updateAttribute(idx, 'value', e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-black transition-colors"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => removeAttribute(idx)}
                                            disabled={newVariant.attributes.length === 1}
                                            className={`p-2 rounded-lg border border-transparent transition-colors ${newVariant.attributes.length === 1 ? 'text-gray-300' : 'text-red-500 hover:bg-red-50'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={addAttribute}
                                    className="text-xs font-semibold text-gray-600 hover:text-black mt-1 transition-colors"
                                >
                                    + Add another attribute
                                </button>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end pt-2 border-t border-gray-100 mt-4">
                                <button type="submit" className="mt-4 text-xs font-semibold text-white bg-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all">
                                    Save Variant
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Variants List */}
                    {product.variants && product.variants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {product.variants.map((variant, idx) => {
                                // Decide price display (fallback to base price if variant price not provided)
                                const hasVariantPrice = variant.price && variant.price.amount !== undefined && variant.price.amount !== null;
                                const displayCurrency = hasVariantPrice ? CURRENCY_SYMBOL[variant.price.currency] : symbol;
                                const displayAmount = hasVariantPrice ? variant.price.amount : product.price?.amount;
                                
                                return (
                                    <div key={variant._id || idx} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col hover:border-gray-300 transition-colors">
                                        
                                        {/* Images Preview in Card */}
                                        {variant.images && variant.images.length > 0 && (
                                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                                                {variant.images.map((img, i) => (
                                                    <img key={i} src={img.url} className="w-10 h-10 object-cover rounded border border-gray-100 shrink-0" alt="variant" />
                                                ))}
                                            </div>
                                        )}

                                        {/* Variant Info */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-900 block">
                                                        {displayCurrency}{Number(displayAmount).toLocaleString('en-IN')}
                                                    </span>
                                                    {!hasVariantPrice && <span className="text-[10px] text-gray-400 font-medium">(Base Price)</span>}
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {variant.attributes && Object.entries(variant.attributes).map(([key, val]) => (
                                                        <span key={key} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                                                            {key}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Stock management */}
                                        <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500">Stock Available</span>
                                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                                                <button 
                                                    onClick={() => handleUpdateStock(variant._id, Math.max(0, variant.stock - 1))}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                                </button>
                                                <span className="text-sm font-semibold w-8 text-center text-gray-900">{variant.stock}</span>
                                                <button 
                                                    onClick={() => handleUpdateStock(variant._id, variant.stock + 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">No variants created yet</p>
                            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Add variants for different sizes, colors, or styles to track their stock individually.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SellerProductDetail;