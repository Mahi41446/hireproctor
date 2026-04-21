import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-3 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
