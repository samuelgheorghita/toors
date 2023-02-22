import React from "react";
import CopyrightIcon from "@mui/icons-material/Copyright";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer__left-container">
        <CopyrightIcon className="icon-copyright" />
        <a href="#" className="footer__left-container__link not">
          Toors
        </a>
        <a href="#" className="footer__left-container__link">
          Privacy
        </a>
        <a href="#" className="footer__left-container__link">
          Terms
        </a>
        <a href="#" className="footer__left-container__link">
          Sitemap
        </a>
      </div>
      <div className="footer__right-container">
        <LanguageIcon className="icon-language" />
        <a className="footer__right-container__language">English</a>
        <a className="footer__right-container__currency">€ EUR</a>
        <a href="#">
          <FacebookIcon className="icon-social-media" />
        </a>
        <a href="#">
          <TwitterIcon className="icon-social-media" />
        </a>
        <a href="#">
          <InstagramIcon className="icon-social-media" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
