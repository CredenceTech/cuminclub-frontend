import React, { useState, useEffect } from 'react'
import product from '../assets/Dish-1.jpg'
import { getCartQuery, graphQLClient, updateCartItemMutation, updateCartMutation } from '../api/graphql';
import { cartData, selectCartResponse, setCartResponse, } from '../state/cartData';
import { useDispatch, useSelector } from 'react-redux';
import LoadingAnimation from "../component/Loader";
const CardReview = () => {
    const dispatch = useDispatch();
    const cartDatas = useSelector(cartData);
    const cartResponse = useSelector(selectCartResponse);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleRemoveFromCart = (productId, sellingPlanId) => {
        // setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
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

    const updateCartItem = async (cartId, cartItem, id) => {
        const params = {
            "cartId": cartId,
            "lines": cartItem
        }
        setIsLoading(true)
        const response = await graphQLClient.request(updateCartItemMutation, params);
        setIsLoading(false)
        dispatch(setCartResponse(response.cartLinesUpdate));
    }



    return (
        <>
            <div className='bg-[#EFE9DA] '>
                <div className='container mx-auto min-h-[85vh]'>
                    <h1 className='text-2xl md:text-6xl p-4 font-skillet text-gray-900 pt-9'>Review your Cart</h1>
                    <div className='flex flex-col gap-4 md:gap-6 md:flex-row justify-between'>
                        <div className='w-full px-4 md:w-1/2 mb-4'>
                            {cartResponse?.cart?.lines?.edges?.map((line, index) => {
                                return <div key={index} className='flex  items-center justify-between py-3 lg:mr-24 border-b border-black'>
                                    <div className='flex flex-row items-center'>
                                        <img src={
                                            line?.node?.merchandise?.product
                                                ?.featuredImage?.url
                                        }
                                            alt={line?.node?.merchandise?.product?.title} className='h-[90px] w-[90px] rounded-lg' />
                                        <div className='ml-4'>
                                            <h1 className='text-xl md:text-4xl font-skillet text-gray-900 '>{line?.node?.merchandise?.product?.title}</h1>
                                            <p className='text-xl font-skillet text-gray-600'>₹ {line?.node?.merchandise?.priceV2?.amount}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() =>
                                            handleRemoveFromCart(
                                                line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
                                            )
                                        } type='button' className='text-[#F15E2A] font-futura text-xl border-b border-b-[#F15E2A]'>Remove</button>
                                    </div>
                                </div>
                            })}

                        </div>
                        <div className='bg-[#EFE9DA]  w-full md:w-1/2'>
                            <div className='bg-[#EADEC1] p-8 rounded-2xl'>
                                <div className="flex flex-row justify-between">
                                    <p className="text-base font-skillet  lg:text-2xl">Subtotal</p>
                                    <p className="text-lg font-skillet lg:text-2xl">₹ 803.6</p>
                                </div>
                                <div className="flex mt-3 flex-row justify-between">
                                    <p className="text-lg font-skillet  lg:text-2xl">Total</p>
                                    <p className="text-xl text-[#279C66] font-skillet lg:text-3xl">₹ {cartResponse?.cart?.estimatedCost?.totalAmount?.amount}</p>
                                </div>
                                <p className='text-[#757575] text-end font-futura'>Tax included and shipping calculated at checkout</p>
                                <div className="flex mt-8 flex-row text-center gap-y-5 justify-between flex-wrap">
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center text-[#757575]'>Standard</p>
                                    </div>
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center text-[#757575]'>Express</p>
                                    </div>
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center text-[#757575]'>Bulk</p>
                                    </div>
                                </div>
                                <button type='button' className='rounded-lg font-skillet text-2xl lg:text-4xl mt-52 bg-gray-900 text-gray-100 w-full py-4'>Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <LoadingAnimation />}
        </>
    )
}

export default CardReview