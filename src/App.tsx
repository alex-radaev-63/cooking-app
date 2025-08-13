import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Recipes from "./Pages/Recipes";
import Groceries from "./Pages/Groceries";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Groceries />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
