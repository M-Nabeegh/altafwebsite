import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResearchPage from './pages/ResearchPage';
import ExperiencePage from './pages/ExperiencePage';
import BookingPage from './pages/BookingPage';
import PioneeredCasesPage from './pages/PioneeredCasesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BookingSuccess from './pages/BookingSuccess';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import PricingPolicy from './pages/PricingPolicy';

const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/thank-you';

  return (
    <div className="app">
      {!hideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/pioneered-cases" element={<PioneeredCasesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/pricing" element={<PricingPolicy />} />
          <Route path="/thank-you" element={<BookingSuccess />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
