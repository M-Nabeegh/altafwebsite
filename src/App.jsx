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
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import PricingPolicy from './pages/PricingPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import FAQsPage from './pages/FAQsPage';
import AdminDashboard from './pages/AdminDashboard';

const HIDE_HEADER_PATHS = ['/thank-you'];

const AppContent = () => {
  const location = useLocation();
  const hideHeader = HIDE_HEADER_PATHS.some(p => location.pathname.startsWith(p));

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
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/faq" element={<FAQsPage />} />
          <Route path="/pricing" element={<PricingPolicy />} />
          <Route path="/thank-you" element={<BookingSuccess />} />
          {/* PayFast Payment Routes */}
          <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
          <Route path="/payment-failure/:orderId" element={<PaymentFailure />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
