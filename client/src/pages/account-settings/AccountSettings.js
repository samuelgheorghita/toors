import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";

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

    fetchData().catch((err) => console.log(err));
  }, []);

  // Capitalizes first letter of the string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (isLoaded) {
    return (
      <div className="account-settings">
        <h1>Account</h1>
        <h5 className="name">{`${capitalize(user.firstName)} ${capitalize(user.lastName)},  `}</h5>
        <span className="email">{user.email}</span>
        <div className="cards-container">
          <div className="card" onClick={() => navigate("/users/account-settings/personal-info")}>
            <div className="icon">
              <AccountBoxIcon sx={{ fontSize: 32 }} />
            </div>
            <h6>Personal-info</h6>
            <div className="description">Comunicaci i tuoi dati personali e le modalità per contattarti</div>
          </div>
          <div className="card">
            <div className="icon">
              <NotificationsNoneIcon sx={{ fontSize: 32 }} />
            </div>
            <h6>Notifications</h6>
            <div className="description">Comunicaci i tuoi dati personali e le modalità per contattarti</div>
          </div>
          <div className="card">
            <div className="icon">
              <PresentToAllIcon sx={{ fontSize: 32 }} />
            </div>
            <h6>Premium Subscription</h6>
            <div className="description">Comunicaci i tuoi dati personali e le modalità per contattarti</div>
          </div>
          <div className="card"></div>
          <div className="card"></div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AccountSettings;
