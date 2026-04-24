import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
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
.search-pill { display: flex; align-items: center; background: #fff; border-radius: 100px; padding: 8px 18px; border: 1px solid #e0e0e0; transition: all 0.2s; }
.search-pill:focus-within { border-color: #111; }
.search-pill input { border: none; outline: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 13px; margin-left: 10px; width: 160px; }
.btn-pill { background: #111; color: #fff; border: none; padding: 10px 24px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-pill:hover { background: #333; }
.btn-pill-outline { background: transparent; color: #111; border: 1px solid #111; padding: 10px 24px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-pill-outline:hover { background: #111; color: #fff; }
.sec-title-wrap { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.sec-title { font-family: 'Oswald', sans-serif; font-size: 3rem; font-weight: 700; line-height: 1; text-transform: uppercase; letter-spacing: 0.02em; }
.shop-section { padding: 60px 40px; min-height: 80vh; }
.shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; margin-top: 20px; }
.shop-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid #eaeaea; display: flex; flex-direction: column; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.shop-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
.shop-card-img { aspect-ratio: 4/5; position: relative; background: #f0f0f0; overflow: hidden; }
.shop-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.shop-card:hover .shop-card-img img { transform: scale(1.05); }
.shop-card-info { padding: 24px; display: flex; flex-direction: column; gap: 16px; flex: 1; }
.shop-card-title { font-size: 16px; font-weight: 700; color: #111; margin-bottom: 6px; line-height: 1.3; }
.shop-card-desc { font-size: 13px; color: #666; line-height: 1.5; }
.shop-card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.shop-card-price { font-size: 18px; font-weight: 800; color: #111; }
.add-btn { background: #111; color: #fff; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.add-btn:hover { background: #333; }
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
.ft-bottom-links span { cursor: pointer; transition: color 0.2s; }
.ft-bottom-links span:hover { color: #111; }
@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .shop-section, .footer { padding-left: 20px; padding-right: 20px; }
  .sec-title { font-size: 2.2rem; }
  .search-pill input { width: 100px; }
  .ft-top { flex-direction: column; gap: 48px; }
  .ft-links { flex-wrap: wrap; gap: 40px; }
  .shop-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
}
`;

export default function Home() {
  const navigate = useNavigate();
  const { handleGetProducts } = useProducts();
  const products = useSelector(state => state.product.products);
  const user = useSelector(state => state.auth?.user);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const DUMMY_IMAGES = [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1529720317453-c8da503f2051?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
  ];

  const getImg = (p, i = 0) => {
    if (p?.image?.[0]?.url) return p.image[0].url;
    if (p?.images?.[0]?.url) return p.images[0].url;
    let hash = i;
    if (p?._id) hash = String(p._id).charCodeAt(p._id.length - 1);
    return DUMMY_IMAGES[hash % DUMMY_IMAGES.length];
  };

  return (
    <div>
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-left">
          <div className="search-pill">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="nav-center">
          <span className="nav-logo" onClick={() => navigate('/')}>VOIDWEAR</span>
        </div>
        <div className="nav-right">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Hello, {user.fullname || 'User'}</span>
            </div>
          ) : (
            <>
              <button className="btn-pill-outline" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-pill" onClick={() => navigate('/register')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <section className="shop-section">
        <div className="sec-title-wrap">
          <h2 className="sec-title">{search ? "SEARCH RESULTS" : "ALL PRODUCTS"}</h2>
        </div>
        {loading ? (
          <p style={{ fontSize: '15px', color: '#666' }}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p style={{ fontSize: '15px', color: '#666' }}>No products found.</p>
        ) : (
          <div className="shop-grid">
            {filtered.map((p, i) => (
              <div key={p._id || i} className="shop-card" onClick={() => p._id && navigate(`/product/${p._id}`)}>
                <div className="shop-card-img">
                  <img src={getImg(p, i)} alt="" />
                </div>
                <div className="shop-card-info">
                  <div>
                    <div className="shop-card-title">{p.title || 'Classic Hoodie'}</div>
                    <div className="shop-card-desc">{p.description?.substring(0, 40) || 'Premium streetwear essential with a perfect modern fit.'}...</div>
                  </div>
                  <div className="shop-card-bottom">
                    <div className="shop-card-price">{SYM[p.price?.currency]||'₹'}{p.price?.amount || '2,999'}</div>
                    <button className="add-btn" onClick={e => e.stopPropagation()}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="ft-top">
          <div className="ft-links">
            <div className="ft-col"><h4>Shop</h4><ul><li>All Products</li><li>New Arrivals</li><li>Best Sellers</li></ul></div>
            <div className="ft-col"><h4>Company</h4><ul><li>About Us</li><li>Careers</li><li>Press</li></ul></div>
            <div className="ft-col"><h4>Support</h4><ul><li>Contact</li><li>Returns</li><li>FAQ</li></ul></div>
          </div>
          <div className="ft-newsletter">
            <div style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16 }}>Stay Updated</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="Email Address" style={{ background: '#fff', border: '1px solid #ddd', padding: '12px 16px', borderRadius: 8, color: '#111', outline: 'none' }} />
              <button style={{ background: '#111', color: '#fff', border: 'none', padding: '0 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Join</button>
            </div>
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
}