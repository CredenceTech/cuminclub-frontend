import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMealItems } from '../state/mealdata';
import { cartData, selectCartResponse, setCartResponse } from '../state/cartData';
import { getCartQuery, graphQLClient } from '../api/graphql';
import { totalQuantity, totalQuantityInDraftOrder } from '../utils';
import {draftOrderData, selectDraftOrderResponse, setDraftOrderResponse} from '../state/draftOrder';

const SpiceLevel = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const selectedMealData = useSelector(selectMealItems);
    const draftOrderDatas = useSelector(draftOrderData);
    const draftOrderResponse=useSelector(selectDraftOrderResponse)
    const total = draftOrderDatas !== null ? totalQuantityInDraftOrder(draftOrderResponse) : 0;
    const filledStars = Math.min(Math.max(0, Math.round(total)), selectedMealData?.no);
    const emptyStars = Math.max(0, +selectedMealData?.no - filledStars);

    useEffect(() => {
        console.log(draftOrderResponse)
        handleAddImage();
    }, [draftOrderResponse]);

    const handleAddImage = () => {
        const newImages = [];
        console.log(draftOrderDatas);
        if (draftOrderDatas) {
            console.log(draftOrderResponse);
            draftOrderResponse?.draftOrder?.lineItems?.edges?.forEach((item) => {
                if (item && item?.node?.quantity) {
                    for (let index = 0; index < item?.node?.quantity; index++) {
                        const imageUrl = item?.node?.variant?.product?.metafields?.edges?.find(edge => edge.node.key === "image_for_home")
                        ?.node?.reference?.image?.originalSrc;
                        console.log(imageUrl);
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

    console.log(images)

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
