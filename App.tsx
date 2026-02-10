import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Guestbook from './pages/Guestbook';
import Contact from './pages/Contact';
import Memories from './pages/Memories';
import MemoryDetail from './pages/MemoryDetail';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="guestbook" element={<Guestbook />} />
            <Route path="contact" element={<Contact />} />
            <Route path="memories" element={<Memories />} />
            <Route path="memories/:id" element={<MemoryDetail />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;