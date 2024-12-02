import React, { useState, useEffect, useRef } from "react";
import {
  createCartMutation,
  getCartQuery,
  getProductCollectionsQuery,
  getProductDetailQuery,
  graphQLClient,
  graphQLClientAdmin,
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
import productImage from '../assets/Dish-11.png';
import { categoryrData } from "../state/selectedCategory";
import { isSubscribe, subscribeClose, subscribeOpen, } from "../state/subscribeData";
import FrequencyDropDown from "../component/FrequencyDropDown";
import ProductFliter from "../component/ProductFliter";
import { draftOrderData, selectDraftOrderResponse, setDraftOrderResponse } from "../state/draftOrder";
import { addDraftOrderData } from "../state/draftOrder";
import ProductBigCard from "../component/ProductBigCard";
import ProductSmallCard from "../component/ProductSmallCard";

const ReadyToEat = () => {
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
  const [selectedValue, setSelectedValue] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [frequentlyOpen, setFrequentlyOpen] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const issubscribe = useSelector(isSubscribe);
  const [transformedProducts, setTransformedProducts] = useState(null);
  const draftOrderItem = useSelector(draftOrderData);
  const draftOrderResponse = useSelector(selectDraftOrderResponse);
  const [shaking, setIsShaking] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIpaid, setIsIpaid] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsIpaid(window.innerWidth <=1280)
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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

  // useEffect(() => {
  //   getCartData();
  // }, [cartDatas]);

  // const getCartData = async () => {
  //   const params = {
  //     cartId: cartDatas?.cartCreate?.cart?.id,
  //   };
  //   const response = await graphQLClient.request(getCartQuery, params);
  //   dispatch(setCartResponse(response));
  // };

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
      // dispatch(openCart());
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

  // const isSubscribeData=dispatch(subscribeClose());

  useEffect(() => {
    const apiCall = async () => {
      try {
        const query = selectedCategory?.node?.title === "Premium" ? '' : selectedCategory?.node?.title || '';

        const result = await graphQLClient.request(getProductCollectionsQuery, {
          first: 15,
          reverse: false,
          query: query,
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

        const transformedProducts = collections.collections.edges.flatMap(category =>
          category.node.products.edges
            .map(product => {
              const rte = product.node.metafields.find(mf => mf && mf.key === "rte");
              const isPremium = product.node.metafields.find(mf => mf && mf.key === "premium")?.value === "true";
              const shouldInclude = (rte?.value === "true") || (issubscribe && isPremium);
              if (rte?.value !== "true") {
                return null;
              }
              if (selectedCategory?.node?.title === "Premium") {
                return isPremium ? {
                  ...product.node,
                  superTitle: category.node.title,
                } : null;
              } else if (shouldInclude) {
                return {
                  ...product.node,
                  superTitle: category.node.title,
                };
              }
              return null;
            })
            .filter(product => product !== null)
        );

        setApiResponse(collections);
        setRawResponse(collections);
        setTransformedProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    apiCall();
  }, [selectedCategory, issubscribe]);


  const handleAddToCart = (productId, sellingPlanId) => {
    setIsShaking(productId);
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

  const addToCart = async (cartItems) => {
    const params = {
      cartInput: {
        lines: [cartItems],
      },
    };
    const response = await graphQLClient.request(createCartMutation, params);
    dispatch(addCartData(response));
    setIsShaking(null);
  };

  const updateCartItem = async (a, cartId, cartItem) => {
    const params = {
      cartId: cartId,
      lines: cartItem,
    };
    const response = await graphQLClient.request(
      updateCartItemMutation,
      params
    );
    dispatch(setCartResponse(response.cartLinesUpdate));
    setIsShaking(null);
  };

  const updateCart = async (cartId, cartItem) => {
    const params = {
      cartId: cartId,
      lines: [cartItem],
    };
    const response = await graphQLClient.request(updateCartMutation, params);
    dispatch(setCartResponse(response.cartLinesAdd));
    setIsShaking(null);
  };


  const handleAddToDraftOrder = (productId) => {

    // Check if draftOrder is null to decide between create or update
    if (draftOrderItem === null) {

      addToDraftOrder({ variantId: productId, quantity: 1 });
    } else {
      let lineItemsArray = draftOrderResponse?.draftOrder?.lineItems?.edges.map((edge) => ({
        variantId: edge.node.variant.id,
        quantity: edge.node.quantity,
      })) || [];
      const productIndex = lineItemsArray.findIndex(item => item.variantId === productId);
      const draftOrderId = draftOrderItem?.draftOrderCreate?.draftOrder?.id;

      if (productIndex !== -1) {
        lineItemsArray[productIndex].quantity += 1;
        updateDraftOrder(draftOrderId, lineItemsArray);
      } else {
        lineItemsArray.push({ variantId: productId, quantity: 1 });
        updateDraftOrder(draftOrderId, lineItemsArray);
      }
    }
  };

  const addToDraftOrder = async (draftOrderItems) => {
    const params = {
      lineItems: [draftOrderItems],
    };

    const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/create-draft-order`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    dispatch(addDraftOrderData(data?.data?.data));
    dispatch(setDraftOrderResponse(data?.data?.data?.draftOrderCreate))
  };


  const handleRemoveToDraftOrder = (productId) => {
    let lineItemsArray = draftOrderResponse?.draftOrder?.lineItems?.edges.map((edge) => ({
      variantId: edge.node.variant.id,
      quantity: edge.node.quantity,
    })) || [];

    const productIndex = lineItemsArray.findIndex(item => item.variantId === productId);
    const draftOrderId = draftOrderItem?.draftOrderCreate?.draftOrder?.id;

    if (productIndex !== -1) {
      if (lineItemsArray[productIndex].quantity > 1) {
        lineItemsArray[productIndex].quantity -= 1;
      } else {
        lineItemsArray.splice(productIndex, 1);
      }
    } else {
      console.log("Product not found in the draft order.");
    }
    updateDraftOrder(draftOrderId, lineItemsArray);
  }


  const updateDraftOrder = async (draftOrderId, draftOrderItems) => {
    const params = {
      draftOrderId: draftOrderId,
      lineItems: draftOrderItems
    };
    const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/update-draft-order`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    dispatch(setDraftOrderResponse(data?.data?.data?.draftOrderUpdate))
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

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };



  return (
    <>
      {apiResponse ? (
        <div className="min-h-[75vh] w-full bg-[#EFE9DA]">
          {/* <div className="border-b-2 border-b-[#cfc19f]">
            <div className="flex flex-row justify-around pt-6">
              <div onClick={() => { dispatch(subscribeClose()); }} className="px-16 relative cursor-pointer ">
                <p className="text-base font-regola-pro lg:text-[30px] lg:leading-[23.88px] py-3 font-[800] text-[#333333]" >BUY NOW </p>
                {!issubscribe ? (
                  <motion.div className="underlineHeader" layoutId="underline" />
                ) : null}
              </div>
              <div onClick={() => { dispatch(subscribeOpen()); }} className="px-16 relative cursor-pointer">
                <p className="text-base font-regola-pro lg:text-[30px] lg:leading-[23.88px] py-3 font-[800] text-[#333333]">SUBSCRIBE </p>
                {issubscribe ? (
                  <motion.div className="underlineHeader" layoutId="underline" />
                ) : null}
              </div>
            </div>
          </div> */}

          {issubscribe ?
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  // key={selectedTab ? selectedTab.label : "empty"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`py-3 bg-[#FBAE36] w-full flex gap-x-4 lg:justify-between items-center h-[108px]`}>
                    <div className="ml-4 w-1/2 lg:ml-10 whitespace-nowrap">
                      <div className="flex gap-x-6">
                        <div>
                          <h3 className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Meal Package</h3>
                          <FilterButton align="right" setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} />
                        </div>
                        <div >
                          <h3 className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Frequency</h3>
                          <FrequencyDropDown align="right" setDropdownOpen={setFrequentlyOpen} dropdownOpen={frequentlyOpen} />
                        </div>
                      </div>

                    </div>
                    <div className="flex  w-1/2 overflow-x-auto flex-1 whitespace-nowrap  scrollbar-hide flex-row items-center ">
                      <div className="flex flex-row items-center gap-x-2 mr-10">
                        <p className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Fill your box 📦</p>
                      </div>
                      <div className="flex flex-row items-center overflow-x-auto flex-1 whitespace-nowrap  scrollbar-hide">
                        <SpiceLevel />
                      </div>
                      <div aria-haspopup="true" aria-expanded={showModel} onClick={() => { setShowModel(!showModel) }} className="bg-[#f1663c] flex justify-center items-center rounded-tl-md rounded-bl-md h-[78px] w-[55px]">
                        <img src={cardIcon} alt="" className="w-8 h-8" />
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
            <div className=""><ProductFliter /></div>
            <div className="p-[20px] lg:p-[60px]">

              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ y: 100, x: -100, opacity: 0 }}
                  animate={{ y: 0, x: 0, opacity: 1 }}
                  exit={{ y: -100, x: 100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    ref={productEdgesRef}
                    className="container mx-auto grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10"
                  >
                    {transformedProducts?.map((product, productIndex) => {
                      // Determine if this is a long product layout
                      const isLong = isIpaid ? (productIndex % 5 === 0) :
                        ((productIndex % 15 === 0) ||
                          (productIndex % 15 === 6) ||
                          (productIndex % 15 === 10));


                      const productLargeImage =
                        product?.metafields?.find((mf) => mf?.key === 'product_large_card_image')?.reference?.image?.originalSrc;
                      const productSmallImage =
                        product?.metafields?.find((mf) => mf?.key === 'product_small_card_image')?.reference?.image?.originalSrc;

                      const productPrice = product.priceRange.minVariantPrice.amount;
                      const categoryTag = product.superTitle; // Replace with appropriate category if available

                      return isLong ? (
                        <ProductBigCard
                          key={product?.id}
                          product={product}
                          categoryTag={categoryTag}
                          productLargeImage={productLargeImage}
                          productSmallImage={productSmallImage}
                          shaking={shaking}
                          setIsShaking={setIsShaking}
                          cartResponse={cartResponse}
                          cartDatas={cartDatas}
                          addCartData={addCartData}
                          productPrice={productPrice}
                          setCartResponse={setCartResponse}
                          setLoading={setLoading}
                          loading={loading}
                        />
                      ) : (
                        <ProductSmallCard
                          key={product?.id}
                          product={product}
                          categoryTag={categoryTag}
                          productSmallImage={productSmallImage}
                          shaking={shaking}
                          setIsShaking={setIsShaking}
                          cartResponse={cartResponse}
                          cartDatas={cartDatas}
                          addCartData={addCartData}
                          productPrice={productPrice}
                          setCartResponse={setCartResponse}
                          setLoading={setLoading}
                          loading={loading}
                        />
                      );
                      // return isLong ? (
                      //   <>
                      //     <div
                      //       key={product.id + 123}
                      //       className="flex md:hidden group cursor-pointer col-span-2 border-b-2 border-[#CCCCCC] px-2 pt-2 pb-[24px]"
                      //       onClick={() => {
                      //         navigate(`/product-details/${product.handle}`);
                      //       }}
                      //     >
                      //       <div className="w-2/5 relative flex justify-center items-center overflow-hidden">
                      //         <img
                      //           src={productSmallImage}
                      //           alt={product.title}
                      //           className="w-full h-full object-cover group-hover:scale-110 transform transition-transform duration-200 rounded-3xl"
                      //         />
                      //       </div>
                      //       <div className="w-3/5 flex flex-col justify-center pl-3 py-1">
                      //         <div>
                      //           <div className='flex flex-row justify-between'>
                      //             <button
                      //               type="button"
                      //               className="bg-[#279C66] flex text-[#FAFAFA] text-[12px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                      //             >
                      //               {categoryTag}
                      //             </button>
                      //             <p className="font-skillet flex font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                      //               ₹ {Math.floor(productPrice)}
                      //             </p>
                      //           </div>
                      //           <p className="font-skillet font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                      //             {product.title}
                      //           </p>
                      //         </div>
                      //         <div className="flex gap-2 mt-3">

                      //           <button
                      //             type="button"
                      //             onClick={(e) => {
                      //               e.stopPropagation();
                      //               handleAddToCart(product.variants.edges[0].node.id);
                      //             }}
                      //             className={`${shaking === product.variants.edges[0].node.id ? '' : ''
                      //               } bg-[#279C66] text-[#FAFAFA]  w-full flex justify-center items-center text-[12px]  rounded-lg pt-[4px] pb-[4px] font-regola-pro font-[600]`}
                      //           >
                      //             {shaking === product.variants.edges[0].node.id ? (
                      //               <div className="spinner1"></div>
                      //             ) : (
                      //               'ADD TO CART'
                      //             )}
                      //           </button>
                      //           {/* <button
                      //             onClick={(e) => e.stopPropagation()}
                      //             type="button"
                      //             className="bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px]  font-[600]"
                      //           >
                      //             BUY NOW
                      //           </button> */}
                      //         </div>
                      //       </div>
                      //     </div>
                      //     <div className="hidden md:grid col-span-2 bg-[#EADEC1] rounded-3xl cursor-pointer group overflow-hidden" onClick={() => { navigate(`/product-details/${product.handle}`) }} key={product.id}>
                      //       <AnimatePresence mode="popLayout">
                      //         <motion.div
                      //           initial={{ y: 500, opacity: 0 }}
                      //           animate={{ y: 0, opacity: 1 }}
                      //           exit={{ y: -500, opacity: 0 }}
                      //           transition={{ duration: 0.3 }}
                      //         >
                      //           <div className="relative flex overflow-hidden justify-center items-center">
                      //             <img
                      //               src={productLargeImage}
                      //               alt={product.title}
                      //               className="w-full h-[290px] rounded-t-3xl object-cover group-hover:scale-110 transform transition-transform duration-200"
                      //             />
                      //             <button
                      //               type="button"
                      //               className="bg-[#FBAE36] text-[18px] leading-[27.08px] absolute top-5 left-5 text-[#333333] px-3 rounded-[10px] py-[4px] tracking-[0.12em] font-regola-pro uppercase font-[600]"
                      //             >
                      //               {categoryTag}
                      //             </button>
                      //           </div>
                      //           <div className="px-10 py-3">
                      //             <div className="flex flex-row justify-between pt-[18px] pb-2">
                      //               <p className="font-skillet font-[400] uppercase text-[#333333] text-[36px] leading-[28.65px]">
                      //                 {product.title}
                      //               </p>
                      //               {!issubscribe && <p className="font-skillet whitespace-nowrap font-[400] uppercase text-[#333333] text-[36px] leading-[28.65px]">
                      //                 ₹ {Math.floor(productPrice)}
                      //               </p>}
                      //             </div>
                      //             <p className="text-[16px] md:leading-[12.73px] leading-4 font-[500] font-regola-pro text-[#757575] pt-2 pb-3">
                      //               {product.description.length > 80
                      //                 ? `${product.description.substring(0, 80)}...`
                      //                 : product.description}
                      //             </p>

                      //             <div className="flex gap-x-2 md:gap-x-4 mt-1">
                      //               {issubscribe ? (
                      //                 <button
                      //                   type="button"
                      //                   onClick={(e) => {
                      //                     e.stopPropagation();
                      //                     handleAddToDraftOrder(product.variants.edges[0].node.id); // Function for "ADD TO BOX"
                      //                   }}
                      //                   className="border-2 border-[#333333] w-[150px] flex justify-center items-center text-[#333333] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]"
                      //                 >
                      //                   ADD TO BOX
                      //                 </button>
                      //               ) : (
                      //                 <button
                      //                   type="button"
                      //                   onClick={(e) => {
                      //                     e.stopPropagation();
                      //                     handleAddToCart(product.variants.edges[0].node.id); // Function for "ADD TO CART"
                      //                   }}
                      //                   className={` ${shaking === product.variants.edges[0].node.id ? '' : ''} border-2 border-[#333333] w-[150px] flex justify-center items-center text-[#333333] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]`}
                      //                 >
                      //                   {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                      //                 </button>
                      //               )}

                      //               <button
                      //                 onClick={(e) => e.stopPropagation()}
                      //                 type="button"
                      //                 className="bg-[#26965C] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] whitespace-nowrap font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]"
                      //               >
                      //                 BUY NOW
                      //               </button>
                      //             </div>
                      //           </div>
                      //         </motion.div>
                      //       </AnimatePresence>
                      //     </div>
                      //   </>
                      // ) : (
                      //   <>
                      //     <div
                      //       key={product.id + 1000}
                      //       className="flex md:hidden group cursor-pointer col-span-2 border-b-2 border-[#CCCCCC]  px-2 pt-2 pb-[24px]"
                      //       onClick={() => {
                      //         navigate(`/product-details/${product.handle}`);
                      //       }}
                      //     >
                      //       <div className="w-2/5 relative flex justify-center items-center overflow-hidden">
                      //         <img
                      //           src={productSmallImage}
                      //           alt={product.title}
                      //           className="w-full h-full object-cover group-hover:scale-110 transform transition-transform duration-200 rounded-3xl"
                      //         />
                      //       </div>
                      //       <div className="w-3/5 flex flex-col justify-center pl-3 py-1">
                      //         <div>
                      //           <div className='flex flex-row justify-between'>
                      //             <button
                      //               type="button"
                      //               className="bg-[#279C66] flex text-[#FAFAFA] text-[12px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                      //             >
                      //               {categoryTag}
                      //             </button>
                      //             <p className="font-skillet flex font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                      //               ₹ {Math.floor(productPrice)}
                      //             </p>
                      //           </div>
                      //           <p className="font-skillet font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                      //             {product.title}
                      //           </p>
                      //         </div>
                      //         <div className="flex gap-2 mt-3">
                      //           <button
                      //             type="button"
                      //             onClick={(e) => {
                      //               e.stopPropagation();
                      //               handleAddToCart(product.variants.edges[0].node.id);
                      //             }}
                      //             className={`${shaking === product.variants.edges[0].node.id ? '' : ''
                      //               } bg-[#279C66] text-[#FAFAFA] w-full flex justify-center items-center text-[12px]  rounded-lg pt-[4px] pb-[4px] font-regola-pro font-[600]`}
                      //           >
                      //             {shaking === product.variants.edges[0].node.id ? (
                      //               <div className="spinner1"></div>
                      //             ) : (
                      //               'ADD TO CART'
                      //             )}
                      //           </button>
                      //           {/* <button
                      //            style={{display:"none"}}
                      //             onClick={(e) => e.stopPropagation()}
                      //             type="button"
                      //             className="bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px]  font-[600]"
                      //           >
                      //             BUY NOW
                      //           </button> */}
                      //         </div>
                      //       </div>
                      //     </div>
                      //     <div key={product.id} className="hidden md:flex bg-[#EADEC1] md:col-span-1 rounded-3xl cursor-pointer group" onClick={() => { navigate(`/product-details/${product.handle}`) }}>
                      //       <AnimatePresence mode="wait">
                      //         <motion.div
                      //           initial={{ y: 500, x: -500, opacity: 0 }}
                      //           animate={{ y: 0, x: 0, opacity: 1 }}
                      //           exit={{ y: -500, x: 500, opacity: 0 }}
                      //           transition={{ duration: 0.4 }}
                      //           className="h-full"
                      //         >
                      //           <div className="relative rounded-t-3xl md:h-full rounded-b-[0px]  md:rounded-3xl flex justify-center overflow-hidden items-center">
                      //             <img
                      //               src={productSmallImage}
                      //               alt={product.title}
                      //               className="w-full h-full  rounded-t-3xl rounded-b-[0px]  md:rounded-3xl group-hover:scale-110 transform transition-transform duration-200"
                      //             />
                      //             <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full">
                      //               <div className="p-2 md:p-5">
                      //                 <button
                      //                   type="button"
                      //                   className="bg-[#279C66] text-[#FAFAFA] text-[12px] md:text-[18px] md:leading-[27.08px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600]"
                      //                 >
                      //                   {categoryTag}
                      //                 </button>
                      //               </div>
                      //               <div className="px-3 md:pl-8 pb-2 md:pb-6 p-[20px] md:pt-[120px] bg-gradient-to-b from-primary rounded-b-[0px]  md:rounded-b-3xl to-secondary w-full">
                      //                 <div className="flex flex-row justify-between items-center mb-2 md:mb-5">
                      //                   <p className="font-skillet font-[400] text-[#FAFAFA] text-[16px] leading-3 md:text-[36px] md:leading-[28.65px] uppercase max-w-[80%]">
                      //                     {product.title}
                      //                   </p>
                      //                   {!issubscribe && <p className="font-skillet font-[400] text-[#FAFAFA]   text-[16px] leading-3 md:text-[36px] md:leading-[28.65px] uppercase">
                      //                     ₹ {Math.floor(productPrice)}
                      //                   </p>}
                      //                 </div>
                      //                 <div className="hidden md:flex md:flex-row md:gap-4">
                      //                   {issubscribe ? (
                      //                     <button
                      //                       type="button"
                      //                       onClick={(e) => {
                      //                         e.stopPropagation();
                      //                         handleAddToDraftOrder(product.variants.edges[0].node.id); // Different function for Add to Box
                      //                       }}
                      //                       className="border-2 border-[#FAFAFA] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[600] leading-[21.28px] tracking-[0.12em]"
                      //                     >
                      //                       ADD TO BOX
                      //                     </button>
                      //                   ) : (
                      //                     <button
                      //                       type="button"
                      //                       onClick={(e) => {
                      //                         e.stopPropagation();
                      //                         handleAddToCart(product.variants.edges[0].node.id); // Function for Add to Cart
                      //                       }}
                      //                       className={` ${shaking === product.variants.edges[0].node.id ? '' : ''} border-2 border-[#FAFAFA] text-[#FAFAFA] md:w-[150px] flex justify-center items-center px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[600] leading-[21.28px] tracking-[0.12em]`}
                      //                     >
                      //                       {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                      //                     </button>
                      //                   )}


                      //                   <button
                      //                     onClick={(e) => e.stopPropagation()}
                      //                     type="button"
                      //                     className="bg-[#279C66] mt-2 md:mt-0 text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[600] leading-[21.28px] tracking-[0.12em]"
                      //                   >
                      //                     BUY NOW
                      //                   </button>
                      //                 </div>
                      //               </div>
                      //             </div>
                      //           </div>
                      //           <div className="mt-3 mb-3 gap-1 md:hidden flex justify-center items-center flex-row ">
                      //             <button
                      //               type="button"
                      //               onClick={(e) => {
                      //                 e.stopPropagation();
                      //                 handleAddToCart(product.variants.edges[0].node.id)
                      //               }
                      //               }
                      //               className={` ${shaking === product.variants.edges[0].node.id ? '' : ''}  border-2 border-[#333333] text-[#333333] md:w-[150px] flex justify-center items-center md:px-2 px-[8px] text-[10px] leading-3 rounded-lg pt-[4px] pb-[4px] font-regola-pro md:text-[16px] font-[600] md:leading-[21.28px] `}
                      //             >
                      //               {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                      //             </button>
                      //             <button
                      //               onClick={(e) => e.stopPropagation()}
                      //               type="button"
                      //               className="bg-[#279C66] text-[#FAFAFA] md:px-2 px-[8px] rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[10px] leading-4 md:text-[16px] font-[600] md:leading-[21.28px]"
                      //             >
                      //               BUY NOW
                      //             </button>
                      //           </div>
                      //         </motion.div>
                      //       </AnimatePresence>
                      //     </div>
                      //   </>
                      // );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
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
            <div onClick={e => { e.stopPropagation() }} className={`flex  flex-col w-full md:w-[500px] bg-[#EADEC1] gap-2 h-full relative top-[100px] }`}>
              <h1 className="text-[27px] font-[400] leading-[27.55px] font-skillet p-[40px] pt-[20px] pb-0">Review your monthly box</h1>
              <div className="p-[40px] pt-5 h-[65vh] pb-32 overflow-x-scroll">
                {draftOrderResponse?.draftOrder?.lineItems?.edges?.map((item, index) => {
                  const productId = item?.node?.variant?.id;
                  const quantity = item?.node?.quantity || 0;
                  const title = item?.node?.variant?.product?.title || "Product Title";
                  const imageUrl = item?.node?.variant?.product?.metafields?.edges?.find(edge => edge.node.key === "image_for_home")
                    ?.node?.reference?.image?.originalSrc || '';

                  return (
                    Array.from({ length: quantity }).map((_, i) => (
                      <div key={`${index}-${i}`} className='flex items-end justify-between pb-2 pt-1 border-b-[0.67px] border-[#A3A3A3]'>
                        <div className='flex flex-row'>
                          <img src={imageUrl} alt={title} className='h-[58px] w-[58px] rounded-lg' />
                          <div className='ml-4'>
                            <h1 className='text-xl md:text-[16px] font-regola-pro font-[700] leading-[21.7px] text-[#333333]'>
                              {title}
                            </h1>
                          </div>
                        </div>
                        <div>
                          <button
                            type='button'
                            className='text-[#FAFAFA] bg-[#f2673d9b] px-5 py-2 font-regola-pro font-[500] text-[13px] leading-[17px] rounded-lg'
                            onClick={() => handleRemoveToDraftOrder(productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  );
                })}
              </div>
              <div className="fixed bottom-0 bg-[#EADEC1]  px-[40px] py-8 shadow-[0px_-3px_5px_#0000002E] w-full md:w-[500px] z-[500] ">
                <div className="flex justify-between">
                  <h1 className="font-[400] text-[32.5px] leading-[33px] text-[#000000] font-skillet"><span className="font-[700] font-regola-pro text-[24.5px] leading-[32px]">₹</span>510</h1>
                  <div className="flex flex-col md:flex-row md:gap-4">
                    <button type="button" className="bg-[#f1663ccc] w-[122px] text-center text-[#FAFAFA] px-2 text-[22px] leading-[22px] font-[400] rounded-lg  font-skillet">Add to cart</button>
                    <button type="button" onClick={() => { setShowModel(false) }} className="bg-[#000000E8] w-[122px] text-center text-[#FAFAFA] px-2 text-[22px] leading-[22px] font-[400] rounded-lg  font-skillet">Checkout</button>
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

export default ReadyToEat;
