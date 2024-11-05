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

    const categoryVariants = {
        open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
        closed: {
            borderBottomRightRadius: "0.375rem",
            borderBottomLeftRadius: "0.375rem",
        },
    };

    useEffect(() => {

        const getProductRecommended = async () => {
            const response = await graphQLClient.request(
                getProductRecommendedQuery,
                {
                    productId: cartResponse.cart.lines.edges[0].node.merchandise.product.id,
                }
            );
            const recommendedList = response.productRecommendations.map(
                (data) => ({
                    ...data,
                    qty: 0,
                })
            );
            setRecommendedProduct(recommendedList);
        };

        getProductRecommended()

    }, [cartResponse])

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

    return (
        <AnimatePresence>
            <div className="relative z-[500]">
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="fixed top-0 right-0 w-full z-50"
                    style={{
                        // background: "rgba(255, 255, 255, 0.2)",
                        height: "88%",
                    }}
                >
                    <div id="cart-modal">
                        <div className="relative ">
                            <div
                                className="lg:w-[35%] w-full overflow-y-auto custom-scrollbar"
                                style={{
                                    background: "#EFE9DA",
                                    backdropFilter: "blur(2px)",
                                    position: "fixed",
                                    right: "0",
                                    height: "65%",
                                }}
                            >
                                <div className="h-20 flex top-0 sticky bg-[#EFE9DA] flex-col justify-around  w-full">
                                    <div className="flex justify-between w-full  items-center ">
                                        <div className="flex gap-3 ml-2 justify-between items-center">
                                            <h1 className="md:text-[54px] text-[30px] font-[400] md:leading-[54.49px] leading-[20px] font-skillet p-[40px] pt-[20px] pb-0">Review your Cart</h1>
                                            <button onClick={onClose} className=" relative -right-10 text-gray-500 pt-[20px] hover:text-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 384 512"><path fill="#000000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>
                                        </div>

                                    </div>


                                </div>

                                <div className="p-[40px] pt-5">
                                    {cartResponse?.cart?.lines?.edges?.map((line, index) => {
                                        return <div key={index} className='flex  items-center justify-between py-3 border-b-[0.99px] border-[#A3A3A3]'>
                                            <div className='flex flex-row items-center w-full'>
                                                <img src={
                                                    line?.node?.merchandise?.product
                                                        ?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc
                                                }
                                                    alt={line?.node?.merchandise?.product?.title} className='md:h-[75px] md:w-[75px] h-[50px] w-[50px] rounded-lg' />
                                                <div className='ml-4'>
                                                    <h1 className='text-xl md:text-[30px] md:leading-[30px] leading-4 font-[400] font-skillet text-[#333333] '>{line?.node?.merchandise?.product?.title}</h1>
                                                    <p className='font-skillet text-[#757575] text-[24px] leading-[24.18px] font-[400]'><span className='text-[18px] leading-[20.1px] '>₹</span> {line?.node?.merchandise?.priceV2?.amount}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button onClick={() =>
                                                    handleRemoveFromCart(
                                                        line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
                                                    )
                                                } type='button' className='text-[#F15E2A] ml-2 font-regola-pro font-[500] md:text-xl text-[18px] border-b border-b-[#F15E2A]'>Remove</button>
                                            </div>
                                        </div>
                                    })}

                                </div>


                            </div>
                        </div>

                        <div
                            className="lg:w-[35%] w-full  md:py-5 py-1"
                            style={{
                                background: "#EFE9DA",
                                backdropFilter: "blur(2px)",
                                position: "fixed",
                                bottom: "0",
                                right: "0",
                                height: "35%",
                            }}
                        >
                            <div className="p-[40px]">
                                <div className="flex mt-0 flex-row justify-between">
                                    <p className="text-lg font-skillet  lg:text-[30.34px] font-[400] leading-[37.45px] text-[#333333]">Total</p>
                                    <p className="text-xl text-[#279C66] font-skillet lg:text-[32px] font-[400] leading-[37.5px]">₹ <span className='lg:text-[33px] font-[400] leading-[32px]'>{cartResponse?.cart?.estimatedCost?.totalAmount?.amount}</span></p>
                                </div>
                                <p className='text-[#757575] md:text-[18px] font-[500] md:leading-[26.45px] text-[14px] leading-3 text-end font-regola-pro mt-0'>Tax included and shipping calculated at checkout</p>

                                <button type='button' className='rounded-lg font-skillet text-2xl lg:text-[30px] mt-[20px] bg-gray-900 text-gray-100 w-full py-4' onClick={() => {
                                    navigate('/cardReview');
                                    onClose(); 
                                }}
                                >Checkout</button>

                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
