import React, { } from "react";
import { Link, useLocation } from "react-router-dom";
import amazonapy from '../assets/amazon-pay.png';
import american from '../assets/american-express.png';
import googlepay from '../assets/google-pay.png';
import mastercard from '../assets/mastercard.png';
import paypal from '../assets/paypal.png';
import unionpay from '../assets/unionpay.png';
import visa from '../assets/visa.png';
import applepay from '../assets/apple-pay.png';

export const Footer = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className={`bg-[#EADEC1] relative z-[100] ${pathname === '/' ? '-bottom-28' : '-bottom-28'}  `}>
      <div className="mx-auto container flex flex-col md:flex-row justify-between px-4  py-10">
        {/* <div className="flex items-center gap-2">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.06 6.645C6.0975 6.3975 6.18 6.18 6.285 6C6.51 5.58 6.8925 5.3625 7.41 5.355C7.7475 5.355 8.055 5.505 8.2725 5.7225C8.4825 5.955 8.625 6.2775 8.625 6.6H9.975C9.96 6.2475 9.8925 5.925 9.75 5.625C9.6375 5.34 9.465 5.085 9.24 4.875C8.1525 3.87 6.135 4.0125 5.2125 5.1525C4.245 6.405 4.2225 8.595 5.205 9.8475C6.1125 10.965 8.1 11.1225 9.18 10.125C9.4125 9.9375 9.6 9.705 9.75 9.435C9.87 9.165 9.9525 8.88 9.96 8.5725H8.625C8.625 8.73 8.5725 8.8725 8.505 9C8.4375 9.1425 8.3475 9.255 8.25 9.3525C8.0025 9.5475 7.71 9.6525 7.395 9.6525C7.125 9.645 6.9 9.5925 6.7275 9.48C6.53307 9.37067 6.37818 9.20266 6.285 9C5.91 8.325 5.97 7.3875 6.06 6.645ZM7.5 0C3.375 0 0 3.375 0 7.5C0.3975 17.4525 14.625 17.445 15 7.5C15 3.375 11.625 0 7.5 0ZM7.5 13.5C4.1925 13.5 1.5 10.8075 1.5 7.5C1.83 -0.4575 13.17 -0.4575 13.5 7.5C13.5 10.8075 10.8075 13.5 7.5 13.5Z"
              fill="black"
            />
          </svg>

          <span>2024 Instantly Yours</span>
        </div>
        <div className="flex items-center lg:gap-8 gap-4">
          <Link to="/term-of-services">Term & Condition</Link>
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/refund">Refunds</Link>
          <Link to="/accessibility">Accessibility Statement</Link>
        </div> */}
        <div className="flex flex-row gap-y-4 md:gap-y-1">
          <div className="lg:pr-20">
            <svg
              width="180"
              height="50"
              viewBox="0 0 180 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.57521 19.9025C1.96275 19.29 1.72742 19.0076 1.72742 18.6308C1.72742 17.8768 2.52814 17.4058 5.49571 16.1809C7.94525 15.0504 8.74627 14.8151 9.4058 14.8151C9.97089 14.8151 10.3477 15.239 10.3477 16.2754C10.3477 17.3588 10.1595 19.0076 10.1595 23.5769V27.1099C10.1595 28.7113 11.1017 29.3238 11.1017 30.266C11.1017 31.2553 9.59406 31.7263 7.14452 31.7263H6.67356C4.17665 31.7263 2.66934 31.2553 2.66934 30.266C2.66934 29.3238 3.65863 28.7113 3.65863 27.1099V24.8015C3.65863 21.1274 3.5645 20.9859 2.57521 19.9025Z"
                // className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                className={`fill-current text-[#231F20]`}
              />
              <path
                d="M13.5036 20.2322C12.844 19.6671 12.5143 19.3844 12.5143 18.7719C12.5143 18.0653 13.0326 17.547 15.4348 16.2279C17.9317 14.8618 19.0151 14.4379 19.9103 14.4379C20.6639 14.4379 20.9937 14.8618 20.9937 15.7099C20.9937 16.0397 20.9466 16.4165 20.8993 16.9348C22.0771 15.6628 23.6315 14.815 25.4215 14.815C28.4835 14.815 29.0489 16.9816 29.4728 21.0799C29.7555 23.9066 30.0382 25.9793 30.2265 27.2984C30.4621 28.523 30.886 29.0884 31.7341 29.3237C32.2992 29.4652 32.3933 30.0774 31.9694 30.5016C31.3102 31.1137 29.7084 31.7262 27.824 31.7262C24.8564 31.7262 23.8671 30.5016 23.7259 28.052C23.5844 26.3091 23.4903 24.7544 23.3488 21.9751C23.2547 18.9605 23.0664 17.7826 22.2183 17.7826C21.229 17.7826 20.8051 19.9495 20.7581 22.7758V27.1098C20.7581 28.7113 21.7003 29.3237 21.7003 30.2659C21.7003 31.2552 20.24 31.7262 17.7431 31.7262H17.3192C14.8226 31.7262 13.315 31.2552 13.315 30.2659C13.315 29.3237 14.2572 28.7113 14.2572 27.1098V24.7544C14.2572 21.7868 14.2572 20.9387 13.5036 20.2322Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M43.275 21.504C47.8443 22.8231 49.3519 24.3774 49.3519 26.8273C49.3519 30.2658 45.6304 31.9617 40.8725 31.9617C37.0098 31.9617 34.1363 31.1139 33.147 28.7114C32.3934 26.8273 33.5709 24.9899 35.7848 24.9899C37.4337 24.9899 38.7527 25.8851 38.8468 27.6751C38.9413 29.371 39.5534 30.0776 40.5427 30.0776C41.7206 30.0776 42.3327 29.1824 42.3327 27.8633C42.3327 26.5917 41.1552 25.3197 38.9883 24.7546C36.0205 23.9536 33.5239 22.6348 33.5239 19.9496C33.5239 16.5579 37.4807 14.7679 42.0033 14.7679C45.3947 14.7679 47.7502 15.8513 48.5509 17.6884C49.3045 19.5728 48.174 21.2687 46.0072 21.2687C44.3584 21.2687 43.3694 20.515 42.9923 18.6776C42.7099 17.1703 42.6157 16.652 41.6262 16.652C40.6842 16.652 40.4957 17.453 40.4957 18.4891C40.4957 19.6199 41.2964 20.9389 43.275 21.504Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M59.9037 17.7826H58.0192V23.7651C58.0192 26.5915 58.2548 27.3455 59.2441 27.3455C59.9978 27.3455 60.1863 26.9213 60.4687 26.5915C60.9871 26.0261 61.5525 26.2617 61.3168 27.1569C60.7514 29.4179 59.4327 31.9619 56.1351 31.9619C53.1201 31.9619 51.5187 29.7476 51.5187 25.2254V17.7826H51.0948C50.4823 17.7826 49.964 17.2643 49.964 16.6522C49.964 15.9926 50.4349 15.5214 51.0474 15.4743H51.0948C53.6385 15.4743 54.7219 14.2967 55.4755 12.177C55.8524 11.0935 56.4648 10.5281 57.1714 10.5281C57.878 10.5281 58.2078 11.0935 58.2078 11.9413C58.2078 13.4957 58.0666 14.4379 58.0192 15.4743H59.9037C60.5161 15.4743 61.0812 15.9926 61.0812 16.6522C61.0812 17.2643 60.5161 17.7826 59.9037 17.7826Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M71.7746 22.3991L71.1151 22.6818C69.5604 23.5298 68.9953 25.1784 68.9953 26.4974C68.9953 27.9106 69.5133 28.6643 70.5026 28.6643C71.4448 28.6643 72.4812 27.5808 72.0099 24.142L71.7746 22.3991ZM76.6737 31.7263C74.0829 31.7263 73.1407 30.5958 72.8109 29.0411C71.7275 30.6428 69.9843 31.6792 67.6762 31.6792C64.5201 31.6792 62.4474 30.1719 62.4474 27.722C62.4474 25.414 64.2845 23.7652 67.535 22.5876C70.8794 21.3627 71.4448 20.8917 71.4448 20.0907C71.1621 17.7827 70.9268 16.7934 70.2673 16.7934C69.7019 16.7934 69.4662 17.5941 69.1365 18.9132C68.7597 20.4678 67.7233 21.5513 65.8392 21.4098C64.1433 21.3627 63.2481 20.0907 63.5779 18.5363C64.1433 16.1809 66.734 14.8148 70.5026 14.8148C75.3075 14.8148 77.6156 16.8875 78.181 20.9859C78.6052 23.9064 78.9817 27.1099 79.1232 27.722C79.3118 28.8528 79.5942 29.0882 80.4423 29.3708C81.0547 29.512 81.1488 30.1245 80.6776 30.5484C80.1125 31.0667 78.6052 31.7263 76.6737 31.7263Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M82.6559 20.2322C81.9964 19.6671 81.6666 19.3844 81.6666 18.7719C81.6666 18.0653 82.185 17.547 84.5871 16.2279C87.084 14.8618 88.1675 14.4379 89.0626 14.4379C89.8163 14.4379 90.146 14.8618 90.146 15.7099C90.146 16.0397 90.0987 16.4165 90.0516 16.9348C91.2292 15.6628 92.7838 14.815 94.5739 14.815C97.6359 14.815 98.2012 16.9816 98.6251 21.0799C98.9075 23.9066 99.1905 25.9793 99.3788 27.2984C99.6144 28.523 100.038 29.0884 100.886 29.3237C101.452 29.4652 101.546 30.0774 101.122 30.5016C100.462 31.1137 98.8608 31.7262 96.9763 31.7262C94.0088 31.7262 93.0195 30.5016 92.8783 28.052C92.7368 26.3091 92.6426 24.7544 92.5011 21.9751C92.407 18.9605 92.2187 17.7826 91.3707 17.7826C90.3814 17.7826 89.9575 19.9495 89.9104 22.7758V27.1098C89.9104 28.7113 90.8526 29.3237 90.8526 30.2659C90.8526 31.2552 89.3921 31.7262 86.8955 31.7262H86.4716C83.975 31.7262 82.4673 31.2552 82.4673 30.2659C82.4673 29.3237 83.4096 28.7113 83.4096 27.1098V24.7544C83.4096 21.7868 83.4096 20.9387 82.6559 20.2322Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M110.921 17.7826H109.036V23.7651C109.036 26.5915 109.272 27.3455 110.261 27.3455C111.015 27.3455 111.203 26.9213 111.486 26.5915C112.004 26.0261 112.57 26.2617 112.334 27.1569C111.769 29.4179 110.449 31.9619 107.152 31.9619C104.137 31.9619 102.536 29.7476 102.536 25.2254V17.7826H102.112C101.499 17.7826 100.981 17.2643 100.981 16.6522C100.981 15.9926 101.452 15.5214 102.065 15.4743H102.112C104.656 15.4743 105.739 14.2967 106.493 12.177C106.869 11.0935 107.482 10.5281 108.189 10.5281C108.895 10.5281 109.225 11.0935 109.225 11.9413C109.225 13.4957 109.084 14.4379 109.036 15.4743H110.921C111.533 15.4743 112.098 15.9926 112.098 16.6522C112.098 17.2643 111.533 17.7826 110.921 17.7826Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M113.936 12.0827C113.323 11.6117 112.946 11.329 112.946 10.7166C112.946 10.01 113.794 9.49165 116.244 8.1729C118.693 6.85385 119.777 6.47702 120.625 6.47702C121.426 6.47702 121.85 6.94798 121.85 7.70163C121.85 8.73799 121.473 10.01 121.473 15.5686V27.1097C121.473 28.7114 122.462 29.3239 122.462 30.2658C122.462 31.2551 121.002 31.7261 118.458 31.7261H118.034C115.49 31.7261 114.03 31.2551 114.03 30.2658C114.03 29.3239 115.019 28.7114 115.019 27.1097V16.6991C115.019 13.6374 114.878 12.8834 113.936 12.0827Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M125.947 21.0801C124.11 16.9817 122.885 17.2644 122.885 15.9928C122.885 15.0032 125.146 14.4851 127.737 14.4851H128.161C130.752 14.4851 132.495 14.9564 132.495 15.9454C132.495 16.8876 131.412 17.4056 131.977 18.8659C132.495 20.4206 133.767 24.095 134.662 26.1207C135.604 23.6711 136.169 21.6455 136.876 19.8084C137.677 17.8298 137.206 17.3586 136.358 16.9817C135.416 16.5578 135.133 16.181 135.133 15.8513C135.133 15.0032 136.075 14.5793 139.043 14.5793C142.152 14.5793 143 14.909 143 15.7098C143 16.3693 140.974 17.2644 140.268 18.9603C138.996 21.9753 138.525 24.0477 136.452 29.1353C134.097 34.9295 132.589 37.0023 128.915 37.0023C126.56 37.0023 124.44 36.1545 123.781 34.1288C123.262 32.5741 124.346 31.1139 126.042 31.1139C127.784 31.1139 128.632 32.1502 128.538 33.6576C128.397 34.8825 128.821 35.4005 129.574 35.4005C130.799 35.4005 131.6 33.8932 130.564 31.4437C129.433 28.8529 126.795 23.0587 125.947 21.0801Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M14.7431 45.534C15.2814 44.3488 15.9279 43.1103 16.4666 41.8173C17.4364 39.6089 17.8133 38.5853 16.9515 37.9388C16.2513 37.5079 16.0357 36.9155 16.0357 36.5921C16.0357 35.7304 17.1131 35.1917 20.5607 35.1917C23.9002 35.1917 24.6004 35.8382 24.6004 36.6462C24.6004 37.8851 21.7455 38.37 20.3988 41.1171C18.6753 44.6722 17.4364 47.2578 16.6281 49.0354V56.8458C16.6281 58.6774 17.9211 60.3472 17.9211 61.4246C17.9211 62.5557 16.0357 63.0943 13.1808 63.0943H12.6424C9.78752 63.0943 7.90216 62.5557 7.90216 61.4246C7.90216 60.3472 9.19479 58.6774 9.19479 56.8458V50.3817C8.11744 47.7424 6.9326 45.2109 6.28613 43.8642C4.34703 39.7164 1.59961 38.2084 1.59961 36.9155C1.59961 35.7844 3.70056 35.1917 6.50142 35.1917H7.36348C10.3262 35.1917 12.5346 35.5688 12.5346 36.6999C12.5346 37.562 11.8341 38.5853 12.2112 39.6089C12.5346 40.6322 13.5042 42.9484 14.7431 45.534Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M38.7666 48.2274C37.4739 41.6555 35.9116 37.5079 33.8647 37.8313C31.8178 38.1544 32.7337 47.15 33.2186 50.0049C34.2956 56.2534 36.3966 60.8318 38.3357 60.455C40.0054 60.1854 40.0054 54.3681 38.7666 48.2274ZM48.3008 49.1432C48.3008 58.1385 43.2375 63.4174 36.0194 63.4174C28.8014 63.4174 23.738 58.1385 23.738 49.1432C23.738 40.0935 28.8014 34.8686 36.0194 34.8686C43.2375 34.8686 48.3008 40.0935 48.3008 49.1432Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M61.1205 63.3636C55.0336 63.3636 50.563 60.7242 50.563 52.3751V41.3863C50.563 39.555 49.27 37.8849 49.27 36.8076C49.27 35.6765 51.2091 35.1378 54.0103 35.1378H54.549C57.4039 35.1378 59.2892 35.6765 59.2892 36.8076C59.2892 37.8849 57.9963 39.555 57.9963 41.3863V52.3751C57.9963 57.8156 59.1814 59.97 62.0901 59.97C65.2143 59.97 66.1839 57.0613 66.1839 52.3751V41.3863C66.1839 39.555 64.4604 37.8849 64.4604 36.8076C64.4604 35.6765 65.9683 35.1378 68.2849 35.1378H68.6617C70.9779 35.1378 72.5402 35.6765 72.5402 36.8076C72.5402 37.8849 70.8164 39.555 70.8164 41.3863V52.3751C70.8164 58.5158 68.2311 63.3636 61.1205 63.3636Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M89.0219 44.1874C89.0219 41.4403 88.591 38.4238 84.282 38.4238C82.6656 38.4238 82.6656 38.9622 82.6656 41.3862V47.4732C82.6656 49.1429 82.9353 49.5738 84.4435 49.5738C87.9986 49.5738 89.0219 46.8808 89.0219 44.1874ZM96.6171 43.9718C96.6171 47.096 95.1626 49.5201 92.3618 51.0283C93.3851 53.183 94.0853 54.9606 95.8628 57.0612C97.4789 59.0003 98.664 59.2697 99.6336 59.6468C100.495 59.9702 101.088 60.4548 100.98 61.1013C100.872 62.1786 99.2027 63.0944 96.0247 63.0944C92.3077 63.0944 89.7221 61.8015 88.2139 59.2159C85.6283 54.9606 86.2748 52.6981 84.1742 52.6981C83.0968 52.7521 82.6656 53.2367 82.6656 55.1759V56.8459C82.6656 58.6772 83.9586 60.347 83.9586 61.4243C83.9586 62.5557 82.0732 63.0944 79.2183 63.0944H78.6796C75.8788 63.0944 73.9934 62.5557 73.9934 61.4243C73.9934 60.347 75.2323 58.6772 75.2323 56.8459V41.3862C75.2323 39.5549 73.9934 37.8851 73.9934 36.8078C73.9934 35.6767 75.8788 35.138 78.6796 35.138H83.9048C92.5233 35.138 96.6171 38.6391 96.6171 43.9718Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M115.308 46.3958C122.203 48.2274 124.573 51.7285 124.573 55.1221C124.573 60.4011 119.294 63.4175 112.345 63.4175C106.151 63.4175 102.65 60.9394 101.303 57.8155C100.064 54.6375 101.303 52.0516 104.158 51.8363C106.582 51.6748 108.144 52.7521 108.521 55.6067C108.898 58.3001 110.514 60.078 113.153 60.078C115.362 60.078 117.247 58.5694 117.247 56.3073C117.247 54.5834 115.577 52.8599 109.76 51.2436C104.966 49.7894 102.488 47.3654 102.488 43.2716C102.488 38.0467 106.743 34.9224 113.261 34.9224C118.217 34.9224 121.233 37.1849 122.526 40.2014C123.765 43.3256 122.095 45.48 119.186 45.48C117.355 45.48 115.739 44.1333 115.092 41.494C114.608 39.2856 113.584 37.7774 112.238 37.7774C110.298 37.7774 109.49 39.3934 109.49 41.1709C109.49 43.0022 110.514 45.1569 115.308 46.3958Z"
                className={`fill-current text-[#231F20]`} />
              <path
                d="M6.5556 2.48215L8.84937 0.0611534C8.97204 -0.0682011 9.18976 0.0216789 9.1849 0.199922L9.09532 3.53399C9.09229 3.64543 9.18338 3.73653 9.29482 3.73379L12.6286 3.64391C12.8071 3.63905 12.8973 3.85677 12.7677 3.97945L10.3467 6.27321C10.2659 6.35004 10.2659 6.47878 10.3467 6.55561L12.7677 8.84968C12.8973 8.97235 12.8071 9.18977 12.6286 9.18521L9.29482 9.09533C9.18338 9.09229 9.09229 9.18339 9.09532 9.29483L9.1849 12.6289C9.18976 12.8071 8.97204 12.8973 8.84937 12.768L6.5556 10.3467C6.47878 10.2659 6.35003 10.2659 6.27321 10.3467L3.97944 12.768C3.85676 12.8973 3.63905 12.8071 3.64391 12.6289L3.73379 9.29483C3.73652 9.18339 3.64542 9.09229 3.53398 9.09533L0.199913 9.18521C0.021671 9.18977 -0.0682094 8.97235 0.0611452 8.84968L2.48184 6.55561C2.56291 6.47878 2.56291 6.35004 2.48184 6.27321L0.0611452 3.97945C-0.0682094 3.85677 0.021671 3.63905 0.199913 3.64391L3.53398 3.73379C3.64542 3.73653 3.73652 3.64543 3.73379 3.53399L3.64391 0.199922C3.63905 0.0216789 3.85676 -0.0682011 3.97944 0.0611534L6.27321 2.48215C6.35003 2.56292 6.47878 2.56292 6.5556 2.48215Z"
                className={`fill-current text-[#231F20]`} />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-sans font-medium text-slate-900">MENU</h2>
            <p className="text-lg font-sans text-slate-900 mt-3">CURRIES</p>
            <p className="text-lg font-sans text-slate-900 ">LENTILS</p>
            <p className="text-lg font-sans text-slate-900 ">READY TO COOK</p>
            <p className="text-lg font-sans text-slate-900 ">READT TO EAT</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-futura text-slate-900">Subscribe to our newsletter</h2>
          <div className="relative flex items-center">
            <input
              type="text"
              className={`bg-[#EADEC1] px-5 py-3 border-[3px] w-full border-[#AA9460]  rounded-lg text-3xl my-3 focus:outline-[#d5ab47] focus:ring-0 `}
              placeholder="Email ID"
            />
            <button type="button" className="rounded-full flex justify-center items-center absolute right-3 h-10 w-10 text-2xl bg-[#aa9460af]" >
              <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.39961 12.3334L7.59961 7.13335L2.39961 1.93335" stroke="#695118" stroke-width="2.6" stroke-linecap="square" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto container flex flex-col md:flex-row justify-between mt-8 px-3 md:px-1 py-10">
        <div>
          <div className="flex gap-x-2  md:gap-x-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="black"><path d="M12.04 2c-5.523 0-10.04 4.478-10.04 10 0 1.768.463 3.45 1.335 4.93l-1.388 5.057 5.193-1.357c1.444.819 3.103 1.27 4.9 1.27 5.523 0 10.04-4.477 10.04-10s-4.518-10-10.04-10zm5.732 13.568c-.234.652-1.358 1.244-1.883 1.32-.484.07-1.105.102-1.771-.107-.409-.128-.933-.304-1.61-.593-2.841-1.223-4.69-4.067-4.836-4.263-.14-.19-1.148-1.523-1.148-2.908s.728-2.059.984-2.337c.253-.273.552-.34.737-.34h.53c.19 0 .392-.035.6.453.234.536.764 1.847.83 1.982.07.139.116.301.023.484-.104.198-.155.32-.308.492-.152.17-.322.38-.458.511-.154.147-.314.31-.137.61.18.307.792 1.314 1.707 2.127 1.173 1.034 2.155 1.355 2.465 1.5.31.147.488.126.67-.077.195-.218.839-.974 1.063-1.31.23-.337.458-.287.764-.17.31.116 1.965.928 2.307 1.095.339.168.565.252.652.393.089.137.089.792-.144 1.445z" /></svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="black"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.324 1.325 1.324h11.494v-9.294h-3.124v-3.622h3.124v-2.672c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.241l-1.918.001c-1.504 0-1.796.714-1.796 1.763v2.313h3.591l-.467 3.622h-3.124v9.294h6.127c.732 0 1.324-.591 1.324-1.324v-21.351c0-.733-.592-1.325-1.325-1.325z" /></svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="black"><path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.347 3.608 1.323.975.975 1.261 2.241 1.323 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.062 1.366-.347 2.633-1.323 3.608-.975.975-2.241 1.261-3.608 1.323-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-1.366-.062-2.633-.347-3.608-1.323-.975-.975-1.261-2.241-1.323-3.608-.058-1.265-.069-1.645-.069-4.849s.012-3.584.07-4.849c.062-1.366.347-2.633 1.323-3.608.975-.975 2.241-1.261 3.608-1.323 1.265-.057 1.645-.068 4.849-.068zm0-2.163c-3.259 0-3.667.014-4.947.072-1.384.062-2.632.354-3.637 1.359-1.005 1.005-1.297 2.253-1.359 3.637-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.062 1.384.354 2.632 1.359 3.637 1.005 1.005 2.253 1.297 3.637 1.359 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.384-.062 2.632-.354 3.637-1.359 1.005-1.005 1.297-2.253 1.359-3.637.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.062-1.384-.354-2.632-1.359-3.637-1.005-1.005-2.253-1.297-3.637-1.359-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.758-6.162 6.162s2.758 6.162 6.162 6.162 6.162-2.758 6.162-6.162-2.758-6.162-6.162-6.162zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" /></svg>
            </div>
          </div>
          <p className="text-slate-500 text-lg mt-4 font-sans">© IY FOODS PVT. LTD.</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-x-4">
            <Link className="border-b border-b-gray-900 text-gray-800 font-sans" to="/term-of-services">Privacy Policy</Link>
            <Link className="border-b border-b-gray-900 text-gray-800 font-sans" to="/privacy-policy">Service Terms</Link>
            <Link className="border-b border-b-gray-900 text-gray-800 font-sans" to="/refund">Cancellation Policy</Link>
            <Link className="border-b border-b-gray-900 text-gray-800 font-sans" to="/accessibility">Refund Policy</Link>
          </div>
          <div className="flex flex-wrap gap-y-2 gap-x-3 mt-5">
            <div>
              <img src={amazonapy} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={american} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={googlepay} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={unionpay} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={mastercard} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={paypal} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={visa} alt="" className="w-[60px] h-[30px]" />
            </div>
            <div>
              <img src={applepay} alt="" className="w-[60px] h-[30px]" />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
