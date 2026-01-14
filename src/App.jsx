import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResearchPage from './pages/ResearchPage';
import ExperiencePage from './pages/ExperiencePage';
import BookingPage from './pages/BookingPage';
import PioneeredCasesPage from './pages/PioneeredCasesPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/pioneered-cases" element={<PioneeredCasesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
