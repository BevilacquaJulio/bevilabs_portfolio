import { useCallback, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Background } from './Background';
import { ErrorBoundary } from './ErrorBoundary';
import { AppRoutes } from './routes';
import { BootContext, markPreloaderSeen, shouldSkipPreloader } from '@/features/site/shell/boot';
import { CursorFollower } from '@/features/site/shell/CursorFollower';
import { Preloader } from '@/features/site/shell/Preloader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export function App() {
  const [booted, setBooted] = useState(shouldSkipPreloader);

  const finishBoot = useCallback(() => {
    markPreloaderSeen();
    setBooted(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <CursorFollower />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BootContext.Provider value={booted}>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Background />
              <AppRoutes />
              <AnimatePresence>
                {!booted && <Preloader key="preloader" onDone={finishBoot} />}
              </AnimatePresence>
            </BrowserRouter>
          </BootContext.Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </MotionConfig>
  );
}
