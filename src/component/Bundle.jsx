import React, { useState, useEffect, useRef } from "react";
import {
  checkoutCreate,
  createCartMutation,
  getProductCollectionsQuery,
  graphQLClient,
  updateCartItemMutation,
  updateCartMutation,
} from "../api/graphql";
import { useDispatch, useSelector } from "react-redux";
import { selectMealItems } from "../state/mealdata";
import { useNavigate } from "react-router-dom";
import { cartIsOpen, openCart } from "../state/cart";
import {
  addCartData,
  cartData,
  selectCartResponse,
  setCartResponse,
} from "../state/cartData";
import { totalQuantity, totalQuantityInDraftOrder } from "../utils";
import SpiceLevel from "../component/SpiceLevel";
import cardIcon from '../assets/cartnew.png';
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from '../component/DropdownFilter';
import { categoryrData } from "../state/selectedCategory";
import { isSubscribe, subscribeClose, subscribeOpen, } from "../state/subscribeData";
import FrequencyDropDown from "../component/FrequencyDropDown";
import ProductFliter from "../component/ProductFliter";
import { clearDraftOrderData, clearDraftOrderResponse, draftOrderData, selectDraftOrderResponse, setDraftOrderResponse } from "../state/draftOrder";
import { addDraftOrderData } from "../state/draftOrder";
import toast from 'react-hot-toast';
import { addBundleData, bundleData, clearBundleData, clearBundleResponse, selectBundleResponse, setBundleResponse } from "../state/bundleData";
import LoadingAnimation from "./Loader";
import { addCheckoutData, setCheckoutResponse } from "../state/checkoutData";

export const Bundle = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [rawResonse, setRawResponse] = useState(null);
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
  const selectedMealData = useSelector(selectMealItems);
  const bundleDatas = useSelector(bundleData);
  const bundleDataResponse = useSelector(selectBundleResponse);

  const [buyNowLoading, setBuyNowLoading] = useState(null)
  const handleAddToCheckout = async (variantId) => {
    try {
      setBuyNowLoading(variantId);
      const params = {
        input: {
          lineItems: [
            {
              variantId: variantId,
              quantity: 1,
            },
          ],
        },
      };
      const response = await graphQLClient.request(checkoutCreate, params);
      if (response?.checkoutCreate?.userErrors?.length > 0) {
        console.error('GraphQL user errors:', response.checkoutCreate.userErrors);
        return;
      }
      dispatch(setCheckoutResponse(response?.checkoutCreate));
      dispatch(addCheckoutData(response));
      setBuyNowLoading(null)
      dispatch(clearDraftOrderData());
      dispatch(clearDraftOrderResponse());
      dispatch(clearBundleData());
      dispatch(clearBundleResponse());
      navigate('/cardReview', { state: { isBuyNow: true } });
    } catch (error) {
      console.error('Error adding to checkout:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsIpaid(window.innerWidth <= 1280)
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
              const shouldInclude = rte?.value === "true";
              if (shouldInclude) {
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
  }, [selectedCategory]);


  const handleAddToCart = (productId, sellingPlanId) => {
    console.log("testt")
    setIsShaking(productId)
    if (cartDatas === null) {
      if (sellingPlanId) {
        addToCart({ merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
      } else {
        addToCart({ merchandiseId: productId, quantity: 1 });
      }
    }
    else {

      const productInCart = cartResponse?.cart?.lines?.edges.find(cartItem => {
        return cartItem.node.merchandise.id === productId;
      });

      if (productInCart) {
        const quantityInCart = productInCart.node.quantity;
        const cartId = cartDatas?.cartCreate?.cart?.id
        const id = productInCart?.node?.id
        if (sellingPlanId) {
          updateCartItem(cartId, { id: id, sellingPlanId: sellingPlanId, quantity: quantityInCart + 1 }, productId);
        } else {
          updateCartItem(cartId, { id: id, quantity: quantityInCart + 1 }, productId);
        }
      } else {
        const cartId = cartDatas?.cartCreate?.cart?.id
        if (sellingPlanId) {
          updateCart(cartId, { merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
        } else {
          updateCart(cartId, { merchandiseId: productId, quantity: 1 });
        }
      }
    }
  };

  const addToCart = async (cartItems) => {
    const params = {
      "cartInput": {
        "lines": [
          cartItems
        ]
      }
    }
    const response = await graphQLClient.request(createCartMutation, params);
    dispatch(addCartData(response))
    dispatch(setCartResponse(response.cartCreate))
    setShowModel(false);
    dispatch(clearDraftOrderData());
    dispatch(clearDraftOrderResponse());
    dispatch(clearBundleData());
    dispatch(clearBundleResponse());
    setIsShaking(null)
    // setLoading((prevLoading) => ({
    //     ...prevLoading,
    //     [cartItems.merchandiseId]: false,
    // }));
  }

  const updateCartItem = async (cartId, cartItem, id) => {
    const params = {
      "cartId": cartId,
      "lines": cartItem
    }
    const response = await graphQLClient.request(updateCartItemMutation, params);
    dispatch(setCartResponse(response.cartLinesUpdate));
    setShowModel(false);
    dispatch(clearDraftOrderData());
    dispatch(clearDraftOrderResponse());
    dispatch(clearBundleData());
    dispatch(clearBundleResponse());
    setIsShaking(null);
    // setLoading((prevLoading) => ({
    //     ...prevLoading,
    //     [id]: false,
    // }));
  }

  const updateCart = async (cartId, cartItem) => {
    const params = {
      "cartId": cartId,
      "lines": [
        cartItem
      ]
    }
    const response = await graphQLClient.request(updateCartMutation, params);
    dispatch(setCartResponse(response.cartLinesAdd));
    setShowModel(false);
    dispatch(clearDraftOrderData());
    dispatch(clearDraftOrderResponse());
    dispatch(clearBundleData());
    dispatch(clearBundleResponse());
    setIsShaking(null);
    // setLoading((prevLoading) => ({
    //     ...prevLoading,
    //     [cartItem.merchandiseId]: false,
    // }));
  }


  useEffect(() => {
    const fetchData = async () => {
      if (
        (selectedMealData?.no === draftOrderResponse?.draftOrder?.lineItems?.edges.reduce(
          (total, edge) => total + edge.node.quantity,
          0
        ) || 0)) {
        if (bundleDataResponse?.productId === undefined && bundleDataResponse === null) {
          setShowModel(true);
          setIsLoading(true); // Start loading

          try {
            const params = {
              metaobjectArray: draftOrderResponse?.draftOrder?.lineItems?.edges?.map((item) => ({
                id: item?.node?.variant?.product?.id,
                quantity: item?.node?.quantity,
                title: `${item?.node?.title} - ${item?.node?.quantity}`,
              })),
              productTitle: `${selectedMealData?.no} Meals`,
              productPrice: `${selectedMealData?.price}`,
            };

            const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/bundle-products`;

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(params),
            });

            if (!response.ok) {
              throw new Error("Failed to fetch bundle products");
            }

            const data = await response.json();
            dispatch(addBundleData(data));
            dispatch(setBundleResponse(data));
          } catch (error) {
            console.error("Error fetching bundle products:", error);
          } finally {
            setIsLoading(false); // End loading
          }
        }
      }
    };

    fetchData();
  }, [draftOrderResponse, selectedMealData]);

  const handleAddToDraftOrder = (productId) => {
    const maxQuantity = selectedMealData.no;
    let currentTotalQuantity =
      draftOrderResponse?.draftOrder?.lineItems?.edges.reduce(
        (total, edge) => total + edge.node.quantity,
        0
      ) || 0;
    if (currentTotalQuantity >= maxQuantity) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            }  rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
        >
          <div className="m-4">
            <div className="bg-white shadow-md flex flex-row gap-x-3 rounded px-4 py-2" role="alert">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <p className="text-gray-700 font-regola-pro">Cannot add more items.</p>
                  <p className="text-gray-700 font-regola-pro">Reached the maximum quantity limit.</p>
                </div>
              </div>
              <button onClick={() => toast.dismiss(t.id)} className="text-gray-600 hover:text-gray-900 transition duration-300" aria-label="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </div>
      ))
      return;
    }

    setIsShaking(productId);

    if (draftOrderItem === null) {
      if (currentTotalQuantity + 1 > maxQuantity) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              }  rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
          >
            <div className="m-4">
              <div className="bg-white shadow-md flex flex-row gap-x-3 rounded px-4 py-2" role="alert">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>
                    <p className="text-gray-700 font-regola-pro">Cannot add more items.</p>
                    <p className="text-gray-700 font-regola-pro">Reached the maximum quantity limit.</p>
                  </div>
                </div>
                <button onClick={() => toast.dismiss(t.id)} className="text-gray-600 hover:text-gray-900 transition duration-300" aria-label="Close">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>
        ))
        return;
      }
      addToDraftOrder({ variantId: productId, quantity: 1 });
    } else {
      let lineItemsArray =
        draftOrderResponse?.draftOrder?.lineItems?.edges.map((edge) => ({
          variantId: edge.node.variant.id,
          quantity: edge.node.quantity,
        })) || [];

      const productIndex = lineItemsArray.findIndex(
        (item) => item.variantId === productId
      );
      const draftOrderId = draftOrderItem?.draftOrderCreate?.draftOrder?.id;

      if (productIndex !== -1) {
        if (currentTotalQuantity + 1 > maxQuantity) {
          toast.error("Cannot increase quantity. Exceeds the maximum quantity limit.");
          return;
        }
        lineItemsArray[productIndex].quantity += 1;
      } else {
        if (currentTotalQuantity + 1 > maxQuantity) {
          toast.error("Cannot add this item. Exceeds the maximum quantity limit.");
          return;
        }
        lineItemsArray.push({ variantId: productId, quantity: 1 });
      }

      updateDraftOrder(draftOrderId, lineItemsArray);
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
    setIsShaking(null);
  };


  const handleRemoveToDraftOrder = async (productId) => {
    try {
      if (bundleDataResponse?.productId !== undefined && bundleDataResponse) {
        setIsLoading(true); // Start loading before the API call

        const params = {
          productId: bundleDataResponse?.productId,
        };

        const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/delete-product`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          throw new Error("Failed to delete the product.");
        }

        const data = await response.json();
        dispatch(clearBundleData());
        dispatch(clearBundleResponse());
      }

      let lineItemsArray =
        draftOrderResponse?.draftOrder?.lineItems?.edges.map((edge) => ({
          variantId: edge.node.variant.id,
          quantity: edge.node.quantity,
        })) || [];

      const productIndex = lineItemsArray.findIndex(
        (item) => item.variantId === productId
      );
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
    } catch (error) {
      console.error("Error removing product from draft order:", error);
    } finally {
      setIsLoading(false); // End loading after the API call
    }
  };



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
    setIsShaking(null);
  };


  return (
    <div className="min-h-[75vh] w-full bg-[#EFE9DA]">
      <>
        <AnimatePresence mode="wait">
          <motion.div
            // key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`py-3 bg-[#FBAE36] w-full flex gap-x-4 flex-col lg:flex-row lg:justify-between lg:items-center lg:h-[108px]`}>
              <div className="ml-4 lg:w-1/2 lg:ml-10 whitespace-nowrap">
                <div className="flex flex-col md:flex-row gap-x-6">
                  <div>
                    <h3 className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Meal Package</h3>
                    <FilterButton align="right" setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} />
                  </div>
                  {/* <div >
                    <h3 className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Frequency</h3>
                    <FrequencyDropDown align="right" setDropdownOpen={setFrequentlyOpen} dropdownOpen={frequentlyOpen} />
                  </div> */}
                </div>

              </div>
              <div className="flex lg:hidden flex-row gap-x-2 px-4 py-2">
                <p className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Fill your box 📦</p>
              </div>
              <div className="flex w-full pl-4 lg:pl-0  lg:w-1/2 overflow-x-auto lg:overscroll-none lg:whitespace-nowrap flex-row items-center ">
                <div className="lg:flex hidden flex-row items-center gap-x-2 mr-10">
                  <p className="text-[#231F20] font-skillet text-2xl lg:text-[32px] lg:leading-[32.29px] font-[400]">Fill your box 📦</p>
                </div>
                <div className="flex flex-row items-center overflow-x-auto flex-1 whitespace-nowrap  scrollbar-hide">
                  <SpiceLevel />
                </div>
                <div aria-haspopup="true" aria-expanded={showModel} onClick={() => { setShowModel(!showModel) }} className="bg-[#f1663c] flex justify-center items-center rounded-tl-md rounded-bl-md h-[78px] w-[55px]">
                  <img src={cardIcon} alt="" className="w-8 h-8" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </>

      <div className=""><ProductFliter excludeCategories={['Bundles']} /></div>
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
                  <>
                    <div
                      key={product.id + 123}
                      className="flex md:hidden group cursor-pointer col-span-2 border-b-2 border-[#CCCCCC] px-2 pt-2 pb-[24px]"
                      onClick={() => {
                        navigate(`/product-details/${product.handle}`);
                      }}
                    >
                      <div className="w-2/5 relative flex justify-center items-center overflow-hidden">
                        <img
                          src={productSmallImage}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transform transition-transform duration-200 rounded-3xl"
                        />
                      </div>
                      <div className="w-3/5 flex flex-col justify-center pl-3 py-1">
                        <div>
                          <div className='flex flex-row justify-between'>
                            <button
                              type="button"
                              className="bg-[#279C66] flex text-[#FAFAFA] text-[12px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                            >
                              {categoryTag}
                            </button>
                            <p className="font-skillet flex font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                              ₹ {Math.floor(productPrice)}
                            </p>
                          </div>
                          <p className="font-skillet font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                            {product.title}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">


                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToDraftOrder(product.variants.edges[0].node.id); // Different function for Add to Box
                            }}
                            className="bg-[#279C66] text-[#FAFAFA] w-full flex justify-center items-center text-[12px]  rounded-lg pt-[4px] pb-[4px] font-regola-pro font-[600]"
                          >
                            {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO BOX'}
                          </button>

                          {/* <button
                            onClick={(e) => e.stopPropagation()}
                            type="button"
                            className="bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px]  font-[600]"
                          >
                            BUY NOW
                          </button> */}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:grid col-span-2 bg-[#EADEC1] rounded-3xl cursor-pointer group overflow-hidden" onClick={() => { navigate(`/product-details/${product.handle}`) }} key={product.id}>
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          initial={{ y: 500, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -500, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative flex overflow-hidden justify-center items-center">
                            <img
                              src={productLargeImage}
                              alt={product.title}
                              className="w-full h-[290px] rounded-t-3xl object-cover group-hover:scale-110 transform transition-transform duration-200"
                            />
                            <button
                              type="button"
                              className="bg-[#FBAE36] text-[18px] leading-[27.08px] absolute top-5 left-5 text-[#333333] px-3 rounded-[10px] py-[4px] tracking-[0.12em] font-regola-pro uppercase font-[600]"
                            >
                              {categoryTag}
                            </button>
                          </div>
                          <div className="px-10 py-3">
                            <div className="flex flex-row justify-between pt-[18px] pb-2">
                              <p className="font-skillet font-[400] uppercase text-[#333333] text-[36px] leading-[28.65px]">
                                {product.title}
                              </p>

                            </div>
                            <p className="text-[16px] md:leading-[12.73px] leading-4 font-[500] font-regola-pro text-[#757575] pt-2 pb-3">
                              {product.description.length > 80
                                ? `${product.description.substring(0, 80)}...`
                                : product.description}
                            </p>

                            <div className="flex gap-x-2 md:gap-x-4 mt-1">

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToDraftOrder(product.variants.edges[0].node.id); // Function for "ADD TO BOX"
                                }}
                                className="border-2 border-[#333333] w-[150px] flex justify-center items-center text-[#333333] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]"
                              >
                                {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO BOX'}
                              </button>


                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  fbq('track', 'InitiateCheckout', {
                                    content_name: product.title,
                                    content_ids: [product.variants.edges[0].node.id.split("/").pop()],
                                    content_type: 'product',
                                    value: product.priceRange?.minVariantPrice?.amount,
                                    currency: 'INR',
                                  });
                                  gtag('event', 'conversion', {
                                    'send_to': 'AW-16743837274/zisbCK38h_gZENrcirA-',
                                    'value': product.priceRange?.minVariantPrice?.amount,
                                    'currency': 'INR'
                                  });
                                  handleAddToCheckout(product.variants.edges[0].node.id)
                                }
                                }
                                type="button"
                                className="bg-[#26965C] text-[#FAFAFA] flex justify-center items-center px-2 rounded-lg pt-[4px] pb-[4px] whitespace-nowrap font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]"
                              >
                                {buyNowLoading === product?.variants.edges[0].node.id ? <div className="spinner1"></div> : 'BUY NOW'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      key={product.id + 1000}
                      className="flex md:hidden group cursor-pointer col-span-2 border-b-2 border-[#CCCCCC]  px-2 pt-2 pb-[24px]"
                      onClick={() => {
                        navigate(`/product-details/${product.handle}`);
                      }}
                    >
                      <div className="w-2/5 relative flex justify-center items-center overflow-hidden">
                        <img
                          src={productSmallImage}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transform transition-transform duration-200 rounded-3xl"
                        />
                      </div>
                      <div className="w-3/5 flex flex-col justify-center pl-3 py-1">
                        <div>
                          <div className='flex flex-row justify-between'>
                            <button
                              type="button"
                              className="bg-[#279C66] flex text-[#FAFAFA] text-[12px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                            >
                              {categoryTag}
                            </button>
                            <p className="font-skillet flex font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                              ₹ {Math.floor(productPrice)}
                            </p>
                          </div>
                          <p className="font-skillet font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                            {product.title}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToDraftOrder(product.variants.edges[0].node.id); // Different function for Add to Box
                            }}
                            className="bg-[#279C66] text-[#FAFAFA] w-full flex justify-center items-center text-[12px]  rounded-lg pt-[4px] pb-[4px] font-regola-pro font-[600]"
                          >
                            {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO BOX'}
                          </button>

                          {/* <button
                            onClick={(e) => e.stopPropagation()}
                            type="button"
                            className="bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px]  font-[600]"
                          >
                            BUY NOW
                          </button> */}
                        </div>
                      </div>
                    </div>
                    <div key={product.id} className="hidden md:flex bg-[#EADEC1] md:col-span-1 rounded-3xl cursor-pointer group" onClick={() => { navigate(`/product-details/${product.handle}`) }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          initial={{ y: 500, x: -500, opacity: 0 }}
                          animate={{ y: 0, x: 0, opacity: 1 }}
                          exit={{ y: -500, x: 500, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="h-full"
                        >
                          <div className="relative rounded-t-3xl md:h-full rounded-b-[0px]  md:rounded-3xl flex justify-center overflow-hidden items-center">
                            <img
                              src={productSmallImage}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-t-3xl rounded-b-[0px]  md:rounded-3xl group-hover:scale-110 transform transition-transform duration-200"
                            />
                            <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full">
                              <div className="p-2 md:p-5">
                                <button
                                  type="button"
                                  className="bg-[#279C66] text-[#FAFAFA] text-[12px] md:text-[18px] md:leading-[27.08px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600]"
                                >
                                  {categoryTag}
                                </button>
                              </div>
                              <div className="px-3 md:pl-8 pb-2 md:pb-6 p-[20px] md:pt-[120px] bg-gradient-to-b from-primary rounded-b-[0px]  md:rounded-b-3xl to-secondary w-full">
                                <div className="flex flex-row justify-between items-center mb-2 md:mb-5">
                                  <p className="font-skillet font-[400] text-[#FAFAFA] text-[16px] leading-3 md:text-[36px] md:leading-[28.65px] uppercase max-w-[80%]">
                                    {product.title}
                                  </p>

                                </div>
                                <div className="hidden md:flex md:flex-row md:gap-4">

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToDraftOrder(product.variants.edges[0].node.id); // Different function for Add to Box
                                    }}
                                    className="border-2 border-[#FAFAFA] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[600] leading-[21.28px] tracking-[0.12em]"
                                  >
                                    {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO BOX'}
                                  </button>


                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      fbq('track', 'InitiateCheckout', {
                                        content_name: product.title,
                                        content_ids: [product.variants.edges[0].node.id.split("/").pop()],
                                        content_type: 'product',
                                        value: product.priceRange?.minVariantPrice?.amount,
                                        currency: 'INR',
                                      });
                                      gtag('event', 'conversion', {
                                        'send_to': 'AW-16743837274/zisbCK38h_gZENrcirA-',
                                        'value': product.priceRange?.minVariantPrice?.amount,
                                        'currency': 'INR'
                                      });
                                      handleAddToCheckout(product.variants.edges[0].node.id)
                                    }
                                    }
                                    type="button"
                                    className="bg-[#279C66] mt-2 md:mt-0 flex justify-center items-center text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[600] leading-[21.28px] tracking-[0.12em]"
                                  >
                                    {buyNowLoading === product?.variants.edges[0].node.id ? <div className="spinner1"></div> : 'BUY NOW'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 mb-3 gap-1 md:hidden flex justify-center items-center flex-row ">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                fbq('track', 'AddToCart', {
                                  content_name: product.title,
                                  content_ids: [product.variants.edges[0].node.id.split("/").pop()],
                                  content_type: 'product',
                                  value: product.priceRange?.minVariantPrice?.amount,
                                  currency: 'INR',
                                });
                                gtag('event', 'conversion', {
                                  'send_to': 'AW-16743837274/42HaCKu4_PcZENrcirA-',
                                  'value': product.priceRange?.minVariantPrice?.amount,
                                  'currency': 'INR'
                                });
                                handleAddToCart(product.variants.edges[0].node.id)
                              }
                              }
                              className={` ${shaking === product.variants.edges[0].node.id ? '' : ''}  border-2 border-[#333333] text-[#333333] md:w-[150px] flex justify-center items-center md:px-2 px-[8px] text-[10px] leading-3 rounded-lg pt-[4px] pb-[4px] font-regola-pro md:text-[16px] font-[600] md:leading-[21.28px] `}
                            >
                              {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                fbq('track', 'InitiateCheckout', {
                                  content_name: product.title,
                                  content_ids: [product.variants.edges[0].node.id.split("/").pop()],
                                  content_type: 'product',
                                  value: product.priceRange?.minVariantPrice?.amount,
                                  currency: 'INR',
                                });
                                gtag('event', 'conversion', {
                                  'send_to': 'AW-16743837274/zisbCK38h_gZENrcirA-',
                                  'value': product.priceRange?.minVariantPrice?.amount,
                                  'currency': 'INR'
                                });
                                handleAddToCheckout(product.variants.edges[0].node.id)
                              }
                              }
                              type="button"
                              className="bg-[#279C66] text-[#FAFAFA] flex justify-center items-center md:px-2 px-[8px] rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[10px] leading-4 md:text-[16px] font-[600] md:leading-[21.28px]"
                            >
                              {buyNowLoading === product?.variants.edges[0].node.id ? <div className="spinner1"></div> : 'BUY NOW'}
                            </button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {
        showModel ?
          <div onClick={() => { setShowModel(false) }} className={`fixed inset-0 bg-transparent h-full w-full flex items-center justify-end z-[200] `}>
            <div onClick={e => { e.stopPropagation() }} className={`flex  flex-col w-[90%] md:w-[500px] bg-[#EADEC1] gap-2 h-full relative top-[0] md:top-[100px] }`}>
              <h1 className="text-[27px] font-[400] leading-[27.55px] font-skillet p-[40px] pt-[20px] pb-0">Review your monthly box</h1>
              <div className="p-[20px] md:p-[40px] pt-5 h-[65vh] pb-32 overflow-x-scroll">
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
                          <div className='ml-4 mt-4'>
                            <h1 className='text-[16px] font-regola-pro font-[700] leading-[21.7px] text-[#333333]'>
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
              <div className="fixed bottom-0 bg-[#EADEC1] px-[20px] md:px-[40px] py-4 md:py-8 shadow-[0px_-3px_5px_#0000002E] w-[90%] md:w-[500px] z-[500] ">
                <div className="flex justify-between">
                  <h1 className="font-[400] text-[32.5px] leading-[33px] text-[#000000] font-skillet"><span className="font-[700] font-regola-pro text-[24.5px] leading-[32px]">₹</span>{selectedMealData?.price}</h1>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <button type="button" className="bg-[#f1663ccc] flex justify-center items-center w-[122px] text-center text-[#FAFAFA] px-2 text-[22px] leading-[22px] font-[400] rounded-lg  font-skillet"
                      onClick={() => {
                        handleAddToCart(bundleDataResponse?.variantId);
                        fbq('track', 'AddToCart', {
                          content_name: `${selectedMealData?.no} Meals`,
                          content_ids: [bundleDataResponse?.variantId.split("/").pop()],
                          content_type: 'product',
                          value: selectedMealData?.price,
                          currency: 'INR',
                        });
                        gtag('event', 'conversion', {
                          'send_to': 'AW-16743837274/42HaCKu4_PcZENrcirA-',
                          'value': selectedMealData?.price,
                          'currency': 'INR'
                        });
                      }}
                    >
                      {shaking === bundleDataResponse?.variantId ? <div className="spinner1"></div> : 'Add to cart'}
                    </button>
                    <button type="button" onClick={(e) => {
                      e.stopPropagation()
                      fbq('track', 'InitiateCheckout', {
                        content_name: `${selectedMealData?.no} Meals`,
                        content_ids: [bundleDataResponse?.variantId.split("/").pop()],
                        content_type: 'product',
                        value: selectedMealData?.price,
                        currency: 'INR',
                      });
                      gtag('event', 'conversion', {
                        'send_to': 'AW-16743837274/zisbCK38h_gZENrcirA-',
                        'value': selectedMealData?.price,
                        'currency': 'INR'
                      });
                      handleAddToCheckout(bundleDataResponse?.variantId)
                      setShowModel(false)
                    }
                    } className="bg-[#000000E8] w-[122px] text-center flex justify-center items-center text-[#FAFAFA] px-2 text-[22px] leading-[22px] font-[400] rounded-lg  font-skillet">

                      {buyNowLoading === bundleDataResponse?.variantId ? <div className="spinner1"></div> : 'Checkout'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          :
          ''
      }
      {isLoading && <LoadingAnimation />}
    </div>

  )
}
