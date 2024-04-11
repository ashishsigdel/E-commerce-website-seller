import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import { PrivateRouteSeller } from "./components/PrivateRoute";
import Product from "./pages/Product";
import PublicRoute from "./components/PublicRoute";
import Stepper from "./components/Stepper";
import OrderDetail from "./components/OrderDetail";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<PrivateRouteSeller />}>
          <Route path="/products/:productSlug" element={<Product />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orderstatus/:orderId" element={<OrderDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
