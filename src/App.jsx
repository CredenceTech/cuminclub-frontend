import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./component/Login";
import Home from "./component/Home";
import Subscription from "./pages/Subscription";
import WithoutLoginCheckout from "./pages/WithoutLoginCheckout";
import Header from "./component/Header"
import Product from "./pages/Product";
import ProductDetail from "./component/ProductDetail";
import PrivacyPolicy from "./component/PrivacyPolicy";
import Accessibility from "./component/Accessibility";
import Refund from "./component/Refund";
import TermOfServices from "./component/TermOfServices";

function App() {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Product />} />
            <Route path="*" element={<Home />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/productDetail" element={<ProductDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/term-of-services" element={<TermOfServices />} />
            <Route path="/without-login-checkout" element={<WithoutLoginCheckout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
