import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="flex w-full flex-col lg:flex-row text-xs lg:text-base bg-[#E91D24] text-white lg:justify-between justify-around items-center px-5 lg:px-48 h-20">
      <div className="flex items-center gap-2">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.06 6.645C6.0975 6.3975 6.18 6.18 6.285 6C6.51 5.58 6.8925 5.3625 7.41 5.355C7.7475 5.355 8.055 5.505 8.2725 5.7225C8.4825 5.955 8.625 6.2775 8.625 6.6H9.975C9.96 6.2475 9.8925 5.925 9.75 5.625C9.6375 5.34 9.465 5.085 9.24 4.875C8.1525 3.87 6.135 4.0125 5.2125 5.1525C4.245 6.405 4.2225 8.595 5.205 9.8475C6.1125 10.965 8.1 11.1225 9.18 10.125C9.4125 9.9375 9.6 9.705 9.75 9.435C9.87 9.165 9.9525 8.88 9.96 8.5725H8.625C8.625 8.73 8.5725 8.8725 8.505 9C8.4375 9.1425 8.3475 9.255 8.25 9.3525C8.0025 9.5475 7.71 9.6525 7.395 9.6525C7.125 9.645 6.9 9.5925 6.7275 9.48C6.53307 9.37067 6.37818 9.20266 6.285 9C5.91 8.325 5.97 7.3875 6.06 6.645ZM7.5 0C3.375 0 0 3.375 0 7.5C0.3975 17.4525 14.625 17.445 15 7.5C15 3.375 11.625 0 7.5 0ZM7.5 13.5C4.1925 13.5 1.5 10.8075 1.5 7.5C1.83 -0.4575 13.17 -0.4575 13.5 7.5C13.5 10.8075 10.8075 13.5 7.5 13.5Z"
            fill="white"
          />
        </svg>

        <span>2024 Instantly Yours</span>
      </div>
      <div className="flex items-center lg:gap-8 gap-4">
        <Link to="/term-of-services">Term & Condition</Link>
        <Link to="/privacy-policy">Privacy</Link>
        <Link to="/refund">Refunds</Link>
        <Link to="/accessibility">Accessibility Statement</Link>
      </div>
    </div>
  );
};
