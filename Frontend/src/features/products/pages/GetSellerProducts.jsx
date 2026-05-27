import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts.js';

const CURRENCY_SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JYP: '¥' };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.gsp-shell { min-height: 100vh; background: #f7f7f5; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; }

/* Navbar */
.gsp-nav { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid #e8e8e8; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px; }
.gsp-logo { font-weight: 700; font-size: 1rem; letter-spacing: -0.03em; color: #111; cursor: pointer; text-transform: lowercase; user-select: none; }
.gsp-nav-right { display: flex; align-items: center; gap: 24px; }
.gsp-nav-link { font-size: 11px; font-weight: 500; color: #888; cursor: pointer; text-transform: uppercase; letter-spacing: 0.06em; transition: color 0.2s; }
.gsp-nav-link:hover { color: #111; }
.gsp-btn-new { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #fff; background: #111; border: none; padding: 9px 18px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Inter', sans-serif; transition: background 0.2s; }
.gsp-btn-new:hover { background: #333; }
.gsp-btn-new svg { width: 12px; height: 12px; }

/* Main */
.gsp-main { width: 100%; max-width: 960px; margin: 0 auto; padding: 48px 24px 80px; }

/* Page header */
.gsp-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
.gsp-header-left h1 { font-size: 1.6rem; font-weight: 500; color: #111; letter-spacing: -0.03em; }
.gsp-header-left p { font-size: 13px; color: #aaa; margin-top: 4px; }

/* Search */
.gsp-search-wrap { position: relative; width: 220px; }
.gsp-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #aaa; pointer-events: none; }
.gsp-search { width: 100%; padding: 9px 12px 9px 34px; border: 1px solid #e0e0e0; outline: none; font-family: 'Inter', sans-serif; font-size: 13px; color: #111; background: #fff; transition: border-color 0.2s; }
.gsp-search:focus { border-color: #111; }
.gsp-search::placeholder { color: #ccc; }

/* Product grid */
.gsp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }

/* Product card */
.gsp-card { background: #fff; border: 1px solid #e8e8e8; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden; }
.gsp-card:hover { border-color: #ccc; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.gsp-card-img-wrap { aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden; position: relative; }
.gsp-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease; }
.gsp-card:hover .gsp-card-img-wrap img { transform: scale(1.04); }
.gsp-card-no-img { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #ddd; }
.gsp-card-no-img span { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
.gsp-card-badge { position: absolute; bottom: 8px; right: 8px; font-size: 10px; font-weight: 600; background: rgba(0,0,0,0.6); color: #fff; padding: 2px 7px; }
.gsp-card-body { padding: 16px; }
.gsp-card-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
.gsp-card-title { font-size: 13px; font-weight: 600; color: #111; line-height: 1.4; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.gsp-card-price { font-size: 13px; font-weight: 700; color: #111; white-space: nowrap; flex-shrink: 0; }
.gsp-card-desc { font-size: 11px; color: #aaa; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 10px; }
.gsp-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #f0f0f0; }
.gsp-card-date { font-size: 10px; color: #ccc; font-weight: 500; }

/* Skeleton */
.gsp-skeleton { background: #fff; border: 1px solid #e8e8e8; overflow: hidden; }
.gsp-skel-img { aspect-ratio: 3/4; background: #f0f0f0; animation: gsp-pulse 1.4s ease-in-out infinite; }
.gsp-skel-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.gsp-skel-row { display: flex; justify-content: space-between; gap: 10px; }
.gsp-skel-line { background: #f0f0f0; height: 12px; border-radius: 2px; animation: gsp-pulse 1.4s ease-in-out infinite; }
@keyframes gsp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

/* Error state */
.gsp-error { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 16px; text-align: center; }
.gsp-error svg { color: #ddd; }
.gsp-error p { font-size: 13px; color: #888; }
.gsp-btn-retry { background: #111; color: #fff; border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 10px 20px; cursor: pointer; transition: background 0.2s; }
.gsp-btn-retry:hover { background: #333; }

/* Empty state */
.gsp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 16px; text-align: center; }
.gsp-empty-icon { width: 56px; height: 56px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
.gsp-empty-icon svg { color: #ccc; }
.gsp-empty-title { font-size: 13px; font-weight: 600; color: #111; }
.gsp-empty-sub { font-size: 12px; color: #aaa; margin-top: -8px; }
.gsp-btn-create { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #fff; background: #111; border: none; padding: 11px 20px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Inter', sans-serif; transition: background 0.2s; margin-top: 4px; }
.gsp-btn-create:hover { background: #333; }
`;

export default function GetSellerProducts() {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProducts();

  const products = useSelector(state => state.product.sellerProducts);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="gsp-shell">
      <style>{css}</style>

      {/* Navbar */}
      <nav className="gsp-nav">
        <span className="gsp-logo" onClick={() => navigate('/')}>voidwear.</span>
        <div className="gsp-nav-right">
          <span className="gsp-nav-link" onClick={() => navigate('/seller/products')}>My Products</span>
          <button type="button" className="gsp-btn-new" onClick={() => navigate('/seller/products/new')}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Product
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="gsp-main">

        {/* Header */}
        <div className="gsp-header">
          <div className="gsp-header-left">
            <h1>My Products</h1>
            <p>{loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} listed`}</p>
          </div>

          {/* Search */}
          {!loading && products?.length > 0 && (
            <div className="gsp-search-wrap">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="gsp-search"
              />
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="gsp-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="gsp-error">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p>{error}</p>
            <button
              className="gsp-btn-retry"
              onClick={async () => { setLoading(true); setError(null); try { await handleGetSellerProducts(); } catch { setError('Failed to load products.'); } finally { setLoading(false); } }}
            >
              Retry
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filtered.length === 0 && (
          <div className="gsp-empty">
            <div className="gsp-empty-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="gsp-empty-title">{search ? 'No products match your search' : 'No products yet'}</p>
            <p className="gsp-empty-sub">{search ? 'Try a different keyword' : 'Create your first product to get started'}</p>
            {!search && (
              <button className="gsp-btn-create" onClick={() => navigate('/seller/products/new')}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Product
              </button>
            )}
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && filtered.length > 0 && (
          <div className="gsp-grid">
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

  const hasImage = product.image?.length > 0 || product.images?.length > 0;
  const imgUrl = (product.image?.[0]?.url) || (product.images?.[0]?.url) || null;

  const date = new Date(product.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="gsp-card" onClick={() => navigate('/seller/products/' + product._id)}>

      {/* Image */}
      <div className="gsp-card-img-wrap">
        {imgUrl ? (
          <img src={imgUrl} alt={product.title} />
        ) : (
          <div className="gsp-card-no-img">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>No image</span>
          </div>
        )}

        {/* Image count badge */}
        {hasImage && (product.image?.length > 1 || product.images?.length > 1) && (
          <span className="gsp-card-badge">
            +{(product.image?.length || product.images?.length) - 1} more
          </span>
        )}
      </div>

      {/* Info */}
      <div className="gsp-card-body">
        <div className="gsp-card-row">
          <h2 className="gsp-card-title">{product.title}</h2>
          <span className="gsp-card-price">{symbol}{Number(product.price?.amount).toLocaleString('en-IN')}</span>
        </div>

        {product.description && (
          <p className="gsp-card-desc">{product.description}</p>
        )}

        <div className="gsp-card-footer">
          <span className="gsp-card-date">{date}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="gsp-skeleton">
      <div className="gsp-skel-img" />
      <div className="gsp-skel-body">
        <div className="gsp-skel-row">
          <div className="gsp-skel-line" style={{ width: '60%' }} />
          <div className="gsp-skel-line" style={{ width: '20%' }} />
        </div>
        <div className="gsp-skel-line" style={{ width: '100%' }} />
        <div className="gsp-skel-line" style={{ width: '80%' }} />
        <div className="gsp-skel-line" style={{ width: '30%', marginTop: 4 }} />
      </div>
    </div>
  );
}
