import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  createCartMutation,
  getProductDetailQuery,
  getProductRecommendedQuery,
  graphQLClient,
  updateCartItemMutation,
  updateCartMutation,
} from "../api/graphql";
import redChillyImage from "../assets/red-chilly.svg";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addCartData,
  cartData,
  selectCartResponse,
  setCartResponse,
} from "../state/cartData";
import { useDispatch, useSelector } from "react-redux";
import LoadingAnimation from "./Loader";

const ProductDetail = () => {
  const location = useLocation();
  const [apiProductResponse, setApiProductResponse] = useState(null);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [dataRecommended, setDataRecommended] = useState(null);
  const cartDatas = useSelector(cartData);
  const cartResponse = useSelector(selectCartResponse);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const refs = useRef([]);

  const scrollToImage = (i) => {
    setCurrentImage(i);
    if (refs.current[i] && refs.current[i].current) {
      refs.current[i].current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  useEffect(() => {
    scrollToImage(currentImage);
  }, [currentImage])

  const totalImages = images?.length;

  const nextImage = () => {
    const nextIndex = (currentImage + 1) % totalImages;
    scrollToImage(nextIndex);
  };

  const previousImage = () => {
    const prevIndex = (currentImage - 1 + totalImages) % totalImages;
    scrollToImage(prevIndex);
  };

  const sliderControl = (isLeft) => (
    <button
      type="button"
      onClick={isLeft ? previousImage : nextImage}
      className={`absolute text-white text-2xl z-10 bg-black h-10 w-10 rounded-full opacity-50 ${images.length === 1 ? "hidden" : ""} flex items-center justify-center ${isLeft ? '-left-10' : '-right-10'
        }`}
      style={{ top: '40%' }}
    >
      <span role="img" className='text-sm' aria-label={`Arrow ${isLeft ? 'left' : 'right'}`}>
        {isLeft ? '◀' : '▶'}
      </span>
    </button>
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage(prevCurrentImage => (prevCurrentImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images?.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getProductDetail = async () => {
          const response = await graphQLClient.request(getProductDetailQuery, {
            productId: location.state?.id || productId,
          });
          setData(response.product);
          setImages(response?.product?.images?.edges.map(edge => edge.node?.src))
          refs.current = response?.product?.images?.edges.map(() => React.createRef());
          setApiProductResponse(true);
        };

        const getProductRecommended = async () => {
          const response = await graphQLClient.request(getProductRecommendedQuery, {
            productId: location.state?.id || productId,
          });
          const recommendedList = response.productRecommendations.map(data => ({
            ...data,
            qty: 0,
          }));
          setDataRecommended(recommendedList);
        };

        await Promise.all([getProductDetail(), getProductRecommended()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state?.id]);


  const getMetafieldData = (key, list) => {
    let metaContent = "";
    if (list) {
      let findValue = list.find((x) => x.key === key);
      if (findValue) {
        metaContent = findValue.value;
      }
    }
    return metaContent;
  };

  const handleAddToCart = (productId, sellingPlanId) => {
    if (cartDatas === null) {
      if (sellingPlanId) {
        addToCart({ merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
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
        updateCartItem(cartId, { id: id, sellingPlanId: sellingPlanId, quantity: quantityInCart + 1 });
      } else {
        updateCartItem(cartId, { id: id, quantity: quantityInCart + 1 });
      }
    } else {
      const cartId = cartDatas?.cartCreate?.cart?.id;
      if (sellingPlanId) {
        updateCart(cartId, { merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
      } else {
        updateCart(cartId, { merchandiseId: productId, quantity: 1 });
      }
    }
  };

  const handleRemoveFromCart = (productId, sellingPlanId) => {
    const productInCart = cartResponse.cart.lines.edges.find((cartItem) => {
      return cartItem.node.merchandise.id === productId;
    });

    if (productInCart) {
      const quantityInCart = productInCart.node.quantity;
      const cartId = cartDatas?.cartCreate?.cart?.id;
      const id = productInCart?.node?.id;
      if (sellingPlanId) {
        updateCartItem(cartId, {
          id: id,
          sellingPlanId: sellingPlanId,
          quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
        });
      } else {
        updateCartItem(cartId, {
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
    const response = await graphQLClient.request(createCartMutation, params);
    dispatch(addCartData(response));
  };

  const updateCartItem = async (cartId, cartItem) => {
    const params = {
      cartId: cartId,
      lines: cartItem,
    };
    const response = await graphQLClient.request(
      updateCartItemMutation,
      params
    );
    dispatch(setCartResponse(response.cartLinesUpdate));
  };

  const updateCart = async (cartId, cartItem) => {
    const params = {
      cartId: cartId,
      lines: [cartItem],
    };
    const response = await graphQLClient.request(updateCartMutation, params);
    dispatch(setCartResponse(response.cartLinesAdd));
  };

  const [openCategoryMeals, setOpenCategoryMeals] = useState(null);

  const toggleCategoryMeals = (id) => {
    setOpenCategoryMeals(openCategoryMeals === id ? null : id);
  };

  const getProductQuantityInCart = (productId) => {
    const productInCart = cartResponse?.cart?.lines?.edges?.find((cartItem) => {
      return cartItem.node.merchandise.id === productId;
    });
    return productInCart ? productInCart?.node?.quantity : 0;
  };

  const accordianData = [
    {
      title: "Ingredient",
      description: getMetafieldData("ingredient", data?.metafields),
      id: 1,
    },
    {
      title: "Nutrition Facts",
      description: getMetafieldData("nutrition_facts", data?.metafields),
      id: 2,
    },
    {
      title: "How To Prepare",
      description: getMetafieldData("how_to_prepare", data?.metafields),
      id: 3,
    },
  ];

  const categoryVariants = {
    open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
    closed: {
      borderBottomRightRadius: "0.375rem",
      borderBottomLeftRadius: "0.375rem",
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.state?.id]);

  return (
    <>
      {apiProductResponse ? (
        <section className="text-gray-600 body-font home1 bg-[#FFFFFF]">
          <div className="container mx-auto flex px-5 py-8 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 px-3 lg:px-16  md:px-10 flex flex-col md:text-center items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-center text-[#53940F]">
                {data?.title}
              </h1>
              <div className="flex justify-center items-center relative">
                {images?.length > 0 && (
                  <>
                    {sliderControl(true)}
                    <div className="carousel">
                      {images.map((img, i) => (
                        <div
                          className="w-[200px]  flex-shrink-0"
                          key={i}
                          ref={refs.current[i]}
                        >
                          <img
                            src={img}
                            className="w-[200px] object-contain"
                            alt={`carousel-${i}`}
                          />
                        </div>
                      ))}
                    </div>
                    {sliderControl()}
                  </>
                )}
              </div>
              <p className="my-4 px-3 sm:px-10 leading-relaxed">
                {data?.description}
              </p>
              <div className="flex mb-3">
                {Array.from(
                  {
                    length:
                      data?.metafields?.find(
                        (metafield) => metafield?.key === "spice_level"
                      )?.value || 0,
                  },
                  (_, index) => (
                    <img
                      className="w-7"
                      key={index}
                      src={redChillyImage}
                      alt="chilly"
                    />
                  )
                )}
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => {
                    handleRemoveFromCart(data?.variants?.edges[0]?.node?.id, data?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id);
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z"
                      fill="#333333"
                    />
                  </svg>
                </button>
                <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                  {getProductQuantityInCart(data?.variants?.edges[0]?.node?.id)}
                </span>
                <button
                  onClick={() => {
                    handleAddToCart(data?.variants?.edges[0]?.node?.id, data?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id);
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.84615V8.30769H4.84615V9.69231H8.30769V13.1538H9.69231V9.69231H13.1538V8.30769H9.69231V4.84615H8.30769Z"
                      fill="#333333"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 mt-4 md:mt-0 w-5/6 mb-10 md:mb-0">
              {/*  accordion sadasdasd */}
              <div className="accordion-container m-2  text-[#333333]">
                {accordianData.map((item) => (
                  <div key={item.id} className="mb-2">
                    <motion.button
                      onClick={() => toggleCategoryMeals(item.id)}
                      className="px-5 py-2 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                      variants={categoryVariants}
                      initial="closed"
                      animate={
                        openCategoryMeals === item.id ? "open" : "closed"
                      }
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-normal text-lg">{item.title}</span>
                      <span>
                        <motion.svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ rotate: 0 }}
                          animate={{
                            rotate: openCategoryMeals === item.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.path
                            d="M6 9L0.803849 9.2855e-07L11.1962 1.83707e-06L6 9Z"
                            fill="#333333"
                          />
                        </motion.svg>
                      </span>
                    </motion.button>
                    <AnimatePresence>
                      {openCategoryMeals === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                        >
                          <p className="pt-2  border-t-[1px]  border-gray-600">
                            {item.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="container mx-auto flex  flex-col justify-center items-center">
            <h1 className="title-font sm:text-4xl text-3xl font-medium text-center text-[#53940F]">
              Recommended Sides
            </h1>
            <p className="font-medium text-base lg:text-xl">
              Recommended Sides with {data?.title}
            </p>
            <div className="flex bg-white justify-center flex-wrap">
              {dataRecommended?.map((item, index) => (
                <div
                  key={index}
                  className="m-2 w-40 lg:w-56  border rounded-2xl border-[#CFCFCF] flex flex-col items-center h-52 lg:h-80 p-2 lg:p-4"
                >
                  <img
                    src={item?.variants?.edges[0]?.node?.image?.url}
                    alt={item?.variants?.edges[0]?.node?.image?.altText}
                    className="w-20 h-20 lg:w-40 lg:h-40 mb-1 cursor-pointer"
                    onClick={() => {
                      navigate(`/productDetail`, {
                        state: { id: item.id },
                      });
                    }}
                  />
                  <h3
                    className="text-[#53940F] text-sm lg:text-lg font-medium text-center lg:font-semibold cursor-pointer"
                    onClick={() => {
                      navigate(`/productDetail`, {
                        state: { id: item.id },
                      });
                    }}
                  >
                    {item?.title}
                  </h3>
                  <p className="text-xs lg:text-base my-2">
                    {
                      item?.variants?.edges[0]?.node?.product?.metafields?.find(
                        (metafield) => metafield?.key === "small_descriptions"
                      )?.value
                    }
                  </p>
                  <div className="flex gap-1 mb-2">
                    {Array.from(
                      {
                        length:
                          item?.variants?.edges[0]?.node?.product?.metafields?.find(
                            (metafield) => metafield?.key === "spice_level"
                          )?.value || 0,
                      },
                      (_, index) => (
                        <img
                          className="w-6"
                          key={index}
                          src={redChillyImage}
                          alt="chilly"
                        />
                      )
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        handleRemoveFromCart(item?.variants?.edges[0].node.id, item?.variants?.edges[0].node?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id)
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z"
                          fill="#333333"
                        />
                      </svg>
                    </button>
                    <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                      {getProductQuantityInCart(
                        item?.variants?.edges[0].node.id
                      )}
                    </span>
                    <button
                      onClick={() =>
                        handleAddToCart(item?.variants?.edges[0].node.id, item?.variants?.edges[0].node?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id)
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.84615V8.30769H4.84615V9.69231H8.30769V13.1538H9.69231V9.69231H13.1538V8.30769H9.69231V4.84615H8.30769Z"
                          fill="#333333"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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
    </>
  );
};

export default ProductDetail;
