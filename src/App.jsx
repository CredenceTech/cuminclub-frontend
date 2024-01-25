import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Meal from "./pages/Meal";
import Login from "./component/Login";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Home from "./component/Home";

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
            <Route path="*" element={<Home />} />
            <Route path="/meal-section" element={<Meal />} />
          </Routes>
        </div>
        {window.location.pathname !== "/" && <Footer />} {/* Render Footer if the route is not "/" */}
      </div>
    </Router>
  );
}

export default App;
