import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/layout/AppLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useAuthStore } from '@/store/authStore';

// Public pages
import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import ForgotPassword from '@/pages/public/ForgotPassword';
import Terms from '@/pages/public/Terms';
import Privacy from '@/pages/public/Privacy';
import Guidelines from '@/pages/public/Guidelines';
import Support from '@/pages/public/Support';

// App pages
import Dashboard from '@/pages/app/Dashboard';
import Marketplace from '@/pages/app/Marketplace';
import Matches from '@/pages/app/Matches';
import SwapRequest from '@/pages/app/SwapRequest';
import Scheduler from '@/pages/app/Scheduler';
import Chat from '@/pages/app/Chat';
import Ratings from '@/pages/app/Ratings';
import Profile from '@/pages/app/Profile';
import Notifications from '@/pages/app/Notifications';
import Settings from '@/pages/app/Settings';

// Admin pages
import AdminOverview from '@/pages/admin/Overview';
import AdminUsers from '@/pages/admin/Users';
import AdminReports from '@/pages/admin/Reports';
import AdminSkills from '@/pages/admin/Skills';
import AdminAnalytics from '@/pages/admin/Analytics';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout><Landing /></PublicLayout>
      </Route>
      <Route path="/login">
        <PublicLayout><Login /></PublicLayout>
      </Route>
      <Route path="/register">
        <PublicLayout><Register /></PublicLayout>
      </Route>
      <Route path="/forgot-password">
        <PublicLayout><ForgotPassword /></PublicLayout>
      </Route>
      <Route path="/terms">
        <PublicLayout><Terms /></PublicLayout>
      </Route>
      <Route path="/privacy">
        <PublicLayout><Privacy /></PublicLayout>
      </Route>
      <Route path="/guidelines">
        <PublicLayout><Guidelines /></PublicLayout>
      </Route>
      <Route path="/support">
        <PublicLayout><Support /></PublicLayout>
      </Route>

      {/* App Routes */}
      <Route path="/dashboard"><AppLayout><Dashboard /></AppLayout></Route>
      <Route path="/marketplace"><AppLayout><Marketplace /></AppLayout></Route>
      <Route path="/matches"><AppLayout><Matches /></AppLayout></Route>
      <Route path="/swap-request"><AppLayout><SwapRequest /></AppLayout></Route>
      <Route path="/scheduler"><AppLayout><Scheduler /></AppLayout></Route>
      <Route path="/chat"><AppLayout><Chat /></AppLayout></Route>
      <Route path="/chat/:id"><AppLayout><Chat /></AppLayout></Route>
      <Route path="/ratings"><AppLayout><Ratings /></AppLayout></Route>
      <Route path="/profile"><AppLayout><Profile /></AppLayout></Route>
      <Route path="/profile/:id"><AppLayout><Profile /></AppLayout></Route>
      <Route path="/notifications"><AppLayout><Notifications /></AppLayout></Route>
      <Route path="/settings"><AppLayout><Settings /></AppLayout></Route>

      {/* Admin Routes */}
      <Route path="/admin"><AppLayout><AdminOverview /></AppLayout></Route>
      <Route path="/admin/users"><AppLayout><AdminUsers /></AppLayout></Route>
      <Route path="/admin/reports"><AppLayout><AdminReports /></AppLayout></Route>
      <Route path="/admin/skills"><AppLayout><AdminSkills /></AppLayout></Route>
      <Route path="/admin/analytics"><AppLayout><AdminAnalytics /></AppLayout></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        {/* <Toaster /> - skipping for now unless needed */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
