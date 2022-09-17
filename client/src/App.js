import "./dist/style.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Error from "./pages/Error";
import AddTour from "./pages/AddTour";

import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/signup" element={<SignUp />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/tours/addtour" element={<AddTour />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
