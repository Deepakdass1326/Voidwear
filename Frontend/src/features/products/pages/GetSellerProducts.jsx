import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts.js';

const CURRENCY_SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JYP: '¥' };

export default function GetSellerProducts() {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProducts();

  const products = useSelector(state => state.product.sellerProducts);

  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [search, setSearch] = useState('');

  /* ── fetch on mount ── */
  useEffect(() => {
    (async () => {
      try {
        await handleGetSellerProducts();
      } catch {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── filtered list ── */
  const filtered = (products ?? []).filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] flex flex-col">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-8 h-[60px]">
        <span className="font-['Montserrat'] font-extrabold text-[1.1rem] tracking-[0.18em] uppercase text-gray-900 select-none">
          Voidwear
        </span>
        <button
          type="button"
          onClick={() => navigate('/seller/create/products')}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 px-4 py-2 rounded-lg border-none cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Product
        </button>
      </nav>

      {/* ── Main ── */}
      <main className="w-full max-w-[960px] mx-auto px-6 py-10 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[1.75rem] font-bold text-gray-900 tracking-tight leading-none">
              My Products
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} listed`}
            </p>
          </div>

          {/* Search */}
          {!loading && products?.length > 0 && (
            <div className="relative w-full sm:w-60">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all duration-200 placeholder-gray-400 font-['Inter']"
              />
            </div>
          )}
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── ERROR ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-medium text-gray-500">{error}</p>
            <button
              onClick={async () => { setLoading(true); setError(null); try { await handleGetSellerProducts(); } catch { setError('Failed to load products.'); } finally { setLoading(false); } }}
              className="text-xs font-semibold text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all cursor-pointer border-none"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {search ? 'No products match your search' : 'No products yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {search ? 'Try a different keyword' : 'Create your first product to get started'}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => navigate('/seller/create/products')}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer border-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Product
              </button>
            )}
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

/* ─── Product Card ─── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const symbol = CURRENCY_SYMBOL[product.price?.currency] ?? '₹';

  // Debug: log product to see exact image structure from backend
 

  const hasImage = product.image?.length > 0 || product.images?.length > 0;
  const imgUrl = (product.image?.[0]?.url) || (product.images?.[0]?.url) || null;

  const date = new Date(product.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div 
     onClick={() => navigate('/seller/product/' + product._id)}
     className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">

      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Image count badge */}
        {hasImage && (product.image?.length > 1 || product.images?.length > 1) && (
          <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded-full">
            +{(product.image?.length || product.images?.length) - 1} more
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
            {product.title}
          </h2>
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap shrink-0">
            {symbol}{Number(product.price?.amount).toLocaleString('en-IN')}
          </span>
        </div>

        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
          <span className="text-[10px] text-gray-300 font-medium">{date}</span>
         
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between gap-3">
          <div className="h-3.5 bg-gray-100 rounded w-2/3" />
          <div className="h-3.5 bg-gray-100 rounded w-1/5" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-px bg-gray-100 mt-1" />
        <div className="flex justify-between">
          <div className="h-2.5 bg-gray-100 rounded w-1/4" />
          <div className="h-2.5 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
