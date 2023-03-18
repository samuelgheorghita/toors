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
        <a className="footer__right-container__language" href="#">
          English
        </a>
        <a className="footer__right-container__currency" href="#">
          € EUR
        </a>
        <a href="#">
          <span className="visually-hidden">Facebook icon</span>
          <FacebookIcon className="icon-social-media" />
        </a>
        <a href="#">
          <span className="visually-hidden">Twitter icon</span>
          <TwitterIcon className="icon-social-media" />
        </a>
        <a href="#">
          <span className="visually-hidden">Instagram icon</span>
          <InstagramIcon className="icon-social-media" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
