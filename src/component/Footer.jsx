import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import amazonapy from '../assets/amazon-pay.png';
import american from '../assets/american-express.png';
import googlepay from '../assets/google-pay.png';
import mastercard from '../assets/mastercard.png';
import paypal from '../assets/paypal.png';
import unionpay from '../assets/unionpay.png';
import visa from '../assets/visa.png';
import applepay from '../assets/apple-pay.png';
import linkedin from '../assets/linkedin.png'
import { addCategoryData } from "../state/selectedCategory";
import { subscribeClose, subscribeOpen } from "../state/subscribeData";
import { FaChevronDown } from 'react-icons/fa';
import { useDispatch } from "react-redux";
export const Footer = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <div className={`footer bg-[#EADEC1] relative z-[100] ${pathname === '/login' || pathname === '/registration' || pathname === '/forgot-password' ? 'bottom-[0px]' : '-bottom-[100px]'} `}>
        <div className="flex flex-col md:flex-row justify-between px-[60px]  pt-10 pb-4 footer-content">
          <div className="flex lg:flex-row flex-col  lg:pr-0 gap-y-4 md:gap-y-1">
            <div className="">
              <svg width="125" height="55" viewBox="0 0 125 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.23331 17.2602C1.70214 16.7291 1.49805 16.4842 1.49805 16.1574C1.49805 15.5035 2.19249 15.095 4.76616 14.0327C6.89057 13.0522 7.58528 12.8482 8.15726 12.8482C8.64735 12.8482 8.97416 13.2158 8.97416 14.1146C8.97416 15.0542 8.81089 16.4842 8.81089 20.447V23.511C8.81089 24.8999 9.62805 25.4311 9.62805 26.2482C9.62805 27.1062 8.32054 27.5146 6.19613 27.5146H5.78768C3.62219 27.5146 2.31494 27.1062 2.31494 26.2482C2.31494 25.4311 3.17292 24.8999 3.17292 23.511V21.5091C3.17292 18.3226 3.09129 18.1999 2.23331 17.2602Z" fill="#231F20" />
                <path d="M11.7115 17.5462C11.1395 17.0561 10.8535 16.811 10.8535 16.2798C10.8535 15.667 11.303 15.2175 13.3864 14.0735C15.5519 12.8887 16.4915 12.5211 17.2678 12.5211C17.9214 12.5211 18.2074 12.8887 18.2074 13.6242C18.2074 13.9102 18.1666 14.237 18.1255 14.6866C19.1471 13.5834 20.4951 12.8482 22.0475 12.8482C24.7031 12.8482 25.1935 14.7271 25.5611 18.2815C25.8063 20.733 26.0514 22.5306 26.2147 23.6745C26.4191 24.7366 26.7867 25.227 27.5222 25.4311C28.0123 25.5538 28.094 26.0847 27.7263 26.4526C27.1546 26.9835 25.7654 27.5146 24.1311 27.5146C21.5575 27.5146 20.6995 26.4526 20.577 24.3282C20.4543 22.8166 20.3727 21.4682 20.2499 19.0578C20.1683 16.4433 20.005 15.4218 19.2695 15.4218C18.4115 15.4218 18.0439 17.3011 18.0031 19.7523V23.511C18.0031 24.8999 18.8202 25.4311 18.8202 26.2482C18.8202 27.1062 17.5538 27.5146 15.3883 27.5146H15.0207C12.8555 27.5146 11.548 27.1062 11.548 26.2482C11.548 25.4311 12.3651 24.8999 12.3651 23.511V21.4682C12.3651 18.8946 12.3651 18.159 11.7115 17.5462Z" fill="#231F20" />
                <path d="M37.5309 18.6491C41.4938 19.7931 42.8013 21.1412 42.8013 23.2658C42.8013 26.248 39.5737 27.7188 35.4473 27.7188C32.0973 27.7188 29.6053 26.9835 28.7473 24.8999C28.0937 23.2658 29.1149 21.6723 31.035 21.6723C32.465 21.6723 33.6089 22.4487 33.6906 24.0011C33.7725 25.4719 34.3034 26.0847 35.1614 26.0847C36.1829 26.0847 36.7138 25.3083 36.7138 24.1644C36.7138 23.0615 35.6925 21.9583 33.8133 21.4682C31.2393 20.7735 29.0741 19.6298 29.0741 17.3011C29.0741 14.3595 32.5058 12.8071 36.428 12.8071C39.3693 12.8071 41.4121 13.7467 42.1066 15.3399C42.7602 16.9743 41.7797 18.445 39.9005 18.445C38.4705 18.445 37.6128 17.7914 37.2858 16.1979C37.0408 14.8907 36.9592 14.4411 36.101 14.4411C35.2841 14.4411 35.1205 15.1358 35.1205 16.0344C35.1205 17.0151 35.815 18.159 37.5309 18.6491Z" fill="#231F20" />
                <path d="M51.9514 15.4225H50.3171V20.611C50.3171 23.0622 50.5214 23.7161 51.3794 23.7161C52.033 23.7161 52.1966 23.3482 52.4415 23.0622C52.891 22.5718 53.3814 22.7762 53.177 23.5525C52.6867 25.5134 51.543 27.7197 48.683 27.7197C46.0683 27.7197 44.6794 25.7994 44.6794 21.8774V15.4225H44.3118C43.7806 15.4225 43.3311 14.973 43.3311 14.4421C43.3311 13.8701 43.7395 13.4614 44.2707 13.4206H44.3118C46.5178 13.4206 47.4574 12.3993 48.111 10.5609C48.4378 9.62131 48.969 9.13096 49.5818 9.13096C50.1946 9.13096 50.4806 9.62131 50.4806 10.3566C50.4806 11.7046 50.3582 12.5218 50.3171 13.4206H51.9514C52.4826 13.4206 52.9727 13.8701 52.9727 14.4421C52.9727 14.973 52.4826 15.4225 51.9514 15.4225Z" fill="#231F20" />
                <path d="M62.2484 19.4255L61.6764 19.6706C60.328 20.4062 59.838 21.8359 59.838 22.9798C59.838 24.2055 60.2872 24.8591 61.1452 24.8591C61.9624 24.8591 62.8612 23.9195 62.4525 20.9371L62.2484 19.4255ZM66.4972 27.5146C64.2503 27.5146 63.4332 26.5342 63.1472 25.1859C62.2075 26.575 60.6957 27.4738 58.694 27.4738C55.9568 27.4738 54.1592 26.1666 54.1592 24.0419C54.1592 22.0402 55.7524 20.6103 58.5715 19.589C61.472 18.5267 61.9624 18.1182 61.9624 17.4235C61.7172 15.4218 61.5131 14.5638 60.9411 14.5638C60.4508 14.5638 60.2464 15.2583 59.9604 16.4023C59.6336 17.7506 58.7348 18.6902 57.1007 18.5675C55.63 18.5267 54.8536 17.4235 55.1396 16.0754C55.63 14.0327 57.8768 12.8479 61.1452 12.8479C65.3124 12.8479 67.3141 14.6455 67.8044 18.1999C68.1723 20.7327 68.4989 23.511 68.6216 24.0419C68.7851 25.0226 69.03 25.2267 69.7656 25.4719C70.2967 25.5943 70.3784 26.1255 69.9697 26.4931C69.4796 26.9427 68.1723 27.5146 66.4972 27.5146Z" fill="#231F20" />
                <path d="M71.6861 17.5462C71.1141 17.0561 70.8281 16.811 70.8281 16.2798C70.8281 15.667 71.2777 15.2175 73.361 14.0735C75.5265 12.8887 76.4661 12.5211 77.2424 12.5211C77.8961 12.5211 78.182 12.8887 78.182 13.6242C78.182 13.9102 78.141 14.237 78.1001 14.6866C79.1214 13.5834 80.4697 12.8482 82.0221 12.8482C84.6777 12.8482 85.1681 14.7271 85.5357 18.2815C85.7806 20.733 86.0261 22.5306 86.1893 23.6745C86.3937 24.7366 86.7613 25.227 87.4968 25.4311C87.9869 25.5538 88.0686 26.0847 87.7009 26.4526C87.1289 26.9835 85.7401 27.5146 84.1057 27.5146C81.5321 27.5146 80.6741 26.4526 80.5516 24.3282C80.4289 22.8166 80.3473 21.4682 80.2246 19.0578C80.1429 16.4433 79.9796 15.4218 79.2441 15.4218C78.3861 15.4218 78.0185 17.3011 77.9777 19.7523V23.511C77.9777 24.8999 78.7949 25.4311 78.7949 26.2482C78.7949 27.1062 77.5282 27.5146 75.3629 27.5146H74.9953C72.8301 27.5146 71.5226 27.1062 71.5226 26.2482C71.5226 25.4311 72.3397 24.8999 72.3397 23.511V21.4682C72.3397 18.8946 72.3397 18.159 71.6861 17.5462Z" fill="#231F20" />
                <path d="M96.1985 15.4225H94.5642V20.611C94.5642 23.0622 94.7685 23.7161 95.6265 23.7161C96.2801 23.7161 96.4436 23.3482 96.6886 23.0622C97.1381 22.5718 97.6284 22.7762 97.4241 23.5525C96.9337 25.5134 95.7898 27.7197 92.9301 27.7197C90.3153 27.7197 88.9265 25.7994 88.9265 21.8774V15.4225H88.5586C88.0277 15.4225 87.5781 14.973 87.5781 14.4421C87.5781 13.8701 87.9866 13.4614 88.5177 13.4206H88.5586C90.7649 13.4206 91.7045 12.3993 92.3581 10.5609C92.6849 9.62131 93.2161 9.13096 93.8289 9.13096C94.4417 9.13096 94.7277 9.62131 94.7277 10.3566C94.7277 11.7046 94.6052 12.5218 94.5642 13.4206H96.1985C96.7296 13.4206 97.2197 13.8701 97.2197 14.4421C97.2197 14.973 96.7296 15.4225 96.1985 15.4225Z" fill="#231F20" />
                <path d="M98.8121 10.4786C98.2809 10.0701 97.9541 9.82494 97.9541 9.29378C97.9541 8.68097 98.6896 8.23144 100.814 7.08773C102.938 5.94376 103.878 5.61695 104.613 5.61695C105.308 5.61695 105.676 6.0254 105.676 6.67902C105.676 7.57782 105.349 8.68097 105.349 13.5018V23.511C105.349 24.9002 106.207 25.4313 106.207 26.2482C106.207 27.1062 104.94 27.5146 102.734 27.5146H102.366C100.16 27.5146 98.894 27.1062 98.894 26.2482C98.894 25.4313 99.7517 24.9002 99.7517 23.511V14.4822C99.7517 11.8269 99.6292 11.173 98.8121 10.4786Z" fill="#231F20" />
                <path d="M109.231 18.282C107.637 14.7277 106.575 14.9728 106.575 13.8699C106.575 13.0117 108.536 12.5624 110.783 12.5624H111.151C113.398 12.5624 114.909 12.9712 114.909 13.8289C114.909 14.646 113.97 15.0953 114.46 16.3617C114.909 17.7101 116.012 20.8968 116.789 22.6536C117.606 20.5292 118.096 18.7724 118.709 17.1791C119.403 15.4632 118.995 15.0545 118.26 14.7277C117.442 14.36 117.197 14.0332 117.197 13.7472C117.197 13.0117 118.014 12.6441 120.588 12.6441C123.285 12.6441 124.02 12.9301 124.02 13.6245C124.02 14.1965 122.263 14.9728 121.65 16.4436C120.547 19.0584 120.139 20.8557 118.341 25.2681C116.298 30.2932 114.991 32.0908 111.804 32.0908C109.762 32.0908 107.924 31.3556 107.352 29.5988C106.902 28.2505 107.842 26.984 109.312 26.984C110.824 26.984 111.559 27.8828 111.478 29.1901C111.355 30.2524 111.723 30.7017 112.376 30.7017C113.439 30.7017 114.133 29.3944 113.234 27.27C112.254 25.0232 109.966 19.998 109.231 18.282Z" fill="#231F20" />
                <path d="M12.7856 39.4902C13.2525 38.4624 13.8132 37.3882 14.2804 36.2668C15.1215 34.3515 15.4483 33.4638 14.7009 32.9031C14.0937 32.5294 13.9067 32.0157 13.9067 31.7352C13.9067 30.9878 14.841 30.5206 17.8311 30.5206C20.7273 30.5206 21.3346 31.0813 21.3346 31.7821C21.3346 32.8565 18.8586 33.2771 17.6907 35.6596C16.1959 38.7428 15.1215 40.9852 14.4205 42.5268V49.3006C14.4205 50.8891 15.5418 52.3372 15.5418 53.2716C15.5418 54.2526 13.9067 54.7197 11.4307 54.7197H10.9638C8.48783 54.7197 6.85272 54.2526 6.85272 53.2716C6.85272 52.3372 7.97378 50.8891 7.97378 49.3006V43.6945C7.03943 41.4055 6.01185 39.21 5.45119 38.0421C3.76947 34.4448 1.38672 33.137 1.38672 32.0157C1.38672 31.0347 3.20881 30.5206 5.6379 30.5206H6.38554C8.955 30.5206 10.8703 30.8477 10.8703 31.8287C10.8703 32.5763 10.2628 33.4638 10.5899 34.3515C10.8703 35.239 11.7112 37.2478 12.7856 39.4902Z" fill="#231F20" />
                <path d="M33.6216 41.8261C32.5006 36.1266 31.1457 32.5295 29.3705 32.81C27.5952 33.0902 28.3895 40.8918 28.8101 43.3678C29.7441 48.7869 31.5662 52.7576 33.248 52.4308C34.6961 52.197 34.6961 47.1518 33.6216 41.8261ZM41.8904 42.6204C41.8904 50.4217 37.4991 55 31.2392 55C24.9792 55 20.5879 50.4217 20.5879 42.6204C20.5879 34.7719 24.9792 30.2405 31.2392 30.2405C37.4991 30.2405 41.8904 34.7719 41.8904 42.6204Z" fill="#231F20" />
                <path d="M53.009 54.9531C47.73 54.9531 43.8528 52.6641 43.8528 45.4232V35.893C43.8528 34.3047 42.7314 32.8563 42.7314 31.922C42.7314 30.941 44.4132 30.4739 46.8425 30.4739H47.3097C49.7857 30.4739 51.4208 30.941 51.4208 31.922C51.4208 32.8563 50.2995 34.3047 50.2995 35.893V45.4232C50.2995 50.1415 51.3273 52.01 53.8499 52.01C56.5595 52.01 57.4003 49.4874 57.4003 45.4232V35.893C57.4003 34.3047 55.9056 32.8563 55.9056 31.922C55.9056 30.941 57.2133 30.4739 59.2224 30.4739H59.5492C61.558 30.4739 62.9129 30.941 62.9129 31.922C62.9129 32.8563 61.4179 34.3047 61.4179 35.893V45.4232C61.4179 50.7488 59.1758 54.9531 53.009 54.9531Z" fill="#231F20" />
                <path d="M77.2056 38.3223C77.2056 35.9398 76.8319 33.3237 73.0948 33.3237C71.693 33.3237 71.693 33.7906 71.693 35.8929V41.1719C71.693 42.6201 71.9269 42.9937 73.2349 42.9937C76.3182 42.9937 77.2056 40.6581 77.2056 38.3223ZM83.7927 38.1353C83.7927 40.8448 82.5313 42.9471 80.1022 44.2552C80.9896 46.1239 81.5969 47.6655 83.1385 49.4873C84.5401 51.169 85.5679 51.4026 86.4088 51.7297C87.1561 52.0102 87.6702 52.4305 87.5767 52.9911C87.4832 53.9255 86.0351 54.7197 83.2789 54.7197C80.0553 54.7197 77.8129 53.5984 76.5049 51.356C74.2625 47.6655 74.8231 45.7033 73.0013 45.7033C72.067 45.7502 71.693 46.1705 71.693 47.8522V49.3006C71.693 50.8888 72.8143 52.337 72.8143 53.2713C72.8143 54.2526 71.1792 54.7197 68.7033 54.7197H68.2361C65.807 54.7197 64.1719 54.2526 64.1719 53.2713C64.1719 52.337 65.2463 50.8888 65.2463 49.3006V35.8929C65.2463 34.3047 64.1719 32.8565 64.1719 31.9222C64.1719 30.9412 65.807 30.474 68.2361 30.474H72.7677C80.2423 30.474 83.7927 33.5104 83.7927 38.1353Z" fill="#231F20" />
                <path d="M100.004 40.2376C105.984 41.8261 108.039 44.8625 108.039 47.8057C108.039 52.3839 103.461 55 97.4346 55C92.0624 55 89.0258 52.8508 87.8578 50.1415C86.7834 47.3854 87.8578 45.1427 90.3338 44.956C92.4361 44.8159 93.7907 45.7503 94.1178 48.226C94.4449 50.5618 95.8461 52.1037 98.1354 52.1037C100.051 52.1037 101.686 50.7954 101.686 48.8335C101.686 47.3385 100.238 45.8437 95.1922 44.442C91.0346 43.1808 88.8857 41.0785 88.8857 37.5281C88.8857 32.9967 92.5762 30.2871 98.2289 30.2871C102.527 30.2871 105.143 32.2493 106.264 34.8654C107.339 37.575 105.89 39.4434 103.368 39.4434C101.779 39.4434 100.378 38.2755 99.8171 35.9865C99.3968 34.0711 98.5091 32.7631 97.3411 32.7631C95.6594 32.7631 94.9587 34.1646 94.9587 35.7063C94.9587 37.2945 95.8461 39.1632 100.004 40.2376Z" fill="#231F20" />
                <path d="M5.68546 2.15245L7.67477 0.0527954C7.78116 -0.0593891 7.96998 0.0185614 7.96577 0.173145L7.88808 3.06468C7.88545 3.16133 7.96445 3.24033 8.0611 3.23796L10.9524 3.16001C11.1072 3.1558 11.1854 3.34461 11.073 3.45101L8.97333 5.44032C8.90328 5.50694 8.90328 5.6186 8.97333 5.68523L11.073 7.6748C11.1854 7.78119 11.1072 7.96975 10.9524 7.9658L8.0611 7.88785C7.96445 7.88522 7.88545 7.96422 7.88808 8.06087L7.96577 10.9524C7.96998 11.107 7.78116 11.1852 7.67477 11.073L5.68546 8.9731C5.61884 8.90305 5.50718 8.90305 5.44055 8.9731L3.45124 11.073C3.34485 11.1852 3.15603 11.107 3.16024 10.9524L3.23819 8.06087C3.24056 7.96422 3.16156 7.88522 3.06491 7.88785L0.173378 7.9658C0.0187946 7.96975 -0.0591558 7.78119 0.0530293 7.6748L2.15242 5.68523C2.22273 5.6186 2.22273 5.50694 2.15242 5.44032L0.0530293 3.45101C-0.0591558 3.34461 0.0187946 3.1558 0.173378 3.16001L3.06491 3.23796C3.16156 3.24033 3.24056 3.16133 3.23819 3.06468L3.16024 0.173145C3.15603 0.0185614 3.34485 -0.0593891 3.45124 0.0527954L5.44055 2.15245C5.50718 2.2225 5.61884 2.2225 5.68546 2.15245Z" fill="#231F20" />
              </svg>

            </div>
            <div className="mt-6 md:ml-[100px] md:mt-0 footer-link border-b pb-6 md:pb-0 border-[#333333] md:border-0">
              <div
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => { setIsMenuOpen(!isMenuOpen); setIsCompanyOpen(false); setIsContactOpen(false); setIsLinksOpen(false) }}
              >
                <h2 className="text-[24px] leading-[28.8px] font-[600] font-regola-pro text-[#333333]">
                  MENU
                </h2>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'
                    } md:hidden`}
                />
              </div>
              <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-3`}>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] font-[400] font-regola-pro text-[#333333] mt-3 uppercase"
                  onClick={() => {
                    navigate('/ready-to-eat');
                    dispatch(addCategoryData(null));
                    dispatch(subscribeClose());
                  }}
                >
                  Ready to eat
                </p>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase"
                  onClick={() => {
                    navigate('/ready-to-cook');
                    dispatch(addCategoryData(null));
                  }}
                >
                  Ready to cook
                </p>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase"
                  onClick={() => {
                    navigate('/bulk');
                    dispatch(addCategoryData(null));
                  }}
                >
                  Bulk products
                </p>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase"
                  onClick={() => {
                    navigate('/products');
                    dispatch(addCategoryData(null));
                  }}
                >
                  All products
                </p>
              </div>
            </div>
            <div className="mt-4 md:ml-[30px] md:mt-0 footer-link border-b pb-6 md:pb-0 border-[#333333] md:border-0">
              <div
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => { setIsCompanyOpen(!isCompanyOpen); setIsMenuOpen(false); setIsContactOpen(false); setIsLinksOpen(false) }}
              >
                <h2 className="text-[24px] leading-[28.8px] font-[600] font-regola-pro text-[#333333]">
                  OUR COMPANY
                </h2>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${isCompanyOpen ? 'rotate-180' : 'rotate-0'
                    } md:hidden`}
                />
              </div>
              <div className={`${isCompanyOpen ? 'block' : 'hidden'} md:block mt-3`}>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] font-[400] font-regola-pro text-[#333333] mt-3 uppercase"
                  onClick={() => navigate('/aboutus')}
                >
                  ABOUT US
                </p>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase"
                  onClick={() => navigate('/how-it-works')}
                >
                  HOW IT WORKS
                </p>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase"
                  onClick={() => navigate('/facilities')}
                >
                  Facility
                </p>
                {/* <p className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase">
                  Sustainability
                </p> */}
              </div>
            </div>
            <div className="mt-4 md:ml-[30px] md:mt-0 footer-link border-b pb-6 md:pb-0 border-[#333333] md:border-0">
              <div
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => { setIsLinksOpen(!isLinksOpen); setIsCompanyOpen(false); setIsContactOpen(false); setIsMenuOpen(false) }}
              >
                <h2 className="text-[24px] leading-[28.8px] font-[600] font-regola-pro text-[#333333]">
                  QUICK LINKS
                </h2>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${isLinksOpen ? 'rotate-180' : 'rotate-0'
                    } md:hidden`}
                />
              </div>
              <div className={`${isLinksOpen ? 'block' : 'hidden'} md:block mt-3`}>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] font-[400] font-regola-pro text-[#333333] mt-3 uppercase"
                  onClick={() => navigate('/recipe-list')}
                >
                  Recipes
                </p>
                {/* <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase"
                  onClick={() => {
                    navigate('/ready-to-eat');
                    dispatch(addCategoryData(null));
                    dispatch(subscribeOpen());
                  }}
                >
                  Subscribe
                </p> */}
                <a href="https://linktr.ee/instantlyyours" target="_blank" rel="noopener noreferrer">
                  <p className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase">
                    Linktree
                  </p>
                </a>
              </div>
            </div>
            <div className="mt-4 md:ml-[30px] md:mt-0 footer-link ">
              <div
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => { setIsContactOpen(!isContactOpen); setIsMenuOpen(false); setIsCompanyOpen(false); setIsLinksOpen(false) }}
              >
                <h2 className="text-[24px] leading-[28.8px] font-[600] font-regola-pro text-[#333333]">
                  CONTACT US
                </h2>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${isContactOpen ? 'rotate-180' : 'rotate-0'
                    } md:hidden`}
                />
              </div>
              <div className={`${isContactOpen ? 'block' : 'hidden'} md:block mt-3`}>
                <Link
                  to={'/business-inquiry'}
                  rel="noopener noreferrer"
                >
                  <p className="text-[16px] cursor-pointer leading-[19.2px] font-[400] font-regola-pro text-[#333333] mt-3 uppercase">
                    Get in touch
                  </p>
                </Link>
                <p
                  className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333]"
                  onClick={() => {
                    navigate('/faqs');
                  }}
                >
                  FAQs
                </p>
                <a
                  href="https://www.linkedin.com/company/instantly-yours-inc/jobs/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase">
                    Careers
                  </p>
                </a>
                <Link
                  to={'/influencers'}
                  rel="noopener noreferrer"
                >
                  <p className="text-[16px] cursor-pointer leading-[19.2px] mt-[10px] font-[400] font-regola-pro text-[#333333] uppercase">
                    Influencers
                  </p>
                </Link>
              </div>
            </div>

          </div>
          <div className="mt-10 sm:w-[385px] md:mt-0 mr-6 ml-0 md:ml-[24px] 2xl:ml-0">
            <h2 className="sm:text-[24px] text-[16px] leading-[28.8px] font-[600] font-regola-pro text-[#000000] mb-2">Subscribe to our newsletter</h2>
            <div className="relative flex items-center">
              <input
                type="text"
                className={`input-box bg-[#EADEC1] placeholder:text-[#757575] font-regola-pro px-5 py-4 border-[3px] w-full border-[#AA9460] text-[#757575] rounded-lg text-[21px] font-[400] leading-[28.8px] my-3 focus:outline-[#AA9460] focus:ring-0 `}
                placeholder="Email ID"
              />
              <button type="button" className="send-button rounded-full flex justify-center items-center absolute right-3 h-[38px] w-[38px] text-2xl bg-[#AA946080]" >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.3996 17.3336L15.5996 12.1336L10.3996 6.93359" stroke="#695118" strokeWidth="2.6" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between pl-12 pr-16 md:px-16 pb-10">
          <div>
            <div className="flex sm:gap-x-2 gap-x-8  md:gap-x-6 mt-8 md:mt-0">
              <div>
                <a href="https://www.facebook.com/people/Instantly-Yours/100079508513629/" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-[18px]">
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </a>
              </div>

              <div>
                <a href="https://www.instagram.com/instantlyyoursinc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[28px]"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>
                </a>
              </div>
              <div>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[28px]"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                </a>
              </div>
              <div>
                {/* <img src={linkedin} alt="" className="w-[30px]" /> */}
                <a href="https://www.linkedin.com/company/instantly-yours-inc/" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[28px]"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" /></svg>
                </a>
              </div>
            </div>
            <p className="text-[#757575] text-[14px] font-[300] mt-4 font-regola-pro">© IY EASY MEALS LLP</p>
          </div>
          <div>
            <div className="footer-bottom-link flex flex-wrap gap-x-4 justify-between gap-y-2 md:text-md text-[#333333] font-regola-pro font-[400] text-[16px] leading-[19.2px]">
              <Link className="border-b border-b-gray-900  " to="/privacy-policy">Privacy Policy</Link>
              <Link className="border-b border-b-gray-900 " to="/term-of-services">Service Terms</Link>
              <Link className="border-b border-b-gray-900   " to="/cancellation-policy">Cancellation Policy</Link>
              <Link className="border-b border-b-gray-900  " to="/refund">Refund Policy</Link>
            </div>
            <div className="md:flex flex-wrap gap-y-2 gap-x-3 mt-5 hidden">
              <div>
                <img src={amazonapy} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={american} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={googlepay} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={unionpay} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={mastercard} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={paypal} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={visa} alt="" className="w-[51px] h-[34px]" />
              </div>
              <div>
                <img src={applepay} alt="" className="w-[51px] h-[34px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
