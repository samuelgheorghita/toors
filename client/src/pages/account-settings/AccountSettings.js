import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import LanguageIcon from "@mui/icons-material/Language";

import * as api from "../../api";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const username = useSelector((state) => state.users.username);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = await api.getUserByUsername(username);
      setUser(user);
      setIsLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate("/users/login");
    });
  }, []);

  // Capitalizes first letter of the string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (isLoaded) {
    return (
      <div className="account-settings">
        <div className="account-settings__wrapper">
          <h1>Account</h1>
          <h5 className="name">{`${capitalize(user.firstName)} ${capitalize(user.lastName)},  `}</h5>
          <span className="email">{user.email}</span>
          <div className="cards-container">
            <div className="card" onClick={() => navigate("/users/account-settings/personal-info")}>
              <div className="icon">
                <AccountBoxIcon sx={{ fontSize: 32 }} />
              </div>
              <h6>Personal info</h6>
              <div className="description">Provide personal details and how we can reach you</div>
            </div>
            <div className="card">
              <div className="icon">
                <NotificationsNoneIcon sx={{ fontSize: 32 }} />
              </div>
              <h6>Notifications</h6>
              <div className="description">Choose notification preferences and how you want to be contacted</div>
            </div>
            <div className="card">
              <div className="icon">
                <PresentToAllIcon sx={{ fontSize: 32 }} />
              </div>
              <h6>Premium Subscription</h6>
              <div className="description">Choose the plan that best fits you</div>
            </div>
            <div className="card">
              <div className="icon">
                <VisibilityOutlinedIcon sx={{ fontSize: 32 }} />
              </div>
              <h6>Privacy & sharing</h6>
              <div className="description">Manage your personal data, connected services and data sharing settings</div>
            </div>
            <div className="card">
              <div className="icon">
                <SecurityIcon sx={{ fontSize: 32 }} />
              </div>
              <h6>Login & Security</h6>
              <div className="description">Update your password and secure your account</div>
            </div>
            <div className="card">
              <div className="icon">
                <LanguageIcon sx={{ fontSize: 32 }} />
              </div>
              <h6>Global preferences</h6>
              <div className="description">Set your default language, currency, and timezone</div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AccountSettings;
