import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

// Rotas lazy: o bundle do admin nao pesa no carregamento do site publico.
const HomePage = lazy(() => import('@/pages/HomePage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function RouteFallback() {
  return (
    <div
      className="relative z-2 flex min-h-dvh flex-col items-center justify-center gap-4 px-[var(--layout-pad)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      role="status"
      aria-label="Carregando"
    >
      <span aria-hidden="true" className="font-display text-2xl font-extrabold tracking-[-0.05em]">
        BL
      </span>
      <span aria-hidden="true" className="skeleton h-1 w-24 rounded-full" />
    </div>
  );
}

export function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageTransition}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}
