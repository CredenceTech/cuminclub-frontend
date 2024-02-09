import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./component/Login";
import Home from "./component/Home";
import WithoutLoginCheckout from "./pages/WithoutLoginCheckout";
import Header from "./component/Header"
import Product from "./pages/Product";
import Accessibility from "./component/Accessibility";
import Refund from "./component/Refund";
import TermOfServices from "./component/TermOfServices";
import PrivacyPolicy from "./component/PrivacyPolicy";
import ProductDetail from "./component/ProductDetail";

function App() {
  return (
    <Router>
      <div
        style={{}}
      >
        <Header />
        <div className="relative top-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Product />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/term-of-services" element={<TermOfServices />} />
            <Route path="/productDetail" element={<ProductDetail />} />
            <Route path="/without-login-checkout" element={<WithoutLoginCheckout />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;