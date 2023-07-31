import { useEffect } from "react";
import "./dist/style.css";
import { Routes, Route, useLocation } from "react-router-dom";

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
import EditTour from "./pages/EditTour";
import Footer from "./components/Footer";
import { prePathS } from "./apis/globalApi";

function App() {
  // The following 4 lines of code restore the scrollbar in case somebody tries to exit the modal in the singleTourPage
  //  without closing the modal itself (but for example by going back using backwards button of the browser)
  let location = useLocation();
  useEffect(() => {
    document.body.style.overflow = "unset";
  }, [location]);

  return (
    <div className="app" style={{ position: "relative" }}>
      <Navbar />
      <div className="app__content">
        <Routes>
          <Route path={`${prePathS}/`} element={<Home />} />
          <Route path={`${prePathS}/users/signup`} element={<SignUp />} />
          <Route path={`${prePathS}/users/login`} element={<Login />} />
          <Route path={`${prePathS}/tours/add-tour`} element={<AddTour />} />
          <Route path={`${prePathS}/tours/:id`} element={<SingleTourPage />} />
          <Route path={`${prePathS}/tours/edit-tour/:id`} element={<EditTour />} />
          <Route path={`${prePathS}/users/favorites`} element={<Favorites typeOfPage="Favorites" />} />
          <Route path={`${prePathS}/users/my-tours`} element={<MyTours typeOfPage="MyTours" />} />
          <Route path={`${prePathS}/users/account-settings`} element={<AccountSettings />} />
          <Route path={`${prePathS}/users/account-settings/personal-info`} element={<PersonalInfo />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
