import { useNavigate } from 'react-router';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #f7f7f5; color: #111; }

.nf-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}
.nf-code {
  font-family: 'Oswald', sans-serif;
  font-size: clamp(6rem, 20vw, 14rem);
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 2px #ddd;
  line-height: 1;
  user-select: none;
  letter-spacing: 0.04em;
}
.nf-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111;
  margin-top: 16px;
}
.nf-sub {
  font-size: 14px;
  color: #888;
  margin-top: 8px;
  max-width: 320px;
  line-height: 1.6;
}
.nf-btn {
  margin-top: 32px;
  background: #111;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
}
.nf-btn:hover { background: #333; }
`;

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="nf-wrap">
            <style>{css}</style>
            <div className="nf-code">404</div>
            <h1 className="nf-title">Page not found</h1>
            <p className="nf-sub">The page you're looking for doesn't exist or may have been moved.</p>
            <button className="nf-btn" onClick={() => navigate('/')}>
                Back to Shop
            </button>
        </div>
    );
}
