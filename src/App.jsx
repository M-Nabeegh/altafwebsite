import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { lazy, Suspense } from 'react';

const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PioneeredCasesPage = lazy(() => import('./pages/PioneeredCasesPage'));

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const PricingPolicy = lazy(() => import('./pages/PricingPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const FAQsPage = lazy(() => import('./pages/FAQsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const HIDE_HEADER_PATHS = ['/thank-you'];

const AppContent = () => {
  const location = useLocation();
  const hideHeader = HIDE_HEADER_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <div className="app">
      {!hideHeader && <Header />}
      <main>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{
              width: '44px', height: '44px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #0056B3',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite'
            }} />
          </div>
        }>
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
        </Suspense>
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
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
