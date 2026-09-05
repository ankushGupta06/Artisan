import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import AddProduct from "@/pages/AddProduct";
import Photo from "@/pages/addproduct/Photo";
import ImageStudio from "@/pages/addproduct/ImageStudio";
import Catalog from "@/pages/addproduct/Catalog";
import Pricing from "@/pages/addproduct/Pricing";
import Preview from "@/pages/addproduct/Preview";
import Marketplace from "@/pages/Marketplace";
import MarketplaceProduct from "@/pages/MarketplaceProduct";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Schemes from "@/pages/Schemes";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import BuyerHome from "@/pages/buyer/BuyerHome";
import BuyerEnquiry from "@/pages/buyer/BuyerEnquiry";
import NotFound from "@/pages/NotFound";

// Charting (recharts) is only needed on the Insights tab, so it's kept out
// of the main bundle — important for a mobile-first, low-bandwidth demo.
const Assistant = lazy(() => import("@/pages/Assistant"));

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-(--color-cream)">
      <span className="size-8 animate-spin rounded-full border-2 border-(--color-terracotta-500) border-t-transparent" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { isLoggedIn } = useApp();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
      <Route path="/products/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />

      <Route path="/add-product" element={<RequireAuth><AddProduct /></RequireAuth>} />
      <Route path="/add-product/photo" element={<RequireAuth><Photo /></RequireAuth>} />
      <Route path="/add-product/studio" element={<RequireAuth><ImageStudio /></RequireAuth>} />
      <Route path="/add-product/catalog" element={<RequireAuth><Catalog /></RequireAuth>} />
      <Route path="/add-product/pricing" element={<RequireAuth><Pricing /></RequireAuth>} />
      <Route path="/add-product/preview" element={<RequireAuth><Preview /></RequireAuth>} />

      <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
      <Route path="/marketplace/:id" element={<RequireAuth><MarketplaceProduct /></RequireAuth>} />

      <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
      <Route path="/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />

      <Route
        path="/assistant"
        element={
          <RequireAuth>
            <Suspense fallback={<RouteFallback />}>
              <Assistant />
            </Suspense>
          </RequireAuth>
        }
      />
      <Route path="/schemes" element={<RequireAuth><Schemes /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

      <Route path="/buyer" element={<RequireAuth><BuyerHome /></RequireAuth>} />
      <Route path="/buyer/marketplace" element={<RequireAuth><Marketplace buyerMode /></RequireAuth>} />
      <Route path="/buyer/product/:id" element={<RequireAuth><MarketplaceProduct buyerMode /></RequireAuth>} />
      <Route path="/buyer/enquiry" element={<RequireAuth><BuyerEnquiry /></RequireAuth>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
