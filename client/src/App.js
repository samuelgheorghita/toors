import "./dist/style.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Error from "./pages/Error";
import AddTour from "./pages/AddTour";
import SingleTourPage from "./pages/SingleTourPage";
import Navbar from "./components/Navbar";
import AccountSettings from "./pages/account-settings/AccountSettings";
import PersonalInfo from "./pages/account-settings/PersonalInfo";
import Favorites from "./pages/profile/Favorites";
import MyTours from "./pages/profile/MyTours";

function App() {
  return (
    <div className="app" style={{ position: "relative" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/signup" element={<SignUp />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/tours/add-tour" element={<AddTour />} />
        <Route path="/tours/:id" element={<SingleTourPage />} />
        {/* <Route path="/users/favorites" element={<Favorites />} /> */}
        <Route path="/users/favorites" element={<Favorites typeOfPage="Favorites" />} />
        <Route path="/users/my-tours" element={<MyTours typeOfPage="MyTours" />} />
        <Route path="/users/account-settings" element={<AccountSettings />} />
        <Route path="/users/account-settings/personal-info" element={<PersonalInfo />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
