import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Recipes from "./Pages/Recipes";
import Groceries from "./Pages/Groceries";
import Dashboard from "./Pages/Dashboard";
import SideBar from "./Components/SideBar";

function App() {
  return (
    <div className="flex w-screen h-screen bg-gray-800">
      <SideBar />
    </div>
    /* <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/groceries" element={<Groceries />} />
        </Routes>
      </Router>
    </> */
  );
}

export default App;
