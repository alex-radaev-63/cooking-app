import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
// import Recipes from "./Pages/Recipes";
// import Dashboard from "./Pages/Dashboard";
import Groceries from "./Pages/Groceries";
import AuthModal from "./Components/Authentication/AuthModal";
import ManageHouseholds from "./Pages/ManageLists";

function App() {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Groceries />} />
          {/* <Route path="/overview" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} /> */}
          <Route path="/households" element={<ManageHouseholds />} />
        </Routes>

        <AuthModal />
      </Router>
    </>
  );
}

export default App;
