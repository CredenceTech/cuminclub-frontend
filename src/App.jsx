import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./component/Login";
import Home from "./component/Home";
import WithoutLoginCheckout from "./pages/WithoutLoginCheckout";
import Header from "./component/Header"
import Product from "./pages/Product";
import Accessibility from "./component/Accessibility";
import Refund from "./component/Refund";
import TermOfServices from "./component/TermOfServices";
import Privacy from "./component/Privacy";
import ProductDetail from "./component/ProductDetail";
import { Footer } from "./component/Footer";
import Registration from "./component/Registration";
import PaymentFailure from "./component/PaymentFailure";
import PaymentSuccess from "./component/PaymentSuccess";
import { Toaster } from "react-hot-toast";
import BundleDetails from "./component/BundleDetails";

function App() {

  return (
    <Router>
      <div
        style={{}}
      >
        <Header />
        <div className="relative min-h-[82vh] bottom-20 top-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Product />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/term-of-services" element={<TermOfServices />} />
            <Route path="/productDetail" element={<ProductDetail />} />
            <Route path="/bundleDetail" element={<BundleDetails />} />
            <Route path="/without-login-checkout" element={<WithoutLoginCheckout />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </Router>
  );
}

export default App;