import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
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

/* ── Hero Section ── */
.hero { padding: 180px 40px 100px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.hero-title { font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 500; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 24px; color: #111; }
.hero-subtitle { font-size: 1.125rem; color: #666; font-weight: 400; max-width: 540px; line-height: 1.6; }

/* ── Filters & Search ── */
.controls-bar { display: flex; justify-content: space-between; align-items: center; padding: 0 40px 48px; }
.search-wrapper { display: flex; align-items: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; width: 280px; transition: border-color 0.3s; }
.search-wrapper:focus-within { border-color: #000; }
.search-wrapper input { border: none; outline: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 14px; width: 100%; margin-left: 12px; color: #000; }
.search-wrapper input::placeholder { color: #999; }
.products-count { font-size: 13px; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

/* ── Product Grid ── */
.shop-section { padding: 0 40px 120px; min-height: 40vh; }
.shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 48px 32px; }

/* ── Product Card ── */
.shop-card { display: flex; flex-direction: column; cursor: pointer; text-decoration: none; }
.shop-card-img-wrapper { aspect-ratio: 3/4; overflow: hidden; background: #f4f4f4; margin-bottom: 20px; position: relative; }
.shop-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.shop-card:hover .shop-card-img { transform: scale(1.05); }
.shop-card-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; opacity: 0; transition: opacity 0.3s ease; }
.shop-card-img-wrapper:hover .shop-card-overlay { opacity: 1; }
.add-to-cart-btn { width: 100%; background: #000; color: #fff; border: none; padding: 12px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: background 0.2s; }
.add-to-cart-btn:hover { background: #333; }
.shop-card-info { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.shop-card-details { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.shop-card-title { font-size: 15px; font-weight: 500; color: #111; letter-spacing: -0.01em; }
.shop-card-desc { font-size: 13px; color: #777; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.shop-card-price { font-size: 14px; font-weight: 600; color: #111; white-space: nowrap; }

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
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 60px 40px; }
}
@media (max-width: 768px) {
  .nav { padding: 0 24px; height: 64px; }
  .nav-left { display: none; }
  .nav-center { justify-content: flex-start; }
  .hero { padding: 140px 24px 80px; text-align: left; align-items: flex-start; }
  .hero-title { font-size: 2.5rem; }
  .controls-bar { flex-direction: column; align-items: stretch; gap: 24px; padding: 0 24px 40px; }
  .search-wrapper { width: 100%; }
  .shop-section { padding: 0 24px 80px; }
  .shop-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 32px 16px; }
  .footer { padding: 80px 24px 32px; gap: 60px; }
  .footer-grid { grid-template-columns: 1fr; gap: 48px; }
  .footer-bottom { flex-direction: column; gap: 24px; align-items: flex-start; }
}
`;

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleGetProducts } = useProducts();
  const { handleAddItem } = useCart();
  const products = useSelector(state => state.product.products);
  const user = useSelector(state => state.auth?.user);
  const cartCount = useSelector(state => state.cart?.items?.length || 0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await logoutUser();
    dispatch(setUser(null));
    navigate('/');
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/products/${product._id}`, { state: { from: '/' } });
  };

  useEffect(() => {
    (async () => {
      try { await handleGetProducts(); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    return (products ?? []).filter(p =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div>
      <style>{css}</style>
      
      <nav className="nav">
        <div className="nav-left">
           <span className="nav-link" onClick={() => navigate('/')}>Collections</span>
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

      <main>
        <section className="hero">
          <h1 className="hero-title">Elevated Essentials.</h1>
          <p className="hero-subtitle">Discover the new standard in modern streetwear. Designed for everyday comfort and uncompromising style.</p>
        </section>

        <div className="controls-bar">
          <div className="search-wrapper">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" placeholder="Search collection..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="products-count">
             {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
          </div>
        </div>

        <section className="shop-section">
          {loading ? (
            <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '40px 0' }}>Loading collection...</p>
          ) : filtered.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', padding: '40px 0' }}>No products match your search.</p>
          ) : (
            <div className="shop-grid">
              {filtered.map((p, i) => (
                <div key={p._id || i} className="shop-card" onClick={() => p._id && navigate(`/products/${p._id}`, { state: { from: '/' } })}>
                  <div className="shop-card-img-wrapper">
                    <img className="shop-card-img" src={p.image?.[0]?.url} alt={p.title} />
                    <div className="shop-card-overlay">
                      <button className="add-to-cart-btn" onClick={(e) => handleAddToCart(e, p)}>
                        {user ? 'Add to Cart' : 'Login to Buy'}
                      </button>
                    </div>
                  </div>
                  <div className="shop-card-info">
                    <div className="shop-card-details">
                      <span className="shop-card-title">{p.title}</span>
                      <span className="shop-card-desc">{p.description}</span>
                    </div>
                    <span className="shop-card-price">{SYM[p.price?.currency] || '₹'}{p.price?.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

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
}