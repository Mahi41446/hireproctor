import { Skeleton } from "@/components/ui/skeleton";
import {
  Navigate,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";

// Lazy-load pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const ConsentPage = lazy(() => import("./pages/ConsentPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-3 w-64">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Routes
const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <RegisterPage />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminPage />
    </Suspense>
  ),
});

const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exam/$sessionId",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ExamPage />
    </Suspense>
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results/$sessionId",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ResultsPage />
    </Suspense>
  ),
});

const consentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/consent",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ConsentPage />
    </Suspense>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/" />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  adminRoute,
  examRoute,
  resultsRoute,
  consentRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
