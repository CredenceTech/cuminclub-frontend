import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeCart } from "../state/cart";
import { addCartData, cartData, clearCartData, clearCartResponse, selectCartResponse, setCartResponse } from "../state/cartData";
import { createCartMutation, getCartQuery, getProductRecommendedQuery, graphQLClient, updateCartItemMutation, updateCartMutation } from "../api/graphql";
import { Link, useNavigate } from "react-router-dom";
import { totalQuantity } from "../utils";
import { selectMealItems } from "../state/mealdata";

export const CartDataDrawer = ({ onClose }) => {
    const dispatch = useDispatch();
    const cartDatas = useSelector(cartData);
    const [openCategoryMeals, setOpenCategoryMeals] = useState(null);
    const [openCategorySides, setOpenCategorySides] = useState(null);
    const selectedMealData = useSelector(selectMealItems);
    const cartResponse = useSelector(selectCartResponse);
    const navigate = useNavigate();
    const [loading, setLoading] = useState({});
    const [recommendedProduct, setRecommendedProduct] = useState(null)

    // useEffect(() => {
    //     getCartData();
    // }, [cartDatas]);

    // const getCartData = async () => {
    //     const params = {
    //         cartId: cartDatas?.cartCreate?.cart?.id,
    //     };
    //     const response = await graphQLClient.request(getCartQuery, params);
    //     dispatch(setCartResponse(response));
    // };

    const categoryVariants = {
        open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
        closed: {
            borderBottomRightRadius: "0.375rem",
            borderBottomLeftRadius: "0.375rem",
        },
    };

    // useEffect(() => {

    //     const getProductRecommended = async () => {
    //         const response = await graphQLClient.request(
    //             getProductRecommendedQuery,
    //             {
    //                 productId: cartResponse.cart.lines.edges[0].node.merchandise.product.id,
    //             }
    //         );
    //         const recommendedList = response.productRecommendations.map(
    //             (data) => ({
    //                 ...data,
    //                 qty: 0,
    //             })
    //         );
    //         setRecommendedProduct(recommendedList);
    //     };

    //     getProductRecommended()

    // }, [cartResponse])

    const handleAddToCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        if (cartDatas === null) {
            if (sellingPlanId) {
                addToCart({ merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
            } else {
                addToCart({ merchandiseId: productId, quantity: 1 });
            }
        }

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
    };

    const handleRemoveFromCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        const productInCart = cartResponse.cart.lines.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            if (sellingPlanId) {
                updateCartItem(cartId, {
                    id: id,
                    sellingPlanId: sellingPlanId,
                    quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
                }, productId);
            } else {
                updateCartItem(cartId, {
                    id: id,
                    quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
                }, productId);
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
        setLoading((prevLoading) => ({
            ...prevLoading,
            [cartItems.merchandiseId]: false,
        }));
    }

    const updateCartItem = async (cartId, cartItem, id) => {
        const params = {
            "cartId": cartId,
            "lines": cartItem
        }
        const response = await graphQLClient.request(updateCartItemMutation, params);
        dispatch(setCartResponse(response.cartLinesUpdate));
        setLoading((prevLoading) => ({
            ...prevLoading,
            [id]: false,
        }));
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
        setLoading((prevLoading) => ({
            ...prevLoading,
            [cartItem.merchandiseId]: false,
        }));
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

    const getProductQuantityInCart = (productId) => {
        const productInCart = cartResponse?.cart?.lines?.edges?.find((cartItem) => {
            return cartItem.node.merchandise.id === productId;
        });
        return productInCart ? productInCart?.node?.quantity : 0;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const modal = document.getElementById("cart-modal");
            if (modal && !modal.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleRemoveWholeProductFromCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        const productInCart = cartResponse.cart.lines.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            if (sellingPlanId) {
                updateCartItem(cartId, {
                    id: id,
                    sellingPlanId: sellingPlanId,
                    quantity: 0,
                }, productId);
            } else {
                updateCartItem(cartId, {
                    id: id,
                    quantity: 0,
                }, productId);
            }
        }
    };

    return (
        <AnimatePresence>
            <div className="relative z-[10000]">
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="fixed top-0 right-0 w-full z-50 h-full lg:h-full"
                    style={{
                        // background: "rgba(255, 255, 255, 0.2)",
                        // height: "88%",
                    }}
                >
                    <div id="cart-modal">
                        <div className="relative  bg-[#EFE9DA] lg:w-[35%] w-[90%] h-full" style={{
                            background: "#EFE9DA",
                            backdropFilter: "blur(2px)",
                            position: "fixed",
                            right: "0",
                        }}>
                            <div className="h-20 flex top-0 sticky bg-[#EFE9DA] flex-col justify-around w-full">
                                {/* <div className="flex justify-between w-full items-center"> */}
                                    <div className="flex ml-2 justify-between items-center md:mr-[60px] mr-4">
                                        <h1 className="md:text-[54px] text-[30px] font-[400] md:leading-[54.49px] leading-[20px] font-skillet p-[30px] pb-0">
                                            Review your Cart
                                        </h1>
                                        <button onClick={onClose} className="relative text-gray-500 pt-[30px] md:pt-0 hover:text-gray-700 p-0">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="36"
                                                width="36"
                                                viewBox="0 0 384 512"
                                                className="md:absolute "
                                            >
                                                <path
                                                    fill="#000000"
                                                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                {/* </div> */}
                            </div>

                            <div
                                className=" overflow-y-auto custom-scrollbar border-none md:h-[55%] h-[68%]"
                            >


                                {!cartResponse || cartResponse.cart?.lines?.edges?.length === 0 && <div className="flex flex-col items-center justify-center py-10 text-center font-regola-pro md:text-xl text-lg space-y-4 mt-[150px]">
                                    <p>Your cart is empty</p>

                                    <button
                                        className="bg-[#333333] text-white px-6 py-3 rounded-lg font-regola-pro md:text-lg text-sm"
                                        onClick={() => { navigate('/products'); onClose() }}
                                    >
                                        Start Shopping
                                    </button>
                                </div>}

                                {cartResponse && cartResponse.cart?.lines?.edges?.length > 0 && <div className="p-[40px] pt-5">
                                    {cartResponse?.cart?.lines?.edges?.map((line, index) => {
                                        return <div key={index} className='flex  items-center justify-between py-3 border-b-[0.99px] border-[#A3A3A3]'>
                                            <div className='flex flex-row items-center w-full'>
                                                <img src={
                                                    line?.node?.merchandise?.product
                                                        ?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc
                                                }
                                                    alt={line?.node?.merchandise?.product?.title} className='md:h-[75px] md:w-[75px] h-[65px] w-[65px] rounded-lg' />
                                                <div className='ml-4'>
                                                    <h1 className='text-xl md:text-[30px] md:leading-[30px] leading-4 font-[400] font-skillet text-[#333333] '>{line?.node?.merchandise?.product?.title}</h1>
                                                    <p className='font-skillet text-[#757575] md:text-[24px] md:leading-[24.18px] text-xl font-[400]'><span className='text-[18px] leading-[20.1px] '>₹</span> {line?.node?.merchandise?.priceV2?.amount}</p>
                                                    {loading[line.node.merchandise.id] ? <svg width="60" height="60" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#4fa94d" data-testid="three-dots-svg"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" attributeName="fill-opacity" from="1" to="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg> :
                                                        <div className="flex gap-2 items-center">
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveFromCart(
                                                                        line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
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
                                                                        d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z"
                                                                        fill="#333333"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                                                                {line.node.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleAddToCart(line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id)
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
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <button onClick={() =>
                                                    handleRemoveWholeProductFromCart(
                                                        line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
                                                    )
                                                } type='button' className='text-[#F15E2A] ml-2 font-regola-pro font-[500] md:text-xl text-[18px] border-b border-b-[#F15E2A]'>Remove</button>
                                            </div>
                                        </div>
                                    })}

                                </div>
                                }


                            </div>

                            <div
                                className="md:py-5 py-1 md:h-[30%] h-[20%]"
                            >
                                {cartResponse && cartResponse.cart?.lines?.edges?.length > 0 &&
                                    <div className="p-[40px]">
                                        <div className="flex mt-0 flex-row justify-between">
                                            <p className="text-[26px] font-skillet  lg:text-[30.34px] font-[400] leading-[37.45px] text-[#333333]">Total</p>
                                            <p className="text-[28px] text-[#279C66] font-skillet lg:text-[32px] font-[400] leading-[37.5px]">₹ <span className='lg:text-[33px] font-[400] leading-[32px]'>{cartResponse?.cart?.cost?.totalAmount?.amount}</span></p>
                                        </div>
                                        <p className='text-[#757575] md:text-[18px] font-[500] md:leading-[26.45px] text-[14px] leading-3 text-end font-regola-pro mt-0'>Tax included and shipping calculated at checkout</p>

                                        <button type='button' className='rounded-lg font-skillet text-2xl lg:text-[30px] mt-[20px] bg-gray-900 text-gray-100 w-full py-4' onClick={() => {
                                            navigate('/cardReview');
                                            onClose();
                                        }}
                                        >Checkout</button>

                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
