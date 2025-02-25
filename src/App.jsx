import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./component/Login";
import Home from "./component/Home";
import WithoutLoginCheckout from "./pages/WithoutLoginCheckout";
import Header from "./component/Header"
import { Product } from "./pages/Product";
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
import { ScrollToTop } from "./component/ScrollToTop";
import Subscription from "./component/Subscription";
import Invoices from "./component/Invoices";
import MealPackage from "./pages/MealPackage";
import './fonts.css';
import CardReview from "./pages/CardReview";
import Recipes from "./pages/Recipes";
import Facility from "./component/Facility"
import AboutUs from "./component/AboutUs"
import RecipeList from "./pages/RecipeList";
import ProductDetails from "./pages/ProductDetail";
import ReadyToEat from "./pages/ReadyToEat";
import { HowItWorks } from "./pages/HowItWorks";
import ReadyToCook from "./pages/ReadyToCook";
import { Bulk } from "./pages/Bulk"
import AnnouncementBar from "./component/AnnouncementBar";
import { CancellationPolicy } from "./component/CancellationPolicy";
import ForgotPassword from "./component/ForgotPassword";
import MyProfile from "./component/MyProfile";
import { Faqs } from "./component/Faqs";
import { BusinessInquiryForm } from "./component/BusinessInquiryForm";
import { AddInfluencersForm } from "./component/AddInfluencersForm";
import { Bundle } from "./component/Bundle";

function App() {
  return (
    <Router>
      <div
        style={{}}
      >
        <ScrollToTop />
        <AnnouncementBar />
        <Header />
        <div className={`relative min-h-[82vh] top-[100px]  `}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/meal-package" element={<MealPackage />} />
            <Route path="/ready-to-eat" element={<ReadyToEat />} />
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
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/Invoices" element={<Invoices />} />
            <Route path="/cardReview" element={<CardReview />} />
            <Route path="/recipes/:handle" element={<Recipes />} />
            <Route path="/recipe-list" element={<RecipeList />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="/facilities" element={<Facility />} />
            <Route path="*" element={<Home />} />
            <Route path="/product-details/:handle" element={<ProductDetails />} />
            <Route path="/ready-to-cook" element={<ReadyToCook />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/products" element={<Product />} />
            <Route path="/bulk" element={<Bulk />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/faqs" element={<Faqs/>}/>
            <Route path="/business-inquiry" element={<BusinessInquiryForm/>}/>
            <Route path="/influencers" element={<AddInfluencersForm/>}/>
            <Route path="/bundles" element={<Bundle/>}/>
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