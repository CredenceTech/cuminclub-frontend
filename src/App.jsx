import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./component/Login";
import Header from "./component/Header";
import Home from "./component/Home";
import Subscription from "./pages/Subscription";

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
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
