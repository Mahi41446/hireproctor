import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.home_link"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-semibold text-foreground tracking-tight">
              Hire<span className="text-primary">Proctor</span>
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    data-ocid="nav.admin_link"
                  >
                    <Link to="/admin">
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  data-ocid="nav.home_button"
                >
                  <Link to="/">
                    <Home className="w-4 h-4 mr-1.5" />
                    Home
                  </Link>
                </Button>

                <div className="h-4 w-px bg-border" />

                <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[180px]">
                  {profile?.fullname ?? profile?.email ?? ""}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5"
                  data-ocid="nav.logout_button"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HireProctor. Professional proctored
            assessments.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
