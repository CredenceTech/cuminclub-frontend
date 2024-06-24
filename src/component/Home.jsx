import React, { useEffect, useState } from "react";
import food from '../assets/food.png';
import { motion } from "framer-motion";
import { Link, unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { cartIsOpen, openCart } from "../state/cart";
import { useDispatch, useSelector } from "react-redux";
import { CartDrawer } from "./CartComponent";
import {
  cartData,
  clearCartData,
  clearCartResponse,
  selectCartResponse,
  setCartResponse,
} from "../state/cartData";
import { getCartQuery, graphQLClient } from "../api/graphql";
import { selectMealItems } from "../state/mealdata";
import { useLocation } from "react-router-dom";
import { totalQuantity } from "../utils";
import { addFilterData, addInnerFilterData } from "../state/selectedCountry";
import {
  clearCustomerAccessToken,
  customerAccessTokenData,
  registerUserId,
} from "../state/user";
const Home = () => {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const isCartOpen = useSelector(cartIsOpen);
  const cartDatas = useSelector(cartData);
  const selectedMealData = useSelector(selectMealItems);
  const userId = useSelector(registerUserId);
  const loginUserCustomerId = useSelector(customerAccessTokenData);
  const dispatch = useDispatch();
  const cartResponse = useSelector(selectCartResponse);
  const location = useLocation();
  const currentUrl = location.pathname;
  const [countryList, setCountryList] = useState(null);
  const navigate = useNavigate();
  const { pathname } = location;

  console.log(userId)

  useEffect(() => {
    if (cartData !== null) {
      getCartData();
    }
  }, [cartDatas]);

  useEffect(() => {
    if (countryList === null) fetchCountryFilters();
  });

  const getCartData = async () => {
    const params = {
      cartId: cartDatas?.cartCreate?.cart?.id,
    };
    const response = await graphQLClient.request(getCartQuery, params);
    setCartResponse(response);
  };

  const openCountryDrawer = () => {
    setIsCountryDrawerOpen(true);
  };

  const closeCountryDrawer = () => {
    setIsCountryDrawerOpen(false);
  };

  const onSelectCountry = (country) => {
    setSelectedCountry(country);
    dispatch(addFilterData(country));
    setFilterData(country);
    closeCountryDrawer();
  };

  useEffect(() => {
    const handlePopstate = () => {
      setIsMenuOpen(false);
      setIsCountryDrawerOpen(false);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const fetchCountryFilters = async () => {
    try {
      const url = `${import.meta.env.VITE_SHOPIFY_API_URL}`;
      const response = await fetch(url);
      const data = await response.json();
      setCountryList(data.data.countries);
      setSelectedCountry(data.data.countries[0]);
      dispatch(addFilterData(data.data.countries[0]));
      setFilterData(data.data.countries[0]);
    } catch (error) {
      console.error("Error fetching Get Store Detail:", error);
    }
  };

  function setFilterData(country) {
    const list = [];
    country.filters.map((data, index) => {
      const filterOption = {};
      filterOption.id = index + 1;
      filterOption.title = data.name;
      filterOption.options = [];
      data.values.map((dataValue) => {
        const option = {
          id: dataValue,
          label: dataValue,
        };
        filterOption.options.push(option);
      });
      list.push(filterOption);
    });
    dispatch(addInnerFilterData(list));
  }

  return (
    <div className={`z-[100] ${pathname === '/' ? 'relative z-[100] -top-28' : ' z-[100]'} `}>
      <div className={`w-full bannerback`}>
        <div
          className={`flex w-full justify-between items-center px-5 py-8`}
        >
          <div className="hidden lg:flex gap-3 text-lg font-bold flex-1 font-futura">
            <div>
              <Link className={`text-lg ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#000000]'}`} to="">
                OUR MENU
              </Link>
            </div>
            <div>
              <Link className={`text-lg ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#000000]'}`} to="">
                HOW IT WORKS
              </Link>
            </div>
            <div>
              <Link className={`text-lg ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#000000]'}`} to="">
                ABOUT US
              </Link>
            </div>
          </div>
          <div className="flex flex-1 justify-center gap-3 ">
            <Link to="/">
              <svg
                width="143"
                height="50"
                viewBox="0 0 143 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.57521 19.9025C1.96275 19.29 1.72742 19.0076 1.72742 18.6308C1.72742 17.8768 2.52814 17.4058 5.49571 16.1809C7.94525 15.0504 8.74627 14.8151 9.4058 14.8151C9.97089 14.8151 10.3477 15.239 10.3477 16.2754C10.3477 17.3588 10.1595 19.0076 10.1595 23.5769V27.1099C10.1595 28.7113 11.1017 29.3238 11.1017 30.266C11.1017 31.2553 9.59406 31.7263 7.14452 31.7263H6.67356C4.17665 31.7263 2.66934 31.2553 2.66934 30.266C2.66934 29.3238 3.65863 28.7113 3.65863 27.1099V24.8015C3.65863 21.1274 3.5645 20.9859 2.57521 19.9025Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M13.5036 20.2322C12.844 19.6671 12.5143 19.3844 12.5143 18.7719C12.5143 18.0653 13.0326 17.547 15.4348 16.2279C17.9317 14.8618 19.0151 14.4379 19.9103 14.4379C20.6639 14.4379 20.9937 14.8618 20.9937 15.7099C20.9937 16.0397 20.9466 16.4165 20.8993 16.9348C22.0771 15.6628 23.6315 14.815 25.4215 14.815C28.4835 14.815 29.0489 16.9816 29.4728 21.0799C29.7555 23.9066 30.0382 25.9793 30.2265 27.2984C30.4621 28.523 30.886 29.0884 31.7341 29.3237C32.2992 29.4652 32.3933 30.0774 31.9694 30.5016C31.3102 31.1137 29.7084 31.7262 27.824 31.7262C24.8564 31.7262 23.8671 30.5016 23.7259 28.052C23.5844 26.3091 23.4903 24.7544 23.3488 21.9751C23.2547 18.9605 23.0664 17.7826 22.2183 17.7826C21.229 17.7826 20.8051 19.9495 20.7581 22.7758V27.1098C20.7581 28.7113 21.7003 29.3237 21.7003 30.2659C21.7003 31.2552 20.24 31.7262 17.7431 31.7262H17.3192C14.8226 31.7262 13.315 31.2552 13.315 30.2659C13.315 29.3237 14.2572 28.7113 14.2572 27.1098V24.7544C14.2572 21.7868 14.2572 20.9387 13.5036 20.2322Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M43.275 21.504C47.8443 22.8231 49.3519 24.3774 49.3519 26.8273C49.3519 30.2658 45.6304 31.9617 40.8725 31.9617C37.0098 31.9617 34.1363 31.1139 33.147 28.7114C32.3934 26.8273 33.5709 24.9899 35.7848 24.9899C37.4337 24.9899 38.7527 25.8851 38.8468 27.6751C38.9413 29.371 39.5534 30.0776 40.5427 30.0776C41.7206 30.0776 42.3327 29.1824 42.3327 27.8633C42.3327 26.5917 41.1552 25.3197 38.9883 24.7546C36.0205 23.9536 33.5239 22.6348 33.5239 19.9496C33.5239 16.5579 37.4807 14.7679 42.0033 14.7679C45.3947 14.7679 47.7502 15.8513 48.5509 17.6884C49.3045 19.5728 48.174 21.2687 46.0072 21.2687C44.3584 21.2687 43.3694 20.515 42.9923 18.6776C42.7099 17.1703 42.6157 16.652 41.6262 16.652C40.6842 16.652 40.4957 17.453 40.4957 18.4891C40.4957 19.6199 41.2964 20.9389 43.275 21.504Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M59.9037 17.7826H58.0192V23.7651C58.0192 26.5915 58.2548 27.3455 59.2441 27.3455C59.9978 27.3455 60.1863 26.9213 60.4687 26.5915C60.9871 26.0261 61.5525 26.2617 61.3168 27.1569C60.7514 29.4179 59.4327 31.9619 56.1351 31.9619C53.1201 31.9619 51.5187 29.7476 51.5187 25.2254V17.7826H51.0948C50.4823 17.7826 49.964 17.2643 49.964 16.6522C49.964 15.9926 50.4349 15.5214 51.0474 15.4743H51.0948C53.6385 15.4743 54.7219 14.2967 55.4755 12.177C55.8524 11.0935 56.4648 10.5281 57.1714 10.5281C57.878 10.5281 58.2078 11.0935 58.2078 11.9413C58.2078 13.4957 58.0666 14.4379 58.0192 15.4743H59.9037C60.5161 15.4743 61.0812 15.9926 61.0812 16.6522C61.0812 17.2643 60.5161 17.7826 59.9037 17.7826Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M71.7746 22.3991L71.1151 22.6818C69.5604 23.5298 68.9953 25.1784 68.9953 26.4974C68.9953 27.9106 69.5133 28.6643 70.5026 28.6643C71.4448 28.6643 72.4812 27.5808 72.0099 24.142L71.7746 22.3991ZM76.6737 31.7263C74.0829 31.7263 73.1407 30.5958 72.8109 29.0411C71.7275 30.6428 69.9843 31.6792 67.6762 31.6792C64.5201 31.6792 62.4474 30.1719 62.4474 27.722C62.4474 25.414 64.2845 23.7652 67.535 22.5876C70.8794 21.3627 71.4448 20.8917 71.4448 20.0907C71.1621 17.7827 70.9268 16.7934 70.2673 16.7934C69.7019 16.7934 69.4662 17.5941 69.1365 18.9132C68.7597 20.4678 67.7233 21.5513 65.8392 21.4098C64.1433 21.3627 63.2481 20.0907 63.5779 18.5363C64.1433 16.1809 66.734 14.8148 70.5026 14.8148C75.3075 14.8148 77.6156 16.8875 78.181 20.9859C78.6052 23.9064 78.9817 27.1099 79.1232 27.722C79.3118 28.8528 79.5942 29.0882 80.4423 29.3708C81.0547 29.512 81.1488 30.1245 80.6776 30.5484C80.1125 31.0667 78.6052 31.7263 76.6737 31.7263Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M82.6559 20.2322C81.9964 19.6671 81.6666 19.3844 81.6666 18.7719C81.6666 18.0653 82.185 17.547 84.5871 16.2279C87.084 14.8618 88.1675 14.4379 89.0626 14.4379C89.8163 14.4379 90.146 14.8618 90.146 15.7099C90.146 16.0397 90.0987 16.4165 90.0516 16.9348C91.2292 15.6628 92.7838 14.815 94.5739 14.815C97.6359 14.815 98.2012 16.9816 98.6251 21.0799C98.9075 23.9066 99.1905 25.9793 99.3788 27.2984C99.6144 28.523 100.038 29.0884 100.886 29.3237C101.452 29.4652 101.546 30.0774 101.122 30.5016C100.462 31.1137 98.8608 31.7262 96.9763 31.7262C94.0088 31.7262 93.0195 30.5016 92.8783 28.052C92.7368 26.3091 92.6426 24.7544 92.5011 21.9751C92.407 18.9605 92.2187 17.7826 91.3707 17.7826C90.3814 17.7826 89.9575 19.9495 89.9104 22.7758V27.1098C89.9104 28.7113 90.8526 29.3237 90.8526 30.2659C90.8526 31.2552 89.3921 31.7262 86.8955 31.7262H86.4716C83.975 31.7262 82.4673 31.2552 82.4673 30.2659C82.4673 29.3237 83.4096 28.7113 83.4096 27.1098V24.7544C83.4096 21.7868 83.4096 20.9387 82.6559 20.2322Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M110.921 17.7826H109.036V23.7651C109.036 26.5915 109.272 27.3455 110.261 27.3455C111.015 27.3455 111.203 26.9213 111.486 26.5915C112.004 26.0261 112.57 26.2617 112.334 27.1569C111.769 29.4179 110.449 31.9619 107.152 31.9619C104.137 31.9619 102.536 29.7476 102.536 25.2254V17.7826H102.112C101.499 17.7826 100.981 17.2643 100.981 16.6522C100.981 15.9926 101.452 15.5214 102.065 15.4743H102.112C104.656 15.4743 105.739 14.2967 106.493 12.177C106.869 11.0935 107.482 10.5281 108.189 10.5281C108.895 10.5281 109.225 11.0935 109.225 11.9413C109.225 13.4957 109.084 14.4379 109.036 15.4743H110.921C111.533 15.4743 112.098 15.9926 112.098 16.6522C112.098 17.2643 111.533 17.7826 110.921 17.7826Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M113.936 12.0827C113.323 11.6117 112.946 11.329 112.946 10.7166C112.946 10.01 113.794 9.49165 116.244 8.1729C118.693 6.85385 119.777 6.47702 120.625 6.47702C121.426 6.47702 121.85 6.94798 121.85 7.70163C121.85 8.73799 121.473 10.01 121.473 15.5686V27.1097C121.473 28.7114 122.462 29.3239 122.462 30.2658C122.462 31.2551 121.002 31.7261 118.458 31.7261H118.034C115.49 31.7261 114.03 31.2551 114.03 30.2658C114.03 29.3239 115.019 28.7114 115.019 27.1097V16.6991C115.019 13.6374 114.878 12.8834 113.936 12.0827Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M125.947 21.0801C124.11 16.9817 122.885 17.2644 122.885 15.9928C122.885 15.0032 125.146 14.4851 127.737 14.4851H128.161C130.752 14.4851 132.495 14.9564 132.495 15.9454C132.495 16.8876 131.412 17.4056 131.977 18.8659C132.495 20.4206 133.767 24.095 134.662 26.1207C135.604 23.6711 136.169 21.6455 136.876 19.8084C137.677 17.8298 137.206 17.3586 136.358 16.9817C135.416 16.5578 135.133 16.181 135.133 15.8513C135.133 15.0032 136.075 14.5793 139.043 14.5793C142.152 14.5793 143 14.909 143 15.7098C143 16.3693 140.974 17.2644 140.268 18.9603C138.996 21.9753 138.525 24.0477 136.452 29.1353C134.097 34.9295 132.589 37.0023 128.915 37.0023C126.56 37.0023 124.44 36.1545 123.781 34.1288C123.262 32.5741 124.346 31.1139 126.042 31.1139C127.784 31.1139 128.632 32.1502 128.538 33.6576C128.397 34.8825 128.821 35.4005 129.574 35.4005C130.799 35.4005 131.6 33.8932 130.564 31.4437C129.433 28.8529 126.795 23.0587 125.947 21.0801Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M14.7431 45.534C15.2814 44.3488 15.9279 43.1103 16.4666 41.8173C17.4364 39.6089 17.8133 38.5853 16.9515 37.9388C16.2513 37.5079 16.0357 36.9155 16.0357 36.5921C16.0357 35.7304 17.1131 35.1917 20.5607 35.1917C23.9002 35.1917 24.6004 35.8382 24.6004 36.6462C24.6004 37.8851 21.7455 38.37 20.3988 41.1171C18.6753 44.6722 17.4364 47.2578 16.6281 49.0354V56.8458C16.6281 58.6774 17.9211 60.3472 17.9211 61.4246C17.9211 62.5557 16.0357 63.0943 13.1808 63.0943H12.6424C9.78752 63.0943 7.90216 62.5557 7.90216 61.4246C7.90216 60.3472 9.19479 58.6774 9.19479 56.8458V50.3817C8.11744 47.7424 6.9326 45.2109 6.28613 43.8642C4.34703 39.7164 1.59961 38.2084 1.59961 36.9155C1.59961 35.7844 3.70056 35.1917 6.50142 35.1917H7.36348C10.3262 35.1917 12.5346 35.5688 12.5346 36.6999C12.5346 37.562 11.8341 38.5853 12.2112 39.6089C12.5346 40.6322 13.5042 42.9484 14.7431 45.534Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M38.7666 48.2274C37.4739 41.6555 35.9116 37.5079 33.8647 37.8313C31.8178 38.1544 32.7337 47.15 33.2186 50.0049C34.2956 56.2534 36.3966 60.8318 38.3357 60.455C40.0054 60.1854 40.0054 54.3681 38.7666 48.2274ZM48.3008 49.1432C48.3008 58.1385 43.2375 63.4174 36.0194 63.4174C28.8014 63.4174 23.738 58.1385 23.738 49.1432C23.738 40.0935 28.8014 34.8686 36.0194 34.8686C43.2375 34.8686 48.3008 40.0935 48.3008 49.1432Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M61.1205 63.3636C55.0336 63.3636 50.563 60.7242 50.563 52.3751V41.3863C50.563 39.555 49.27 37.8849 49.27 36.8076C49.27 35.6765 51.2091 35.1378 54.0103 35.1378H54.549C57.4039 35.1378 59.2892 35.6765 59.2892 36.8076C59.2892 37.8849 57.9963 39.555 57.9963 41.3863V52.3751C57.9963 57.8156 59.1814 59.97 62.0901 59.97C65.2143 59.97 66.1839 57.0613 66.1839 52.3751V41.3863C66.1839 39.555 64.4604 37.8849 64.4604 36.8076C64.4604 35.6765 65.9683 35.1378 68.2849 35.1378H68.6617C70.9779 35.1378 72.5402 35.6765 72.5402 36.8076C72.5402 37.8849 70.8164 39.555 70.8164 41.3863V52.3751C70.8164 58.5158 68.2311 63.3636 61.1205 63.3636Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF]' : 'text-[#231F20]'}`}
                />
                <path
                  d="M89.0219 44.1874C89.0219 41.4403 88.591 38.4238 84.282 38.4238C82.6656 38.4238 82.6656 38.9622 82.6656 41.3862V47.4732C82.6656 49.1429 82.9353 49.5738 84.4435 49.5738C87.9986 49.5738 89.0219 46.8808 89.0219 44.1874ZM96.6171 43.9718C96.6171 47.096 95.1626 49.5201 92.3618 51.0283C93.3851 53.183 94.0853 54.9606 95.8628 57.0612C97.4789 59.0003 98.664 59.2697 99.6336 59.6468C100.495 59.9702 101.088 60.4548 100.98 61.1013C100.872 62.1786 99.2027 63.0944 96.0247 63.0944C92.3077 63.0944 89.7221 61.8015 88.2139 59.2159C85.6283 54.9606 86.2748 52.6981 84.1742 52.6981C83.0968 52.7521 82.6656 53.2367 82.6656 55.1759V56.8459C82.6656 58.6772 83.9586 60.347 83.9586 61.4243C83.9586 62.5557 82.0732 63.0944 79.2183 63.0944H78.6796C75.8788 63.0944 73.9934 62.5557 73.9934 61.4243C73.9934 60.347 75.2323 58.6772 75.2323 56.8459V41.3862C75.2323 39.5549 73.9934 37.8851 73.9934 36.8078C73.9934 35.6767 75.8788 35.138 78.6796 35.138H83.9048C92.5233 35.138 96.6171 38.6391 96.6171 43.9718Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M115.308 46.3958C122.203 48.2274 124.573 51.7285 124.573 55.1221C124.573 60.4011 119.294 63.4175 112.345 63.4175C106.151 63.4175 102.65 60.9394 101.303 57.8155C100.064 54.6375 101.303 52.0516 104.158 51.8363C106.582 51.6748 108.144 52.7521 108.521 55.6067C108.898 58.3001 110.514 60.078 113.153 60.078C115.362 60.078 117.247 58.5694 117.247 56.3073C117.247 54.5834 115.577 52.8599 109.76 51.2436C104.966 49.7894 102.488 47.3654 102.488 43.2716C102.488 38.0467 106.743 34.9224 113.261 34.9224C118.217 34.9224 121.233 37.1849 122.526 40.2014C123.765 43.3256 122.095 45.48 119.186 45.48C117.355 45.48 115.739 44.1333 115.092 41.494C114.608 39.2856 113.584 37.7774 112.238 37.7774C110.298 37.7774 109.49 39.3934 109.49 41.1709C109.49 43.0022 110.514 45.1569 115.308 46.3958Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
                <path
                  d="M6.5556 2.48215L8.84937 0.0611534C8.97204 -0.0682011 9.18976 0.0216789 9.1849 0.199922L9.09532 3.53399C9.09229 3.64543 9.18338 3.73653 9.29482 3.73379L12.6286 3.64391C12.8071 3.63905 12.8973 3.85677 12.7677 3.97945L10.3467 6.27321C10.2659 6.35004 10.2659 6.47878 10.3467 6.55561L12.7677 8.84968C12.8973 8.97235 12.8071 9.18977 12.6286 9.18521L9.29482 9.09533C9.18338 9.09229 9.09229 9.18339 9.09532 9.29483L9.1849 12.6289C9.18976 12.8071 8.97204 12.8973 8.84937 12.768L6.5556 10.3467C6.47878 10.2659 6.35003 10.2659 6.27321 10.3467L3.97944 12.768C3.85676 12.8973 3.63905 12.8071 3.64391 12.6289L3.73379 9.29483C3.73652 9.18339 3.64542 9.09229 3.53398 9.09533L0.199913 9.18521C0.021671 9.18977 -0.0682094 8.97235 0.0611452 8.84968L2.48184 6.55561C2.56291 6.47878 2.56291 6.35004 2.48184 6.27321L0.0611452 3.97945C-0.0682094 3.85677 0.021671 3.63905 0.199913 3.64391L3.53398 3.73379C3.64542 3.73653 3.73652 3.64543 3.73379 3.53399L3.64391 0.199922C3.63905 0.0216789 3.85676 -0.0682011 3.97944 0.0611534L6.27321 2.48215C6.35003 2.56292 6.47878 2.56292 6.5556 2.48215Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF]' : 'text-[#231F20]'}`}
                />
              </svg>
            </Link>
            {/* <button onClick={openCountryDrawer}>
            <img
              alt={selectedCountry?.name}
              className="h-8 w-8"
              src={selectedCountry?.country_flag}
            />
          </button>
          {isCountryDrawerOpen && (
            <CountryDrawer
              onClose={closeCountryDrawer}
              onSelectCountry={onSelectCountry}
              allCountryList={countryList}
            />
          )} */}
          </div>
          <div className="flex gap-x-8 flex-1 justify-end">
            <button
              onClick={
                cartDatas !== null ? () => dispatch(openCart()) : undefined
              }
              className="flex relative items-center gap-2 py-2  text-white px-3 rounded-xl"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.8576 1.51447L8.76626 9.99997H21.2339L16.1426 1.51447L17.8576 0.485474L23.5663 9.99997H28.5936C29.3703 9.99997 30 10.6296 30 11.4064V12.2839C30 18.1711 28.6293 23.9774 25.9965 29.2431C25.7645 29.707 25.2904 30 24.7718 30H5.22819C4.70957 30 4.23546 29.707 4.00352 29.2431C1.37069 23.9774 0 18.1711 0 12.2839V11.4064C0 10.6296 0.629662 9.99997 1.40639 9.99997H6.43388L12.1426 0.485474L13.8576 1.51447Z"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
                />
              </svg>

              <div className="rounded-full absolute left-10 bottom-6 h-7 w-7 flex items-center justify-center bg-[#279C66]">
                <span style={{ fontSize: 10 }}>
                  {cartDatas !== null ? totalQuantity(cartResponse) : 0}/
                  {selectedMealData.no}
                </span>
              </div>
            </button>
            <button className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
              <svg
                width="37"
                height="31"
                viewBox="0 0 37 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.800781 2.58333C0.800781 1.89819 1.0717 1.24111 1.55394 0.756641C2.03617 0.272172 2.69022 0 3.37221 0H34.2294C34.9113 0 35.5654 0.272172 36.0476 0.756641C36.5299 1.24111 36.8008 1.89819 36.8008 2.58333C36.8008 3.26848 36.5299 3.92556 36.0476 4.41003C35.5654 4.89449 34.9113 5.16667 34.2294 5.16667H3.37221C2.69022 5.16667 2.03617 4.89449 1.55394 4.41003C1.0717 3.92556 0.800781 3.26848 0.800781 2.58333ZM0.800781 15.5C0.800781 14.8149 1.0717 14.1578 1.55394 13.6733C2.03617 13.1888 2.69022 12.9167 3.37221 12.9167H34.2294C34.9113 12.9167 35.5654 13.1888 36.0476 13.6733C36.5299 14.1578 36.8008 14.8149 36.8008 15.5C36.8008 16.1851 36.5299 16.8422 36.0476 17.3267C35.5654 17.8112 34.9113 18.0833 34.2294 18.0833H3.37221C2.69022 18.0833 2.03617 17.8112 1.55394 17.3267C1.0717 16.8422 0.800781 16.1851 0.800781 15.5ZM0.800781 28.4167C0.800781 27.7315 1.0717 27.0744 1.55394 26.59C2.03617 26.1055 2.69022 25.8333 3.37221 25.8333H34.2294C34.9113 25.8333 35.5654 26.1055 36.0476 26.59C36.5299 27.0744 36.8008 27.7315 36.8008 28.4167C36.8008 29.1018 36.5299 29.7589 36.0476 30.2434C35.5654 30.7278 34.9113 31 34.2294 31H3.37221C2.69022 31 2.03617 30.7278 1.55394 30.2434C1.0717 29.7589 0.800781 29.1018 0.800781 28.4167Z"
                  fill="#E91D24"
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#E91D24]'}`}
                />
              </svg>
            </button>
            {userId === null &&
              <button className="bg-[#FBAE36] hidden lg:block px-7 rounded-full ">
                <Link className="text-lg" to="/login">
                  Login
                </Link>
              </button>}
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#610B15] z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="h-screen"
            >
              <div className="flex w-full to-gray-300 justify-between items-center px-8 pt-3 h-24 font-custom-font">
                <div>
                  <svg
                    width="130"
                    height="50"
                    viewBox="0 0 130 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xlinkHref="http://www.w3.org/1999/xlink"
                  >
                    <rect width="130" height="50" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlinkHref="#image0_1_1467"
                          transform="scale(0.00598802 0.0147059)"
                        />
                      </pattern>
                      <image
                        id="image0_1_1467"
                        width="167"
                        height="68"
                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABECAYAAADkxiXAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkE1QjZGNjZEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkE1QjZGNjVEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjYyMEYwNDA3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjYyMEYwNDE3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5J8dbAAAART0lEQVR42uxdCZgUxRWuRQKYBRHFZQnEAIKiiIKiYszH5QY1iCIeRFCColHBAyFCCIp4EJcYJRjvG4+gxAvFRWRdFUQBMYhIgKBIFjXoKgEMqKhs/t95LU3t657q2Vl2Zrff971vZrqrquv4u+pdVZNTXl5uXCgnJ+eH7xOKe/0MH8PAvcHtwQ3A34A3gJeDx08oKJlvYoopgFxwVzdqoQDmxfi4CVzPuvUjcDPh38bdH1NlqW5EYF6Ej78mSTYds+b7cdfGVFmqEwGY+fj4U5Jk8+NZM6ZdDk7QYHDDgHvLRQbtjllzU9ytMe3qZf0E+dwCngleDF4FXgJAfhh3ZUzVCc6DwXPBZwCMn8RdF1MmgXMjuA+A+b+422LKNHCOJDA/+WlbmpDOA+8HntVs3XvF2dp4tOUYfAwBbwb/BW1ZV9MGWMaL5r9O4NfA96Cd5QFpG0l/NAE/iXTLswWcM+VzGri/B1g06Gw04pEsHLQj8PGKrw9Ow7WD0JYtNQyft4LPl+9ng1uAr1b6g/1QAu4il8bh2s/RH29lvLaOWbMclW3iA6ZH52XpoJ1mvZz7go+pgavjIOv3mQHpDvcBk1Svuse2TsT0jZVre2bpoNVXrv24BoLTblO9gHS7O17LWHDGFFNGypxRZbp98EFeBbnlu7iro9OE4l574GMvcBnEqi0xONMDTArgt5lEMMgK/O4lS8S5ZkckEzue5ql3Rdm6DyD+LMIz2uDj1+Cu4JYmERVVBl4CfgJlLVXyXIiPU6VebZVir0eaEfh8h0oDyvhvwLNbiuzWDdxORAQ+ewV4NnhGqooVAMn2sJ7Hm0QQjXedloQi8J0A6tsh/UI387Xg/QOS5CMNFcGvwQ+intMiji21+d+BaVIcjfxzHfJw7O8CnwheDR4q4x5KOVFC5vCQVvj6gXVrKSrYyVeRhjJQDXxp6ElqI6AIIg7mePDkIFOHr6E3m4QPP0wseZYCPcoqk3zn4OP+CONQhLx9rGc3xUehmFt2C8m7UQByi+uqAfDtjY+7FYVTo/vAIzSbM+r4pqXYJKM+qGMR8vXA95ete1Nxb4hl4Vjku08T3L5IsykJONkXV/kuLcsrXX1IdcicTS1gkg5IAkxSrkmE4j0utjmtkSzjBZlZktX9JPBryOPVpU/EdpxgPftwmVGHJgGmpyTyBXoB+Ro7AJOz+GJHYBqpw3zk28eqY15EYBqZzVzJtmZw9TvEIZ+dpmO2KkSng+8IuDdKllJX4tJ2lHxfGbEeq32D3tkkbIDNI5ZRAH4e+euHAJNAngVuFbFsDvhM5PeXzWDvzyKWs6qS47VbVQGhusD5Bfg98JcB98/FgPa3ZgWG4l+ewrM2yOckAsUxD0WXwfJczuhPyiyh0XoB8rchs01hyLOmBMi/pLUmEYYYFMtwpH+5xPLKOgwEf+zQxu3gx0ImgmqnXQ1Oyn8DwE3QkVQkKGcNCwDpJADDXz/KrHlWms2iODQUhYvKlt+jcTues0wG7gvwiSI+0Jlwp/LMs7gkI10b8EK5dgW4tZL2YSpDSNccvL+IMyPBW5W0l6ItHZVZ82DvJbCI4kNXyJStwb8wCa8OQacpaKNQTjMfQOeAW0gbmyjp18n1XKQ7E7yt1pmSAhSenn5/Lb4TlHdg4JaJMO6vD2eTY8Fz5HcjpczXUcZs3+85KIu+/gMJEtxba2fANYJnK9J9rdXRL9zLcnyJkm4s0hVa5TLfZOSZh89Xzc7G7zoCchuIFyhlU+Pv5o+LxXcqVdMAwuUyk/rjailT/8ZYgeCoz0ZpQ4UZ07uX6bQrZ87CoEACXGdAwu3KrV/5vmuyVG90PsE9FszZib5jKi4rNWCmQN3EzuineTYwrbYsFqtDBVka9bO9Nccr6YYHBWzj+vcmrmTKW02hXQVOmobuSZJmapiWh0FnQPNSpf7U3P8osttDYJpS1gAIg9NQ707KtTsd8tFkZZuQOMP18C3puYqsuR4AfNnBjPSdQz1jcDrSewBXsgDlfyrX9rZ+j3N8HrcuTwVAb61kvfNS0W7FeL9eudXV930fxz6wZ89NoijZpqvqohyHNPUyGZwfOwzoVw5pqG1fGeG5w8X4nippcmluskxiWWgYYNpKZsVwoeoK+P5GuZbvkO8n2WRKSpkA0In46Gcc3F9C1wEsqdri1qQo39HEoxnfW2T5Sqv1R+8kLyqB2bFWgFMASt81G8xo/L4mEbNIv/3NyttNQByW4qPmBczGrUIGgy/CpIDbjbIcnDSvbbeuDUKb24dJIqnirG429Ywsl31keXxVorTXWGlo/hmuAPTNFF6C1eKrPsICGE1W/Wzrg2xzuBfcPYO7MacSk8IGtHG2tXrQpTwT109gf/n6goAcY3ZE4ddscJqE793zEm1HBzDy6TZ0yirpECpCvZR8Wxzlpy4oowTlbbbefNuzRC17KdI+YxJbPSibdpAZvGmG9Rnr5ndxNke96QApRTv9MrUm8zNtHaTzz5aFimjDFWwZ0tLj9A9R0OjhOzQbtPV0zJp8kS626k4D+UrcWw9eJ7PogVZWekAWKUVqR+bQGrAJZS2SsDjOFgxTe1BJy+Wb4Xc8nofRRJdlIDA16wJnun+BN0u0kEdrA+RJOiwe9Wy0EiL3kJKWLwCdATTpXVNZYGajzPl10IpjEjGdWnseDgjpejqkPC7jf/b9pidnTpbKiU+EmHeuAui6Ceho+loaALqBlpXkIpE/q5SignObA2C+iwAqm+zgiXKfvMN74yPW932RezT5iXbXG0PytvOlZbvpl5/sr1MS4mz7WhWZgKLsLJgSMCv6RRSP/hCSrqOvP7bKrDojY8CJStFeucy6PNv6TU+O7aYscnzELOt3sfV8goNxmiscyloA7oE8n4ekGS8A1QBXZD17G3ikaP6MHv8y4OVifzCG4By7/srvVMnuz/khY0b5uUAZN0/OfMWXtkgUGE3+nGuXC6ZJjyGOSwIeT1n/gVRn2VQUopNlQNsImK63Ks0txNSoaY+kgsKI9Fscyx4CvkHe0rnaTInyn0P5M+XN5XO8bRqUiTgbviXgmRkWUe/VFR+jUR5nubMEeJTJSkxAmBvycIvEQAmIpnt1X+nHjwgAS5m6Qep1uIBgUprAOUEUOo5FKXhEkna+j/qybaeYRLwCo6zoxboJ99ZYae9FWrpQGS3GiCjaa58SM51WNsWGJ5BnP2lnvoCSq9YizrIyXtHNCqmcbBxTGtBV3KuVqbjlZcaEgpJ+Na2tAOdiAe4PlFe6Oimg4q3BMVU1MBubih4ip2N/6sbdF1NEsO0mcikjoRg++GiSLCNMxcCPBVkJTjFtUFZ90SGSyctTR+QpLpXPI99Kx3wtRQvnpjAvAonR+otFZnV6w7FE07baX7TxqViaN6axPxhAcrnItoxyny7XuSx2kOUyT5Qx9tdCypghwOog/UR5jsriiqAt0AHEeFJva8gFKJMgHa3J97jX1+y869Kjv2edzInGFPpMPxxgHiS1wiEfYywv8Jm7qKW/EZK+nSg8BHRQw8pFmRsbVgcAk67KF32zA4F9JM+WSofMSY8VtX/fJc9DNtwE7z2i02GUBHGzDG7MGydKX2Olna9TyWXMgkNfsy9sXzoVKMbUzpP+P8gk4myHKaIjX5z2kDm/zRqZU2aIUb5LdIFd6pCP6fzn0HtH/gWlHypmlf4m3M+cI9rw28hzUUi6y61li7Nw8zT1Sb4FTNJk4bYhWbvITMoyeoppb7jRI6XYTm7Ce4ZWC4cIrg3KNT5jjpigCM53ZQw0fF0iNmuTNeA0CdefLWa4DPKeCshyAwabJ1UwMKN+hHoReLcj77iQ59uU51Dup6aiz9+eSRuk2JfTAIAFcioKZ8MmjvnofhyUJM3vje6McREVr0W9Zrk2otZo62J7vbESRfComlPTZkoqKNkqoojnNeKSODFNxXv7sSi6RA3T6xB2E+BiPekIifrHFNcg79VRMtStJcCkIfyugNvs5L+ZRDQNo28Ok9lDmxG5me6ldO1eBEAfhexJ5aARvn+eQhE0xNPA/baMJZVJHgCxQE46OVnJ87G8CFskbWfrftKzj7jjFeUzsINBL32TJF8hS/lLURtXW0xJlDO1KHS6Gs+yDhC7Hx3PIIeHTcWjWrjvh/LnDWmcQbeJ1hyVqHgNsD08qHt3hrjhs7ViwvkPlRHu4fel5yw4UkSI+2UrjHEA6L85g/I0aJM4UO1osSjUk+csEZGi2Aq5i8GpyFI2cabsp+1d4swoSzj3n3dVykoLODFrNhJlrqVo6q84ZuVpKcdarlKv7q/KV02x2W6Lckj/rFglUiLk56a88VUxaDVe5gTI9jD6No0xYZvqJBLpCuXWASizRRqAyb7nUsfQPBqqS3DtOMfsYzRgWrRGUVxY71LUn4HSCxnVDqay19c6XSUjqDYoRG0VbZ4DW+KQl9E+2mEO7dNQLwaNHGGZdM52yPel2fHnEWEzGhWup5Rb3slw3ITXW8QUzpxLtSNzYnDuWHJSETuSHa2oHcD1qYscJF6Pj5Rb6diopilcDR3ylUY432i0STgzXIjnNvHIyINjcFYkbYZq5ZCvdZL72vLXzGW7sLgItSXcb5/UAqkbpwhOl2Dkr1w7VNyvPPKmzDELX+RHMmWJzxhwyjJkz1IdRBsMo9MdlIdyZebr6VAtek60fUH+fTlrlfu/dChbO2d0bRX0KwN9abukjfcDhyyHmiR70WurzKnJgVOC3mRc7xKgifsHZ7PRI7Un+U491squZ3beR/SDooEyS32/tc1zw6DcNA1Rhng42BDl1qIqevHLwAzOoMcoV6wDXHEKxGphU/cYnBVJ29XHDuRR3HtZ4OHbPctB5gwqlxr8DPnXDxuYTUSZOErJ96D1m8qEvc34+7/nAwgbK8CkQ2CaqehSpO0xrZvo6HwAXwOeDr6MogxXKPBHPIVPDONTlKz5mQCGjIuERwcyQuboADmPg7dJtM3OIcXMkP0tXpkNZSnWzuzZJGBZIkoZyx0UIDfSWN7W9hABcPTXDw0w51wrJiN2YA/wWFNx+zKpcEJByVirL1qZJH8QkaQvp1tiDw33t0k/fiLWgjtMxW28E/GMK6tynF1wl4lG+POkE+1/D+NylNIWBnQ0/1CWfuznApSXCx2LujjAdcmYxf7KbNjG6HvebaKsXZjml5wiy2nWZYpBD6QoXtX6Zd3zOAww+okclSmXtsExlSjiOpTxmCpDFpTQXTfY6OawZERtf0DQgbGVaC+1+vUpZOXE8HIMzuCO5Qx3XIqdG1Yuj6Y+37jvozfykjBwIdRFB3AR/AOjmHrEzHUi8gZt7f3W8VoQ8USUbRHrMzjZrtVaDU4BEt9eemKuCwApO5ARNJdGLJfyIT0hT5vwAxJ4j4ELnZDH6RBagOxxk/C8vOGQnNHzhyFPcUhdeQbAO9bloghtfVLq4xJDyecc7bLzoNYqRAHyk7dfhjIcZakyUQw2BCgNOylEIeXSwN5XNPc8UVq8PURFlskoEkFJovJzhkkEjuTLkv+hAHcaQLnIse2sIwNN2gnIJqbyX6Io50BpazdRDGn9oOODUes8kOzZVKOHqkohyvp968pf3pGeQkefamLKWHLBXU0I/OihXCuNhz/7KRO3BnMZ5DlD3nEpZSFpc43+P0FvxEOb/ZRpW4MZEUN3muf14TbSntr+cXEv0rRzinWLPvpmtG3Gwxsv6+mkk83O7kgeDrUEQLzEc1/yn4PBPIxqoQJM0t0xMOOZsypmTi7RYSfS0f9M33RQuBuN4R0inmARUzxzOhE3la0Oud8oBJg0Ng+IgVlzKKPAKX5r/uHA8ohZuYyfJHuqY4rBWWUApaGaGjv3RLsYmxnx09n69+CYYpmzymVQBsQOMYm/FqEmv7sAltHt3/+rg3dYVUw1T+b8vwADAEEM+e5euq/8AAAAAElFTkSuQmCC"
                      />
                    </defs>
                  </svg>
                </div>
                <button onClick={() => setIsMenuOpen(false)}>
                  <svg
                    width="36"
                    height="36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m2 2 32 32M34 2 2 34"
                      stroke="yellow"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="grid grid-rows-6 justify-items-center place-items-center lg:grid-cols-2 text-2xl lg:text-3xl font-bold text-[#F7C144] gap-5 lg:gap-20 h-screen w-full ">
                {loginUserCustomerId === null ? (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                ) : null}
                {loginUserCustomerId === null ? (
                  <Link to="/registration" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                ) : null}
                {loginUserCustomerId !== null ? (
                  <Link to="/Invoices" onClick={() => setIsMenuOpen(false)}>
                    Invoices
                  </Link>
                ) : null}
                {loginUserCustomerId !== null ? (
                  <Link to="/subscription" onClick={() => setIsMenuOpen(false)}>
                    Subscription
                  </Link>
                ) : null}
                {loginUserCustomerId !== null ? (
                  <button
                    onClick={() => {
                      dispatch(clearCustomerAccessToken());
                      dispatch(clearCartData());
                      dispatch(clearCartResponse());
                    }}
                  >
                    Logout
                  </button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}

        {isCartOpen && <CartDrawer />}
        <div className="w-full " >
          <div className="flex flex-col md:flex-row justify-between items-center pt-[100px] pb-[40px] px-8">
            <h1 className="text-white black-text-shadow font-skillet text-lg lg:text-4xl font-bold mb-4">READY TO EAT MEALS <br /> RIGHT AT YOUR DOORSTEP</h1>
            <Link to='/meal-package' className='flex flex-row py-2 px-4 rounded-full items-center gap-x-5 bg-[#EFE9DA]'>
              <button className=" text-black">Subscribe at ₹80/meal </button>
              <svg width="21" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.0693 0.624305L23.6407 9.08584C23.8 9.24287 23.9264 9.42937 24.0127 9.63467C24.0989 9.83997 24.1433 10.06 24.1433 10.2823C24.1433 10.5046 24.0989 10.7246 24.0127 10.9299C23.9264 11.1352 23.8 11.3217 23.6407 11.4788L15.0693 19.9403C14.9101 20.0974 14.7211 20.2221 14.5132 20.3071C14.3052 20.3921 14.0823 20.4359 13.8573 20.4359C13.6322 20.4359 13.4093 20.3921 13.2013 20.3071C12.9934 20.2221 12.8044 20.0974 12.6453 19.9403C12.4861 19.7832 12.3598 19.5967 12.2737 19.3914C12.1876 19.1861 12.1432 18.966 12.1432 18.7438C12.1432 18.5216 12.1876 18.3016 12.2737 18.0963C12.3598 17.891 12.4861 17.7045 12.6453 17.5474L18.2904 11.9746L1.85725 11.9746C1.40259 11.9746 0.966559 11.7963 0.64507 11.4789C0.323579 11.1616 0.142966 10.7311 0.142966 10.2823C0.142966 9.83348 0.323579 9.40303 0.64507 9.08566C0.966559 8.76829 1.40259 8.59 1.85725 8.59L18.2904 8.59L12.6453 3.01723C12.4855 2.86043 12.3587 2.674 12.2722 2.46867C12.1857 2.26334 12.1412 2.04315 12.1412 1.82077C12.1412 1.59838 12.1857 1.37819 12.2722 1.17286C12.3587 0.967528 12.4855 0.781102 12.6453 0.624305C12.8043 0.467011 12.9932 0.342225 13.2012 0.257083C13.4092 0.171943 13.6321 0.128118 13.8573 0.128118C14.0824 0.128118 14.3053 0.171943 14.5133 0.257083C14.7213 0.342225 14.9102 0.467012 15.0693 0.624305Z"
                  fill="#000000" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className='bg-[#EFE9DA]'>
        <div className='container mx-auto py-14'>
          <div className='flex flex-row justify-start items-center whitespace-nowrap  flex-wrap gap-x-8 gap-y-4'>
            <div className=' flex flex-row  items-center relative '>
              <img src={food} alt="" className='h-[100px] w-[100px]  relative left-[17px]' />
              <p className='text-[#231F20] bg-[#EADEC1] text-xl lg:text-2xl font-skillet rounded-tr-lg rounded-br-lg px-8 py-1'>North <br /> Indian</p>
            </div>
            <div className=' flex flex-row items-center relative '>
              <img src={food} alt="" className='h-[100px] w-[100px]  relative left-[17px]' />
              <p className='text-[#231F20] bg-[#EADEC1] text-xl lg:text-2xl font-skillet rounded-tr-lg rounded-br-lg px-8 py-1'>South <br /> Indian</p>
            </div>
            <div className=' flex flex-row items-center relative '>
              <img src={food} alt="" className='h-[100px] w-[100px]  relative left-[17px]' />
              <p className='text-[#231F20] bg-[#EADEC1] text-xl lg:text-2xl font-skillet rounded-tr-lg rounded-br-lg px-8 py-1'>Popular <br /> Combos</p>
            </div>
            <div className=' flex flex-row items-center relative '>
              <img src={food} alt="" className='h-[100px] w-[100px]  relative left-[17px]' />
              <p className='text-[#231F20] bg-[#EADEC1] text-xl lg:text-2xl font-skillet rounded-tr-lg rounded-br-lg px-8 py-1'>North <br /> Indian</p>
            </div>
            <div className=' flex flex-row items-center relative '>
              <img src={food} alt="" className='h-[100px] w-[100px]  relative left-[17px]' />
              <p className='text-[#231F20] bg-[#EADEC1] text-xl lg:text-2xl font-skillet rounded-tr-lg rounded-br-lg px-8 py-1 '>North <br /> Indian</p>
            </div>
          </div>
        </div>
        <div className='flex flex-row px-8 md:px-14 lg:px-3 items-center'>
          <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.1258 38.223C63.4723 53.1821 50.8158 64.7793 35.8568 64.1258C20.8977 63.4723 9.3007 50.8162 9.95398 35.8568C10.6075 20.8977 23.2636 9.30074 38.2227 9.95421C53.182 10.6075 64.7792 23.2639 64.1258 38.223Z" fill="#F15E2A" />
            <path d="M32.8251 41.104C32.2105 40.433 31.9758 40.1254 31.9933 39.7298C32.0276 38.9389 32.8899 38.4813 36.0615 37.3315C38.6842 36.257 39.536 36.0466 40.2282 36.077C40.8215 36.1026 41.1977 36.5651 41.1498 37.6528C41.1005 38.7901 40.8271 40.5125 40.6174 45.3082L40.4554 49.0167C40.3821 50.6981 41.3431 51.3841 41.2995 52.3729C41.2543 53.4117 39.6503 53.8367 37.0793 53.7243L36.5844 53.7028C33.964 53.5885 32.4033 53.0249 32.4486 51.9864C32.4919 50.9978 33.5587 50.4001 33.6321 48.7191L33.7378 46.2962C33.9059 42.4394 33.8138 42.2865 32.8251 41.104Z" fill="#FBAE36" />
            <path d="M37.8018 23.0008L40.3205 20.5648C40.4552 20.4345 40.6794 20.5391 40.6661 20.7258L40.4193 24.2213C40.4111 24.3382 40.5026 24.4381 40.6193 24.4402L44.1232 24.4985C44.3106 24.502 44.3953 24.7345 44.2536 24.857L41.6073 27.1542C41.519 27.2306 41.5127 27.3663 41.5945 27.4502L44.0304 29.9694C44.1607 30.1041 44.0561 30.3283 43.8691 30.3152L40.374 30.0677C40.2568 30.0597 40.1572 30.151 40.155 30.2682L40.0965 33.7718C40.0935 33.9593 39.8608 34.0438 39.7377 33.9024L37.4413 31.256C37.3641 31.1677 37.2289 31.1616 37.1448 31.2431L34.6259 33.6788C34.4912 33.8091 34.2669 33.705 34.28 33.518L34.5273 30.0226C34.5354 29.9054 34.444 29.8058 34.3268 29.8036L30.8232 29.7451C30.6357 29.7421 30.5509 29.5096 30.6925 29.3868L33.339 27.0899C33.4274 27.013 33.4334 26.8775 33.3524 26.7935L30.9158 24.2747C30.7856 24.14 30.8903 23.9153 31.0772 23.9289L34.5727 24.1757C34.6895 24.1844 34.7897 24.0927 34.7914 23.9754L34.8499 20.4718C34.8531 20.2846 35.0856 20.1998 35.2084 20.3414L37.5051 22.9876C37.5822 23.0764 37.7172 23.0822 37.8018 23.0008Z" fill="#FBAE36" />
          </svg>

          <p className='text-[#231F20] font-skillet px-6 py-4 text-3xl lg:text-4xl'>Our Bestsellers</p>
        </div>
        <div className='container mx-auto py-14'>
          <div className='flex flex-row  justify-start whitespace-nowrap mx-5 lg:mx-10 flex-wrap gap-x-16 gap-y-4'>
            <div className=' flex flex-col justify-start  items-center'>
              <div className='bg-[#EADEC1] flex justify-center items-center rounded-2xl relative'>
                <img src={food} alt="" className='h-[150px] w-[120px]  relative inset-0' />
              </div>
              <p className='text-[#231F20] font-futuraBold text-lg pt-2'>Pav Bhaji</p>
              <p className='text-gray-500 text-lg'>₹ 199.00</p>
            </div>
            <div className=' flex flex-col justify-between'>
              <div className='bg-[#EADEC1] flex justify-center items-center rounded-2xl relative'>
                <img src={food} alt="" className='h-[150px] w-[120px]  relative inset-0' />
              </div>
              <p className='text-[#231F20] font-futuraBold text-lg pt-2'>Paneer Butter <br /> Masala</p>
              <p className='text-gray-500 text-lg'>₹ 199.00</p>
            </div>
            <div className=' flex flex-col justify-start '>
              <div className='bg-[#EADEC1] flex justify-center items-center rounded-2xl relative'>
                <img src={food} alt="" className='h-[150px] w-[120px]  relative inset-0' />
              </div>
              <p className='text-[#231F20] font-futuraBold text-lg pt-2'>Dal Makhani</p>
              <p className='text-gray-500 text-lg'>₹ 199.00</p>
            </div>
            <div className=' flex flex-col justify-start '>
              <div className='bg-[#EADEC1] flex justify-center items-center rounded-2xl relative'>
                <img src={food} alt="" className='h-[150px] w-[120px]  relative inset-0' />
              </div>
              <p className='text-[#231F20] font-futuraBold text-lg pt-2'>Pav Bhaji</p>
              <p className='text-gray-500 text-lg'>₹ 199.00</p>
            </div>
            <div className=' flex flex-col justify-start '>
              <div className='bg-[#EADEC1] flex justify-center items-center rounded-2xl relative'>
                <img src={food} alt="" className='h-[150px] w-[120px]  relative inset-0' />
              </div>
              <p className='text-[#231F20] font-futuraBold text-lg pt-2'>Pav Bhaji</p>
              <p className='text-gray-500 text-lg'>₹ 199.00</p>
            </div>
            <div className=' flex flex-col justify-start '>
              <div className='bg-[#EADEC1] flex justify-center items-center rounded-2xl relative'>
                <img src={food} alt="" className='h-[150px] w-[120px]  relative inset-0' />
              </div>
              <p className='text-[#231F20] font-futuraBold text-lg pt-2'>Pav Bhaji</p>
              <p className='text-gray-500 text-lg'>₹ 199.00</p>
            </div>

          </div>
        </div>
      </div>

      <div className='w-full bannerbottom h-[500px]'>
        <div className='mx-auto container'>
          <div className='flex justify-between '>
            <div className='px-10'>
              <p className='text-white text-lg font-skillet lg:text-5xl pt-6'>Confused?</p>
              <p className='text-[#FBAE36] text-lg lg:text-3xl font-futuraBold'>Spin it </p>
            </div>
            <div className='flex h-[500px] relative z-10 justify-end items-center'>
              <div className='relative right-[-24px] top-[60px] z-[-1]'>
                <Link to='' className='flex flex-row py-2 pl-2 pr-10  rounded-full items-center gap-x-5 bg-[#EFE9DA]'>
                  <div className='h-10 w-10 rounded-full bg-[#FBAE36]'></div>
                  <button className=" text-[#B25220] font-xl">{`spin >>`} </button>
                </Link>
                <p className='text-[#FFFFFF] text-lg font-futuraBold lg:text-2xl mt-4'>Pav Bhaji</p>
                <p className='text-[#FFFFFF] text-lg '>₹ 199.00</p>
                <button type='button' className="bg-[#FBAE36] mt-2 rounded-full py-1 px-4 font-bold text-black">Add to cart </button>
              </div>
              <img src={food} alt="" className='lg:h-[400px] h-[250px]' />
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;

const CountryDrawer = ({ onClose, onSelectCountry, allCountryList }) => {
  const handleCountrySelect = (country) => {
    console.log("country", country);
    onSelectCountry(country);
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4 }}
      className="fixed z-50 flex flex-col px-7 text-[#E91D24] inset-0 bg-[#FFF] md:w-[350px]"
    >
      <div className="flex justify-between items-center w-full  text-red-700 h-16">
        <svg
          width="130"
          height="50"
          viewBox="0 0 130 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xlinkHref="http://www.w3.org/1999/xlink"
        >
          <rect width="130" height="50" fill="url(#pattern0)" />
          <defs>
            <pattern
              id="pattern0"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                xlinkHref="#image0_1_1467"
                transform="scale(0.00598802 0.0147059)"
              />
            </pattern>
            <image
              id="image0_1_1467"
              width="167"
              height="68"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABECAYAAADkxiXAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkE1QjZGNjZEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkE1QjZGNjVEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjYyMEYwNDA3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjYyMEYwNDE3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5J8dbAAAART0lEQVR42uxdCZgUxRWu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"
            />
          </defs>
        </svg>
        <span onClick={onClose} className="cursor-pointer">
          <svg fill="red" viewBox="0 0 24 24" width="24px" height="24px">
            <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" />
          </svg>
        </span>
      </div>

      <div className="flex mt-5 flex-col gap-7">
        {allCountryList?.map((countryItem) => (
          <button
            onClick={() => handleCountrySelect(countryItem)}
            className="flex  items-center px-3 lg:px-7"
          >
            <img
              alt={countryItem?.name}
              className="h-10 w-10"
              src={countryItem?.country_flag}
            />
            <span className="ml-10">{countryItem?.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};