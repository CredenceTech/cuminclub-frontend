import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeCart } from "../state/cart";
import { addCartData, cartData, selectCartResponse, setCartResponse } from "../state/cartData";
import { getCartQuery, graphQLClient, updateCartItemMutation, updateCartMutation } from "../api/graphql";
import { Link } from "react-router-dom";

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const cartDatas = useSelector(cartData);
  const [openCategoryMeals, setOpenCategoryMeals] = useState(null);
  const [openCategorySides, setOpenCategorySides] = useState(null);
  const cartResponse = useSelector(selectCartResponse);


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

  const categoryVariants = {
    open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
    closed: {
      borderBottomRightRadius: "0.375rem",
      borderBottomLeftRadius: "0.375rem",
    },
  };

  const handleAddToCart = (productId) => {
    if(cartDatas === null){
      addToCart({ merchandiseId: productId, quantity: 1 })
    }

    const productInCart = cartResponse?.cart?.lines?.edges.find(cartItem => {
      return cartItem.node.merchandise.id === productId;
    });

    if (productInCart) {
      const quantityInCart = productInCart.node.quantity;
      const  cartId = cartDatas?.cartCreate?.cart?.id
      const id = productInCart?.node?.id
      updateCartItem(cartId, {id : id, quantity: quantityInCart + 1})
    } else {
      const  cartId = cartDatas?.cartCreate?.cart?.id
      updateCart(cartId, { merchandiseId: productId, quantity: 1 })
    }
  };

  const handleRemoveFromCart = (productId) => {
    const productInCart = cartResponse.cart.lines.edges.find(cartItem => {
      return cartItem.node.merchandise.id === productId;
    });

    if (productInCart) {
      const quantityInCart = productInCart.node.quantity;
      const  cartId = cartDatas?.cartCreate?.cart?.id
      const id = productInCart?.node?.id
      updateCartItem(cartId, {id : id, quantity: quantityInCart === 1 ? 0 : quantityInCart - 1})
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
  }

 const updateCartItem = async(cartId, cartItem) => {
    const params = {
      "cartId": cartId,
      "lines": cartItem
    }
    const response = await graphQLClient.request(updateCartItemMutation, params);
    dispatch(setCartResponse(response.cartLinesUpdate));
  }

  const updateCart = async(cartId, cartItem) => {
    const params = {
      "cartId": cartId,
      "lines": [
        cartItem
      ]
    }
    const response = await graphQLClient.request(updateCartMutation, params);
    dispatch(setCartResponse(response.cartLinesAdd));
  }

  const toggleCategoryMeals = (category) => {
    setOpenCategoryMeals((prevOpenCategory) =>
      prevOpenCategory === category ? null : category
    );
  };

  const toggleCategorySides = (category) => {
    setOpenCategorySides((prevOpenCategory) =>
      prevOpenCategory === category ? null : category
    );
  };

  return (
    <AnimatePresence>
      <div className="relative">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-20 right-0 w-full shadow-md"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            height: "89.8vh",
          }}
        >
          <div className="relative">
            <div
              className="lg:w-3/12 w-full"
              style={{
                background: "rgba(200, 200, 200, 0.7)",
                backdropFilter: "blur(2px)",
                position: "fixed",
                right: "0",
                height: "100%",
              }}
            >
              <div className="h-20 flex sticky top-0 flex-col justify-around bg-white w-full">
                <div className="flex justify-between w-full  items-center">
                  <div className="flex gap-3 ml-2 items-center">
                    <span
                      onClick={() => dispatch(closeCart())}
                      className="cursor-pointer"
                    >
                      <svg
                        width="23"
                        height="15"
                        viewBox="0 0 23 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23 18.9084C20.1865 15.5705 17.6882 13.6766 15.5043 13.2262C13.321 12.7764 11.2424 12.7082 9.26785 13.0223V19L0 9.24574L9.26785 0V5.68156C12.9185 5.7095 16.0218 6.9825 18.5783 9.5C21.1341 12.0175 22.6084 15.1536 23 18.9084Z"
                          fill="#333333"
                        />
                      </svg>
                    </span>
                    <span className="text-lg font-bold">Your Meal Box</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <svg
                      width="24"
                      height="23"
                      viewBox="0 0 24 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 27C3.675 27 2.969 26.7065 2.382 26.1195C1.795 25.5325 1.501 24.826 1.5 24V4.5H0V1.5H7.5V0H16.5V1.5H24V4.5H22.5V24C22.5 24.825 22.2065 25.5315 21.6195 26.1195C21.0325 26.7075 20.326 27.001 19.5 27H4.5ZM7.5 21H10.5V7.5H7.5V21ZM13.5 21H16.5V7.5H13.5V21Z"
                        fill="#C10D13"
                      />
                    </svg>
                    <div className="bg-[#53940F] px-2 gap-2 flex py-0.5 items-center text-white rounded-l-lg">
                      <svg
                        width="21"
                        height="22"
                        viewBox="0 0 21 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0.942857C0 0.692796 0.0948277 0.452976 0.263622 0.276156C0.432417 0.0993363 0.661351 0 0.900063 0H1.56971C2.70979 0 3.39384 0.803314 3.78386 1.55006C4.04428 2.04789 4.2327 2.62491 4.38031 3.14789C4.42023 3.14458 4.46026 3.14291 4.50031 3.14286H19.499C20.495 3.14286 21.2151 4.14103 20.9415 5.14549L18.7477 13.2025C18.551 13.9252 18.1349 14.561 17.5624 15.0138C16.9898 15.4666 16.2921 15.7116 15.5747 15.7118H8.43659C7.71353 15.7118 7.01047 15.4631 6.43548 15.0038C5.86049 14.5446 5.44538 13.9002 5.25397 13.1698L4.3419 9.68503L2.8298 4.34469L2.8286 4.33463C2.64138 3.62183 2.46617 2.95429 2.20455 2.45646C1.95374 1.97246 1.75212 1.88571 1.57091 1.88571H0.900063C0.661351 1.88571 0.432417 1.78638 0.263622 1.60956C0.0948277 1.43274 0 1.19292 0 0.942857ZM7.80055 22C8.43711 22 9.0476 21.7351 9.49772 21.2636C9.94784 20.7921 10.2007 20.1525 10.2007 19.4857C10.2007 18.8189 9.94784 18.1794 9.49772 17.7078C9.0476 17.2363 8.43711 16.9714 7.80055 16.9714C7.16398 16.9714 6.55349 17.2363 6.10337 17.7078C5.65325 18.1794 5.40038 18.8189 5.40038 19.4857C5.40038 20.1525 5.65325 20.7921 6.10337 21.2636C6.55349 21.7351 7.16398 22 7.80055 22ZM16.2011 22C16.8377 22 17.4482 21.7351 17.8983 21.2636C18.3484 20.7921 18.6013 20.1525 18.6013 19.4857C18.6013 18.8189 18.3484 18.1794 17.8983 17.7078C17.4482 17.2363 16.8377 16.9714 16.2011 16.9714C15.5646 16.9714 14.9541 17.2363 14.504 17.7078C14.0538 18.1794 13.801 18.8189 13.801 19.4857C13.801 20.1525 14.0538 20.7921 14.504 21.2636C14.9541 21.7351 15.5646 22 16.2011 22Z"
                          fill="white"
                        />
                      </svg>
                      <span>4/45</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99965 8.84455C8.1912 8.84455 8.3749 8.76846 8.51034 8.63302C8.64578 8.49758 8.72187 8.31388 8.72187 8.12233V4.77789C8.72187 4.58634 8.64578 4.40264 8.51034 4.2672C8.3749 4.13176 8.1912 4.05566 7.99965 4.05566C7.80811 4.05566 7.62441 4.13176 7.48896 4.2672C7.35352 4.40264 7.27743 4.58634 7.27743 4.77789V8.11122C7.27596 8.20699 7.29355 8.30211 7.32918 8.39102C7.36482 8.47993 7.41778 8.56086 7.48499 8.62911C7.55221 8.69735 7.63232 8.75155 7.72068 8.78853C7.80903 8.82552 7.90387 8.84456 7.99965 8.84455Z"
                      fill="#53940F"
                    />
                    <path
                      d="M7.97201 11.3166C8.43224 11.3166 8.80534 10.9435 8.80534 10.4832C8.80534 10.023 8.43224 9.6499 7.97201 9.6499C7.51177 9.6499 7.13867 10.023 7.13867 10.4832C7.13867 10.9435 7.51177 11.3166 7.97201 11.3166Z"
                      fill="#53940F"
                    />
                    <path
                      d="M14.85 11.1889L9.43894 1.22221C9.29568 0.958998 9.0841 0.739278 8.82648 0.586186C8.56886 0.433094 8.27473 0.352295 7.97505 0.352295C7.67537 0.352295 7.38124 0.433094 7.12362 0.586186C6.866 0.739278 6.65442 0.958998 6.51116 1.22221L1.0945 11.1889C0.95272 11.4434 0.88012 11.7306 0.883932 12.0218C0.887743 12.3131 0.967833 12.5983 1.11622 12.849C1.2646 13.0997 1.4761 13.3071 1.72963 13.4506C1.98316 13.594 2.26986 13.6685 2.56116 13.6667H13.3834C13.6723 13.6669 13.9563 13.5921 14.2076 13.4495C14.4588 13.3069 14.6687 13.1014 14.8166 12.8532C14.9645 12.605 15.0454 12.3227 15.0512 12.0338C15.0571 11.7449 14.9878 11.4595 14.85 11.2055V11.1889ZM13.8612 12.2667C13.812 12.3496 13.7421 12.4183 13.6583 12.466C13.5745 12.5138 13.4798 12.5389 13.3834 12.5389H2.56116C2.46459 12.5391 2.36962 12.5142 2.28562 12.4666C2.20161 12.419 2.13148 12.3503 2.08212 12.2673C2.03277 12.1843 2.0059 12.0898 2.00418 11.9933C2.00245 11.8967 2.02592 11.8014 2.07227 11.7167L7.48338 1.74999C7.53099 1.6618 7.60156 1.58812 7.68763 1.53677C7.77369 1.48542 7.87205 1.45831 7.97227 1.45831C8.07249 1.45831 8.17085 1.48542 8.25692 1.53677C8.34298 1.58812 8.41356 1.6618 8.46116 1.74999L13.8723 11.7167C13.9183 11.8014 13.9415 11.8967 13.9396 11.9931C13.9376 12.0896 13.9106 12.1838 13.8612 12.2667Z"
                      fill="#53940F"
                    />
                  </svg>
                  <span className="text-sm text-[#53940F]">
                    Your Meal box is overloaded, but you can add more!
                  </span>
                </div>
              </div>

              <div className="accordion-container  m-2 text-[#333333]">
                <div key={1} className="mb-2">
                  <motion.button
                    onClick={() => toggleCategoryMeals(1)}
                    className="px-5 py-2 items-center justify-between  flex w-full bg-white rounded-lg"
                    variants={categoryVariants}
                    initial="closed"
                    animate={openCategoryMeals === 1 ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-bold text-lg">Meals</span>
                    <span>
                      {openCategoryMeals === 1 ? (
                        <motion.svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.path
                            d="M6 0L11.1962 9L0.803848 9L6 0Z"
                            fill="#333333"
                          />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.path
                            d="M6 9L0.803849 9.2855e-07L11.1962 1.83707e-06L6 9Z"
                            fill="#333333"
                          />
                        </motion.svg>
                      )}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {openCategoryMeals === 1 && (
                      <motion.div
                        key={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-b-lg overflow-y-scroll h-96 pb-2"
                      >
                        {cartResponse?.cart?.lines?.edges?.map(
                          (line, lineIndex) => (
                            <div
                              className="flex items-center px-4 py-2  justify-between"
                              key={lineIndex}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    line.node.merchandise.product.featuredImage
                                      .url
                                  }
                                  alt={line.node.merchandise.product.title}
                                  className="w-20 h-20"
                                />
                                <p className="font-semibold text-base">
                                  {line.node.merchandise.product.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.99935 1.66663C14.6018 1.66663 18.3327 5.39746 18.3327 9.99996C18.3327 14.6025 14.6018 18.3333 9.99935 18.3333C5.39685 18.3333 1.66602 14.6025 1.66602 9.99996C1.66602 5.39746 5.39685 1.66663 9.99935 1.66663ZM9.99935 3.33329C8.23124 3.33329 6.53555 4.03567 5.2853 5.28591C4.03506 6.53616 3.33268 8.23185 3.33268 9.99996C3.33268 11.7681 4.03506 13.4638 5.2853 14.714C6.53555 15.9642 8.23124 16.6666 9.99935 16.6666C11.7675 16.6666 13.4632 15.9642 14.7134 14.714C15.9636 13.4638 16.666 11.7681 16.666 9.99996C16.666 8.23185 15.9636 6.53616 14.7134 5.28591C13.4632 4.03567 11.7675 3.33329 9.99935 3.33329ZM9.99102 8.33329C10.456 8.33329 10.8327 8.70996 10.8327 9.17496V13.445C10.9915 13.5367 11.1157 13.6783 11.1859 13.8477C11.2561 14.0172 11.2684 14.2051 11.2209 14.3823C11.1734 14.5595 11.0688 14.7161 10.9233 14.8277C10.7778 14.9394 10.5995 15 10.416 15H10.0077C9.89715 15 9.78771 14.9782 9.68559 14.9359C9.58347 14.8936 9.49069 14.8316 9.41253 14.7534C9.33438 14.6753 9.27238 14.5825 9.23008 14.4804C9.18779 14.3783 9.16602 14.2688 9.16602 14.1583V9.99996C8.945 9.99996 8.73304 9.91216 8.57676 9.75588C8.42048 9.5996 8.33268 9.38764 8.33268 9.16663C8.33268 8.94561 8.42048 8.73365 8.57676 8.57737C8.73304 8.42109 8.945 8.33329 9.16602 8.33329H9.99102ZM9.99935 5.83329C10.2204 5.83329 10.4323 5.92109 10.5886 6.07737C10.7449 6.23365 10.8327 6.44561 10.8327 6.66663C10.8327 6.88764 10.7449 7.0996 10.5886 7.25588C10.4323 7.41216 10.2204 7.49996 9.99935 7.49996C9.77833 7.49996 9.56637 7.41216 9.41009 7.25588C9.25381 7.0996 9.16602 6.88764 9.16602 6.66663C9.16602 6.44561 9.25381 6.23365 9.41009 6.07737C9.56637 5.92109 9.77833 5.83329 9.99935 5.83329Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </span>
                                <div className="flex gap-2 items-center">
                                  <button
                                   onClick={() =>
                                    handleRemoveFromCart(
                                      line.node.merchandise.id)
                                  }>
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
                                    {/* {getProductQuantityInCart(
                            product.node.variants.edges[0].node.id
                          )} */}
                                    {line.node.quantity}
                                  </span>
                                  <button
                                 onClick={() =>
                                  handleAddToCart(
                                    line.node.merchandise.id
                                  )
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
                            </div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="accordion-container m-2 text-[#333333] ">
                <div key={1} className="mb-2">
                  <motion.button
                    onClick={() => toggleCategorySides(2)}
                    className="px-5 py-2 items-center justify-between flex w-full bg-white rounded-lg"
                    variants={categoryVariants}
                    initial="closed"
                    animate={openCategorySides === 2 ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-bold text-lg">Recommended Sides</span>
                    <span>
                      {openCategorySides === 2 ? (
                        <motion.svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.path
                            d="M6 0L11.1962 9L0.803848 9L6 0Z"
                            fill="#333333"
                          />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.path
                            d="M6 9L0.803849 9.2855e-07L11.1962 1.83707e-06L6 9Z"
                            fill="#333333"
                          />
                        </motion.svg>
                      )}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {openCategorySides === 2 && (
                      <motion.div
                        key={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white overflow-y-scroll h-96 rounded-b-lg pb-2"
                      >
                        {cartResponse?.cart?.lines?.edges?.map(
                          (line, lineIndex) => (
                            <div
                              className="flex items-center px-4 py-2  justify-between"
                              key={lineIndex}
                            >
                              {console.log(line, "Line")}
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    line.node.merchandise.product.featuredImage
                                      .url
                                  }
                                  alt={line.node.merchandise.product.title}
                                  className="w-20 h-20"
                                />
                                <p className="font-semibold text-base">
                                  {line.node.merchandise.product.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.99935 1.66663C14.6018 1.66663 18.3327 5.39746 18.3327 9.99996C18.3327 14.6025 14.6018 18.3333 9.99935 18.3333C5.39685 18.3333 1.66602 14.6025 1.66602 9.99996C1.66602 5.39746 5.39685 1.66663 9.99935 1.66663ZM9.99935 3.33329C8.23124 3.33329 6.53555 4.03567 5.2853 5.28591C4.03506 6.53616 3.33268 8.23185 3.33268 9.99996C3.33268 11.7681 4.03506 13.4638 5.2853 14.714C6.53555 15.9642 8.23124 16.6666 9.99935 16.6666C11.7675 16.6666 13.4632 15.9642 14.7134 14.714C15.9636 13.4638 16.666 11.7681 16.666 9.99996C16.666 8.23185 15.9636 6.53616 14.7134 5.28591C13.4632 4.03567 11.7675 3.33329 9.99935 3.33329ZM9.99102 8.33329C10.456 8.33329 10.8327 8.70996 10.8327 9.17496V13.445C10.9915 13.5367 11.1157 13.6783 11.1859 13.8477C11.2561 14.0172 11.2684 14.2051 11.2209 14.3823C11.1734 14.5595 11.0688 14.7161 10.9233 14.8277C10.7778 14.9394 10.5995 15 10.416 15H10.0077C9.89715 15 9.78771 14.9782 9.68559 14.9359C9.58347 14.8936 9.49069 14.8316 9.41253 14.7534C9.33438 14.6753 9.27238 14.5825 9.23008 14.4804C9.18779 14.3783 9.16602 14.2688 9.16602 14.1583V9.99996C8.945 9.99996 8.73304 9.91216 8.57676 9.75588C8.42048 9.5996 8.33268 9.38764 8.33268 9.16663C8.33268 8.94561 8.42048 8.73365 8.57676 8.57737C8.73304 8.42109 8.945 8.33329 9.16602 8.33329H9.99102ZM9.99935 5.83329C10.2204 5.83329 10.4323 5.92109 10.5886 6.07737C10.7449 6.23365 10.8327 6.44561 10.8327 6.66663C10.8327 6.88764 10.7449 7.0996 10.5886 7.25588C10.4323 7.41216 10.2204 7.49996 9.99935 7.49996C9.77833 7.49996 9.56637 7.41216 9.41009 7.25588C9.25381 7.0996 9.16602 6.88764 9.16602 6.66663C9.16602 6.44561 9.25381 6.23365 9.41009 6.07737C9.56637 5.92109 9.77833 5.83329 9.99935 5.83329Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </span>
                                <div className="flex gap-2 items-center">
                                  <button
                                  // onClick={() =>
                                  //   handleRemoveFromCart(
                                  //     product.node.variants.edges[0].node.id
                                  //   )
                                  // }
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
                                    {/* {getProductQuantityInCart(
                            product.node.variants.edges[0].node.id
                          )} */}
                                    {line.node.quantity}
                                  </span>
                                  <button
                                  // onClick={() =>
                                  //   handleAddToCart(
                                  //     product.node.variants.edges[0].node.id
                                  //   )
                                  // }
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
                            </div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <Link to="/without-login-checkout">
                <button type="button" onClick={() => { dispatch(closeCart()) }} className="fixed rounded-3xl w-3/4 text-white text-xl font-semibold  text-left bottom-0 mb-2 left-1/2 transform -translate-x-1/2 bg-[#53940F] px-10 py-2">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
