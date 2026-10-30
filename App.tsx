import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import Home from './pages/Home';
const Gallery = lazy(() => import('./pages/Gallery'));
const Guestbook = lazy(() => import('./pages/Guestbook'));
const Contact = lazy(() => import('./pages/Contact'));
const Memories = lazy(() => import('./pages/Memories'));
const MemoryDetail = lazy(() => import('./pages/MemoryDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const Souvenirs = lazy(() => import('./pages/Souvenirs'));

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Suspense fallback={<div className="p-12 text-center" role="status">Loading…</div>}><Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="guestbook" element={<Guestbook />} />
            <Route path="contact" element={<Contact />} />
            <Route path="memories" element={<Memories />} />
            <Route path="souvenirs" element={<Souvenirs />} />
            <Route path="memories/:id" element={<MemoryDetail />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes></Suspense>
      </HashRouter>
      <SpeedInsights />
    </LanguageProvider>
  );
};

export default App;