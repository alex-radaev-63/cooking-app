import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Groceries from "./Pages/Groceries";
import AuthModal from "./Components/Authentication/AuthModal";
import ManageHouseholds from "./Pages/ManageHouseholds";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Groceries />} />
        <Route path="/households" element={<ManageHouseholds />} />
      </Routes>

      <AuthModal />
    </Router>
  );
}

export default App;
