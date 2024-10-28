import React, { useEffect, useState, useRef } from "react";
import food from '../assets/food.png';
import { AnimatePresence, motion } from "framer-motion";
import { Link, unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { cartIsOpen, openCart } from "../state/cart";
import { useDispatch, useSelector } from "react-redux";
import { CartDrawer } from "./CartComponent";
import Rating from "./Rating";
import {
  cartData,
  clearCartData,
  clearCartResponse,
  selectCartResponse,
  setCartResponse,
} from "../state/cartData";
import { getCartQuery, getCategoriesQuery, getMediaImageQuery, getProductCollectionsQuery, getRecipeListQuery, graphQLClient } from "../api/graphql";
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
import { addCategoryData } from "../state/selectedCategory";
import imagefooter from '../assets/footer-image.png'
import heatEat from '../assets/heat-enjoy.jpg'
import selectMeal from '../assets/select-meal.png'
import recieveBox from '../assets/receive-box.png'
import freshHighQuality from '../assets/fresh-high-quality.png'
import authenticMeal from '../assets/authentic-flavors.png'
import noPreservativeWhite from '../assets/no-preservative.svg'
import headerImage1 from '../assets/header.png'
import headerImage2 from '../assets/header2.png'
import headerImage3 from '../assets/header3.png'
import Tooltip from "./Tooltip";
import headerMenu1 from "../assets/header-menu1.png"
import headerMenu2 from "../assets/header-menu2.jpg"
import headerMenu3 from "../assets/header-menu3.png"
import headerMenu4 from "../assets/header-menu4.png"
import headerMenu5 from "../assets/header-menu5.png"
import { subscribeClose, subscribeOpen } from "../state/subscribeData";
import middleImg from '../assets/middle1-image1.png'
import rtcImg from '../assets/ready-to-cook-img.jpg'
import SearchQuery from "./SearchQuery";
import UserMenu from '../component/DropdownProfile';
const Home = () => {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [showHeaderMain, setShowHeaderMain] = React.useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [selecteRandomPro, setSelecteRandomPro] = useState(null);
  const [rawResonse, setRawResponse] = useState(null);
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
  const [categoryData, setCategoryData] = useState([]);

  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);

  const [recipeList, setRecipeList] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const reviews = [
    {
      name: 'Rashmi Bansal',
      text: 'Lorem Ipsum ',
      rating: 4,
    },
    {
      name: 'John Doe',
      text: 'John has ',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      text: 'The product',
      rating: 4,
    },
  ];
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(true);
      setTimeout(() => {
        setCurrentReviewIndex((prevIndex) =>
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
        setFadeIn(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const handleMouseDowns = () => {
    setIsDragging(true);
  };

  const handleMouseMoves = (e) => {
    if (!isDragging) return;
    const parentWidth = e.target.parentNode.offsetWidth;
    const newX = e.clientX - e.target.parentNode.getBoundingClientRect().left - 30;
    if (newX >= 0 && newX <= parentWidth - 60) {
      setPositionX(newX);
      // setRotation((prevRotation) => {
      //   const newRotation = prevRotation + 360;
      //   const selectedIndex = Math.abs(Math.floor(newRotation / 360) % apiResponse.length);
      //   setSelecteRandomPro(apiResponse[selectedIndex]);

      //   return newRotation;
      // });
    }
  };

  const handleMouseUps = () => {
    setIsDragging(false);
    setPositionX(0);
    setRotation((prevRotation) => {
      const newRotation = prevRotation + 360;
      const selectedIndex = Math.abs(Math.floor(newRotation / 360) % apiResponse.length);
      setSelecteRandomPro(apiResponse[selectedIndex]);

      return newRotation;
    });
  };

  const fetchImageById = async (imageId) => {
    try {
      const result = await graphQLClient.request(getMediaImageQuery, { id: imageId });
      return result.node?.image?.url || '';
    } catch (error) {
      console.error("Error fetching image:", error);
      return '';
    }
  };

  useEffect(() => {
    const apiCall = async () => {
      try {
        const result = await graphQLClient.request(getRecipeListQuery, { first: 10 });
        const collections = result.metaobjects.edges;
        const recipesWithImages = await Promise.all(
          collections.map(async (recipe) => {
            const imageId = recipe.node.fields.find(field => field.key === 'image')?.value;
            const imageUrl = imageId ? await fetchImageById(imageId) : '';

            return {
              ...recipe.node,
              imageUrl
            };
          })
        );

        setRecipeList(recipesWithImages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    apiCall();
  }, []);


  const imgRef = useRef(null);

  // Handle mouse drag start
  const handleMouseDown = (e) => {
    setDragging(true);
    setLastMouseX(e.clientX);
    e.preventDefault(); // Prevent default drag behavior
  };

  // Handle mouse movement during drag (rotate image and update product)
  const handleMouseMove = (e) => {
    if (dragging) {
      const deltaX = e.clientX - lastMouseX;
      setRotation((prevRotation) => {
        const newRotation = prevRotation + deltaX / 2; // Adjust rotation speed

        // Update product based on rotation
        const selectedIndex = Math.abs(Math.floor(newRotation / 360) % apiResponse.length);
        setSelecteRandomPro(apiResponse[selectedIndex]);

        return newRotation;
      });
      setLastMouseX(e.clientX);
    }
  };

  // Handle mouse release (stop dragging)
  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  // Set up event listeners for dragging
  useEffect(() => {
    const handleMouseMoveThrottle = (e) => {
      requestAnimationFrame(() => handleMouseMove(e)); // Throttle mouse move events
    };

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMoveThrottle);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveThrottle);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleSpinClick = () => {
    // Simulate a 360-degree rotation on button click
    setRotation((prevRotation) => {
      const newRotation = prevRotation + 360; // Rotate by 360 degrees

      // Update the selected product based on rotation
      const selectedIndex = Math.abs(Math.floor(newRotation / 360) % apiResponse.length);
      setSelecteRandomPro(apiResponse[selectedIndex]);

      return newRotation;
    });
  };

  // console.log(userId)

  useEffect(() => {
    if (cartData !== null) {
      getCartData();
    }
  }, [cartDatas]);

  useEffect(() => {
    if (countryList === null) fetchCountryFilters();
  });

  const spinVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: 0 },
    visible: { opacity: 1, scale: 1, rotate: 360 },
  };

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

  useEffect(() => {
    const getCategory = async () => {
      try {
        const result = await graphQLClient.request(getCategoriesQuery);
        setCategoryData(result?.collections?.edges?.slice(0, 4));
        // dispatch(addCategoryData(result?.collections?.edges[0]))
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }

    getCategory();
  }, [])

  useEffect(() => {
    const apiCall = async () => {
      try {
        const result = await graphQLClient.request(getProductCollectionsQuery, {
          first: 1,
          reverse: false,
          query: "",
        });

        const collections = result;

        const bundleIndex = collections.collections.edges.findIndex(
          (item) => item.node.title === "Bundles"
        );

        if (bundleIndex !== -1) {
          const bundleItem = collections.collections.edges.splice(
            bundleIndex,
            1
          )[0];
          collections.collections.edges.push(bundleItem);
        }

        const products = collections?.collections?.edges[0]?.node?.products?.edges || [];

        const filteredProducts = products.filter((product) => {
          const bulkMetafield = product.node.metafields.find(mf => mf && mf.key === "bulk");
          return bulkMetafield.value !== "true";
        });
        setApiResponse(filteredProducts.splice(1, 10));
        setSelecteRandomPro(filteredProducts[0]);
        setRawResponse(collections);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    apiCall();
  }, []);



  const colors = ['#fbae3666', '#279c6666', '#f15e2a66', '#fbae3666', '#279c6666', '#f15e2a66'];
  const colorCategory = ['#FBAE36', '#26965C', '#555555', '#FB7D36'];

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 5);
  };


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

  const onMenuClick = (index) => {
    if (index === 0) {
      navigate('/products');
      dispatch(addCategoryData(null))
    } else if (index === 1) {
      navigate('/ready-to-eat');
      dispatch(subscribeClose());
      dispatch(addCategoryData(null))
    } else if (index === 2) {
      navigate('/ready-to-cook');
      dispatch(addCategoryData(null))
    } else if (index === 4) {
      navigate('/ready-to-eat');
      dispatch(addCategoryData(null))
      dispatch(subscribeOpen());
    } else if (index === 3) {
      navigate('/bulk');
      dispatch(addCategoryData(null))
    } else {
      navigate('/');
    }
  };

  const onLearnClick = (index) => {
    if (index === 0) {
      navigate('/aboutus');
    } else if (index === 1) {
      navigate('/how-it-works');
    }
    else if (index === 2) {
      navigate('/facilities');
    } else {
      navigate('/');
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

  const recipData = [
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
    {
      title: 'Biryani burrito',
      image: imagefooter
    },
  ]

  const buttonTexts = [
    'AUTHENTIC FLAVOURS',
    'FRESH INGREDIENTS',
    'NO ARTIFICIAL ADDITIVES',
    'QUALITY CONTROL',
    'PRESERVATIVE FREE'
  ];

  const descriptionData = [
    {
      title: 'Authentic, Home Cooked Flavours',
      description: 'Get that cosy, homemade taste in every bite. Our recipes bring the comfort of home right to your plate.',
      image: authenticMeal,
    },
    {
      title: 'Fresh, High Quality Ingredients',
      description: 'We only use fresh ingredients to make sure your meals are super tasty (and also nutritious).',
      image: freshHighQuality
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "Easy to carry and easy to open! Tasty food!",
      reviewerName: "Nayan Dubey",
      typeform: "Typeform",
      typeformMessage: {
        title: "Pilot",
        messages: ["76 participants", "300 products",
          "26 median age"]
      }
    },
    {
      id: 2,
      text: "Good quality packaging with no leakage issue.",
      reviewerName: "Shristi Dhawan",
      typeform: "Typeform",
      typeformMessage: {
        title: "Pilot",
        messages: ["76 participants", "300 products",
          "26 median age"]
      }

    },
    {
      id: 3,
      text: "Packaging is good and the colour combination lets you recall the item.",
      reviewerName: "Harshit Mehrotra",
      typeform: "Typeform",
      typeformMessage: {
        title: "Pilot",
        messages: ["76 participants", "300 products",
          "26 median age"]
      }
    },
    {
      id: 4,
      text: "Easy to carry and easy to open! Tasty food!",
      reviewerName: "Nayan Dubey",
      typeform: "Typeform",
      typeformMessage: {
        title: "Pilot",
        messages: ["76 participants", "300 products",
          "26 median age"]
      }
    }
  ];

  const tooltipData = {
    title: "Packaging",
    messages: [
      "Lorem Ipsum Lorem Ipsum",
      "Lorem Ipsum Lorem Ipsum"
    ]
  };

  const totalSlides = testimonials.length;
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isLastInRow, setIsLastInRow] = useState(2)

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, []);

  const nextSlide = () => {
    if (currentSlide < Math.ceil(totalSlides - slidesPerView)) {
      setCurrentSlide((prev) => prev + 1);
      setIsLastInRow((isLastInRow) => isLastInRow + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      setIsLastInRow((isLastInRow) => isLastInRow - 1);
    }
  };

  const getBackgroundColor = (index) => {
    return index % 2 === 0 ? '#FAA634' : '#FB7D36';
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchQuery('');
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [activeButton, setActiveButton] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const lastUpdateTimeRef = useRef(0)
  const animationDuration = 5000

  const currentData = descriptionData[activeButton] || descriptionData[0]

  useEffect(() => {
    let animationFrame
    let startTime = performance.now() - (progress / 100) * animationDuration

    const updateProgress = (currentTime) => {
      if (!isPaused) {
        const elapsedTime = currentTime - startTime
        const newProgress = Math.min((elapsedTime / animationDuration) * 100, 100)
        setProgress(newProgress)

        if (newProgress < 100) {
          lastUpdateTimeRef.current = currentTime
          animationFrame = requestAnimationFrame(updateProgress)
        } else {
          setActiveButton((prev) => (prev + 1) % buttonTexts.length)
          startTime = currentTime
          setProgress(0)
          animationFrame = requestAnimationFrame(updateProgress)
        }
      }
    }

    animationFrame = requestAnimationFrame(updateProgress)

    return () => cancelAnimationFrame(animationFrame)
  }, [isPaused, activeButton, buttonTexts.length, animationDuration])

  const handleButtonClick = (index) => {
    setActiveButton(index)
    setProgress(0)
    setIsPaused(false)
  }

  const handleMouseHold = () => {
    setIsPaused(true)
  }

  const handleMouseRelease = () => {
    if (isPaused) {
      const currentTime = performance.now()
      const pauseDuration = currentTime - lastUpdateTimeRef.current
      lastUpdateTimeRef.current = currentTime - pauseDuration
      setIsPaused(false)
    }
  }

  const bannerData = [
    {
      image: headerImage1,
      title: "Bring the Taste of Home, Anywhere",
      description: "Ready-to-eat comfort food, delivered right at your door.",
      ctaText: "Subscribe at ₹80/meal",
      navigationLink: "/products"
    },
    {
      image: headerImage2,
      title: "Real Indian Food, Ready in 2 Minutes",
      description: "Heat, Cook, and Repeat – Get deliciousness served to your plate in minutes.",
      ctaText: "All Ready to Eat Products",
      navigationLink: "/ready-to-eat"
    },
    {
      image: headerImage3,
      title: "From Kitchen to Table, Cooked in 7 Minutes",
      description: "Delicious meals cooked instantly in 7 minutes. Experience ease on busy days with your favourite protein.",
      ctaText: "All Ready to Cook Products",
      navigationLink: "/ready-to-cook"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Function to start autoplay
    const startAutoplay = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    };
    startAutoplay();
    return () => clearInterval(intervalRef.current);
  }, [bannerData.length]);

  const prevIndex = (currentIndex - 1 + bannerData.length) % bannerData.length;
  const nextIndex = (currentIndex + 1) % bannerData.length;

  const handlePrevClick = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(prevIndex);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  };

  const handleNextClick = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(nextIndex);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  };

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

  return (
    <div className={`z-[100] ${pathname === '/' ? 'relative z-[100] -top-[100px]' : ' z-[100]'} bg-[#EFE9DA]`}>
      <div className="w-full relative home-page-background-img">
        {bannerData.map((data, index) => (
          <img
            key={index}
            src={data.image}
            alt={`Banner ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${currentIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              zIndex: currentIndex === index ? 2 : 1,
            }}
          />
        ))}

        <div
          className="absolute inset-0 h-[250px]"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(115, 115, 115, 0) 100%)',
            transition: 'background 1s ease-in-out',
            zIndex: 3,
          }}
        />
        <button
          onClick={handlePrevClick}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-20 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Previous Slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] w-[50px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={handleNextClick}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-20 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Next Slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] w-[50px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>


        <div className={`flex ${showHeaderMain ? 'z-[1000]' : ''} w-full justify-between items-center relative pt-7`} >
          <div className=" my-6 text-[18px] font-[600] flex-1 font-regola-pro z-50">
            <NavigationMenu.Root className="NavigationMenuRoot">
              <NavigationMenu.List className="NavigationMenuList hidden lg:flex">
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger
                    onMouseEnter={() => setShowHeaderMain(true)}
                    // onMouseLeave={() => setShowHeaderMain(false)}
                    onClick={() => { setShowHeaderMain(true) }}
                    className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] px-4 whitespace-nowrap relative ml-14 ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#ffffff]'} `}>
                    OUR MENU
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    onMouseLeave={() => setShowHeaderMain(false)}
                    className="NavigationMenuContent absolute left-0 top-12 bg-[#FAFAFAE5] z-1000 w-[94vw] ml-10 mr-10 px-10 py-11 rounded-[4px]"
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
                  <NavigationMenu.Trigger className={`NavigationMenuTrigger text-[18px] font-bold font-regola-pro leading-[21.6px] whitespace-nowrap px-4 relative  ${!showHeaderMain ? 'text-[#FFFFFF]' : 'text-[#FFFFFF]'} `}>
                    LEARN
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="NavigationMenuContent mx-4 absolute top-12  bg-[#D9D9D9] rounded-[4px]">
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
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger onClick={() => { navigate('/recipe-list') }} className={`NavigationMenuTrigger px-4 whitespace-nowrap text-[18px] font-bold font-regola-pro leading-[21.6px]  relative  ${!showHeaderMain ? 'text-[#FFFFFF]' : 'text-[#FFFFFF]'} `}>
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
                  className={`fill-current ${pathname === '/' ? 'text-[#FFFFFF] black-text-shadow' : 'text-[#E91D24]'}`}
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 justify-center gap-3 z-10 logo">
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
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M13.5036 20.2322C12.844 19.6671 12.5143 19.3844 12.5143 18.7719C12.5143 18.0653 13.0326 17.547 15.4348 16.2279C17.9317 14.8618 19.0151 14.4379 19.9103 14.4379C20.6639 14.4379 20.9937 14.8618 20.9937 15.7099C20.9937 16.0397 20.9466 16.4165 20.8993 16.9348C22.0771 15.6628 23.6315 14.815 25.4215 14.815C28.4835 14.815 29.0489 16.9816 29.4728 21.0799C29.7555 23.9066 30.0382 25.9793 30.2265 27.2984C30.4621 28.523 30.886 29.0884 31.7341 29.3237C32.2992 29.4652 32.3933 30.0774 31.9694 30.5016C31.3102 31.1137 29.7084 31.7262 27.824 31.7262C24.8564 31.7262 23.8671 30.5016 23.7259 28.052C23.5844 26.3091 23.4903 24.7544 23.3488 21.9751C23.2547 18.9605 23.0664 17.7826 22.2183 17.7826C21.229 17.7826 20.8051 19.9495 20.7581 22.7758V27.1098C20.7581 28.7113 21.7003 29.3237 21.7003 30.2659C21.7003 31.2552 20.24 31.7262 17.7431 31.7262H17.3192C14.8226 31.7262 13.315 31.2552 13.315 30.2659C13.315 29.3237 14.2572 28.7113 14.2572 27.1098V24.7544C14.2572 21.7868 14.2572 20.9387 13.5036 20.2322Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M43.275 21.504C47.8443 22.8231 49.3519 24.3774 49.3519 26.8273C49.3519 30.2658 45.6304 31.9617 40.8725 31.9617C37.0098 31.9617 34.1363 31.1139 33.147 28.7114C32.3934 26.8273 33.5709 24.9899 35.7848 24.9899C37.4337 24.9899 38.7527 25.8851 38.8468 27.6751C38.9413 29.371 39.5534 30.0776 40.5427 30.0776C41.7206 30.0776 42.3327 29.1824 42.3327 27.8633C42.3327 26.5917 41.1552 25.3197 38.9883 24.7546C36.0205 23.9536 33.5239 22.6348 33.5239 19.9496C33.5239 16.5579 37.4807 14.7679 42.0033 14.7679C45.3947 14.7679 47.7502 15.8513 48.5509 17.6884C49.3045 19.5728 48.174 21.2687 46.0072 21.2687C44.3584 21.2687 43.3694 20.515 42.9923 18.6776C42.7099 17.1703 42.6157 16.652 41.6262 16.652C40.6842 16.652 40.4957 17.453 40.4957 18.4891C40.4957 19.6199 41.2964 20.9389 43.275 21.504Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M59.9037 17.7826H58.0192V23.7651C58.0192 26.5915 58.2548 27.3455 59.2441 27.3455C59.9978 27.3455 60.1863 26.9213 60.4687 26.5915C60.9871 26.0261 61.5525 26.2617 61.3168 27.1569C60.7514 29.4179 59.4327 31.9619 56.1351 31.9619C53.1201 31.9619 51.5187 29.7476 51.5187 25.2254V17.7826H51.0948C50.4823 17.7826 49.964 17.2643 49.964 16.6522C49.964 15.9926 50.4349 15.5214 51.0474 15.4743H51.0948C53.6385 15.4743 54.7219 14.2967 55.4755 12.177C55.8524 11.0935 56.4648 10.5281 57.1714 10.5281C57.878 10.5281 58.2078 11.0935 58.2078 11.9413C58.2078 13.4957 58.0666 14.4379 58.0192 15.4743H59.9037C60.5161 15.4743 61.0812 15.9926 61.0812 16.6522C61.0812 17.2643 60.5161 17.7826 59.9037 17.7826Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M71.7746 22.3991L71.1151 22.6818C69.5604 23.5298 68.9953 25.1784 68.9953 26.4974C68.9953 27.9106 69.5133 28.6643 70.5026 28.6643C71.4448 28.6643 72.4812 27.5808 72.0099 24.142L71.7746 22.3991ZM76.6737 31.7263C74.0829 31.7263 73.1407 30.5958 72.8109 29.0411C71.7275 30.6428 69.9843 31.6792 67.6762 31.6792C64.5201 31.6792 62.4474 30.1719 62.4474 27.722C62.4474 25.414 64.2845 23.7652 67.535 22.5876C70.8794 21.3627 71.4448 20.8917 71.4448 20.0907C71.1621 17.7827 70.9268 16.7934 70.2673 16.7934C69.7019 16.7934 69.4662 17.5941 69.1365 18.9132C68.7597 20.4678 67.7233 21.5513 65.8392 21.4098C64.1433 21.3627 63.2481 20.0907 63.5779 18.5363C64.1433 16.1809 66.734 14.8148 70.5026 14.8148C75.3075 14.8148 77.6156 16.8875 78.181 20.9859C78.6052 23.9064 78.9817 27.1099 79.1232 27.722C79.3118 28.8528 79.5942 29.0882 80.4423 29.3708C81.0547 29.512 81.1488 30.1245 80.6776 30.5484C80.1125 31.0667 78.6052 31.7263 76.6737 31.7263Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M82.6559 20.2322C81.9964 19.6671 81.6666 19.3844 81.6666 18.7719C81.6666 18.0653 82.185 17.547 84.5871 16.2279C87.084 14.8618 88.1675 14.4379 89.0626 14.4379C89.8163 14.4379 90.146 14.8618 90.146 15.7099C90.146 16.0397 90.0987 16.4165 90.0516 16.9348C91.2292 15.6628 92.7838 14.815 94.5739 14.815C97.6359 14.815 98.2012 16.9816 98.6251 21.0799C98.9075 23.9066 99.1905 25.9793 99.3788 27.2984C99.6144 28.523 100.038 29.0884 100.886 29.3237C101.452 29.4652 101.546 30.0774 101.122 30.5016C100.462 31.1137 98.8608 31.7262 96.9763 31.7262C94.0088 31.7262 93.0195 30.5016 92.8783 28.052C92.7368 26.3091 92.6426 24.7544 92.5011 21.9751C92.407 18.9605 92.2187 17.7826 91.3707 17.7826C90.3814 17.7826 89.9575 19.9495 89.9104 22.7758V27.1098C89.9104 28.7113 90.8526 29.3237 90.8526 30.2659C90.8526 31.2552 89.3921 31.7262 86.8955 31.7262H86.4716C83.975 31.7262 82.4673 31.2552 82.4673 30.2659C82.4673 29.3237 83.4096 28.7113 83.4096 27.1098V24.7544C83.4096 21.7868 83.4096 20.9387 82.6559 20.2322Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M110.921 17.7826H109.036V23.7651C109.036 26.5915 109.272 27.3455 110.261 27.3455C111.015 27.3455 111.203 26.9213 111.486 26.5915C112.004 26.0261 112.57 26.2617 112.334 27.1569C111.769 29.4179 110.449 31.9619 107.152 31.9619C104.137 31.9619 102.536 29.7476 102.536 25.2254V17.7826H102.112C101.499 17.7826 100.981 17.2643 100.981 16.6522C100.981 15.9926 101.452 15.5214 102.065 15.4743H102.112C104.656 15.4743 105.739 14.2967 106.493 12.177C106.869 11.0935 107.482 10.5281 108.189 10.5281C108.895 10.5281 109.225 11.0935 109.225 11.9413C109.225 13.4957 109.084 14.4379 109.036 15.4743H110.921C111.533 15.4743 112.098 15.9926 112.098 16.6522C112.098 17.2643 111.533 17.7826 110.921 17.7826Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M113.936 12.0827C113.323 11.6117 112.946 11.329 112.946 10.7166C112.946 10.01 113.794 9.49165 116.244 8.1729C118.693 6.85385 119.777 6.47702 120.625 6.47702C121.426 6.47702 121.85 6.94798 121.85 7.70163C121.85 8.73799 121.473 10.01 121.473 15.5686V27.1097C121.473 28.7114 122.462 29.3239 122.462 30.2658C122.462 31.2551 121.002 31.7261 118.458 31.7261H118.034C115.49 31.7261 114.03 31.2551 114.03 30.2658C114.03 29.3239 115.019 28.7114 115.019 27.1097V16.6991C115.019 13.6374 114.878 12.8834 113.936 12.0827Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M125.947 21.0801C124.11 16.9817 122.885 17.2644 122.885 15.9928C122.885 15.0032 125.146 14.4851 127.737 14.4851H128.161C130.752 14.4851 132.495 14.9564 132.495 15.9454C132.495 16.8876 131.412 17.4056 131.977 18.8659C132.495 20.4206 133.767 24.095 134.662 26.1207C135.604 23.6711 136.169 21.6455 136.876 19.8084C137.677 17.8298 137.206 17.3586 136.358 16.9817C135.416 16.5578 135.133 16.181 135.133 15.8513C135.133 15.0032 136.075 14.5793 139.043 14.5793C142.152 14.5793 143 14.909 143 15.7098C143 16.3693 140.974 17.2644 140.268 18.9603C138.996 21.9753 138.525 24.0477 136.452 29.1353C134.097 34.9295 132.589 37.0023 128.915 37.0023C126.56 37.0023 124.44 36.1545 123.781 34.1288C123.262 32.5741 124.346 31.1139 126.042 31.1139C127.784 31.1139 128.632 32.1502 128.538 33.6576C128.397 34.8825 128.821 35.4005 129.574 35.4005C130.799 35.4005 131.6 33.8932 130.564 31.4437C129.433 28.8529 126.795 23.0587 125.947 21.0801Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M14.7431 45.534C15.2814 44.3488 15.9279 43.1103 16.4666 41.8173C17.4364 39.6089 17.8133 38.5853 16.9515 37.9388C16.2513 37.5079 16.0357 36.9155 16.0357 36.5921C16.0357 35.7304 17.1131 35.1917 20.5607 35.1917C23.9002 35.1917 24.6004 35.8382 24.6004 36.6462C24.6004 37.8851 21.7455 38.37 20.3988 41.1171C18.6753 44.6722 17.4364 47.2578 16.6281 49.0354V56.8458C16.6281 58.6774 17.9211 60.3472 17.9211 61.4246C17.9211 62.5557 16.0357 63.0943 13.1808 63.0943H12.6424C9.78752 63.0943 7.90216 62.5557 7.90216 61.4246C7.90216 60.3472 9.19479 58.6774 9.19479 56.8458V50.3817C8.11744 47.7424 6.9326 45.2109 6.28613 43.8642C4.34703 39.7164 1.59961 38.2084 1.59961 36.9155C1.59961 35.7844 3.70056 35.1917 6.50142 35.1917H7.36348C10.3262 35.1917 12.5346 35.5688 12.5346 36.6999C12.5346 37.562 11.8341 38.5853 12.2112 39.6089C12.5346 40.6322 13.5042 42.9484 14.7431 45.534Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M38.7666 48.2274C37.4739 41.6555 35.9116 37.5079 33.8647 37.8313C31.8178 38.1544 32.7337 47.15 33.2186 50.0049C34.2956 56.2534 36.3966 60.8318 38.3357 60.455C40.0054 60.1854 40.0054 54.3681 38.7666 48.2274ZM48.3008 49.1432C48.3008 58.1385 43.2375 63.4174 36.0194 63.4174C28.8014 63.4174 23.738 58.1385 23.738 49.1432C23.738 40.0935 28.8014 34.8686 36.0194 34.8686C43.2375 34.8686 48.3008 40.0935 48.3008 49.1432Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M61.1205 63.3636C55.0336 63.3636 50.563 60.7242 50.563 52.3751V41.3863C50.563 39.555 49.27 37.8849 49.27 36.8076C49.27 35.6765 51.2091 35.1378 54.0103 35.1378H54.549C57.4039 35.1378 59.2892 35.6765 59.2892 36.8076C59.2892 37.8849 57.9963 39.555 57.9963 41.3863V52.3751C57.9963 57.8156 59.1814 59.97 62.0901 59.97C65.2143 59.97 66.1839 57.0613 66.1839 52.3751V41.3863C66.1839 39.555 64.4604 37.8849 64.4604 36.8076C64.4604 35.6765 65.9683 35.1378 68.2849 35.1378H68.6617C70.9779 35.1378 72.5402 35.6765 72.5402 36.8076C72.5402 37.8849 70.8164 39.555 70.8164 41.3863V52.3751C70.8164 58.5158 68.2311 63.3636 61.1205 63.3636Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M89.0219 44.1874C89.0219 41.4403 88.591 38.4238 84.282 38.4238C82.6656 38.4238 82.6656 38.9622 82.6656 41.3862V47.4732C82.6656 49.1429 82.9353 49.5738 84.4435 49.5738C87.9986 49.5738 89.0219 46.8808 89.0219 44.1874ZM96.6171 43.9718C96.6171 47.096 95.1626 49.5201 92.3618 51.0283C93.3851 53.183 94.0853 54.9606 95.8628 57.0612C97.4789 59.0003 98.664 59.2697 99.6336 59.6468C100.495 59.9702 101.088 60.4548 100.98 61.1013C100.872 62.1786 99.2027 63.0944 96.0247 63.0944C92.3077 63.0944 89.7221 61.8015 88.2139 59.2159C85.6283 54.9606 86.2748 52.6981 84.1742 52.6981C83.0968 52.7521 82.6656 53.2367 82.6656 55.1759V56.8459C82.6656 58.6772 83.9586 60.347 83.9586 61.4243C83.9586 62.5557 82.0732 63.0944 79.2183 63.0944H78.6796C75.8788 63.0944 73.9934 62.5557 73.9934 61.4243C73.9934 60.347 75.2323 58.6772 75.2323 56.8459V41.3862C75.2323 39.5549 73.9934 37.8851 73.9934 36.8078C73.9934 35.6767 75.8788 35.138 78.6796 35.138H83.9048C92.5233 35.138 96.6171 38.6391 96.6171 43.9718Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M115.308 46.3958C122.203 48.2274 124.573 51.7285 124.573 55.1221C124.573 60.4011 119.294 63.4175 112.345 63.4175C106.151 63.4175 102.65 60.9394 101.303 57.8155C100.064 54.6375 101.303 52.0516 104.158 51.8363C106.582 51.6748 108.144 52.7521 108.521 55.6067C108.898 58.3001 110.514 60.078 113.153 60.078C115.362 60.078 117.247 58.5694 117.247 56.3073C117.247 54.5834 115.577 52.8599 109.76 51.2436C104.966 49.7894 102.488 47.3654 102.488 43.2716C102.488 38.0467 106.743 34.9224 113.261 34.9224C118.217 34.9224 121.233 37.1849 122.526 40.2014C123.765 43.3256 122.095 45.48 119.186 45.48C117.355 45.48 115.739 44.1333 115.092 41.494C114.608 39.2856 113.584 37.7774 112.238 37.7774C110.298 37.7774 109.49 39.3934 109.49 41.1709C109.49 43.0022 110.514 45.1569 115.308 46.3958Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
                />
                <path
                  d="M6.5556 2.48215L8.84937 0.0611534C8.97204 -0.0682011 9.18976 0.0216789 9.1849 0.199922L9.09532 3.53399C9.09229 3.64543 9.18338 3.73653 9.29482 3.73379L12.6286 3.64391C12.8071 3.63905 12.8973 3.85677 12.7677 3.97945L10.3467 6.27321C10.2659 6.35004 10.2659 6.47878 10.3467 6.55561L12.7677 8.84968C12.8973 8.97235 12.8071 9.18977 12.6286 9.18521L9.29482 9.09533C9.18338 9.09229 9.09229 9.18339 9.09532 9.29483L9.1849 12.6289C9.18976 12.8071 8.97204 12.8973 8.84937 12.768L6.5556 10.3467C6.47878 10.2659 6.35003 10.2659 6.27321 10.3467L3.97944 12.768C3.85676 12.8973 3.63905 12.8071 3.64391 12.6289L3.73379 9.29483C3.73652 9.18339 3.64542 9.09229 3.53398 9.09533L0.199913 9.18521C0.021671 9.18977 -0.0682094 8.97235 0.0611452 8.84968L2.48184 6.55561C2.56291 6.47878 2.56291 6.35004 2.48184 6.27321L0.0611452 3.97945C-0.0682094 3.85677 0.021671 3.63905 0.199913 3.64391L3.53398 3.73379C3.64542 3.73653 3.73652 3.64543 3.73379 3.53399L3.64391 0.199922C3.63905 0.0216789 3.85676 -0.0682011 3.97944 0.0611534L6.27321 2.48215C6.35003 2.56292 6.47878 2.56292 6.5556 2.48215Z"
                  className={`fill-current ${!showHeaderMain ? 'text-[#ffffff]' : 'text-[#FFFFFF]'}`}
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

          <div className="flex gap-x-8 flex-1 justify-end mr-6 z-10">
            <div className="z-[2000]">
              <SearchQuery />
            </div>

            {/* <div className="relative flex justify-center items-center">
              <button onClick={toggleSearch} className="focus:outline-none">
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M31.6 31.6L23.1429 23.1429M14.6857 27.3714C7.67959 27.3714 2 21.6918 2 14.6857C2 7.67959 7.67959 2 14.6857 2C21.6918 2 27.3714 7.67959 27.3714 14.6857C27.3714 21.6918 21.6918 27.3714 14.6857 27.3714Z" stroke="#FFFFFF" stroke-width="3.02041" />
                </svg>
              </button>
              {searchOpen && (
                <div className="absolute -right-2 bg-[#FFFFFF] rounded-full flex">
                  <div className="relative">
                    <input
                      type="text"
                      className="pl-4 pr-[50px] py-2 w-64 text-[#333333] border border-[#333333] rounded-full focus:outline-none"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <button
                      onClick={toggleSearch}
                      className="px-4 py-2 absolute right-0 top-0 bottom-0 bg-[#FBAE36]  text-white rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div> */}
            <button
              onClick={() => { navigate('/cardReview') }
                // cartDatas !== null ? () => dispatch(openCart()) : undefined
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
                  className={`fill-current  ${!showHeaderMain ? 'text-[#FFFFFF]' : 'text-[#FFFFFFF]'}`}
                />
              </svg>

              <div className="rounded-full absolute left-10 bottom-6 h-7 w-7 flex items-center justify-center bg-[#279C66]">
                <span style={{ fontSize: 15 }} className="font-[500] font-regola-pro">
                  {cartDatas !== null ? totalQuantity(cartResponse) : 0}
                </span>
              </div>
            </button>

            {loginUserCustomerId === null &&
              <button className="bg-[#FBAE36] hidden lg:block px-9 rounded-full ">
                <Link className="text-[#FFFFFF] text-[18px] font-regola-pro font-[600] leading-[21.6px] uppercase tracking-widest" to="/login">
                  Login
                </Link>
              </button>}

            {loginUserCustomerId !== null ? (
              <div className="flex items-center space-x-3">
                <hr className="w-px h-full bg-[#000000]  border-none" />
                <UserMenu align="right" />
              </div>
            ) : null}
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
                    height="55"
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
        <div className="relative w-full px-4 md:px-8 z-10 mt-5" >
          <div className="ml-10 banner-text">
            <h1 className={`font-skillet text-[35px] lg:text-[44px] font-[400] sm:leading-[44.4px] leading-[34.4px] ${currentIndex === 0 ? 'text-[#FFFFFF]'
              : currentIndex === 2 ? 'text-[#dfdfdf]'
                : 'text-white'
              } text-left `}>
              {bannerData[currentIndex].title}
            </h1>
            <p className={`font-regola-pro max-w-[600px] text-xl lg:text-[20px] font-normal leading-[24px] text-left ${currentIndex == 0 ? 'text-[#EEEEEE]' : 'text-[#DFDFDF]'}`}>
              {bannerData[currentIndex].description}
            </p>
          </div>
          <div className="flex px-8 subscribe-button pt-4 ml-1">
            <Link to={bannerData[currentIndex].navigationLink} className='flex flex-row py-2 px-4 rounded-[8px] items-center gap-x-3 bg-[#EFE9DA]'>
              <button className="text-[#231F20] font-regola-pro font-[400] text-[20px] leading-[24px] py-1">{bannerData[currentIndex].ctaText}</button>
              <svg width="15" height="11" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.0693 0.624305L23.6407 9.08584C23.8 9.24287 23.9264 9.42937 24.0127 9.63467C24.0989 9.83997 24.1433 10.06 24.1433 10.2823C24.1433 10.5046 24.0989 10.7246 24.0127 10.9299C23.9264 11.1352 23.8 11.3217 23.6407 11.4788L15.0693 19.9403C14.9101 20.0974 14.7211 20.2221 14.5132 20.3071C14.3052 20.3921 14.0823 20.4359 13.8573 20.4359C13.6322 20.4359 13.4093 20.3921 13.2013 20.3071C12.9934 20.2221 12.8044 20.0974 12.6453 19.9403C12.4861 19.7832 12.3598 19.5967 12.2737 19.3914C12.1876 19.1861 12.1432 18.966 12.1432 18.7438C12.1432 18.5216 12.1876 18.3016 12.2737 18.0963C12.3598 17.891 12.4861 17.7045 12.6453 17.5474L18.2904 11.9746L1.85725 11.9746C1.40259 11.9746 0.966559 11.7963 0.64507 11.4789C0.323579 11.1616 0.142966 10.7311 0.142966 10.2823C0.142966 9.83348 0.323579 9.40303 0.64507 9.08566C0.966559 8.76829 1.40259 8.59 1.85725 8.59L18.2904 8.59L12.6453 3.01723C12.4855 2.86043 12.3587 2.674 12.2722 2.46867C12.1857 2.26334 12.1412 2.04315 12.1412 1.82077C12.1412 1.59838 12.1857 1.37819 12.2722 1.17286C12.3587 0.967528 12.4855 0.781102 12.6453 0.624305C12.8043 0.467011 12.9932 0.342225 13.2012 0.257083C13.4092 0.171943 13.6321 0.128118 13.8573 0.128118C14.0824 0.128118 14.3053 0.171943 14.5133 0.257083C14.7213 0.342225 14.9102 0.467012 15.0693 0.624305Z"
                  fill="#1D1929" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className={`pb-10 bg-[#EFE9DA] grid grid-cols-2 md:grid-cols-4 overflow-x-hidden`}>
        {
          categoryData?.map((item, i) => (
            <div
              key={item?.node?.id}
              onClick={() => { dispatch(addCategoryData(item)); navigate('/products'); }}
              style={{ background: `${colorCategory[i]}` }}
              className={`product-box group relative p-4 w-[50vw] md:w-[25vw] h-[120px] flex items-center cursor-pointer overflow-visible transition-transform duration-200`}
            >
              <div className="relative">
                <img
                  src={item?.node?.image?.originalSrc}
                  alt=""
                  className='md:h-[80px] rounded-full md:w-[80px] h-[60px] w-[60px] transition-transform duration-200 group-hover:scale-150 group-hover:translate-y-4 ml-[10px]'
                />
              </div>
              <p
                className={`transition-transform duration-200 ${i === 0 ? 'text-[#231F20]' : 'text-[#FFFFFF]'} pl-5 text-xl lg:text-[40px] font-skillet rounded-lg group-hover:translate-x-2`}
              >
                {item?.node?.title}
              </p>
              <div className={`group-hover:block hidden pl-4 transition-transform duration-400 ${i === 0 ? 'text-[#231F20]' : 'text-[#FFFFFF]'} group-hover:translate-x-1`}>
                <svg width="25" height="21" className="fill-current" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.0693 0.624305L23.6407 9.08584C23.8 9.24287 23.9264 9.42937 24.0127 9.63467C24.0989 9.83997 24.1433 10.06 24.1433 10.2823C24.1433 10.5046 24.0989 10.7246 24.0127 10.9299C23.9264 11.1352 23.8 11.3217 23.6407 11.4788L15.0693 19.9403C14.9101 20.0974 14.7211 20.2221 14.5132 20.3071C14.3052 20.3921 14.0823 20.4359 13.8573 20.4359C13.6322 20.4359 13.4093 20.3921 13.2013 20.3071C12.9934 20.2221 12.8044 20.0974 12.6453 19.9403C12.4861 19.7832 12.3598 19.5967 12.2737 19.3914C12.1876 19.1861 12.1432 18.966 12.1432 18.7438C12.1432 18.5216 12.1876 18.3016 12.2737 18.0963C12.3598 17.891 12.4861 17.7045 12.6453 17.5474L18.2904 11.9746L1.85725 11.9746C1.40259 11.9746 0.966559 11.7963 0.64507 11.4789C0.323579 11.1616 0.142966 10.7311 0.142966 10.2823C0.142966 9.83348 0.323579 9.40303 0.64507 9.08566C0.966559 8.76829 1.40259 8.59 1.85725 8.59L18.2904 8.59L12.6453 3.01723C12.4855 2.86043 12.3587 2.674 12.2722 2.46867C12.1857 2.26334 12.1412 2.04315 12.1412 1.82077C12.1412 1.59838 12.1857 1.37819 12.2722 1.17286C12.3587 0.967528 12.4855 0.781102 12.6453 0.624305C12.8043 0.467011 12.9932 0.342225 13.2012 0.257083C13.4092 0.171943 13.6321 0.128118 13.8573 0.128118C14.0824 0.128118 14.3053 0.171943 14.5133 0.257083C14.7213 0.342225 14.9102 0.467012 15.0693 0.624305Z"
                    fill="currentColor" />
                </svg>
              </div>
            </div>
          ))
        }
      </div>


      <div className="bg-[#EFE9DA] mt-5">
        <div className='section-title flex flex-row px-4 md:px-14 lg:pl-15 items-center'>
          <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.1258 38.223C63.4723 53.1821 50.8158 64.7793 35.8568 64.1258C20.8977 63.4723 9.3007 50.8162 9.95398 35.8568C10.6075 20.8977 23.2636 9.30074 38.2227 9.95421C53.182 10.6075 64.7792 23.2639 64.1258 38.223Z" fill="#F15E2A" />
            <path d="M32.8251 41.104C32.2105 40.433 31.9758 40.1254 31.9933 39.7298C32.0276 38.9389 32.8899 38.4813 36.0615 37.3315C38.6842 36.257 39.536 36.0466 40.2282 36.077C40.8215 36.1026 41.1977 36.5651 41.1498 37.6528C41.1005 38.7901 40.8271 40.5125 40.6174 45.3082L40.4554 49.0167C40.3821 50.6981 41.3431 51.3841 41.2995 52.3729C41.2543 53.4117 39.6503 53.8367 37.0793 53.7243L36.5844 53.7028C33.964 53.5885 32.4033 53.0249 32.4486 51.9864C32.4919 50.9978 33.5587 50.4001 33.6321 48.7191L33.7378 46.2962C33.9059 42.4394 33.8138 42.2865 32.8251 41.104Z" fill="#FBAE36" />
            <path d="M37.8018 23.0008L40.3205 20.5648C40.4552 20.4345 40.6794 20.5391 40.6661 20.7258L40.4193 24.2213C40.4111 24.3382 40.5026 24.4381 40.6193 24.4402L44.1232 24.4985C44.3106 24.502 44.3953 24.7345 44.2536 24.857L41.6073 27.1542C41.519 27.2306 41.5127 27.3663 41.5945 27.4502L44.0304 29.9694C44.1607 30.1041 44.0561 30.3283 43.8691 30.3152L40.374 30.0677C40.2568 30.0597 40.1572 30.151 40.155 30.2682L40.0965 33.7718C40.0935 33.9593 39.8608 34.0438 39.7377 33.9024L37.4413 31.256C37.3641 31.1677 37.2289 31.1616 37.1448 31.2431L34.6259 33.6788C34.4912 33.8091 34.2669 33.705 34.28 33.518L34.5273 30.0226C34.5354 29.9054 34.444 29.8058 34.3268 29.8036L30.8232 29.7451C30.6357 29.7421 30.5509 29.5096 30.6925 29.3868L33.339 27.0899C33.4274 27.013 33.4334 26.8775 33.3524 26.7935L30.9158 24.2747C30.7856 24.14 30.8903 23.9153 31.0772 23.9289L34.5727 24.1757C34.6895 24.1844 34.7897 24.0927 34.7914 23.9754L34.8499 20.4718C34.8531 20.2846 35.0856 20.1998 35.2084 20.3414L37.5051 22.9876C37.5822 23.0764 37.7172 23.0822 37.8018 23.0008Z" fill="#FBAE36" />
          </svg>
          <p className='text-[#231F20] font-skillet px-1 py-4 text-3xl lg:text-[48px] font-[400] lg:leading-[48.43px]'>Fan Favourites</p>
        </div>
        <div className="w-full">
          <div className='product-slider pt-9 pb-14 overflow-x-auto scrollbar-hide lg:ml-[90px] ml-[10px] cursor-pointer'>
            <div className='flex flex-row justify-around  md:justify-start md:mx-5 lg:mx-10  gap-x-2 gap-y-4'>
              {apiResponse?.map((item, i) => (
                <div key={i} className='flex flex-col justify-between lg:justify-start pr-4 pl-4'>
                  <div
                    style={{ background: `${colors[i % colors.length]}` }}
                    onClick={() => { navigate(`/product-details/${item?.node?.handle}`) }}
                    className='relative flex justify-center items-center rounded-2xl w-[110px] h-[151px] sm:w-[150px] sm:h-[180px] md:w-[170px] md:h-[201px] overflow-visible'
                  >
                    <div
                      className='w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[191px] md:h-[195.62px] object-fill'
                      style={{
                        position: 'absolute',
                        top: '51%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%'
                      }}
                    >
                      <img
                        src={item?.node?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc}
                        alt=""
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <p className='text-[#231F20] text-base font-regola-pro md:text-[20px] font-[600] leading-[24px] pt-4 max-w-[140px]'>
                    {item?.node?.title}
                  </p>

                  <p className='text-[#757575] text-[18px] font-bold leading-[21.6px] pt-1 font-regola-pro'>
                    ₹ {item?.node?.priceRange?.minVariantPrice?.amount}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="bg-[#EFE9DA] sm:mt-0 mt-10">
        <div className='section-title flex flex-row px-4 md:px-14 lg:pl-15 items-center'>
          <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.1258 38.223C63.4723 53.1821 50.8158 64.7793 35.8568 64.1258C20.8977 63.4723 9.3007 50.8162 9.95398 35.8568C10.6075 20.8977 23.2636 9.30074 38.2227 9.95421C53.182 10.6075 64.7792 23.2639 64.1258 38.223Z" fill="#F15E2A" />
            <path d="M32.8251 41.104C32.2105 40.433 31.9758 40.1254 31.9933 39.7298C32.0276 38.9389 32.8899 38.4813 36.0615 37.3315C38.6842 36.257 39.536 36.0466 40.2282 36.077C40.8215 36.1026 41.1977 36.5651 41.1498 37.6528C41.1005 38.7901 40.8271 40.5125 40.6174 45.3082L40.4554 49.0167C40.3821 50.6981 41.3431 51.3841 41.2995 52.3729C41.2543 53.4117 39.6503 53.8367 37.0793 53.7243L36.5844 53.7028C33.964 53.5885 32.4033 53.0249 32.4486 51.9864C32.4919 50.9978 33.5587 50.4001 33.6321 48.7191L33.7378 46.2962C33.9059 42.4394 33.8138 42.2865 32.8251 41.104Z" fill="#FBAE36" />
            <path d="M37.8018 23.0008L40.3205 20.5648C40.4552 20.4345 40.6794 20.5391 40.6661 20.7258L40.4193 24.2213C40.4111 24.3382 40.5026 24.4381 40.6193 24.4402L44.1232 24.4985C44.3106 24.502 44.3953 24.7345 44.2536 24.857L41.6073 27.1542C41.519 27.2306 41.5127 27.3663 41.5945 27.4502L44.0304 29.9694C44.1607 30.1041 44.0561 30.3283 43.8691 30.3152L40.374 30.0677C40.2568 30.0597 40.1572 30.151 40.155 30.2682L40.0965 33.7718C40.0935 33.9593 39.8608 34.0438 39.7377 33.9024L37.4413 31.256C37.3641 31.1677 37.2289 31.1616 37.1448 31.2431L34.6259 33.6788C34.4912 33.8091 34.2669 33.705 34.28 33.518L34.5273 30.0226C34.5354 29.9054 34.444 29.8058 34.3268 29.8036L30.8232 29.7451C30.6357 29.7421 30.5509 29.5096 30.6925 29.3868L33.339 27.0899C33.4274 27.013 33.4334 26.8775 33.3524 26.7935L30.9158 24.2747C30.7856 24.14 30.8903 23.9153 31.0772 23.9289L34.5727 24.1757C34.6895 24.1844 34.7897 24.0927 34.7914 23.9754L34.8499 20.4718C34.8531 20.2846 35.0856 20.1998 35.2084 20.3414L37.5051 22.9876C37.5822 23.0764 37.7172 23.0822 37.8018 23.0008Z" fill="#FBAE36" />
          </svg>
          <p className='text-[#231F20] font-skillet px-1 py-4 text-3xl lg:text-[48px] font-[400]'>Instantly Yours Promises Instant, Hygienic Meals</p>
        </div>

        <div className="relative bg-cover bg-right bg-no-repeat 2xl:h-[509px] md:h-[509px] md:ml-[10px] lg:ml-[135px] md:rounded-l-lg flex flex-col justify-center mt-[35px]">
          <img src={middleImg} className="h-[509px] w-full object-cover md:rounded-l-lg" style={{ zIndex: 1 }} />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#000000a6] md:rounded-l-lg w-full md:w-3/5" style={{ zIndex: 2 }}></div>
          <div className="z-10 text-white absolute inset-0 pl-[60px] pb-[280px] pt-[10px] sm:pt-[50px] sm:pl-[60px] info-section">
            <h2 className="text-[36px] text-[#FAFAFA] font-normal leading-[43.57px] mb-4 font-regola-pro">Ready to Eat</h2>
            <div className="w-full md:w-2/5">
              <p className="text-[16px] text-[#CECECE] font-normal font-regola-pro mb-4 leading-[22px]" >
                Need a quick meal that doesn't compromise on taste and feels close to home? Our RTE meals are packed in convenient tear-away pouches. Just heat them up and you’re ready to eat in 2 minutes. Perfect for on-the-go lunches, late-night snacks, or whenever you crave a delicious, homemade meal without any effort.
              </p>
            </div>
            <button className="bg-white text-[#333333] mt-1 py-2 px-10 rounded font-regola-pro font-[300] text-[16px]" onClick={() => { navigate('/ready-to-eat') }}>DISCOVER</button>
            <div className="pt-[80px]">
              <div
                className={`${fadeIn ? 'opacity-0 translate-x-[-50px]' : 'opacity-100 translate-x-0'
                  } transition-all duration-500 ease-in-out`}
              >
                <Rating rating={reviews[currentReviewIndex]?.rating} text={""} color="#FFFFFF" emptyColor="#FFFFFF" />
                <h1 className="text-[#EBEBEB] text-[20px] leading-[24px] pt-3 font-[400] font-regola-pro ">{reviews[currentReviewIndex]?.name}</h1>
                <p className="text-[#EBEBEB] text-[14px] leading-[16.8px] pt-1 font-[300] font-regola-pro ">{reviews[currentReviewIndex]?.text}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex coverImage flex-col md:flex-row h-auto md:h-[509px] md:mt-[50px] md:mr-[70px] lg:mr-[127px] md:rounded-r-lg mb-[80px]">
          <div className="w-full relative md:w-3/5 flex-shrink-0 md:h-[300px] h-auto md:h-full order-2 md:order-1">
            <div className="relative w-full h-full">
              <img src={rtcImg} className="rtcimg" alt="" />
              <div className="absolute top-[40%] left-[35%] md:top-[160px] md:left-[300px]">
                <Tooltip message={":sparkles: Coming soon!"} data={tooltipData}>
                  <div className="cursor-pointer img-svg">
                    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="34.3278" cy="33.9938" r="33.6715" fill="#A6A6A6" fillOpacity="0.45" />
                      <circle cx="34.3277" cy="33.9937" r="20.2029" fill="#D1D1D1" />
                    </svg>
                  </div>
                </Tooltip>
              </div>
              <div className="absolute bottom-[35%] right-[25%] md:bottom-[150px] md:left-[480px]">
                <Tooltip message={":sparkles: Coming soon!"} data={tooltipData}>
                  <div className="cursor-pointer img-svg">
                    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="34.3278" cy="33.9938" r="33.6715" fill="#A6A6A6" fillOpacity="0.45" />
                      <circle cx="34.3277" cy="33.9937" r="20.2029" fill="#D1D1D1" />
                    </svg>
                  </div>
                </Tooltip>
              </div>
              <div className="absolute bottom-[22%] left-[47%] md:bottom-[60px] md:left-[360px]">
                <Tooltip message={":sparkles: Coming soon!"} data={tooltipData}>
                  <div className="cursor-pointer img-svg">
                    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="34.3278" cy="33.9938" r="33.6715" fill="#A6A6A6" fillOpacity="0.45" />
                      <circle cx="34.3277" cy="33.9937" r="20.2029" fill="#D1D1D1" />
                    </svg>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="relative w-full md:w-2/5 flex flex-col items-center md:items-end md:rounded-r-lg px-4 md:px-0 md:pr-[60px] pt-[30px] md:pt-[50px] order-1 md:order-2">
            <div className="absolute top-0 left-0 right-0 h-10 md:hidden"></div>
            <h2 className="font-regola-pro text-[28px] font-normal leading-tight md:leading-[43.57px] text-center md:text-right text-[#333333] mb-4 md:text-[36px]">
              Ready to Cook
            </h2>
            <div className="w-full flex flex-col items-center md:items-end">
              <p className="font-regola-pro text-[14px] md:text-[16px] font-normal md:leading-[22px] text-center md:text-right md:pl-4 text-[#333333D9] mb-4">
                Love cooking but short on time? Give our DIY cooking kits a try! Each kit comes with pre-measured ingredients and easy-to-follow instructions. This allows you to make a gourmet meal in under 7 minutes. Enjoy the fun of cooking without the prep work or cleanup. Perfect for busy weeknights or when you want to impress without the stress.
              </p>
            </div>
            <button className="bg-white text-[#333333] mt-1 py-2 px-5 rounded font-regola-pro text-[16px] font-light text-center" onClick={() => { navigate('/ready-to-cook') }}>
              VIEW PRODUCTS
            </button>
          </div>
        </div>
      </div>

      <div className='w-full bannerbottom h-[759px] overflow-hidden relative spin-banner-area'>
        <div className='absolute top-10 left-5 lg:left-[127px] z-20 spin-banner-area-div'>
          <p className='text-white text-[40px] font-skillet lg:text-[70px] pt-6 lg:leading-[78.27px] leading-[40px] font-[400] title'>
            Not Sure What to Eat?
          </p>
          <p className='text-[#000] text-[30px] lg:text-[51.72px] lg:leading-[62px] leading-[25px] font-regola-pro font-[300] sub-title'>
            Give it a Spin!
          </p>
        </div>
        <div className='relative z-10 flex justify-end items-center mt-10 lg:mt-5 lg:pt-7 lg:ml-auto md:right-[-60px] xl:right-[-80px] 2xl:right-[-120px] spin-section'>
          <div className='relative right-[-38px] top-[-15px] z-[-1] mt-2 spin-content'>
            <div
              className='flex cursor-pointer flex-row py-2 pl-2 pr-10 rounded-full items-center gap-x-3 bg-[#FFFFFF] h-[76px] w-[300px] btn-spin'
              onMouseMove={handleMouseMoves}
              onMouseUp={handleMouseUps}
              style={{
                boxShadow: '0px 4px 22.7px 0px #0000001F inset',
                position: 'relative',
              }}
            >
              <div
                className='lg:h-[60px] lg:w-[60px] rounded-full bg-[#FBAE36] h-10 w-10'
                style={{
                  position: 'absolute',
                  left: `${8 + positionX}px`,
                  cursor: 'grab',
                  top: '8px',
                  bottom: '8px',
                  transition: isDragging ? 'none' : 'left 0.3s ease',
                }}
                onMouseDown={handleMouseDowns}
              ></div>

              <div className="pl-[76px]">
                <button className='text-[#B25220] text-[20px] md:text-[36px] font-[500] leading-[43.2px] font-regola-pro spin-btn'>
                  {`Spin >>`}
                </button>
              </div>
            </div>
            <div className="absolute spin-product-info">
              <div className="spin-product-info-text h-[175px]">
                <p className='text-[#FFFFFF] text-lg pr-[50px] lg:text-[42.06px] mt-4 w-[350px] font-[600] leading-[50.47px] font-regola-pro mb-3'
                  style={{ textShadow: '0px 4px 9.9px #00000040' }}>
                  {selecteRandomPro?.node?.title}
                </p>

                <p className='text-[#FFFFFF] text-lg lg:text-[37.85px] font-[400] leading-[45.42px] font-regola-pro mt-4 mb-3'>
                  ₹ {selecteRandomPro?.node?.priceRange?.minVariantPrice?.amount}
                </p>
              </div>
              <button
                type='button'
                className='w-[202px] bg-[#FFFFFF] mt-2 rounded-[8px] py-1 px-4 text-[#231F20] h-[49px] lg:text-[24px] font-[500] leading-[28.8px] font-regola-pro cart-btn'
              >
                Add to cart
              </button>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              ref={imgRef}
              onMouseDown={handleMouseDown}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: rotation }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.8 }}
            >
              <img
                src={selecteRandomPro?.node?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc}
                alt=''
                className='lg:h-[676px] lg:w-[676px] h-[250px] w-[250px] rounded-full'
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>


      {/* <div className='w-full bannerbottom h-[759px] overflow-hidden'>
        <div className=''>
          <div className='flex flex-col lg:flex-row '>
            <div className='md:ml-[127px] ml-5 mt-10'>
              <p className='text-white text-[40px] font-skillet lg:text-[70px] pt-6 lg:leading-[78.27px] leading-[40px] font-[400] '>
                Not Sure What to Eat?
              </p>
              <p className='text-[#000] text-[30px] lg:text-[51.72px] lg:leading-[62px] leading-[25px] font-regola-pro font-[300]'>
                Give it a Spin!
              </p>
            </div>
            <div className='flex relative z-10 justify-end items-center mt-10 lg:mt-5 lg:right-0 right-0 lg:pt-7 lg:ml-auto md:right-[-60px] xl:right-[-80px] 2xl:right-[-120px]'>
              <div className='relative right-[-38px] top-[70px] z-[-1] mt-2'>
                <div
                  className='flex cursor-pointer flex-row py-2 pl-2 pr-10 rounded-full items-center gap-x-3 bg-[#FFFFFF] w-[220px]'
                  onClick={handleSpinClick}
                  style={
                    {
                      boxShadow: "0px 4px 22.7px 0px #0000001F inset"

                    }
                  }
                >
                  <div className='lg:h-[60px] lg:w-[60px] rounded-full bg-[#FBAE36] h-10 w-10'></div>
                  <button className="text-[#B25220] text-[20px] md:text-[28px] font-[500] leading-[40px] font-regola-pro">
                    {`Spin >>`}
                  </button>
                </div>
                <p className='text-[#FFFFFF] text-lg pr-[50px] lg:text-[24px] mt-4 max-w-[190px] font-[600] leading-[30px] font-regola-pro'>
                  {selecteRandomPro?.node?.title}
                </p>
                <p className='text-[#FFFFFF] text-lg lg:text-[24px] font-[400] leading-[30px] font-regola-pro'>
                  ₹ {selecteRandomPro?.node?.priceRange?.minVariantPrice?.amount}
                </p>
                <button
                  type='button'
                  className="w-[202px] bg-[#FFFFFF] mt-2 rounded-[8px] py-1 px-4 text-[#231F20] h-[49px] lg:text-[24px] font-[500] leading-[28.8px] font-regola-pro"
                >
                  Add to cart
                </button>
              </div>

              <AnimatePresence>
                <motion.div
                  ref={imgRef}
                  onMouseDown={handleMouseDown}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: rotation }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.8 }}
                >
                  <img
                    src={selecteRandomPro?.node?.featuredImage?.url}
                    alt=""
                    className='lg:h-[660px] h-[250px]'
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div> */}


      <div className="bg-[#EFE9DA] p-10">
        <div className="container mx-auto md:pt-14">
          <div className="flex flex-col md:flex-row items-start">
            <div className="flex flex-col w-full">
              <p className="font-regola-pro text-[20px] font-normal leading-[23.2px] text-[#333333]">
                Our Process is
              </p>
              <div className="flex flex-col md:flex-row items-center justify-between w-full mt-4 md:mt-0 process-section-title">
                <span className="font-regola-pro text-[24px] md:text-[36px] font-semibold leading-[28.8px] md:leading-[41.76px] text-[#333333]">
                  Simple, Transparent, and Delicious
                </span>
                <a onClick={() => { navigate(`/how-it-works`) }} class="link cursor-pointer">
                  <span class="text-content font-inter">Learn How It Works</span>
                  <span class="shadow-text font-inter">Learn How It Works</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    class="arrow-icon"
                  >
                    <path
                      d="M12 15.5L18 9.5M18 9.5L12 3.5M18 9.5L3 9.5"
                      stroke="#333333"
                      stroke-width="1.5"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-5">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-6 relative">
                <div className="py-4">
                  <div className="relative">
                    <img
                      src={selectMeal}
                      alt="Select Meal"
                      className="w-[400px] h-[500px] object-cover mb-4 rounded-[8px]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 w-[400px] rounded-bl-[8px] rounded-br-[8px] h-[100px] bg-gradient-to-b from-primary to-secondary flex items-end">
                      <h3 className="p-4 font-regola-pro text-[20px] md:text-[24px] font-semibold leading-[24px] md:leading-[28.8px] mb-8 ml-4 text-white">
                        Select Your Meals
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 px-2 mb-6 relative">
                <div className="py-4">
                  <div className="relative">
                    <img
                      src={recieveBox}
                      alt="Receive Box"
                      className="w-[400px] h-[500px] object-cover mb-4 rounded-[8px]"
                    />
                    <div className="absolute bottom-0 w-[400px] rounded-bl-[8px] rounded-br-[8px] left-0 right-0 h-[100px] bg-gradient-to-b from-primary to-secondary flex items-end">
                      <h3 className="p-4 font-regola-pro text-[20px] md:text-[24px] mb-8 ml-4 font-semibold leading-[24px] md:leading-[28.8px] text-white">
                        Receive Your Box
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 px-2 mb-6 relative">
                <div className="py-4">
                  <div className="relative">
                    <img
                      src={heatEat}
                      alt="Heat and Enjoy"
                      className="w-[400px] h-[500px] object-cover mb-4 rounded-[8px]"
                    />
                    <div className="absolute bottom-0 left-0 w-[400px] rounded-bl-[8px] rounded-br-[8px] right-0 h-[100px] bg-gradient-to-b from-primary to-secondary flex items-end">
                      <h3 className="p-4 font-regola-pro text-[20px] md:text-[24px] mb-8 ml-4 font-semibold leading-[24px] md:leading-[28.8px] text-white">
                        Heat and Enjoy
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>

      <div className="relative bg-center h-[691px] w-full cursor-pointer mb-[-40px]" onMouseDown={handleMouseHold}
        onMouseUp={handleMouseRelease}
        onMouseLeave={handleMouseRelease} >
        <img
          src={currentData?.image}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          style={{ opacity: currentData ? 1 : 0, zIndex: 0 }}
        />
        <div
          className="absolute inset-0 h-[350px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.56) 0%, rgba(0, 0, 0, 0) 100%)",
            zIndex: 1,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-start p-10 rounded-lg z-10">
          <div className="flex pl-8 pt-2 flavour-options-title">
            <h1 className="font-skillet text-[30px] leading-[26px] text-[#FFFFFF] mb-4 
                  md:text-[48px] md:leading-[48.43px] font-[400]">
              What makes us instantly yours
            </h1>
          </div>

          <div className="flex items-start flavour-options-title-text mb-4 md:mt-8 mt-0 flex-col md:flex-row  pl-8">
            <img
              src={noPreservativeWhite}
              alt="Icon"
              className="w-[76px] h-[76px] object-cover"
            />
            <div className="w-full md:w-1/2 ml-5 flavour-options-title-text-content">
              <h2 className="font-skillet text-[26px] leading-[20px] text-[#FFFFFF] mb-2 
                    md:text-[36px] md:leading-[35px] font-[400]">
                {currentData?.title}
              </h2>
              <p className="font-regola-pro text-[14px] leading-[20px] text-[#EBEBEB] 
                   md:text-[18px] md:leading-[24px] font-[500]">
                {currentData?.description}
              </p>
            </div>
          </div>

          <div className="flex flex-grow items-center w-full  md:mt-80 mt-2 pl-8 flavour-options">
            <div className="flex flex-col md:flex-row gap-10">
              {buttonTexts.map((text, index) => (
                <button
                  key={index}
                  className={`relative inline-flex items-center justify-center h-[47px] pt-[9.42px] pr-[22.6px] pb-[9.42px] pl-[22.6px] rounded-[7.53px] text-[#333333] bg-[#FFFFFF] overflow-hidden`}
                  onClick={() => handleButtonClick(index)}
                >
                  <span
                    className={`absolute top-0 left-0 h-full`}
                    style={{
                      height: '100%',
                      borderRadius: '7.53px',
                      width: activeButton === index ? `${progress}%` : '0%',
                      backgroundColor: '#7D7D7DAB',
                      zIndex: 0,
                      transition: 'expand 1s linear',
                    }}
                  />
                  <span className="relative z-10 font-regola-pro text-[14px] font-[600] leading-[16px] text-[#333333] text-left
                             md:text-[16.95px] md:leading-[20.34px]">
                    {text}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="pt-16 mb-12">
        <div className="px-8 sm:mx-5 mx-0 pt-10">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/5 mb-10">
              <h2 className="md:text-[48px] md:leading-[37px] font-[400] text-[30px] leading-[22px] font-skillet text-[#333333]">
                Your Health is Our Priority
              </h2>
              <p className="md:text-[23px] md:leading-[37px] text-[19px] leading-[20px] text-[#757575] font-[500] font-regola-pro">
                Don’t Believe Us, Believe Our Happy Customers
              </p>
            </div>
            {/* <div className="w-full md:w-2/5 flex flex-row justify-between items-start mb-10">
              <div className="text-center">
                <h3 className="md:text-[32px] md:leading-[38.4px] text-[22px] leading-[24px] font-[600] text-[#FB7D36] font-regola-pro">9/10</h3>
                <p className="text-[16px] md:text-[24px] md:leading-[28.8px] leading-[20px] text-[#333333] font-regola-pro font-[600]">Packaging</p>
              </div>
              <div className="text-center">
                <h3 className="md:text-[32px] md:leading-[38.4px] text-[22px] leading-[24px] font-[600] text-[#FB7D36] font-regola-pro">10/10</h3>
                <p className="text-[16px] md:text-[24px] md:leading-[28.8px] leading-[20px] text-[#333333] font-regola-pro font-[600]">Products</p>
              </div>
              <div className="text-center">
                <h3 className="md:text-[32px] md:leading-[38.4px] text-[22px] leading-[24px] font-[600] text-[#FB7D36] font-regola-pro">9/10</h3>
                <p className="text-[16px] md:text-[24px] md:leading-[28.8px] leading-[20px] text-[#333333] font-regola-pro font-[600]">Service</p>
              </div>
            </div> */}
          </div>

        </div>

        <div className="sm:pl-[45px] pl-0 relative w-full">
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => {
                return (
                  <div
                    key={testimonial.id}
                    className="md:w-[48%] lg:w-[31%] w-[98%] p-5 h-[229px] flex-shrink-0 mx-[1.1%] rounded-[11.06px] flex flex-col relative"
                    style={{ backgroundColor: getBackgroundColor(index) }}
                  >
                    <div className="flex flex-col mb-[10px] pt-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="58" className="absolute top-6 left-4" height="44" viewBox="0 0 58 44" fill="none">
                        <path d="M0 43.7216V32.2159C0 28.7216 0.617898 25.0142 1.85369 21.0938C3.1321 17.1307 4.96449 13.3168 7.35085 9.65199C9.77983 5.9446 12.6989 2.72727 16.108 0L24.2898 6.64773C21.6051 10.483 19.2614 14.4886 17.2585 18.6648C15.2983 22.7983 14.3182 27.2301 14.3182 31.9602V43.7216H0ZM32.7273 43.7216V32.2159C32.7273 28.7216 33.3452 25.0142 34.581 21.0938C35.8594 17.1307 37.6918 13.3168 40.0781 9.65199C42.5071 5.9446 45.4261 2.72727 48.8352 0L57.017 6.64773C54.3324 10.483 51.9886 14.4886 49.9858 18.6648C48.0256 22.7983 47.0455 27.2301 47.0455 31.9602V43.7216H32.7273Z" fill="white" fill-opacity="0.45" />
                      </svg>
                      <p className="font-regola-pro leading-[30px] py-1 pl-[65px] pr-[45px] text-[20px] md:text-[24px] font-[500] text-[#FFFFFF]">
                        {testimonial.text}
                      </p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="58" height="44" className="absolute top-20 right-4" viewBox="0 0 58 44" fill="none">
                        <path d="M57.0166 8.39233e-05V11.5058C57.0166 15.0001 56.3987 18.7075 55.1629 22.6279C53.8845 26.591 52.0521 30.4049 49.6657 34.0697C47.2368 37.7771 44.3177 40.9944 40.9086 43.7217L32.7268 37.074C35.4115 33.2387 37.7552 29.233 39.7581 25.0569C41.7183 20.9234 42.6984 16.4916 42.6984 11.7615V8.39233e-05H57.0166ZM24.2893 8.39233e-05V11.5058C24.2893 15.0001 23.6714 18.7075 22.4356 22.6279C21.1572 26.591 19.3248 30.4049 16.9385 34.0697C14.5095 37.7771 11.5905 40.9944 8.18137 43.7217L-0.000442505 37.074C2.68422 33.2387 5.02796 29.233 7.0308 25.0569C8.99103 20.9234 9.97115 16.4916 9.97115 11.7615V8.39233e-05H24.2893Z" fill="white" fill-opacity="0.45" />
                      </svg>
                    </div>
                    <div className="flex justify-between mt-auto pb-3 px-5">
                      <p className="font-regola-pro font-[400] md:text-[20px] text-[18px] leading-[24px] text-[#FFFFFF]">{testimonial.reviewerName}</p>

                      <Tooltip data={testimonial.typeformMessage} style={`bottom-3 ${index === isLastInRow ? '-left-[70px]' : 'lg:left-6 -left-[100px]'}  px-8`} >
                        <p className="font-regola-pro font-[400] md:text-[20px] text-[18px] leading-[24px] cursor-pointer text-[#FFFFFF]">{testimonial.typeform}</p>
                      </Tooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex sm:justify-end justify-center pt-8 sm:pr-[60px] pr-0">
            <div className="flex gap-3 testimonial-navigation">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                type="button"
                className="text-lg px-5 py-[14px] bg-[#5F5F5F] text-[#FFFFFF] rounded-full w-50 h-50"
                disabled={currentSlide === 0} // Disable button if on the first slide
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.77066 1.4717L4.18733 4.05503H13.3029V5.77726H4.18733L6.77066 8.36059L5.55286 9.57838L0.890625 4.91615L5.55286 0.253906L6.77066 1.4717Z" fill="white" />
                </svg>

              </button>
              {/* Next Button */}
              <button
                onClick={nextSlide}
                type="button"
                className="text-lg px-5 py-[14px] bg-[#5F5F5F] text-[#FFFFFF] rounded-full w-50 h-50"
                disabled={currentSlide >= Math.ceil(totalSlides - slidesPerView)}
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.64062 0.253906L13.3029 4.91615L8.64062 9.57838L7.42283 8.36059L10.0062 5.77726H0.890625V4.05503H10.0062L7.42283 1.4717L8.64062 0.253906Z" fill="white" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>


      <div className='bg-[#EFE9DA] relative mt-12 mb-[-113px]'>
        <div className="relative bg-custom-image-footer flex flex-col lg:flex-row">
          {/* <div className="absolute -z-10 inset-0 bg-gradient-to-l from-transparent to-[#000000a6] rounded-l-lg"></div> */}
          <div className="w-full lg:w-1/4 p-6 lg:p-14 lg:pt-20 text-section text-white flex flex-col justify-between">
            <div>
              <h2 className="font-[600] text-[36px] leading-[36.72px] text-left font-regola-pro">
                Explore Our
              </h2>
              <h2 className="font-[600] text-[36px] leading-[36.72px] text-left font-regola-pro whitespace-nowrap">
                Diverse Recipes
              </h2>

              <p className="font-[300] text-[16px] leading-[22px] text-[#FDFDFD] mt-4 font-regola-pro">
                Discover the freshest, ready-to-eat meals made for every taste and lifestyle
              </p>
            </div>
            <button className="hidden lg:flex bg-white mb-[35px] text-[#333333] py-2 px-8 font-[300] font-regola-pro text-[16px] rounded lg:self-start self-center" onClick={() => { navigate('/recipe-list') }}>View all recipes</button>
          </div>
          <div className="w-full lg:min-w-3/4 lg:pb-[100px] lg:pt-20 pl-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-x-5">
            {recipeList?.map((recipe) => (
              <div key={recipe?.id} className="relative min-w-[250px] md:min-w-[300px]">
                {/* Image container */}
                <div className="relative min-w-[250px] md:min-w-[300px] h-[300px] md:h-[350px]" >
                  <img
                    src={recipe?.imageUrl}
                    alt={recipe?.fields?.find(field => field.key === "name")?.value}
                    className="min-w-[250px] md:min-w-[300px] h-[300px] md:h-[362px] cursor-pointer object-cover"
                    onClick={() => { navigate(`/recipes/${recipe?.handle}`) }}
                  />
                </div>

                <div className="absolute bottom-[-12px] left-0 w-full">
                  <div className="bg-gradient-to-b from-primary to-secondary pt-10">
                    <p className="font-regola-pro text-[#FFFFFF] font-[500] text-[21.75px] leading-[26.1px] px-4 pb-8">
                      {recipe?.fields?.find(field => field.key === "name")?.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 lg:hidden text-center bg-white w-[250px] font-regola-pro my-7 mx-auto text-[#333333] rounded font-[300] text-[16px] py-2 px-5" onClick={() => { navigate('/recipe-list') }}>View all recipes</button>
        </div>
      </div>

    </div >
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
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABECAYAAADkxiXAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkE1QjZGNjZEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkE1QjZGNjVEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjYyMEYwNDA3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjYyMEYwNDE3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5J8dbAAAART0lEQVR42uxdCZgUxRWuRQKYBRHFZQnEAIKiiIKiYszH5QY1iCIeRFCColHBAyFCCIp4EJcYJRjvG4+gxAvFRWRdFUQBMYhIgKBIFjXoKgEMqKhs/t95LU3t657q2Vl2Zrff971vZrqrquv4u+pdVZNTXl5uXCgnJ+eH7xOKe/0MH8PAvcHtwQ3A34A3gJeDx08oKJlvYoopgFxwVzdqoQDmxfi4CVzPuvUjcDPh38bdH1NlqW5EYF6Ej78mSTYds+b7cdfGVFmqEwGY+fj4U5Jk8+NZM6ZdDk7QYHDDgHvLRQbtjllzU9ytMe3qZf0E+dwCngleDF4FXgJAfhh3ZUzVCc6DwXPBZwCMn8RdF1MmgXMjuA+A+b+422LKNHCOJDA/+WlbmpDOA+8HntVs3XvF2dp4tOUYfAwBbwb/BW1ZV9MGWMaL5r9O4NfA96Cd5QFpG0l/NAE/iXTLswWcM+VzGri/B1g06Gw04pEsHLQj8PGKrw9Ow7WD0JYtNQyft4LPl+9ng1uAr1b6g/1QAu4il8bh2s/RH29lvLaOWbMclW3iA6ZH52XpoJ1mvZz7go+pgavjIOv3mQHpDvcBk1Svuse2TsT0jZVre2bpoNVXrv24BoLTblO9gHS7O17LWHDGFFNGypxRZbp98EFeBbnlu7iro9OE4l574GMvcBnEqi0xONMDTArgt5lEMMgK/O4lS8S5ZkckEzue5ql3Rdm6DyD+LMIz2uDj1+Cu4JYmERVVBl4CfgJlLVXyXIiPU6VebZVir0eaEfh8h0oDyvhvwLNbiuzWDdxORAQ+ewV4NnhGqooVAMn2sJ7Hm0QQjXedloQi8J0A6tsh/UI387Xg/QOS5CMNFcGvwQ+intMiji21+d+BaVIcjfxzHfJw7O8CnwheDR4q4x5KOVFC5vCQVvj6gXVrKSrYyVeRhjJQDXxp6ElqI6AIIg7mePDkIFOHr6E3m4QPP0wseZYCPcoqk3zn4OP+CONQhLx9rGc3xUehmFt2C8m7UQByi+uqAfDtjY+7FYVTo/vAIzSbM+r4pqXYJKM+qGMR8vXA95ete1Nxb4hl4Vjku08T3L5IsykJONkXV/kuLcsrXX1IdcicTS1gkg5IAkxSrkmE4j0utjmtkSzjBZlZktX9JPBryOPVpU/EdpxgPftwmVGHJgGmpyTyBXoB+Ro7AJOz+GJHYBqpw3zk28eqY15EYBqZzVzJtmZw9TvEIZ+dpmO2KkSng+8IuDdKllJX4tJ2lHxfGbEeq32D3tkkbIDNI5ZRAH4e+euHAJNAngVuFbFsDvhM5PeXzWDvzyKWs6qS47VbVQGhusD5Bfg98JcB98/FgPa3ZgWG4l+ewrM2yOckAsUxD0WXwfJczuhPyiyh0XoB8rchs01hyLOmBMi/pLUmEYYYFMtwpH+5xPLKOgwEf+zQxu3gx0ImgmqnXQ1Oyn8DwE3QkVQkKGcNCwDpJADDXz/KrHlWms2iODQUhYvKlt+jcTues0wG7gvwiSI+0Jlwp/LMs7gkI10b8EK5dgW4tZL2YSpDSNccvL+IMyPBW5W0l6ItHZVZ82DvJbCI4kNXyJStwb8wCa8OQacpaKNQTjMfQOeAW0gbmyjp18n1XKQ7E7yt1pmSAhSenn5/Lb4TlHdg4JaJMO6vD2eTY8Fz5HcjpczXUcZs3+85KIu+/gMJEtxba2fANYJnK9J9rdXRL9zLcnyJkm4s0hVa5TLfZOSZh89Xzc7G7zoCchuIFyhlU+Pv5o+LxXcqVdMAwuUyk/rjailT/8ZYgeCoz0ZpQ4UZ07uX6bQrZ87CoEACXGdAwu3KrV/5vmuyVG90PsE9FszZib5jKi4rNWCmQN3EzuineTYwrbYsFqtDBVka9bO9Nccr6YYHBWzj+vcmrmTKW02hXQVOmobuSZJmapiWh0FnQPNSpf7U3P8osttDYJpS1gAIg9NQ707KtTsd8tFkZZuQOMP18C3puYqsuR4AfNnBjPSdQz1jcDrSewBXsgDlfyrX9rZ+j3N8HrcuTwVAb61kvfNS0W7FeL9eudXV930fxz6wZ89NoijZpqvqohyHNPUyGZwfOwzoVw5pqG1fGeG5w8X4nippcmluskxiWWgYYNpKZsVwoeoK+P5GuZbvkO8n2WRKSpkA0In46Gcc3F9C1wEsqdri1qQo39HEoxnfW2T5Sqv1R+8kLyqB2bFWgFMASt81G8xo/L4mEbNIv/3NyttNQByW4qPmBczGrUIGgy/CpIDbjbIcnDSvbbeuDUKb24dJIqnirG429Ywsl31keXxVorTXWGlo/hmuAPTNFF6C1eKrPsICGE1W/Wzrg2xzuBfcPYO7MacSk8IGtHG2tXrQpTwT109gf/n6goAcY3ZE4ddscJqE793zEm1HBzDy6TZ0yirpECpCvZR8Wxzlpy4oowTlbbbefNuzRC17KdI+YxJbPSibdpAZvGmG9Rnr5ndxNke96QApRTv9MrUm8zNtHaTzz5aFimjDFWwZ0tLj9A9R0OjhOzQbtPV0zJp8kS626k4D+UrcWw9eJ7PogVZWekAWKUVqR+bQGrAJZS2SsDjOFgxTe1BJy+Wb4Xc8nofRRJdlIDA16wJnun+BN0u0kEdrA+RJOiwe9Wy0EiL3kJKWLwCdATTpXVNZYGajzPl10IpjEjGdWnseDgjpejqkPC7jf/b9pidnTpbKiU+EmHeuAui6Ceho+loaALqBlpXkIpE/q5SignObA2C+iwAqm+zgiXKfvMN74yPW932RezT5iXbXG0PytvOlZbvpl5/sr1MS4mz7WhWZgKLsLJgSMCv6RRSP/hCSrqOvP7bKrDojY8CJStFeucy6PNv6TU+O7aYscnzELOt3sfV8goNxmiscyloA7oE8n4ekGS8A1QBXZD17G3ikaP6MHv8y4OVifzCG4By7/srvVMnuz/khY0b5uUAZN0/OfMWXtkgUGE3+nGuXC6ZJjyGOSwIeT1n/gVRn2VQUopNlQNsImK63Ks0txNSoaY+kgsKI9Fscyx4CvkHe0rnaTInyn0P5M+XN5XO8bRqUiTgbviXgmRkWUe/VFR+jUR5nubMEeJTJSkxAmBvycIvEQAmIpnt1X+nHjwgAS5m6Qep1uIBgUprAOUEUOo5FKXhEkna+j/qybaeYRLwCo6zoxboJ99ZYae9FWrpQGS3GiCjaa58SM51WNsWGJ5BnP2lnvoCSq9YizrIyXtHNCqmcbBxTGtBV3KuVqbjlZcaEgpJ+Na2tAOdiAe4PlFe6Oimg4q3BMVU1MBubih4ip2N/6sbdF1NEsO0mcikjoRg++GiSLCNMxcCPBVkJTjFtUFZ90SGSyctTR+QpLpXPI99Kx3wtRQvnpjAvAonR+otFZnV6w7FE07baX7TxqViaN6axPxhAcrnItoxyny7XuSx2kOUyT5Qx9tdCypghwOog/UR5jsriiqAt0AHEeFJva8gFKJMgHa3J97jX1+y869Kjv2edzInGFPpMPxxgHiS1wiEfYywv8Jm7qKW/EZK+nSg8BHRQw8pFmRsbVgcAk67KF32zA4F9JM+WSofMSY8VtX/fJc9DNtwE7z2i02GUBHGzDG7MGydKX2Olna9TyWXMgkNfsy9sXzoVKMbUzpP+P8gk4myHKaIjX5z2kDm/zRqZU2aIUb5LdIFd6pCP6fzn0HtH/gWlHypmlf4m3M+cI9rw28hzUUi6y61li7Nw8zT1Sb4FTNJk4bYhWbvITMoyeoppb7jRI6XYTm7Ce4ZWC4cIrg3KNT5jjpigCM53ZQw0fF0iNmuTNeA0CdefLWa4DPKeCshyAwabJ1UwMKN+hHoReLcj77iQ59uU51Dup6aiz9+eSRuk2JfTAIAFcioKZ8MmjvnofhyUJM3vje6McREVr0W9Zrk2otZo62J7vbESRfComlPTZkoqKNkqoojnNeKSODFNxXv7sSi6RA3T6xB2E+BiPekIifrHFNcg79VRMtStJcCkIfyugNvs5L+ZRDQNo28Ok9lDmxG5me6ldO1eBEAfhexJ5aARvn+eQhE0xNPA/baMJZVJHgCxQE46OVnJ87G8CFskbWfrftKzj7jjFeUzsINBL32TJF8hS/lLURtXW0xJlDO1KHS6Gs+yDhC7Hx3PIIeHTcWjWrjvh/LnDWmcQbeJ1hyVqHgNsD08qHt3hrjhs7ViwvkPlRHu4fel5yw4UkSI+2UrjHEA6L85g/I0aJM4UO1osSjUk+csEZGi2Aq5i8GpyFI2cabsp+1d4swoSzj3n3dVykoLODFrNhJlrqVo6q84ZuVpKcdarlKv7q/KV02x2W6Lckj/rFglUiLk56a88VUxaDVe5gTI9jD6No0xYZvqJBLpCuXWASizRRqAyb7nUsfQPBqqS3DtOMfsYzRgWrRGUVxY71LUn4HSCxnVDqay19c6XSUjqDYoRG0VbZ4DW+KQl9E+2mEO7dNQLwaNHGGZdM52yPel2fHnEWEzGhWup5Rb3slw3ITXW8QUzpxLtSNzYnDuWHJSETuSHa2oHcD1qYscJF6Pj5Rb6diopilcDR3ylUY432i0STgzXIjnNvHIyINjcFYkbYZq5ZCvdZL72vLXzGW7sLgItSXcb5/UAqkbpwhOl2Dkr1w7VNyvPPKmzDELX+RHMmWJzxhwyjJkz1IdRBsMo9MdlIdyZebr6VAtek60fUH+fTlrlfu/dChbO2d0bRX0KwN9abukjfcDhyyHmiR70WurzKnJgVOC3mRc7xKgifsHZ7PRI7Un+U491squZ3beR/SDooEyS32/tc1zw6DcNA1Rhng42BDl1qIqevHLwAzOoMcoV6wDXHEKxGphU/cYnBVJ29XHDuRR3HtZ4OHbPctB5gwqlxr8DPnXDxuYTUSZOErJ96D1m8qEvc34+7/nAwgbK8CkQ2CaqehSpO0xrZvo6HwAXwOeDr6MogxXKPBHPIVPDONTlKz5mQCGjIuERwcyQuboADmPg7dJtM3OIcXMkP0tXpkNZSnWzuzZJGBZIkoZyx0UIDfSWN7W9hABcPTXDw0w51wrJiN2YA/wWFNx+zKpcEJByVirL1qZJH8QkaQvp1tiDw33t0k/fiLWgjtMxW28E/GMK6tynF1wl4lG+POkE+1/D+NylNIWBnQ0/1CWfuznApSXCx2LujjAdcmYxf7KbNjG6HvebaKsXZjml5wiy2nWZYpBD6QoXtX6Zd3zOAww+okclSmXtsExlSjiOpTxmCpDFpTQXTfY6OawZERtf0DQgbGVaC+1+vUpZOXE8HIMzuCO5Qx3XIqdG1Yuj6Y+37jvozfykjBwIdRFB3AR/AOjmHrEzHUi8gZt7f3W8VoQ8USUbRHrMzjZrtVaDU4BEt9eemKuCwApO5ARNJdGLJfyIT0hT5vwAxJ4j4ELnZDH6RBagOxxk/C8vOGQnNHzhyFPcUhdeQbAO9bloghtfVLq4xJDyecc7bLzoNYqRAHyk7dfhjIcZakyUQw2BCgNOylEIeXSwN5XNPc8UVq8PURFlskoEkFJovJzhkkEjuTLkv+hAHcaQLnIse2sIwNN2gnIJqbyX6Io50BpazdRDGn9oOODUes8kOzZVKOHqkohyvp968pf3pGeQkefamLKWHLBXU0I/OihXCuNhz/7KRO3BnMZ5DlD3nEpZSFpc43+P0FvxEOb/ZRpW4MZEUN3muf14TbSntr+cXEv0rRzinWLPvpmtG3Gwxsv6+mkk83O7kgeDrUEQLzEc1/yn4PBPIxqoQJM0t0xMOOZsypmTi7RYSfS0f9M33RQuBuN4R0inmARUzxzOhE3la0Oud8oBJg0Ng+IgVlzKKPAKX5r/uHA8ohZuYyfJHuqY4rBWWUApaGaGjv3RLsYmxnx09n69+CYYpmzymVQBsQOMYm/FqEmv7sAltHt3/+rg3dYVUw1T+b8vwADAEEM+e5euq/8AAAAAElFTkSuQmCC"
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