import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import LanguageIcon from "@mui/icons-material/Language";

import * as api from "../../api";
import { prePath } from "../../apis/globalApi";
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
      navigate(`/${prePath}/users/login`);
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
          <h2 className="name">{`${capitalize(user.firstName)} ${capitalize(user.lastName)},  `}</h2>
          <span className="email">{user.email}</span>
          <div className="cards-container">
            <button className="card" onClick={() => navigate(`/${prePath}/users/account-settings/personal-info`)}>
              <div className="icon">
                <AccountBoxIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Personal info</h3>
              <div className="description">Provide personal details and how we can reach you</div>
            </button>
            <button className="card" disabled>
              <div className="icon">
                <NotificationsNoneIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Notifications</h3>
              <div className="description">Choose notification preferences and how you want to be contacted</div>
            </button>
            <button className="card" disabled>
              <div className="icon">
                <PresentToAllIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Premium Subscription</h3>
              <div className="description">Choose the plan that best fits your interests</div>
            </button>
            <button className="card" disabled>
              <div className="icon">
                <VisibilityOutlinedIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Privacy & sharing</h3>
              <div className="description">Manage your personal data, connected services and data sharing settings</div>
            </button>
            <button className="card" disabled>
              <div className="icon">
                <SecurityIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Login & Security</h3>
              <div className="description">Update your password and secure your account</div>
            </button>
            <button className="card" disabled>
              <div className="icon">
                <LanguageIcon sx={{ fontSize: 32 }} />
              </div>
              <h3>Global preferences</h3>
              <div className="description">Set your default language, currency, and timezone</div>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AccountSettings;
