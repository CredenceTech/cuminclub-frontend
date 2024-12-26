import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMealItems } from '../state/mealdata';
import { cartData, selectCartResponse, setCartResponse } from '../state/cartData';
import { getCartQuery, graphQLClient } from '../api/graphql';
import { totalQuantity, totalQuantityInDraftOrder } from '../utils';
import { draftOrderData, selectDraftOrderResponse, setDraftOrderResponse } from '../state/draftOrder';
import { clearBundleData, clearBundleResponse, selectBundleResponse } from '../state/bundleData';

const SpiceLevel = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const selectedMealData = useSelector(selectMealItems);
    const draftOrderDatas = useSelector(draftOrderData);
    const draftOrderResponse = useSelector(selectDraftOrderResponse)
    const total = draftOrderDatas !== null ? totalQuantityInDraftOrder(draftOrderResponse) : 0;
    const filledStars = Math.min(Math.max(0, Math.round(total ?? 0)), selectedMealData?.no ?? 0);
    const emptyStars = Math.max(0, +selectedMealData?.no - filledStars);
    const bundleDataResponse = useSelector(selectBundleResponse);

    const handleRemoveToDraftOrder = async (productId) => {
        try {
            if (bundleDataResponse?.productId !== undefined && bundleDataResponse) {
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
            const draftOrderId = draftOrderDatas?.draftOrderCreate?.draftOrder?.id;

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
            console.log("Removed successfully!!")
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
    };


    useEffect(() => {
        handleAddImage();
    }, [draftOrderResponse]);

    const handleAddImage = () => {
        const newImages = [];
        if (draftOrderDatas) {
            draftOrderResponse?.draftOrder?.lineItems?.edges?.forEach((item) => {
                if (item && item?.node?.quantity) {
                    for (let index = 0; index < item?.node?.quantity; index++) {
                        const imageUrl = item?.node?.variant?.product?.metafields?.edges?.find(edge => edge.node.key === "image_for_home")
                            ?.node?.reference?.image?.originalSrc;
                        const productId = item?.node?.variant?.id;
                        if (imageUrl && productId) {
                            newImages.push({ id: productId, url: imageUrl });
                        }
                    }
                }
            });
            setImages(newImages);
        }
    };


    const starElements = [];


    for (let i = 0; i < filledStars; i++) {
        const { id, url } = images[i] || {}; // Destructure id and url
        starElements.push(
            <div
                key={`filled-${id}-${i}`}
                className="relative flex justify-center items-center h-[78px] w-[78px] group"
            >
                <img src={url} alt={`Image ${i}`} className="w-full h-full rounded" />
                {/* Cross Icon Overlay */}
                <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full">
                    <button
                        className="text-white text-[20px] font-bold p-2 bg-red-500 rounded-full h-[30px] w-[30px] flex items-center justify-center"
                        onClick={() => handleRemoveToDraftOrder(id)} // Pass the id for removal
                    >
                        &times;
                    </button>
                </div>
            </div>
        );
    }


    for (let i = 0; i < emptyStars; i++) {
        starElements.push(
            <div
                key={`empty-${i}`}
                className="rounded border-dashed border-[#F1663C] border-[3px] flex justify-center items-center h-[78px] w-[78px]"
            >
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
