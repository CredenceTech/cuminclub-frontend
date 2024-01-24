import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./component/Home";
import Meal from "./pages/Meal";
import Login from "./component/Login";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
        <Route path="/meal-section" element={<Meal />} />
      </Routes>
    </Router>
  );
}

export default App;
