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
                <div className='px-[45px] min-h-[85vh]'>
                    <h1 className='text-2xl md:text-[54px] leading-[54px] font-[400] p-4 font-skillet text-[#231F20] pt-9'>Review your Cart</h1>
                    <div className='flex flex-col gap-4 md:gap-6 md:flex-row justify-between'>
                        <div className='w-full px-4 md:w-1/2 mb-4'>
                            {cartResponse?.cart?.lines?.edges?.map((line, index) => {
                                return <div key={index} className='flex  items-center justify-between py-3 lg:mr-24 border-b-[0.99px] border-[#A3A3A3]'>
                                    <div className='flex flex-row items-center'>
                                        <img src={
                                            line?.node?.merchandise?.product
                                                ?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc
                                        }
                                            alt={line?.node?.merchandise?.product?.title} className='h-[85.1px] w-[85.1px] rounded-lg' />
                                        <div className='ml-4'>
                                            <h1 className='text-xl md:text-[36px] leading-[36px] font-[400] font-skillet text-[#333333] '>{line?.node?.merchandise?.product?.title}</h1>
                                            <p className='font-skillet text-[#757575] text-[28px] leading-[28.18px] font-[400]'><span className='text-[20px] leading-[20.1px] '>₹</span> {line?.node?.merchandise?.priceV2?.amount}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() =>
                                            handleRemoveFromCart(
                                                line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
                                            )
                                        } type='button' className='text-[#F15E2A] m-7 font-regola-pro font-[500] text-xl border-b border-b-[#F15E2A]'>Remove</button>
                                    </div>
                                </div>
                            })}

                        </div>
                        <div className='bg-[#EFE9DA]  w-full md:w-1/2'>
                            <div className='bg-[#EADEC1] p-8 rounded-2xl'>
                                {/* <div className="flex flex-row justify-between">
                                    <p className="text-base font-skillet  lg:text-[24px] font-[400] leading-[24.5px] text-[#333333]">Subtotal</p>
                                    <p className="text-lg font-skillet lg:text-[24px] font-[400] leading-[24.5px] text-[#333333]">₹ <span className='lg:text-[32px] font-[400] leading-[32.5px]'>803.6</span></p>
                                </div> */}
                                <div className="flex mt-3 flex-row justify-between">
                                    <p className="text-lg font-skillet  lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Total</p>
                                    <p className="text-xl text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{cartResponse?.cart?.estimatedCost?.totalAmount?.amount}</span></p>
                                </div>
                                <p className='text-[#757575] text-[20px] font-[500] leading-[26.45px] text-end font-regola-pro'>Tax included and shipping calculated at checkout</p>
                                <div className="flex mt-8 flex-row text-center gap-y-5 whitespace-nowrap justify-between gap-3">
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center font-[400] text-[20px] leading-[24px] font-regola-pro text-[#757575]'>Standard</p>
                                    </div>
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center font-[400] text-[20px] leading-[24px] font-regola-pro text-[#757575]'>Express</p>
                                    </div>
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center font-[400] text-[20px] leading-[24px] font-regola-pro text-[#757575]'>Bulk</p>
                                    </div>
                                </div>
                                <button type='button' className='rounded-lg font-skillet text-2xl lg:text-4xl mt-[110px] bg-gray-900 text-gray-100 w-full py-4'>Checkout</button>
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