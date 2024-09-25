import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMealItems } from '../state/mealdata';
import { cartData, selectCartResponse, setCartResponse } from '../state/cartData';
import { getCartQuery, graphQLClient } from '../api/graphql';
import { totalQuantity } from '../utils';

const SpiceLevel = () => {
    const dispatch = useDispatch();
    const selectedMealData = useSelector(selectMealItems);
    const cartDatas = useSelector(cartData);
    const cartResponse = useSelector(selectCartResponse);

    const [images, setImages] = useState([]);

    useEffect(() => {
        if (cartDatas !== null) {
            getCartData();
        }
    }, [cartDatas]);

    const getCartData = async () => {
        const params = {
            cartId: cartDatas?.cartCreate?.cart?.id,
        };
        const response = await graphQLClient.request(getCartQuery, params);
        dispatch(setCartResponse(response));
    };

    const total = cartDatas !== null ? totalQuantity(cartResponse) : 0;

    const filledStars = Math.min(Math.max(0, Math.round(total)), selectedMealData?.no);
    const emptyStars = Math.max(0, +selectedMealData?.no - filledStars);

    useEffect(() => {
        handleAddImage();
    }, [cartResponse]);

    const handleAddImage = () => {
        const newImages = [];
        if (cartDatas) {
            cartResponse?.cart?.lines?.edges?.forEach((item) => {
                if (item && item?.node?.quantity) {
                    for (let index = 0; index < item?.node?.quantity; index++) {
                        const imageUrl = item?.node?.merchandise?.product?.featuredImage?.url;
                        if (imageUrl) {
                            newImages.push(imageUrl);
                        }
                    }
                }
            });
            setImages(newImages);
        }
    };

    const starElements = [];

    for (let i = 0; i < filledStars; i++) {
        starElements.push(
            <div key={`filled-${i}`} className=" flex justify-center items-center h-[78px] w-[78px]">
                <img src={images[i]} alt={`Image ${i}`} className='w-full h-full rounded' />
            </div>
        );
    }
    for (let i = 0; i < emptyStars; i++) {
        starElements.push(
            <div key={`empty-${i}`} className="rounded border-dashed border-[#F1663C] border-[3px] flex justify-center items-center h-[78px] w-[78px]">
                <p className="text-[30px] font-medium text-[#EADEC1]">?</p>
            </div>
        );
    }

    return (
        <div className="flex flex-row gap-x-2 mr-2">
            {starElements}
        </div>
    );
}

export default SpiceLevel;
