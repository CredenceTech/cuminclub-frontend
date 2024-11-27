import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { handleAddToCart } from '../../utils/cartUtils';

const ProductBigCard = ({
    product,
    categoryTag,
    productLargeImage,
    productSmallImage,
    shaking,
    cartResponse,
    cartDatas,
    addCartData,
    setCartResponse,
    setIsShaking,
    productPrice
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleAdd = async (productId, sellingPlanId) => {
        await handleAddToCart({
            productId,
            sellingPlanId,
            cartResponse,
            cartDatas,
            addCartData,
            setCartResponse,
            setIsShaking,
            dispatch
        });
    };
    return (
        <>
            <div
                key={product.id + 4567}
                className="flex md:hidden group cursor-pointer col-span-2 border-b-2 border-[#CCCCCC]  p-2"
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
                <div className="w-3/5 flex flex-col justify-between pl-3 py-1">
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
                                handleAdd(product.variants.edges[0].node.id);
                            }}
                            className={`${shaking === product.variants.edges[0].node.id ? '' : ''
                                } border-2 border-[#333333] text-[#333333] w-full flex justify-center items-center text-[12px]  rounded-lg pt-[4px] pb-[4px] font-regola-pro font-[600]`}
                        >
                            {shaking === product.variants.edges[0].node.id ? (
                                <div className="spinner1"></div>
                            ) : (
                                'ADD TO CART'
                            )}
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            type="button"
                            className="bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px]  font-[600]"
                        >
                            BUY NOW
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="hidden md:grid col-span-2 bg-[#EADEC1] rounded-3xl cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/product-details/${product.handle}`)}
                key={product.id}
            >
                <AnimatePresence mode="popLayout">
                    <motion.div
                        initial={{ y: 500, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -500, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative flex justify-center overflow-hidden items-center ">
                            <img
                                src={productLargeImage}
                                alt={product.title}
                                className="w-full h-[290px] rounded-t-3xl object-cover group-hover:scale-110 transform transition-transform duration-200"
                            />
                            <button
                                type="button"
                                className="bg-[#FBAE36] text-[18px] leading-[27.08px] absolute top-5 left-5 text-[#333333] uppercase px-3 rounded-[10px] py-[4px] tracking-[0.12em] font-regola-pro font-[600]"
                            >
                                {categoryTag}
                            </button>
                        </div>
                        <div className="px-10 py-3">
                            <div className="flex flex-row justify-between pt-[18px] pb-2">
                                <p className="font-skillet font-[400] uppercase text-[#333333] text-[36px] leading-[28.65px]">
                                    {product.title}
                                </p>
                                <p className="font-skillet font-[400] text-[#333333] text-[36px] leading-[28.65px] whitespace-nowrap">
                                    ₹ {Math.floor(productPrice)}
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
                                        handleAdd(product.variants.edges[0].node.id);
                                    }}
                                    className={`${shaking === product.variants.edges[0].node.id ? '' : ''
                                        } border-2 border-[#333333] w-[150px] flex justify-center items-center text-[#333333] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]`}
                                >
                                    {shaking === product.variants.edges[0].node.id ? (
                                        <div className="spinner1"></div>
                                    ) : (
                                        'ADD TO CART'
                                    )}
                                </button>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    type="button"
                                    className="bg-[#26965C] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] whitespace-nowrap font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]"
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

export default ProductBigCard;