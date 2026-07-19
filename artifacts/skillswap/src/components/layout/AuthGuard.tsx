import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
    if (!isLoading && adminOnly && !user?.isAdmin) {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, adminOnly, user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !user?.isAdmin) return null;

  return <>{children}</>;
}
