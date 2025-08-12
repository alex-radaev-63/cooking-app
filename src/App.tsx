import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Recipes from "./Pages/Recipes";
import Groceries from "./Pages/Groceries";
import Dashboard from "./Pages/Dashboard";
import { GroceryProvider } from "./Components/context/GroceryContext";
//import SideBar from "./Components/SideBar";

function App() {
  return (
    /* Test side bar component (learning to apply tailwind classes)

    <div className="flex w-screen h-screen bg-gray-800">
      <SideBar />
    </div> 

    */ <GroceryProvider>
      <>
        <Router>
          <Navbar />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/groceries" element={<Groceries />} />
          </Routes>
        </Router>
      </>
    </GroceryProvider>
  );
}

export default App;
