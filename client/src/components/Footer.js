import React from "react";
import CopyrightIcon from "@mui/icons-material/Copyright";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footer__left-container">
        <CopyrightIcon className="icon-copyright" />
        <li>
          <a href="#" className="footer__left-container__link not">
            Toors
          </a>
        </li>
        <li>
          <a href="#" className="footer__left-container__link">
            Privacy
          </a>
        </li>
        <li>
          <a href="#" className="footer__left-container__link">
            Terms
          </a>
        </li>
        <li>
          <a href="#" className="footer__left-container__link">
            Sitemap
          </a>
        </li>
      </ul>
      <ul className="footer__right-container">
        <LanguageIcon className="icon-language" />
        <li>
          <a className="footer__right-container__language" href="#">
            English
          </a>
        </li>
        <li>
          <a className="footer__right-container__currency" href="#">
            € EUR
          </a>
        </li>
        <li>
          <a href="#">
            <span className="visually-hidden">Facebook icon</span>
            <FacebookIcon className="icon-social-media" />
          </a>
        </li>
        <li>
          <a href="#">
            <span className="visually-hidden">Twitter icon</span>
            <TwitterIcon className="icon-social-media" />
          </a>
        </li>
        <li>
          <a href="#">
            <span className="visually-hidden">Instagram icon</span>
            <InstagramIcon className="icon-social-media" />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
