import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoginPrompt from './components/LoginPrompt';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import TeamPage from './pages/TeamPage';
import MinePage from './pages/MinePage';
import BottomNav from './components/BottomNav';

// Root Layout Component
function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <LoginPrompt />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16">
      <Header />
      <main className="flex-1">
        {showProfileSetup && <ProfileSetupModal />}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

// Create root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Create routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product',
  component: ProductPage,
});

const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team',
  component: TeamPage,
});

const mineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mine',
  component: MinePage,
});

// Create route tree
const routeTree = rootRoute.addChildren([homeRoute, productRoute, teamRoute, mineRoute]);

// Create router
const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
