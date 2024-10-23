import React, { useEffect, useRef, useState } from "react";
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
import menu1 from '../assets/menu.png'
import menu2 from '../assets/heateat.png'
import menu3 from '../assets/cookeat.png'
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
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import headerMenu1 from "../assets/header-menu1.png"
import headerMenu2 from "../assets/header-menu2.jpg"
import headerMenu3 from "../assets/header-menu3.png"
import headerMenu4 from "../assets/header-menu4.png"
import headerMenu5 from "../assets/header-menu5.png"
import { subscribeClose, subscribeOpen } from "../state/subscribeData";
import SearchQuery from "./SearchQuery";
import { addCategoryData } from "../state/selectedCategory";

const Header = () => {
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
  const [showHeaderMain, setShowHeaderMain] = React.useState(false);
  const headerMenuData = [
    {
      image: headerMenu1,
      title: "All Menu"
    },
    {
      image: headerMenu2,
      title: "Ready to Eat"
    },
    {
      image: headerMenu3,
      title: "Ready to Cook"
    },
    {
      image: headerMenu4,
      title: "Bulk"
    },
  ]

  const learnMenuData = [
    {
      title: "About us"
    },
    {
      title: "How it works"
    },
    {
      title: "Facility"
    },
    // {
    //   title: "Team"
    // },
    // {
    //   title: "Sustainability"
    // }
  ]


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

  const onMenuClick = (index) => {
    if (index === 0) {
      navigate('/products');
      dispatch(addCategoryData(null))
      setIsMenuOpen(false)
    } else if (index === 1) {
      navigate('/ready-to-eat');
      dispatch(subscribeClose());
      dispatch(addCategoryData(null))
      setIsMenuOpen(false)
    } else if (index === 2) {
      navigate('/ready-to-cook');
      dispatch(addCategoryData(null))
      setIsMenuOpen(false)
    } else if (index === 4) {
      navigate('/ready-to-eat');
      dispatch(subscribeOpen());
      dispatch(addCategoryData(null))
      setIsMenuOpen(false)
    } else if (index === 3) {
      navigate('/bulk');
      dispatch(addCategoryData(null))
      setIsMenuOpen(false)
    } else {
      navigate('/');
      setIsMenuOpen(false)
    }
  };

  const onLearnClick = (index) => {
    if (index === 0) {
      navigate('/aboutus');
      setIsMenuOpen(false)
    } else if (index === 1) {
      navigate('/how-it-works');
      setIsMenuOpen(false)
    }
    else if (index === 2) {
      navigate('/facilities');
      setIsMenuOpen(false)
    } else {
      navigate('/');
      setIsMenuOpen(false)
    }
  };

  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerTop = headerRef.current.getBoundingClientRect().top;
        setIsSticky(headerTop <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div ref={headerRef}>
      <div
        className={`flex w-full justify-between ${pathname === "/" ? 'hidden' : ''} font-sans ${pathname.includes('ready-to-cook') || pathname === "/" || pathname.includes('login') ? 'bg-transparent' : 'bg-[#EADEC1]'}  items-center ${pathname.includes('recipes') || pathname.includes('ready-to-cook') || pathname.includes('login') ? 'absolute' : ''}  ${isSticky ? 'fixed top-0 ' : 'absolute'}
          } transition-all duration-300  z-50 px-10 py-6`}
      >
        <div className="gap-3 text-[18px] font-[500] font-regola-pro leading-[21.6px] flex-1">
          <NavigationMenu.Root className="NavigationMenuRoot hidden lg:flex ">
            <NavigationMenu.List className="NavigationMenuList hidden lg:flex">
              <NavigationMenu.Item className="pl-4">
                <NavigationMenu.Trigger
                  onMouseEnter={() => setShowHeaderMain(true)}
                  // onMouseLeave={() => setShowHeaderMain(false)}
                  onClick={() => { setShowHeaderMain(true) }}
                  className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] pr-4 whitespace-nowrap relative  ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#FFFFFF]' : 'text-[#231F20]'} `}>
                  OUR MENU
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  onMouseLeave={() => setShowHeaderMain(false)}
                  className="NavigationMenuContent absolute left-0 top-12 bg-[#FAFAFAE5] z-1000 w-[94vw] mr-10 px-10 py-11 rounded-[4px]"
                >
                  <div className={`grid grid-cols-${headerMenuData.length < 5 ? headerMenuData.length : 5} gap-4 w-full px-[150px] z-1000`}>
                    {headerMenuData.map((menuItem, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden"
                        onClick={() => onMenuClick(index)}
                      >
                        <img
                          src={menuItem.image}
                          alt={menuItem.title}
                          className="w-full header-menu-background-img object-cover group-hover:scale-110 transform transition-transform duration-200"
                        />
                        <div
                          className="absolute inset-0 group-hover:opacity-90 transition duration-300 h-[100px]"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0, 0, 0, 0.63) 0%, rgba(0, 0, 0, 0) 100%)",
                          }}
                        >
                          <span className="absolute top-2 left-2 text-white font-[400] font-regola-pro text-[24px] leading-[28.8px] mt-[20px] ml-2">
                            {menuItem.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] px-4 whitespace-nowrap relative ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#FFFFFF]' : 'text-[#231F20]'}  `}>
                  LEARN
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="NavigationMenuContent absolute  top-12 bg-[#D9D9D9] z-1000 w-auto h-auto rounded-[4px]">
                  <div className="flex flex-col gap-4 w-full p-4 z-1000">
                    {learnMenuData.map((menuItem, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => onLearnClick(index)}
                      >
                        <span className=" text-[#333333] font-[400] font-regola-pro text-[24px] leading-[28.8px] mb-[20px] ml-2">
                          {menuItem.title}
                        </span>

                      </div>
                    ))}
                  </div>
                </NavigationMenu.Content>
                {/* <NavigationMenu.Content className="NavigationMenuContent absolute top-10 bg-green-700 z-50  w-[100vw] h-[500px]">
                    <div className="">
                      <h1>Anukas adjasd;p9erhj</h1>
                    </div>
                  </NavigationMenu.Content> */}
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger onClick={() => { navigate('/recipe-list') }} className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] whitespace-nowrap px-4  relative  ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#FFFFFF]' : 'text-[#231F20]'} `}>
                  RECIPES
                </NavigationMenu.Trigger>

              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
          <button className="lg:hidden btn-hamburger" onClick={() => setIsMenuOpen(true)}>
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
                className={`fill-current ${pathname.includes("/ready-to-cook") || pathname.includes('login') || pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#231F20]'}`}
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 justify-center gap-3 logo">
          <Link to="/">
            <svg
              width="143"
              height="63"
              viewBox="0 0 143 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.57521 19.9025C1.96275 19.29 1.72742 19.0076 1.72742 18.6308C1.72742 17.8768 2.52814 17.4058 5.49571 16.1809C7.94525 15.0504 8.74627 14.8151 9.4058 14.8151C9.97089 14.8151 10.3477 15.239 10.3477 16.2754C10.3477 17.3588 10.1595 19.0076 10.1595 23.5769V27.1099C10.1595 28.7113 11.1017 29.3238 11.1017 30.266C11.1017 31.2553 9.59406 31.7263 7.14452 31.7263H6.67356C4.17665 31.7263 2.66934 31.2553 2.66934 30.266C2.66934 29.3238 3.65863 28.7113 3.65863 27.1099V24.8015C3.65863 21.1274 3.5645 20.9859 2.57521 19.9025Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M13.5036 20.2322C12.844 19.6671 12.5143 19.3844 12.5143 18.7719C12.5143 18.0653 13.0326 17.547 15.4348 16.2279C17.9317 14.8618 19.0151 14.4379 19.9103 14.4379C20.6639 14.4379 20.9937 14.8618 20.9937 15.7099C20.9937 16.0397 20.9466 16.4165 20.8993 16.9348C22.0771 15.6628 23.6315 14.815 25.4215 14.815C28.4835 14.815 29.0489 16.9816 29.4728 21.0799C29.7555 23.9066 30.0382 25.9793 30.2265 27.2984C30.4621 28.523 30.886 29.0884 31.7341 29.3237C32.2992 29.4652 32.3933 30.0774 31.9694 30.5016C31.3102 31.1137 29.7084 31.7262 27.824 31.7262C24.8564 31.7262 23.8671 30.5016 23.7259 28.052C23.5844 26.3091 23.4903 24.7544 23.3488 21.9751C23.2547 18.9605 23.0664 17.7826 22.2183 17.7826C21.229 17.7826 20.8051 19.9495 20.7581 22.7758V27.1098C20.7581 28.7113 21.7003 29.3237 21.7003 30.2659C21.7003 31.2552 20.24 31.7262 17.7431 31.7262H17.3192C14.8226 31.7262 13.315 31.2552 13.315 30.2659C13.315 29.3237 14.2572 28.7113 14.2572 27.1098V24.7544C14.2572 21.7868 14.2572 20.9387 13.5036 20.2322Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M43.275 21.504C47.8443 22.8231 49.3519 24.3774 49.3519 26.8273C49.3519 30.2658 45.6304 31.9617 40.8725 31.9617C37.0098 31.9617 34.1363 31.1139 33.147 28.7114C32.3934 26.8273 33.5709 24.9899 35.7848 24.9899C37.4337 24.9899 38.7527 25.8851 38.8468 27.6751C38.9413 29.371 39.5534 30.0776 40.5427 30.0776C41.7206 30.0776 42.3327 29.1824 42.3327 27.8633C42.3327 26.5917 41.1552 25.3197 38.9883 24.7546C36.0205 23.9536 33.5239 22.6348 33.5239 19.9496C33.5239 16.5579 37.4807 14.7679 42.0033 14.7679C45.3947 14.7679 47.7502 15.8513 48.5509 17.6884C49.3045 19.5728 48.174 21.2687 46.0072 21.2687C44.3584 21.2687 43.3694 20.515 42.9923 18.6776C42.7099 17.1703 42.6157 16.652 41.6262 16.652C40.6842 16.652 40.4957 17.453 40.4957 18.4891C40.4957 19.6199 41.2964 20.9389 43.275 21.504Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M59.9037 17.7826H58.0192V23.7651C58.0192 26.5915 58.2548 27.3455 59.2441 27.3455C59.9978 27.3455 60.1863 26.9213 60.4687 26.5915C60.9871 26.0261 61.5525 26.2617 61.3168 27.1569C60.7514 29.4179 59.4327 31.9619 56.1351 31.9619C53.1201 31.9619 51.5187 29.7476 51.5187 25.2254V17.7826H51.0948C50.4823 17.7826 49.964 17.2643 49.964 16.6522C49.964 15.9926 50.4349 15.5214 51.0474 15.4743H51.0948C53.6385 15.4743 54.7219 14.2967 55.4755 12.177C55.8524 11.0935 56.4648 10.5281 57.1714 10.5281C57.878 10.5281 58.2078 11.0935 58.2078 11.9413C58.2078 13.4957 58.0666 14.4379 58.0192 15.4743H59.9037C60.5161 15.4743 61.0812 15.9926 61.0812 16.6522C61.0812 17.2643 60.5161 17.7826 59.9037 17.7826Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M71.7746 22.3991L71.1151 22.6818C69.5604 23.5298 68.9953 25.1784 68.9953 26.4974C68.9953 27.9106 69.5133 28.6643 70.5026 28.6643C71.4448 28.6643 72.4812 27.5808 72.0099 24.142L71.7746 22.3991ZM76.6737 31.7263C74.0829 31.7263 73.1407 30.5958 72.8109 29.0411C71.7275 30.6428 69.9843 31.6792 67.6762 31.6792C64.5201 31.6792 62.4474 30.1719 62.4474 27.722C62.4474 25.414 64.2845 23.7652 67.535 22.5876C70.8794 21.3627 71.4448 20.8917 71.4448 20.0907C71.1621 17.7827 70.9268 16.7934 70.2673 16.7934C69.7019 16.7934 69.4662 17.5941 69.1365 18.9132C68.7597 20.4678 67.7233 21.5513 65.8392 21.4098C64.1433 21.3627 63.2481 20.0907 63.5779 18.5363C64.1433 16.1809 66.734 14.8148 70.5026 14.8148C75.3075 14.8148 77.6156 16.8875 78.181 20.9859C78.6052 23.9064 78.9817 27.1099 79.1232 27.722C79.3118 28.8528 79.5942 29.0882 80.4423 29.3708C81.0547 29.512 81.1488 30.1245 80.6776 30.5484C80.1125 31.0667 78.6052 31.7263 76.6737 31.7263Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M82.6559 20.2322C81.9964 19.6671 81.6666 19.3844 81.6666 18.7719C81.6666 18.0653 82.185 17.547 84.5871 16.2279C87.084 14.8618 88.1675 14.4379 89.0626 14.4379C89.8163 14.4379 90.146 14.8618 90.146 15.7099C90.146 16.0397 90.0987 16.4165 90.0516 16.9348C91.2292 15.6628 92.7838 14.815 94.5739 14.815C97.6359 14.815 98.2012 16.9816 98.6251 21.0799C98.9075 23.9066 99.1905 25.9793 99.3788 27.2984C99.6144 28.523 100.038 29.0884 100.886 29.3237C101.452 29.4652 101.546 30.0774 101.122 30.5016C100.462 31.1137 98.8608 31.7262 96.9763 31.7262C94.0088 31.7262 93.0195 30.5016 92.8783 28.052C92.7368 26.3091 92.6426 24.7544 92.5011 21.9751C92.407 18.9605 92.2187 17.7826 91.3707 17.7826C90.3814 17.7826 89.9575 19.9495 89.9104 22.7758V27.1098C89.9104 28.7113 90.8526 29.3237 90.8526 30.2659C90.8526 31.2552 89.3921 31.7262 86.8955 31.7262H86.4716C83.975 31.7262 82.4673 31.2552 82.4673 30.2659C82.4673 29.3237 83.4096 28.7113 83.4096 27.1098V24.7544C83.4096 21.7868 83.4096 20.9387 82.6559 20.2322Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M110.921 17.7826H109.036V23.7651C109.036 26.5915 109.272 27.3455 110.261 27.3455C111.015 27.3455 111.203 26.9213 111.486 26.5915C112.004 26.0261 112.57 26.2617 112.334 27.1569C111.769 29.4179 110.449 31.9619 107.152 31.9619C104.137 31.9619 102.536 29.7476 102.536 25.2254V17.7826H102.112C101.499 17.7826 100.981 17.2643 100.981 16.6522C100.981 15.9926 101.452 15.5214 102.065 15.4743H102.112C104.656 15.4743 105.739 14.2967 106.493 12.177C106.869 11.0935 107.482 10.5281 108.189 10.5281C108.895 10.5281 109.225 11.0935 109.225 11.9413C109.225 13.4957 109.084 14.4379 109.036 15.4743H110.921C111.533 15.4743 112.098 15.9926 112.098 16.6522C112.098 17.2643 111.533 17.7826 110.921 17.7826Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M113.936 12.0827C113.323 11.6117 112.946 11.329 112.946 10.7166C112.946 10.01 113.794 9.49165 116.244 8.1729C118.693 6.85385 119.777 6.47702 120.625 6.47702C121.426 6.47702 121.85 6.94798 121.85 7.70163C121.85 8.73799 121.473 10.01 121.473 15.5686V27.1097C121.473 28.7114 122.462 29.3239 122.462 30.2658C122.462 31.2551 121.002 31.7261 118.458 31.7261H118.034C115.49 31.7261 114.03 31.2551 114.03 30.2658C114.03 29.3239 115.019 28.7114 115.019 27.1097V16.6991C115.019 13.6374 114.878 12.8834 113.936 12.0827Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M125.947 21.0801C124.11 16.9817 122.885 17.2644 122.885 15.9928C122.885 15.0032 125.146 14.4851 127.737 14.4851H128.161C130.752 14.4851 132.495 14.9564 132.495 15.9454C132.495 16.8876 131.412 17.4056 131.977 18.8659C132.495 20.4206 133.767 24.095 134.662 26.1207C135.604 23.6711 136.169 21.6455 136.876 19.8084C137.677 17.8298 137.206 17.3586 136.358 16.9817C135.416 16.5578 135.133 16.181 135.133 15.8513C135.133 15.0032 136.075 14.5793 139.043 14.5793C142.152 14.5793 143 14.909 143 15.7098C143 16.3693 140.974 17.2644 140.268 18.9603C138.996 21.9753 138.525 24.0477 136.452 29.1353C134.097 34.9295 132.589 37.0023 128.915 37.0023C126.56 37.0023 124.44 36.1545 123.781 34.1288C123.262 32.5741 124.346 31.1139 126.042 31.1139C127.784 31.1139 128.632 32.1502 128.538 33.6576C128.397 34.8825 128.821 35.4005 129.574 35.4005C130.799 35.4005 131.6 33.8932 130.564 31.4437C129.433 28.8529 126.795 23.0587 125.947 21.0801Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M14.7431 45.534C15.2814 44.3488 15.9279 43.1103 16.4666 41.8173C17.4364 39.6089 17.8133 38.5853 16.9515 37.9388C16.2513 37.5079 16.0357 36.9155 16.0357 36.5921C16.0357 35.7304 17.1131 35.1917 20.5607 35.1917C23.9002 35.1917 24.6004 35.8382 24.6004 36.6462C24.6004 37.8851 21.7455 38.37 20.3988 41.1171C18.6753 44.6722 17.4364 47.2578 16.6281 49.0354V56.8458C16.6281 58.6774 17.9211 60.3472 17.9211 61.4246C17.9211 62.5557 16.0357 63.0943 13.1808 63.0943H12.6424C9.78752 63.0943 7.90216 62.5557 7.90216 61.4246C7.90216 60.3472 9.19479 58.6774 9.19479 56.8458V50.3817C8.11744 47.7424 6.9326 45.2109 6.28613 43.8642C4.34703 39.7164 1.59961 38.2084 1.59961 36.9155C1.59961 35.7844 3.70056 35.1917 6.50142 35.1917H7.36348C10.3262 35.1917 12.5346 35.5688 12.5346 36.6999C12.5346 37.562 11.8341 38.5853 12.2112 39.6089C12.5346 40.6322 13.5042 42.9484 14.7431 45.534Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M38.7666 48.2274C37.4739 41.6555 35.9116 37.5079 33.8647 37.8313C31.8178 38.1544 32.7337 47.15 33.2186 50.0049C34.2956 56.2534 36.3966 60.8318 38.3357 60.455C40.0054 60.1854 40.0054 54.3681 38.7666 48.2274ZM48.3008 49.1432C48.3008 58.1385 43.2375 63.4174 36.0194 63.4174C28.8014 63.4174 23.738 58.1385 23.738 49.1432C23.738 40.0935 28.8014 34.8686 36.0194 34.8686C43.2375 34.8686 48.3008 40.0935 48.3008 49.1432Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M61.1205 63.3636C55.0336 63.3636 50.563 60.7242 50.563 52.3751V41.3863C50.563 39.555 49.27 37.8849 49.27 36.8076C49.27 35.6765 51.2091 35.1378 54.0103 35.1378H54.549C57.4039 35.1378 59.2892 35.6765 59.2892 36.8076C59.2892 37.8849 57.9963 39.555 57.9963 41.3863V52.3751C57.9963 57.8156 59.1814 59.97 62.0901 59.97C65.2143 59.97 66.1839 57.0613 66.1839 52.3751V41.3863C66.1839 39.555 64.4604 37.8849 64.4604 36.8076C64.4604 35.6765 65.9683 35.1378 68.2849 35.1378H68.6617C70.9779 35.1378 72.5402 35.6765 72.5402 36.8076C72.5402 37.8849 70.8164 39.555 70.8164 41.3863V52.3751C70.8164 58.5158 68.2311 63.3636 61.1205 63.3636Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M89.0219 44.1874C89.0219 41.4403 88.591 38.4238 84.282 38.4238C82.6656 38.4238 82.6656 38.9622 82.6656 41.3862V47.4732C82.6656 49.1429 82.9353 49.5738 84.4435 49.5738C87.9986 49.5738 89.0219 46.8808 89.0219 44.1874ZM96.6171 43.9718C96.6171 47.096 95.1626 49.5201 92.3618 51.0283C93.3851 53.183 94.0853 54.9606 95.8628 57.0612C97.4789 59.0003 98.664 59.2697 99.6336 59.6468C100.495 59.9702 101.088 60.4548 100.98 61.1013C100.872 62.1786 99.2027 63.0944 96.0247 63.0944C92.3077 63.0944 89.7221 61.8015 88.2139 59.2159C85.6283 54.9606 86.2748 52.6981 84.1742 52.6981C83.0968 52.7521 82.6656 53.2367 82.6656 55.1759V56.8459C82.6656 58.6772 83.9586 60.347 83.9586 61.4243C83.9586 62.5557 82.0732 63.0944 79.2183 63.0944H78.6796C75.8788 63.0944 73.9934 62.5557 73.9934 61.4243C73.9934 60.347 75.2323 58.6772 75.2323 56.8459V41.3862C75.2323 39.5549 73.9934 37.8851 73.9934 36.8078C73.9934 35.6767 75.8788 35.138 78.6796 35.138H83.9048C92.5233 35.138 96.6171 38.6391 96.6171 43.9718Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M115.308 46.3958C122.203 48.2274 124.573 51.7285 124.573 55.1221C124.573 60.4011 119.294 63.4175 112.345 63.4175C106.151 63.4175 102.65 60.9394 101.303 57.8155C100.064 54.6375 101.303 52.0516 104.158 51.8363C106.582 51.6748 108.144 52.7521 108.521 55.6067C108.898 58.3001 110.514 60.078 113.153 60.078C115.362 60.078 117.247 58.5694 117.247 56.3073C117.247 54.5834 115.577 52.8599 109.76 51.2436C104.966 49.7894 102.488 47.3654 102.488 43.2716C102.488 38.0467 106.743 34.9224 113.261 34.9224C118.217 34.9224 121.233 37.1849 122.526 40.2014C123.765 43.3256 122.095 45.48 119.186 45.48C117.355 45.48 115.739 44.1333 115.092 41.494C114.608 39.2856 113.584 37.7774 112.238 37.7774C110.298 37.7774 109.49 39.3934 109.49 41.1709C109.49 43.0022 110.514 45.1569 115.308 46.3958Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
              <path
                d="M6.5556 2.48215L8.84937 0.0611534C8.97204 -0.0682011 9.18976 0.0216789 9.1849 0.199922L9.09532 3.53399C9.09229 3.64543 9.18338 3.73653 9.29482 3.73379L12.6286 3.64391C12.8071 3.63905 12.8973 3.85677 12.7677 3.97945L10.3467 6.27321C10.2659 6.35004 10.2659 6.47878 10.3467 6.55561L12.7677 8.84968C12.8973 8.97235 12.8071 9.18977 12.6286 9.18521L9.29482 9.09533C9.18338 9.09229 9.09229 9.18339 9.09532 9.29483L9.1849 12.6289C9.18976 12.8071 8.97204 12.8973 8.84937 12.768L6.5556 10.3467C6.47878 10.2659 6.35003 10.2659 6.27321 10.3467L3.97944 12.768C3.85676 12.8973 3.63905 12.8071 3.64391 12.6289L3.73379 9.29483C3.73652 9.18339 3.64542 9.09229 3.53398 9.09533L0.199913 9.18521C0.021671 9.18977 -0.0682094 8.97235 0.0611452 8.84968L2.48184 6.55561C2.56291 6.47878 2.56291 6.35004 2.48184 6.27321L0.0611452 3.97945C-0.0682094 3.85677 0.021671 3.63905 0.199913 3.64391L3.53398 3.73379C3.64542 3.73653 3.73652 3.64543 3.73379 3.53399L3.64391 0.199922C3.63905 0.0216789 3.85676 -0.0682011 3.97944 0.0611534L6.27321 2.48215C6.35003 2.56292 6.47878 2.56292 6.5556 2.48215Z"
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
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
          <SearchQuery />
          <button
            // onClick={
            //   cartDatas !== null ? () => dispatch(openCart()) : undefined
            // }
            onClick={() => {
              navigate('/cardReview')
            }}
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
                className={`fill-current ${pathname.includes('ready-to-cook') || pathname.includes('login') ? 'text-[#ffffff]' : 'text-[#231F20]'}`}
              />
            </svg>

            <div className="rounded-full absolute left-10 bottom-6 h-7 w-7 flex items-center justify-center bg-[#279C66]">
              <span style={{ fontSize: 15 }} className="font-[500] font-regola-pro">
                {cartDatas !== null ? totalQuantity(cartResponse) : 0}
                {/* /{selectedMealData.no} */}
              </span>
            </div>
          </button>

          {userId === null &&
            <button className="bg-[#FBAE36] hidden lg:block px-7 rounded-full ">
              <Link className={`font-[600] font-regola-pro leading-[21.6px] text-[18px] uppercase ${pathname.includes('ready-to-cook') ? 'text-[#ffffff]' : 'text-[#231F20]'}`} to="/login">
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
                <svg width="143" height="64" viewBox="0 0 143 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.57533 19.9025C1.96287 19.2901 1.72754 19.0077 1.72754 18.6308C1.72754 17.8769 2.52826 17.4059 5.49583 16.181C7.94537 15.0505 8.7464 14.8152 9.40592 14.8152C9.97101 14.8152 10.3478 15.2391 10.3478 16.2754C10.3478 17.3588 10.1596 19.0077 10.1596 23.577V27.1099C10.1596 28.7114 11.1018 29.3238 11.1018 30.2661C11.1018 31.2554 9.59418 31.7263 7.14464 31.7263H6.67368C4.17678 31.7263 2.66946 31.2554 2.66946 30.2661C2.66946 29.3238 3.65875 28.7114 3.65875 27.1099V24.8016C3.65875 21.1274 3.56462 20.9859 2.57533 19.9025Z" fill="white" />
                  <path d="M13.5039 20.2323C12.8444 19.6672 12.5146 19.3845 12.5146 18.772C12.5146 18.0654 13.033 17.5471 15.4351 16.2281C17.9321 14.8619 19.0155 14.438 19.9106 14.438C20.6643 14.438 20.9941 14.8619 20.9941 15.71C20.9941 16.0398 20.947 16.4166 20.8996 16.9349C22.0775 15.663 23.6319 14.8152 25.4219 14.8152C28.4839 14.8152 29.0493 16.9817 29.4732 21.0801C29.7559 23.9067 30.0386 25.9794 30.2268 27.2985C30.4625 28.5231 30.8863 29.0885 31.7344 29.3238C32.2995 29.4653 32.3937 30.0775 31.9698 30.5017C31.3105 31.1139 29.7088 31.7263 27.8243 31.7263C24.8568 31.7263 23.8675 30.5017 23.7263 28.0522C23.5848 26.3092 23.4907 24.7545 23.3492 21.9752C23.255 18.9606 23.0668 17.7827 22.2187 17.7827C21.2294 17.7827 20.8055 19.9496 20.7584 22.7759V27.1099C20.7584 28.7114 21.7006 29.3238 21.7006 30.2661C21.7006 31.2554 20.2404 31.7263 17.7435 31.7263H17.3196C14.823 31.7263 13.3154 31.2554 13.3154 30.2661C13.3154 29.3238 14.2576 28.7114 14.2576 27.1099V24.7545C14.2576 21.787 14.2576 20.9389 13.5039 20.2323Z" fill="white" />
                  <path d="M43.2746 21.504C47.8439 22.823 49.3515 24.3774 49.3515 26.8273C49.3515 30.2658 45.63 31.9617 40.8721 31.9617C37.0094 31.9617 34.136 31.1139 33.1467 28.7114C32.393 26.8273 33.5706 24.9899 35.7845 24.9899C37.4333 24.9899 38.7523 25.885 38.8465 27.6751C38.9409 29.3709 39.5531 30.0775 40.5424 30.0775C41.7202 30.0775 42.3324 29.1824 42.3324 27.8633C42.3324 26.5916 41.1548 25.3196 38.988 24.7546C36.0201 23.9535 33.5235 22.6348 33.5235 19.9496C33.5235 16.5578 37.4804 14.7678 42.0029 14.7678C45.3944 14.7678 47.7498 15.8512 48.5505 17.6883C49.3042 19.5728 48.1737 21.2687 46.0068 21.2687C44.358 21.2687 43.369 20.515 42.9919 18.6776C42.7095 17.1703 42.6154 16.652 41.6258 16.652C40.6839 16.652 40.4953 17.453 40.4953 18.489C40.4953 19.6198 41.296 20.9389 43.2746 21.504Z" fill="white" />
                  <path d="M59.9035 17.7827H58.0191V23.7652C58.0191 26.5916 58.2547 27.3455 59.244 27.3455C59.9977 27.3455 60.1862 26.9213 60.4686 26.5916C60.9869 26.0262 61.5523 26.2618 61.3167 27.157C60.7513 29.4179 59.4326 31.9619 56.1349 31.9619C53.12 31.9619 51.5186 29.7477 51.5186 25.2255V17.7827H51.0947C50.4822 17.7827 49.9639 17.2644 49.9639 16.6522C49.9639 15.9927 50.4348 15.5214 51.0473 15.4744H51.0947C53.6383 15.4744 54.7218 14.2968 55.4754 12.177C55.8522 11.0936 56.4647 10.5282 57.1713 10.5282C57.8779 10.5282 58.2076 11.0936 58.2076 11.9414C58.2076 13.4958 58.0664 14.438 58.0191 15.4744H59.9035C60.516 15.4744 61.0811 15.9927 61.0811 16.6522C61.0811 17.2644 60.516 17.7827 59.9035 17.7827Z" fill="white" />
                  <path d="M71.7745 22.3991L71.1149 22.6818C69.5603 23.5299 68.9952 25.1784 68.9952 26.4975C68.9952 27.9107 69.5132 28.6643 70.5025 28.6643C71.4447 28.6643 72.4811 27.5809 72.0098 24.1421L71.7745 22.3991ZM76.6735 31.7263C74.0828 31.7263 73.1406 30.5958 72.8108 29.0411C71.7274 30.6429 69.9841 31.6793 67.6761 31.6793C64.52 31.6793 62.4473 30.1719 62.4473 27.7221C62.4473 25.4141 64.2843 23.7652 67.5349 22.5877C70.8793 21.3628 71.4447 20.8918 71.4447 20.0908C71.162 17.7827 70.9267 16.7934 70.2671 16.7934C69.7018 16.7934 69.4661 17.5942 69.1364 18.9132C68.7595 20.4679 67.7232 21.5513 65.839 21.4098C64.1431 21.3628 63.248 20.0908 63.5778 18.5364C64.1431 16.181 66.7339 14.8149 70.5025 14.8149C75.3074 14.8149 77.6155 16.8876 78.1809 20.9859C78.6051 23.9064 78.9816 27.1099 79.1231 27.7221C79.3116 28.8529 79.594 29.0882 80.4421 29.3709C81.0546 29.5121 81.1487 30.1246 80.6775 30.5485C80.1124 31.0668 78.6051 31.7263 76.6735 31.7263Z" fill="white" />
                  <path d="M82.6563 20.2323C81.9968 19.6672 81.667 19.3845 81.667 18.772C81.667 18.0654 82.1853 17.5471 84.5875 16.2281C87.0844 14.8619 88.1678 14.438 89.063 14.438C89.8166 14.438 90.1464 14.8619 90.1464 15.71C90.1464 16.0398 90.099 16.4166 90.052 16.9349C91.2295 15.663 92.7842 14.8152 94.5742 14.8152C97.6362 14.8152 98.2016 16.9817 98.6255 21.0801C98.9079 23.9067 99.1909 25.9794 99.3792 27.2985C99.6148 28.5231 100.039 29.0885 100.887 29.3238C101.452 29.4653 101.546 30.0775 101.122 30.5017C100.463 31.1139 98.8611 31.7263 96.9767 31.7263C94.0091 31.7263 93.0198 30.5017 92.8786 28.0522C92.7371 26.3092 92.643 24.7545 92.5015 21.9752C92.4074 18.9606 92.2191 17.7827 91.371 17.7827C90.3817 17.7827 89.9578 19.9496 89.9108 22.7759V27.1099C89.9108 28.7114 90.853 29.3238 90.853 30.2661C90.853 31.2554 89.3924 31.7263 86.8958 31.7263H86.4719C83.9753 31.7263 82.4677 31.2554 82.4677 30.2661C82.4677 29.3238 83.4099 28.7114 83.4099 27.1099V24.7545C83.4099 21.787 83.4099 20.9389 82.6563 20.2323Z" fill="white" />
                  <path d="M110.921 17.7827H109.037V23.7652C109.037 26.5916 109.272 27.3455 110.262 27.3455C111.015 27.3455 111.204 26.9213 111.486 26.5916C112.005 26.0262 112.57 26.2618 112.334 27.157C111.769 29.4179 110.45 31.9619 107.153 31.9619C104.138 31.9619 102.536 29.7477 102.536 25.2255V17.7827H102.112C101.5 17.7827 100.981 17.2644 100.981 16.6522C100.981 15.9927 101.452 15.5214 102.065 15.4744H102.112C104.656 15.4744 105.739 14.2968 106.493 12.177C106.87 11.0936 107.482 10.5282 108.189 10.5282C108.895 10.5282 109.225 11.0936 109.225 11.9414C109.225 13.4958 109.084 14.438 109.037 15.4744H110.921C111.534 15.4744 112.099 15.9927 112.099 16.6522C112.099 17.2644 111.534 17.7827 110.921 17.7827Z" fill="white" />
                  <path d="M113.936 12.0827C113.323 11.6117 112.946 11.329 112.946 10.7166C112.946 10.01 113.794 9.49165 116.244 8.1729C118.693 6.85385 119.777 6.47702 120.625 6.47702C121.426 6.47702 121.85 6.94798 121.85 7.70163C121.85 8.73799 121.473 10.01 121.473 15.5686V27.1097C121.473 28.7114 122.462 29.3239 122.462 30.2658C122.462 31.2551 121.002 31.7261 118.458 31.7261H118.034C115.49 31.7261 114.03 31.2551 114.03 30.2658C114.03 29.3239 115.019 28.7114 115.019 27.1097V16.6991C115.019 13.6374 114.878 12.8834 113.936 12.0827Z" fill="white" />
                  <path d="M125.948 21.08C124.11 16.9817 122.886 17.2644 122.886 15.9927C122.886 15.0031 125.147 14.4851 127.738 14.4851H128.162C130.753 14.4851 132.495 14.9563 132.495 15.9453C132.495 16.8875 131.412 17.4056 131.977 18.8658C132.495 20.4205 133.767 24.095 134.662 26.1206C135.605 23.6711 136.17 21.6454 136.876 19.8084C137.677 17.8298 137.206 17.3585 136.358 16.9817C135.416 16.5578 135.133 16.181 135.133 15.8512C135.133 15.0031 136.076 14.5792 139.043 14.5792C142.153 14.5792 143 14.909 143 15.7097C143 16.3692 140.975 17.2644 140.268 18.9603C138.996 21.9752 138.525 24.0476 136.452 29.1352C134.097 34.9295 132.59 37.0022 128.915 37.0022C126.56 37.0022 124.44 36.1544 123.781 34.1288C123.263 32.5741 124.346 31.1138 126.042 31.1138C127.785 31.1138 128.633 32.1502 128.538 33.6575C128.397 34.8824 128.821 35.4004 129.575 35.4004C130.8 35.4004 131.6 33.8931 130.564 31.4436C129.434 28.8529 126.796 23.0586 125.948 21.08Z" fill="white" />
                  <path d="M14.7431 45.5339C15.2814 44.3487 15.9279 43.1102 16.4666 41.8172C17.4364 39.6088 17.8133 38.5852 16.9515 37.9387C16.2513 37.5078 16.0357 36.9154 16.0357 36.592C16.0357 35.7303 17.1131 35.1916 20.5607 35.1916C23.9002 35.1916 24.6004 35.8381 24.6004 36.6461C24.6004 37.885 21.7455 38.3699 20.3988 41.117C18.6753 44.6721 17.4364 47.2577 16.6281 49.0353V56.8457C16.6281 58.6774 17.9211 60.3471 17.9211 61.4245C17.9211 62.5556 16.0357 63.0942 13.1808 63.0942H12.6424C9.78752 63.0942 7.90216 62.5556 7.90216 61.4245C7.90216 60.3471 9.19479 58.6774 9.19479 56.8457V50.3817C8.11744 47.7423 6.9326 45.2108 6.28613 43.8641C4.34703 39.7163 1.59961 38.2083 1.59961 36.9154C1.59961 35.7843 3.70056 35.1916 6.50142 35.1916H7.36348C10.3262 35.1916 12.5346 35.5687 12.5346 36.6998C12.5346 37.5619 11.8341 38.5852 12.2112 39.6088C12.5346 40.6321 13.5042 42.9483 14.7431 45.5339Z" fill="white" />
                  <path d="M38.7668 48.2274C37.4742 41.6555 35.9119 37.508 33.865 37.8314C31.8181 38.1545 32.7339 47.1501 33.2188 50.005C34.2959 56.2535 36.3968 60.8319 38.3359 60.4551C40.0057 60.1854 40.0057 54.3681 38.7668 48.2274ZM48.3011 49.1432C48.3011 58.1385 43.2377 63.4175 36.0197 63.4175C28.8016 63.4175 23.7383 58.1385 23.7383 49.1432C23.7383 40.0936 28.8016 34.8687 36.0197 34.8687C43.2377 34.8687 48.3011 40.0936 48.3011 49.1432Z" fill="white" />
                  <path d="M61.121 63.3635C55.0341 63.3635 50.5634 60.7242 50.5634 52.3751V41.3863C50.5634 39.555 49.2705 37.8849 49.2705 36.8076C49.2705 35.6765 51.2096 35.1378 54.0108 35.1378H54.5495C57.4044 35.1378 59.2897 35.6765 59.2897 36.8076C59.2897 37.8849 57.9968 39.555 57.9968 41.3863V52.3751C57.9968 57.8155 59.1819 59.9699 62.0906 59.9699C65.2148 59.9699 66.1844 57.0613 66.1844 52.3751V41.3863C66.1844 39.555 64.4609 37.8849 64.4609 36.8076C64.4609 35.6765 65.9688 35.1378 68.2853 35.1378H68.6622C70.9784 35.1378 72.5407 35.6765 72.5407 36.8076C72.5407 37.8849 70.8169 39.555 70.8169 41.3863V52.3751C70.8169 58.5158 68.2316 63.3635 61.121 63.3635Z" fill="white" />
                  <path d="M89.0217 44.1874C89.0217 41.4403 88.5908 38.4239 84.2817 38.4239C82.6654 38.4239 82.6654 38.9622 82.6654 41.3863V47.4732C82.6654 49.143 82.935 49.5739 84.4433 49.5739C87.9984 49.5739 89.0217 46.8808 89.0217 44.1874ZM96.6169 43.9719C96.6169 47.0961 95.1624 49.5201 92.3615 51.0284C93.3848 53.1831 94.085 54.9606 95.8626 57.0613C97.4786 59.0004 98.6638 59.2697 99.6333 59.6468C100.495 59.9702 101.088 60.4549 100.98 61.1013C100.872 62.1787 99.2024 63.0945 96.0244 63.0945C92.3075 63.0945 89.7219 61.8015 88.2137 59.216C85.6281 54.9606 86.2746 52.6981 84.1739 52.6981C83.0966 52.7522 82.6654 53.2368 82.6654 55.1759V56.846C82.6654 58.6773 83.9583 60.3471 83.9583 61.4244C83.9583 62.5558 82.073 63.0945 79.2181 63.0945H78.6794C75.8785 63.0945 73.9932 62.5558 73.9932 61.4244C73.9932 60.3471 75.2321 58.6773 75.2321 56.846V41.3863C75.2321 39.555 73.9932 37.8852 73.9932 36.8079C73.9932 35.6768 75.8785 35.1381 78.6794 35.1381H83.9046C92.5231 35.1381 96.6169 38.6392 96.6169 43.9719Z" fill="white" />
                  <path d="M115.308 46.3958C122.203 48.2274 124.573 51.7285 124.573 55.1221C124.573 60.401 119.294 63.4175 112.346 63.4175C106.151 63.4175 102.65 60.9394 101.303 57.8155C100.064 54.6375 101.303 52.0516 104.158 51.8363C106.582 51.6748 108.144 52.7521 108.521 55.6067C108.898 58.3001 110.514 60.0779 113.154 60.0779C115.362 60.0779 117.248 58.5694 117.248 56.3072C117.248 54.5834 115.578 52.8599 109.76 51.2436C104.966 49.7894 102.488 47.3654 102.488 43.2716C102.488 38.0467 106.744 34.9224 113.262 34.9224C118.217 34.9224 121.234 37.1849 122.527 40.2014C123.765 43.3256 122.096 45.48 119.187 45.48C117.355 45.48 115.739 44.1333 115.093 41.494C114.608 39.2856 113.585 37.7773 112.238 37.7773C110.299 37.7773 109.491 39.3933 109.491 41.1709C109.491 43.0022 110.514 45.1569 115.308 46.3958Z" fill="white" />
                  <path d="M6.5556 2.48221L8.84937 0.0612144C8.97204 -0.06814 9.18976 0.02174 9.1849 0.199983L9.09532 3.53405C9.09229 3.64549 9.18338 3.73659 9.29482 3.73385L12.6286 3.64397C12.8071 3.63912 12.8973 3.85683 12.7677 3.97951L10.3467 6.27327C10.2659 6.3501 10.2659 6.47885 10.3467 6.55567L12.7677 8.84974C12.8973 8.97241 12.8071 9.18983 12.6286 9.18527L9.29482 9.09539C9.18338 9.09236 9.09229 9.18345 9.09532 9.29489L9.1849 12.629C9.18976 12.8072 8.97204 12.8974 8.84937 12.768L6.5556 10.3467C6.47878 10.266 6.35003 10.266 6.27321 10.3467L3.97944 12.768C3.85676 12.8974 3.63905 12.8072 3.64391 12.629L3.73379 9.29489C3.73652 9.18345 3.64542 9.09236 3.53398 9.09539L0.199913 9.18527C0.021671 9.18983 -0.0682094 8.97241 0.0611452 8.84974L2.48184 6.55567C2.56291 6.47885 2.56291 6.3501 2.48184 6.27327L0.0611452 3.97951C-0.0682094 3.85683 0.021671 3.63912 0.199913 3.64397L3.53398 3.73385C3.64542 3.73659 3.73652 3.64549 3.73379 3.53405L3.64391 0.199983C3.63905 0.02174 3.85676 -0.06814 3.97944 0.0612144L6.27321 2.48221C6.35003 2.56298 6.47878 2.56298 6.5556 2.48221Z" fill="white" />
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
            <NavigationMenu.Root className="NavigationMenuRoot lg:hidden flex ">
              <NavigationMenu.List className="NavigationMenuList px-8">
                <NavigationMenu.Item className="">
                  <NavigationMenu.Trigger
                    onMouseEnter={() => setShowHeaderMain(true)}
                    // onMouseLeave={() => setShowHeaderMain(false)}
                    onClick={() => { setShowHeaderMain(true) }}
                    className={`NavigationMenuTrigger text-[18px]  font-bold font-regola-pro leading-[21.6px] pl-4 whitespace-nowrap py-4 relative text-[#FFFFFF] `}>
                    OUR MENU
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    onMouseLeave={() => setShowHeaderMain(false)}
                    className="NavigationMenuContent absolute left-0 top-10 bg-[#FAFAFAE5] z-[1000] w-[100vw] px-5 py-11 rounded-[4px]"
                  >
                    <div className={`grid grid-cols-${headerMenuData.length < 2 ? headerMenuData.length : 2} gap-4 w-full z-1000`}>
                      {headerMenuData.map((menuItem, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer overflow-hidden"
                          onClick={() => onMenuClick(index)}
                        >
                          <img
                            src={menuItem.image}
                            alt={menuItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transform transition-transform duration-200"
                          />
                          <div
                            className="absolute inset-0 group-hover:opacity-90 transition duration-300 h-[100px]"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0, 0, 0, 0.63) 0%, rgba(0, 0, 0, 0) 100%)",
                            }}
                          >
                            <span className="absolute top-2 left-2 text-white font-[400] font-regola-pro text-[24px] leading-[28.8px] mt-[20px] ml-2">
                              {menuItem.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] px-4 pb-4 whitespace-nowrap relative text-[#FFFFFF]`}>
                    LEARN
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="NavigationMenuContent absolute  top-12 bg-[#D9D9D9] z-[1000] w-auto h-auto rounded-[4px]">
                    <div className="flex flex-col gap-4 w-full p-4 z-1000">
                      {learnMenuData.map((menuItem, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                          onClick={() => onLearnClick(index)}
                        >
                          <span className=" text-[#333333] font-[400] whitespace-nowrap font-regola-pro text-[24px] leading-[28.8px] mb-[20px] ml-2">
                            {menuItem.title}
                          </span>

                        </div>
                      ))}
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger onClick={() => { navigate('/recipe-list') }} className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] whitespace-nowrap px-4  relative text-[#FFFFFF]`}>
                    RECIPES
                  </NavigationMenu.Trigger>

                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
            <div className="flex flex-col text-[18px] px-12 font-bold font-regola-pro leading-[21.6px]  pb-4 whitespace-nowrap relative text-[#FFFFFF]">
              {loginUserCustomerId === null ? (
                <Link to="/login" className="py-5" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              ) : null}
              {loginUserCustomerId === null ? (
                <Link to="/registration" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              ) : null}
              {loginUserCustomerId !== null ? (
                <Link to="/Invoices" className="py-5" onClick={() => setIsMenuOpen(false)}>
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
                  className="py-5"
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
    </div>
  );
};

export default Header;

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