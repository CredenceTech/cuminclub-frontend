import React, { useState, useEffect, useRef } from "react";
import {
  createCartMutation,
  getCartQuery,
  getProductCollectionsQuery,
  getProductDetailQuery,
  graphQLClient,
  updateCartItemMutation,
  updateCartMutation,
} from "../api/graphql";
import { useDispatch, useSelector } from "react-redux";
import { addMeal, selectMealItems } from "../state/mealdata";
import mealThreeImage from "../assets/mealThreeImage.png";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "../component/CartComponent";
import { cartIsOpen, openCart } from "../state/cart";
import {
  addCartData,
  cartData,
  selectCartResponse,
  setCartResponse,
} from "../state/cartData";
import { FilterDrawer } from "../component/FilterDrawer";
import LoadingAnimation from "../component/Loader";
import { totalQuantity } from "../utils";
import Popup from "../component/Popup";
import SpiceLevel from "../component/SpiceLevel";
import cardIcon from '../assets/cartnew.png';
import { AnimatePresence, motion } from "framer-motion";
import food1 from '../assets/food1.png'
import FilterButton from '../component/DropdownFilter';
import productImage from '../assets/Dish-1.jpg';
import { categoryrData } from "../state/selectedCategory";
const Product = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [rawResonse, setRawResponse] = useState(null);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const mealData = useSelector(selectMealItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCartOpen = useSelector(cartIsOpen);
  const selectedCategory = useSelector(categoryrData);
  const [activeTitle, setActiveTitle] = useState();
  const cartDatas = useSelector(cartData);
  const cartResponse = useSelector(selectCartResponse);
  const [popupState, setPopupState] = useState(true);
  const [loading, setLoading] = useState({});
  const categoryTitleRefs = useRef([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [selectedTab, setSelectedTab] = useState('BUY NOW');
  const [selectedValue, setSelectedValue] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      for (let i = 0; i < categoryTitleRefs.current.length; i++) {
        const categoryTitleRef = categoryTitleRefs.current[i];
        const rect = categoryTitleRef.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setCurrentCategory(categoryTitleRef.textContent);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setActiveTitle(currentCategory);
  }, [currentCategory]);

  useEffect(() => {
    getCartData();
  }, [cartDatas]);

  const getCartData = async () => {
    const params = {
      cartId: cartDatas?.cartCreate?.cart?.id,
    };
    const response = await graphQLClient.request(getCartQuery, params);
    dispatch(setCartResponse(response));
  };

  const productEdgesRef = useRef();

  const handleCategorySelect = (title) => {
    setActiveTitle(title);
    const productEdgesElement = document.getElementById(
      `product-edges-${title}`
    );

    if (productEdgesElement) {
      productEdgesElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (cartResponse && totalQuantity(cartResponse) == mealData.no) {
      dispatch(openCart());
    }
  }, [cartResponse]);

  useEffect(() => {
    const handleSelectedOptionsChange = (selectedOptions) => {
      const filteredData = apiResponse?.collections?.edges?.filter((order) => {
        return order.node.products.edges.some((product) => {
          const productTags = product.node.tags;
          return selectedOptions.every((selectedOption) =>
            productTags.includes(selectedOption)
          );
        });
      });
      const newData = {
        collections: {
          edges: filteredData,
        },
      };
      setFilteredOptions(newData);
      setRawResponse(newData);
    };

    handleSelectedOptionsChange(selectedOptions);
  }, [selectedOptions]);

  const handleSelectedOptionsChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

  useEffect(() => {
    const apiCall = async () => {
      try {
        const result = await graphQLClient.request(getProductCollectionsQuery, {
          first: 15,
          reverse: false,
          query: selectedCategory?.node?.title,
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

        setApiResponse(collections);
        setRawResponse(collections);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };
    apiCall();
  }, [selectedCategory]);

  const handleAddToCart = (productId, sellingPlanId) => {
    setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
    if (cartDatas === null) {
      if (sellingPlanId) {
        addToCart({
          merchandiseId: productId,
          sellingPlanId: sellingPlanId,
          quantity: 1,
        });
      } else {
        addToCart({ merchandiseId: productId, quantity: 1 });
      }
    }

    const productInCart = cartResponse?.cart?.lines?.edges.find((cartItem) => {
      return cartItem.node.merchandise.id === productId;
    });

    if (productInCart) {
      const quantityInCart = productInCart.node.quantity;
      const cartId = cartDatas?.cartCreate?.cart?.id;
      const id = productInCart?.node?.id;
      if (sellingPlanId) {
        updateCartItem(productId, cartId, {
          id: id,
          sellingPlanId: sellingPlanId,
          quantity: quantityInCart + 1,
        });
      } else {
        updateCartItem(productId, cartId, {
          id: id,
          quantity: quantityInCart + 1,
        });
      }
    } else {
      const cartId = cartDatas?.cartCreate?.cart?.id;
      if (sellingPlanId) {
        updateCart(cartId, {
          merchandiseId: productId,
          sellingPlanId: sellingPlanId,
          quantity: 1,
        });
      } else {
        updateCart(cartId, { merchandiseId: productId, quantity: 1 });
      }
    }
  };

  const handleRemoveFromCart = (productId, sellingPlanId) => {
    setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
    const productInCart = cartResponse.cart.lines.edges.find((cartItem) => {
      return cartItem.node.merchandise.id === productId;
    });

    if (productInCart) {
      const quantityInCart = productInCart.node.quantity;
      const cartId = cartDatas?.cartCreate?.cart?.id;
      const id = productInCart?.node?.id;
      if (sellingPlanId) {
        updateCartItem(productId, cartId, {
          id: id,
          sellingPlanId: sellingPlanId,
          quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
        });
      } else {
        updateCartItem(productId, cartId, {
          id: id,
          quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
        });
      }
    }
  };

  const addToCart = async (cartItems) => {
    const params = {
      cartInput: {
        lines: [cartItems],
      },
    };
    setIsLoading(true);
    const response = await graphQLClient.request(createCartMutation, params);
    setIsLoading(false);
    dispatch(addCartData(response));
    setLoading((prevLoading) => ({
      ...prevLoading,
      [cartItems.merchandiseId]: false,
    }));
  };

  const updateCartItem = async (a, cartId, cartItem) => {
    const params = {
      cartId: cartId,
      lines: cartItem,
    };
    setIsLoading(true);
    const response = await graphQLClient.request(
      updateCartItemMutation,
      params
    );
    setIsLoading(false);
    dispatch(setCartResponse(response.cartLinesUpdate));
    setLoading((prevLoading) => ({
      ...prevLoading,
      [a]: false,
    }));
  };

  const updateCart = async (cartId, cartItem) => {
    const params = {
      cartId: cartId,
      lines: [cartItem],
    };
    setIsLoading(true);
    const response = await graphQLClient.request(updateCartMutation, params);
    setIsLoading(false);
    dispatch(setCartResponse(response.cartLinesAdd));
    setLoading((prevLoading) => ({
      ...prevLoading,
      [cartItem.merchandiseId]: false,
    }));
  };

  const getProductQuantityInCart = (productId) => {
    const productInCart = cartResponse?.cart?.lines?.edges?.find((cartItem) => {
      return cartItem.node.merchandise.id === productId;
    });
    return productInCart ? productInCart?.node?.quantity : 0;
  };

  const openCountryDrawer = () => {
    setIsCountryDrawerOpen(true);
  };

  const closeCountryDrawer = () => {
    setIsCountryDrawerOpen(false);
  };

  const [data, setData] = useState(null);

  const getProductDetail = async (productId) => {
    const response = await graphQLClient.request(getProductDetailQuery, {
      productId: productId,
    });

    const metafields = response.product.metafields;

    if (metafields) {
      for (const metafield of metafields) {
        if (metafield && metafield.key === "component_reference") {
          const dataArray = JSON.parse(metafield.value);
          setData(dataArray);
          break;
        }
      }
    }
  };

  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = [];

      for (const productId of data) {
        const response = await graphQLClient.request(getProductDetailQuery, {
          productId,
        });

        details.push(response);
      }

      setProductDetails(details);
    };

    if (data !== null) {
      fetchProductDetails();
    }
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      try {
        let data;

        for (let index = 0; index < productDetails.length; index++) {
          const product = productDetails[index];
          const productId = product.product.variants.edges[0].node.id;
          const productIds =
            product?.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans
              ?.edges[0]?.node?.id;

          await new Promise((resolve) => setTimeout(resolve, 500 * index));

          if (cartDatas === null) {
            if (data === undefined) {
              const params = {
                cartInput: {
                  lines: [{ merchandiseId: productId, quantity: 1 }],
                },
              };
              const response = await graphQLClient.request(
                createCartMutation,
                params
              );
              data = response;
              dispatch(addCartData(response));
            } else {
              const cartId = data?.cartCreate?.cart?.id;

              if (productIds) {
                updateCart(cartId, {
                  merchandiseId: productId,
                  sellingPlanId: sellingPlanId,
                  quantity: 1,
                });
              } else {
                updateCart(cartId, { merchandiseId: productId, quantity: 1 });
              }
            }
          } else {
            const cartId = cartDatas?.cartCreate?.cart?.id;

            if (productIds) {
              updateCart(cartId, {
                merchandiseId: productId,
                sellingPlanId: sellingPlanId,
                quantity: 1,
              });
            } else {
              updateCart(cartId, { merchandiseId: productId, quantity: 1 });
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching data:`, error);
      }
    }

    if (productDetails !== null) {
      fetchData();
    }
  }, [productDetails]);

  const options = [
    {
      id: 1,
      noMeal: "6 Meals",
      price: "for ₹999.00",
      discountPrice: "₹2510.12/meal",
      no: 6,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "₹2110.12/meal",
          discountPrice: "₹2510.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "₹2110.12/meal",
          discountPrice: "2000.12/meal",
        },
      ],
    },
    {
      id: 2,
      noMeal: "12 Meals",
      price: "for ₹999.00",
      discountPrice: "₹1110.12/meal",
      no: 12,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "₹1210.12/meal",
          discountPrice: "₹1110.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "₹1210.12/meal",
          discountPrice: "₹1000.12/meal",
        },
      ],
    },
    {
      id: 3,
      noMeal: "18 Meals",
      price: "for ₹999.00",
      discountPrice: "₹1110.12/meal",
      no: 18,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "₹1210.12/meal",
          discountPrice: "₹1110.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "₹1210.12/meal",
          discountPrice: "₹1000.12/meal",
        },
      ],
    },
  ]

  const product = [
    {
      id: 1,
      isLong: true,
      image: food1,
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Dal makhani'
    },
    {
      id: 2,
      isLong: false,
      image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31_1.png?v=1718710992"',
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Punjabi chole'
    },
    {
      id: 3,
      isLong: false,
      image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31_1.png?v=1718710992"',
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Dal makhani'
    },
    {
      id: 4,
      isLong: false,
      image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Dal makhani'
    },
    {
      id: 5,
      isLong: false,
      image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Dal makhani'
    },
    {
      id: 6,
      isLong: false,
      image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Dal makhani'
    },
    {
      id: 7,
      isLong: true,
      image: food1,
      description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
      name: 'Dal makhani'
    },
  ]

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };



  return (
    <>
      {apiResponse ? (
        <div className="min-h-[75vh] w-full bg-[#EFE9DA]">
          <div className="border-b-2 border-b-[#cfc19f]">
            <div className="container mx-auto flex flex-row justify-around pt-4">
              <div onClick={() => { setSelectedTab('BUY NOW') }} className="px-16 relative cursor-pointer ">
                <p className="text-base font-futuraBold lg:text-2xl py-3" >BUY NOW </p>
                {selectedTab === 'BUY NOW' ? (
                  <motion.div className="underlineHeader" layoutId="underline" />
                ) : null}
              </div>
              <div onClick={() => { setSelectedTab('SUBSCRIBE') }} className="px-16 relative cursor-pointer">
                <p className="text-base font-futuraBold lg:text-2xl py-3">SUBSCRIBE </p>
                {selectedTab === 'SUBSCRIBE' ? (
                  <motion.div className="underlineHeader" layoutId="underline" />
                ) : null}
              </div>
            </div>
          </div>

          {selectedTab === 'SUBSCRIBE' ?
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  // key={selectedTab ? selectedTab.label : "empty"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`py-2 bg-[#FBAE36] w-full flex gap-x-4 lg:justify-between items-center`}>
                    <div className="ml-4 w-1/2 lg:ml-10 whitespace-nowrap">
                      <h3 className="text-[#231F20] font-skillet text-2xl lg:text-3xl">Meal Package</h3>
                      <FilterButton align="right" setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} />
                    </div>
                    <div className="flex  w-1/2 overflow-x-auto flex-1 whitespace-nowrap  scrollbar-hide flex-row items-center ">
                      <div className="flex flex-row items-center gap-x-2 mr-10">
                        <p className="text-[#231F20] font-skillet text-2xl">Fill your box 📦</p>
                      </div>
                      <div className="flex flex-row items-center overflow-x-auto flex-1 whitespace-nowrap  scrollbar-hide">
                        <SpiceLevel />
                      </div>
                      <div aria-haspopup="true" aria-expanded={showModel} onClick={() => { setShowModel(!showModel) }} className="bg-[#f1663c] flex justify-center items-center rounded-tl-md rounded-bl-md h-16 w-12">
                        <img src={cardIcon} alt="" className="w-6 h-6" />
                      </div>



                      {/* <div className="flex h-12 lg:h-16 gap-5">
                <div
                  className="px-3 text-base gap-5 text-[#53940F] bg-white border-[#53940F] rounded-lg flex items-center justify-center"
                  style={{ borderWidth: "3px" }}
                >
                  <div className="flex flex-col items-center font-bold text-base lg:text-xl">
                    <span>{mealData.no}</span>
                    <span>Meals</span>
                  </div>
                  <div className="flex flex-col">
                    <span> {mealData.discountPrice}</span>
                    <strike className="text-gray-300">{mealData.price}</strike>
                  </div>
                </div>
                <div
                  onClick={() => navigate("/")}
                  className="px-3 h-12 lg:h-16 cursor-pointer text-white gap-3  py-1  border text-sm border-white bg-[#53940F] rounded-lg flex items-center justify-center"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.2207 11.7711L6.77365 11.759L14.5285 4.03297C14.8328 3.72684 15.0003 3.3203 15.0003 2.88783C15.0003 2.45537 14.8328 2.04883 14.5285 1.7427L13.2516 0.458276C12.6429 -0.153973 11.581 -0.150734 10.9771 0.455846L3.2207 8.18346V11.7711ZM12.1131 1.60341L13.3925 2.8854L12.1067 4.16659L10.8298 2.88298L12.1131 1.60341ZM4.83092 8.85888L9.68573 4.02163L10.9626 5.30606L6.10863 10.1417L4.83092 10.1457V8.85888Z"
                      fill="white"
                    />
                    <path
                      d="M1.61022 15H12.8818C13.7698 15 14.492 14.2735 14.492 13.3803V6.36045L12.8818 7.98015V13.3803H4.15276C4.13182 13.3803 4.11009 13.3884 4.08915 13.3884C4.06258 13.3884 4.03602 13.3811 4.00864 13.3803H1.61022V2.04231H7.12281L8.73303 0.422607H1.61022C0.722183 0.422607 0 1.14905 0 2.04231V13.3803C0 14.2735 0.722183 15 1.61022 15Z"
                      fill="white"
                    />
                  </svg>
                  <span className="text-xs lg:text-lg">Update Your Plan</span>
                </div>
              </div> */}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* <motion.div
                // key={selectedTab ? selectedTab.label : "empty"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className=" container mx-auto grid grid-cols-2 lg:grid-cols-3 mt-10 gap-4 md:gap-10">

                  {product?.map((item) => (
                    <>
                      {item?.isLong
                        ?
                        <div className='col-span-2 bg-[#EADEC1] rounded-3xl' key={item?.id}>
                          <AnimatePresence mode="popLayout">
                            <motion.div
                              initial={{ y: 500, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -500, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="relative">
                                <img src={item?.image} alt="product" className="w-full h-[300px] rounded-t-3xl" />
                                <button type="button" className="bg-[#FBAE36] tracking-tight absolute top-4 left-4 text-gray-900 px-3 rounded-lg py-1 font-futuraBold">LENTIL</button>
                              </div>
                              <div className=" px-10 py-5">
                                <div className="flex flex-row justify-between">
                                  <p className="text-base font-futuraBold uppercase lg:text-2xl">{item?.name}</p>
                                  <p className="text-base font-futuraBold lg:text-2xl">₹ 99</p>
                                </div>
                                <p className="text-lg font-futura text-[#515151]">{item?.description}</p>
                                <div className="flex gap-x-4 mt-1">
                                  <button type="button" className="border-2 border-gray-900 text-gray-900 px-3 rounded-lg py-1 font-futuraBold">ADD TO CART</button>
                                  <button type="button" className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold">BUY NOW</button>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        :
                        <div key={item?.id} className="bg-[#EADEC1] relative rounded-3xl">
                          <AnimatePresence mode="wait">
                            <motion.div
                              initial={{ y: 500, x: -500, opacity: 0 }}
                              animate={{ y: 0, x: 0, opacity: 1 }}
                              exit={{ y: -500, x: 500, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img src={item?.image} alt="product" className="w-full h-[250px] md:h-full rounded-t-3xl" />
                              <div className="absolute top-0 left-0 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full flex flex-col justify-between h-full">
                                <div className="p-4">
                                  <button type="button" className="bg-[#26965C] tracking-tight  text-gray-100 px-3 rounded-lg py-1 font-futuraBold">CURRY</button>
                                </div>
                                <div className="px-3 md:pl-8 pb-4">
                                  <p className="text-base font-futuraBold text-gray-100 uppercase lg:text-2xl">{item?.name}</p>
                                  <div className="flex flex-col md:flex-row md:gap-4">
                                    <button type="button" className="border-2 border-gray-100 text-gray-100 px-3 rounded-lg py-1 font-futuraBold">ADD TO CART</button>
                                    <button type="button" className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold">BUY NOW</button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      }

                    </>
                  ))}

                </div >
              </motion.div> */}
            </>
            :
            ''
            // <motion.div
            //   // key={selectedTab ? selectedTab.label : "empty"}
            //   initial={{ y: 10, opacity: 0 }}
            //   animate={{ y: 0, opacity: 1 }}
            //   exit={{ y: -10, opacity: 0 }}
            //   transition={{ duration: 0.4 }}
            // >
            //   <div className=" container mx-auto grid grid-cols-2 lg:grid-cols-3 mt-10 gap-4 md:gap-10">

            //     {product?.map((item) => (
            //       <>
            //         {item?.isLong
            //           ?
            //           <div className='col-span-2 bg-[#EADEC1] rounded-3xl' key={item?.id}>
            //             <AnimatePresence mode="popLayout">
            //               <motion.div
            //                 initial={{ y: 500, opacity: 0 }}
            //                 animate={{ y: 0, opacity: 1 }}
            //                 exit={{ y: -500, opacity: 0 }}
            //                 transition={{ duration: 0.3 }}
            //               >
            //                 <div className="relative">
            //                   <img src={item?.image} alt="product" className="w-full h-[300px] rounded-t-3xl" />
            //                   <button type="button" className="bg-[#FBAE36] tracking-tight absolute top-4 left-4 text-gray-900 px-3 rounded-lg py-1 font-futuraBold">LENTIL</button>
            //                 </div>
            //                 <div className=" px-10 py-5">
            //                   <div className="flex flex-row justify-between">
            //                     <p className="text-base font-futuraBold uppercase lg:text-2xl">{item?.name}</p>
            //                     <p className="text-base font-futuraBold lg:text-2xl">₹ 99</p>
            //                   </div>
            //                   <p className="text-lg font-futura text-[#515151]">{item?.description}</p>
            //                   <div className="flex gap-x-4 mt-1">
            //                     <button type="button" className="border-2 border-gray-900 text-gray-900 px-3 rounded-lg py-1 font-futuraBold">ADD TO CART</button>
            //                     <button type="button" className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold">BUY NOW</button>
            //                   </div>
            //                 </div>
            //               </motion.div>
            //             </AnimatePresence>
            //           </div>
            //           :
            //           <div key={item?.id} className="bg-[#EADEC1] relative rounded-3xl">
            //             <AnimatePresence mode="wait">
            //               <motion.div
            //                 initial={{ y: 500, x: -500, opacity: 0 }}
            //                 animate={{ y: 0, x: 0, opacity: 1 }}
            //                 exit={{ y: -500, x: 500, opacity: 0 }}
            //                 transition={{ duration: 0.4 }}
            //               >
            //                 <img src={item?.image} alt="product" className="w-full h-[250px] md:h-full rounded-t-3xl" />
            //                 <div className="absolute top-0 left-0 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full flex flex-col justify-between h-full">
            //                   <div className="p-4">
            //                     <button type="button" className="bg-[#26965C] tracking-tight  text-gray-100 px-3 rounded-lg py-1 font-futuraBold">CURRY</button>
            //                   </div>
            //                   <div className="px-3 md:pl-8 pb-4">
            //                     <p className="text-base font-futuraBold text-gray-100 uppercase lg:text-2xl">{item?.name}</p>
            //                     <div className="flex flex-col md:flex-row md:gap-4">
            //                       <button type="button" className="border-2 border-gray-100 text-gray-100 px-3 rounded-lg py-1 font-futuraBold">ADD TO CART</button>
            //                       <button type="button" className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold">BUY NOW</button>
            //                     </div>
            //                   </div>
            //                 </div>
            //               </motion.div>
            //             </AnimatePresence>
            //           </div>
            //         }

            //       </>
            //     ))}

            //   </div >
            // </motion.div>
          }
          <>
            {/* <div className="flex bg-[#FBAE36] justify-start sticky top-20">
              <div className="flex items-center bg-[#FBAE36] gap-2">
                <button
                  onClick={openCountryDrawer}
                  className="bg-[#333333] px-3 py-2 rounded-r-lg"
                >
                  <span className="w-2 h-2">
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 2.00245C4.73478 2.00245 4.48043 2.10781 4.29289 2.29534C4.10536 2.48288 4 2.73723 4 3.00245C4 3.26767 4.10536 3.52202 4.29289 3.70956C4.48043 3.89709 4.73478 4.00245 5 4.00245C5.26522 4.00245 5.51957 3.89709 5.70711 3.70956C5.89464 3.52202 6 3.26767 6 3.00245C6 2.73723 5.89464 2.48288 5.70711 2.29534C5.51957 2.10781 5.26522 2.00245 5 2.00245ZM2.17 2.00245C2.3766 1.41692 2.75974 0.909884 3.2666 0.55124C3.77346 0.192596 4.37909 0 5 0C5.62091 0 6.22654 0.192596 6.7334 0.55124C7.24026 0.909884 7.6234 1.41692 7.83 2.00245H15C15.2652 2.00245 15.5196 2.10781 15.7071 2.29534C15.8946 2.48288 16 2.73723 16 3.00245C16 3.26767 15.8946 3.52202 15.7071 3.70956C15.5196 3.89709 15.2652 4.00245 15 4.00245H7.83C7.6234 4.58798 7.24026 5.09502 6.7334 5.45366C6.22654 5.81231 5.62091 6.0049 5 6.0049C4.37909 6.0049 3.77346 5.81231 3.2666 5.45366C2.75974 5.09502 2.3766 4.58798 2.17 4.00245H1C0.734784 4.00245 0.48043 3.89709 0.292893 3.70956C0.105357 3.52202 0 3.26767 0 3.00245C0 2.73723 0.105357 2.48288 0.292893 2.29534C0.48043 2.10781 0.734784 2.00245 1 2.00245H2.17ZM11 8.00245C10.7348 8.00245 10.4804 8.10781 10.2929 8.29534C10.1054 8.48288 10 8.73723 10 9.00245C10 9.26767 10.1054 9.52202 10.2929 9.70956C10.4804 9.89709 10.7348 10.0025 11 10.0025C11.2652 10.0025 11.5196 9.89709 11.7071 9.70956C11.8946 9.52202 12 9.26767 12 9.00245C12 8.73723 11.8946 8.48288 11.7071 8.29534C11.5196 8.10781 11.2652 8.00245 11 8.00245ZM8.17 8.00245C8.3766 7.41692 8.75974 6.90988 9.2666 6.55124C9.77346 6.1926 10.3791 6 11 6C11.6209 6 12.2265 6.1926 12.7334 6.55124C13.2403 6.90988 13.6234 7.41692 13.83 8.00245H15C15.2652 8.00245 15.5196 8.10781 15.7071 8.29534C15.8946 8.48288 16 8.73723 16 9.00245C16 9.26767 15.8946 9.52202 15.7071 9.70956C15.5196 9.89709 15.2652 10.0025 15 10.0025H13.83C13.6234 10.588 13.2403 11.095 12.7334 11.4537C12.2265 11.8123 11.6209 12.0049 11 12.0049C10.3791 12.0049 9.77346 11.8123 9.2666 11.4537C8.75974 11.095 8.3766 10.588 8.17 10.0025H1C0.734784 10.0025 0.48043 9.89709 0.292893 9.70956C0.105357 9.52202 0 9.26767 0 9.00245C0 8.73723 0.105357 8.48288 0.292893 8.29534C0.48043 8.10781 0.734784 8.00245 1 8.00245H8.17ZM5 14.0025C4.73478 14.0025 4.48043 14.1078 4.29289 14.2953C4.10536 14.4829 4 14.7372 4 15.0025C4 15.2677 4.10536 15.522 4.29289 15.7096C4.48043 15.8971 4.73478 16.0025 5 16.0025C5.26522 16.0025 5.51957 15.8971 5.70711 15.7096C5.89464 15.522 6 15.2677 6 15.0025C6 14.7372 5.89464 14.4829 5.70711 14.2953C5.51957 14.1078 5.26522 14.0025 5 14.0025ZM2.17 14.0025C2.3766 13.4169 2.75974 12.9099 3.2666 12.5512C3.77346 12.1926 4.37909 12 5 12C5.62091 12 6.22654 12.1926 6.7334 12.5512C7.24026 12.9099 7.6234 13.4169 7.83 14.0025H15C15.2652 14.0025 15.5196 14.1078 15.7071 14.2953C15.8946 14.4829 16 14.7372 16 15.0025C16 15.2677 15.8946 15.522 15.7071 15.7096C15.5196 15.8971 15.2652 16.0025 15 16.0025H7.83C7.6234 16.588 7.24026 17.095 6.7334 17.4537C6.22654 17.8123 5.62091 18.0049 5 18.0049C4.37909 18.0049 3.77346 17.8123 3.2666 17.4537C2.75974 17.095 2.3766 16.588 2.17 16.0025H1C0.734784 16.0025 0.48043 15.8971 0.292893 15.7096C0.105357 15.522 0 15.2677 0 15.0025C0 14.7372 0.105357 14.4829 0.292893 14.2953C0.48043 14.1078 0.734784 14.0025 1 14.0025H2.17Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </button>
                {isCountryDrawerOpen && (
                  <FilterDrawer
                    option={selectedOptions}
                    onClose={closeCountryDrawer}
                    onSelectedOptionsChange={handleSelectedOptionsChange}
                    handleClearFilters={() => {
                      setSelectedOptions([]);
                    }}
                  />
                )}
                {isCartOpen && <CartDrawer />}
                <span className="text-xl font-bold hidden lg:block">
                  Filter
                </span>
              </div>
              <div className="flex overflow-x-auto flex-1 whitespace-nowrap  scrollbar-hide lg:justify-around">
                {apiResponse.collections.edges.map((category) => (
                  <div
                    key={category.node.title}
                    onClick={() => handleCategorySelect(category.node.title)}
                    className={`cursor-pointer flex items-center py-1 mx-1 lg:mx-4 my-1 lg:my-2 text-xs lg:text-base font-medium px-3 lg:px-5 rounded border border-[#333333] ${activeTitle === category.node.title
                      ? "bg-[#53940F] text-white border-none"
                      : ""
                      }`}
                  >
                    {category.node.title}
                  </div>
                ))}
              </div>
            </div> */}

            {/* <div className="mt-4 overflow-y-auto" style={{ height: '79vh' }} ref={productsContainerRef}> */}
            <div
              className="mt-4 container mx-auto"
            // style={{
            //   height: "62vh",
            // }}
            >
              {rawResonse.collections.edges.map((category, index) => (
                // <div key={category.node.title} ref={productSectionsRefs[index]}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={category.node.title}
                    initial={{ y: 100, x: -100, opacity: 0 }}
                    animate={{ y: 0, x: 0, opacity: 1 }}
                    exit={{ y: -100, x: 100, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mt-10 ">
                      {/* <div
                        ref={(ref) => (categoryTitleRefs.current[index] = ref)}
                        className="flex justify-center text-[#FAFAFA] text-lg lg:text-2xl font-bold"
                      >
                        {category.node.title}
                      </div> */}
                      <div
                        key={category.node.title}
                        ref={productEdgesRef}
                        id={`product-edges-${category.node.title}`}
                        className="container mx-auto grid grid-cols-2 lg:grid-cols-3 mt-10 gap-4 md:gap-10"
                      >
                        {category.node.products.edges.map((product) => (
                          <>
                            <div key={product.node.id} className="bg-[#EADEC1] relative rounded-3xl">
                              <AnimatePresence mode="wait">
                                <motion.div
                                  initial={{ y: 500, x: -500, opacity: 0 }}
                                  animate={{ y: 0, x: 0, opacity: 1 }}
                                  exit={{ y: -500, x: 500, opacity: 0 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <img src={product.node.featuredImage.url} alt="product" className="w-full h-[250px] md:h-full rounded-t-3xl" />
                                  <div className="absolute top-0 left-0 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full flex flex-col justify-between h-full">
                                    <div className="p-4">
                                      <button type="button" className="bg-[#26965C] tracking-tight  text-gray-100 px-3 rounded-lg py-1 font-futuraBold">CURRY</button>
                                    </div>
                                    <div className="px-3 md:pl-8 pb-4">
                                      <p className="text-base font-futuraBold text-gray-100 uppercase lg:text-2xl">{product.node.title}</p>
                                      <div className="flex flex-col md:flex-row md:gap-4">
                                        <button type="button" onClick={() =>
                                          handleAddToCart(
                                            product.node.variants.edges[0].node.id,
                                            product.node.sellingPlanGroups?.edges[0]?.node
                                              ?.sellingPlans?.edges[0]?.node?.id
                                          )
                                        } className="border-2 border-gray-100 text-gray-100 px-3 rounded-lg py-1 font-futuraBold">ADD TO CART</button>
                                        <button type="button" className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold">BUY NOW</button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            </div>
                            {/* <div
                              key={product.node.id}
                              className="m-2 w-40 lg:w-56 bg-[#EADEC1] border rounded-2xl flex flex-col justify-between p-2 lg:p-4"
                            >
                              <img
                                src={product.node.featuredImage.url}
                                alt={product.node.featuredImage.altText}
                                className="w-48 h-32 lg:w-52 lg:h-48 mb-1 cursor-pointer rounded-2xl"
                                onClick={() => {
                                  if (category.node.title === "Bundles") {
                                    navigate(`/bundleDetail`, {
                                      state: { id: product.node.id },
                                    });
                                  } else {
                                    navigate(`/productDetail`, {
                                      state: { id: product.node.id },
                                    });
                                  }
                                }}
                              />
                              <h3
                                style={{ color: "rgba(51, 51, 51, 1)" }}
                                className="text-base font-futuraBold lg:text-lg items-start overflow-hidden pb-8 cursor-pointer"
                                onClick={() => {
                                  if (category.node.title === "Bundles") {
                                    navigate(`/bundleDetail`, {
                                      state: { id: product.node.id },
                                    });
                                  } else {
                                    navigate(`/productDetail`, {
                                      state: { id: product.node.id },
                                    });
                                  }
                                }}
                              >
                                {product.node.title}
                              </h3>
                              
                              {category.node.title === "Bundles" ? (
                                <div>
                                  <button
                                    onClick={() => {
                                      getProductDetail(product.node.id);
                                    }}
                                    className="bg-[#53940F] lg:px-10 py-0.5 px-3 lg:py-1.5 rounded-lg lg:text-xl lg:font-bold text-white"
                                  >
                                    Add to cart
                                  </button>
                                </div>
                              ) : loading[product.node.variants.edges[0].node.id] ? (
                                <svg
                                  width="80"
                                  height="80"
                                  viewBox="0 0 120 30"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#4fa94d"
                                  data-testid="three-dots-svg"
                                >
                                  <circle cx="15" cy="15" r="15">
                                    <animate
                                      attributeName="r"
                                      from="15"
                                      to="15"
                                      begin="0s"
                                      dur="0.8s"
                                      values="15;9;15"
                                      calcMode="linear"
                                      repeatCount="indefinite"
                                    ></animate>
                                    <animate
                                      attributeName="fill-opacity"
                                      from="1"
                                      to="1"
                                      begin="0s"
                                      dur="0.8s"
                                      values="1;.5;1"
                                      calcMode="linear"
                                      repeatCount="indefinite"
                                    ></animate>
                                  </circle>
                                  <circle
                                    cx="60"
                                    cy="15"
                                    r="9"
                                    attributeName="fill-opacity"
                                    from="1"
                                    to="0.3"
                                  >
                                    <animate
                                      attributeName="r"
                                      from="9"
                                      to="9"
                                      begin="0s"
                                      dur="0.8s"
                                      values="9;15;9"
                                      calcMode="linear"
                                      repeatCount="indefinite"
                                    ></animate>
                                    <animate
                                      attributeName="fill-opacity"
                                      from="0.5"
                                      to="0.5"
                                      begin="0s"
                                      dur="0.8s"
                                      values=".5;1;.5"
                                      calcMode="linear"
                                      repeatCount="indefinite"
                                    ></animate>
                                  </circle>
                                  <circle cx="105" cy="15" r="15">
                                    <animate
                                      attributeName="r"
                                      from="15"
                                      to="15"
                                      begin="0s"
                                      dur="0.8s"
                                      values="15;9;15"
                                      calcMode="linear"
                                      repeatCount="indefinite"
                                    ></animate>
                                    <animate
                                      attributeName="fill-opacity"
                                      from="1"
                                      to="1"
                                      begin="0s"
                                      dur="0.8s"
                                      values="1;.5;1"
                                      calcMode="linear"
                                      repeatCount="indefinite"
                                    ></animate>
                                  </circle>
                                </svg>
                              ) : (
                                <div
                                  className="flex w-full justify-center gap-x-8 lg:gap-x-10 items-center rounded-lg mt-2 px-4 py-1 lg:py-2"
                                  style={{ background: "rgba(241, 102, 60, 0.6)" }}
                                >
                                  <button
                                    onClick={() => {
                                      if (
                                        getProductQuantityInCart(
                                          product.node.variants.edges[0].node.id
                                        ) !== 0
                                      ) {
                                        handleRemoveFromCart(
                                          product.node.variants.edges[0].node.id
                                        );
                                      }
                                    }}
                                  >
                                    <svg
                                      width="20"
                                      height="2"
                                      viewBox="0 0 14 2"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.9696 1.95317H0.625244V0.0468292H13.9696V1.95317Z"
                                        fill="#FAFAFA"
                                      />
                                    </svg>
                                  </button>
                                  <span className="text-xl text-white">
                                    {getProductQuantityInCart(
                                      product.node.variants.edges[0].node.id
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleAddToCart(
                                        product.node.variants.edges[0].node.id,
                                        product.node.sellingPlanGroups?.edges[0]?.node
                                          ?.sellingPlans?.edges[0]?.node?.id
                                      )
                                    }
                                  >
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 14 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.34425 6.04683V0.32782H8.25059V6.04683H13.9696V7.95316H8.25059V13.6722H6.34425V7.95316H0.625244V6.04683H6.34425Z"
                                        fill="#FAFAFA"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div> */}
                          </>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          </>
          {/* {popupState && (
            <Popup onCloseButtonClick={() => setPopupState(false)} />
          )} */}
        </div>
      ) : (
        <div
          className="flex justify-center items-center"
          style={{
            height: "90vh",
          }}
        >
          <LoadingAnimation />
        </div>
      )}
      {isLoading && <LoadingAnimation />}
      {
        showModel ?
          <div onClick={() => { setShowModel(false) }} className={`fixed inset-0 bg-transparent h-full w-full flex items-center justify-end z-[200] `}>
            <div onClick={e => { e.stopPropagation() }} className={`flex  flex-col w-full md:w-[400px] bg-[#EADEC1] gap-2 h-full relative top-28 }`}>
              <h1 className="text-3xl font-skillet pl-4 py-4">Review your monthly box</h1>
              <div className="px-4 h-[65vh] pb-32 overflow-x-scroll">
                <div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div>
                <div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div>
                <div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div>
                <div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div>
                <div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div><div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div><div className='flex  items-end justify-between py-3 border-b border-[#A3A3A3]'>
                  <div className='flex flex-row '>
                    <img src={productImage} alt="" className='h-[50px] w-[50px] rounded-lg' />
                    <div className='ml-4'>
                      <h1 className='text-xl md:text-2xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                    </div>
                  </div>
                  <div>
                    <button type='button' className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-1 font-futura text-xl rounded-lg '>Remove</button>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-0 bg-[#EADEC1]  px-5 py-8 border-t border-t-black w-full md:w-[400px] z-[500] ">
                <div className="flex justify-between">
                  <h1 className="text-2xl text-[#000000] font-skillet">₹510</h1>
                  <div className="flex flex-col md:flex-row md:gap-4">
                    <button type="button" className="bg-[#f1663ccc] text-gray-100 px-2 text-2xl rounded-lg  font-skillet">Add to cart</button>
                    <button type="button" onClick={() => { setShowModel(false) }} className="bg-[#26965C] text-gray-100 px-2 text-2xl rounded-lg  font-skillet">Checkout</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          :
          ''
      }
    </>
  );
};

export default Product;
