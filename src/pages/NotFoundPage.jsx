import { Link } from 'react-router-dom';
import { FaHome, FaCalendarCheck } from 'react-icons/fa';
import SEO from '../components/SEO';

const NotFoundPage = () => (
  <div className="not-found-page">
    <SEO
      title="Page Not Found | Prof. Dr. Javed Altaf"
      description="The requested page could not be found."
      url="https://www.javedaltaf.com/404"
    />
    <div className="not-found-card">
      <div className="not-found-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you’re looking for may have moved or no longer exists.</p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary"><FaHome /> Return Home</Link>
        <Link to="/booking" className="btn btn-outline"><FaCalendarCheck /> Book Consultation</Link>
      </div>
    </div>
    <style>{`
      .not-found-page {
        min-height: 80vh;
        padding: 160px 20px 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--light-gray);
      }
      .not-found-card {
        width: min(100%, 620px);
        padding: 56px 40px;
        text-align: center;
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }
      .not-found-code {
        color: var(--primary-color);
        font: 700 clamp(4rem, 14vw, 7rem)/1 var(--font-heading);
        opacity: 0.16;
      }
      .not-found-card h1 { margin: -12px 0 14px; }
      .not-found-card p { color: var(--text-light); margin-bottom: 30px; }
      .not-found-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
      .not-found-actions .btn { gap: 8px; }
      @media (max-width: 600px) {
        .not-found-page { padding-top: 120px; }
        .not-found-card { padding: 42px 22px; }
        .not-found-actions { flex-direction: column; }
      }
    `}</style>
  </div>
);

export default NotFoundPage;
