import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { handleAddToCart } from '../../utils/cartUtils';

const ProductSmallCard = ({
    product,
    categoryTag,
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
                key={product.id}
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
            <div key={product.id + 9867} className="hidden md:grid md:col-span-1 bg-[#EADEC1] rounded-3xl  group cursor-pointer" onClick={() => { navigate(`/product-details/${product.handle}`) }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ y: 500, x: -500, opacity: 0 }}
                        animate={{ y: 0, x: 0, opacity: 1 }}
                        exit={{ y: -500, x: 500, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                    >
                        <div className="relative rounded-t-3xl md:h-full rounded-b-[0px] overflow-hidden  md:rounded-3xl flex justify-center items-center">
                            <img
                                src={productSmallImage}
                                alt={product.title}
                                className="w-full h-full md:h-full rounded-t-3xl rounded-b-[0px]  md:rounded-3xl group-hover:scale-110 transform transition-transform duration-200"
                            />
                            <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full">
                                <div className="p-2 md:p-5">
                                    <button
                                        type="button"
                                        className="bg-[#279C66] text-[#FAFAFA] text-[12px] md:text-[18px] md:leading-[27.08px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600]"
                                    >
                                        {categoryTag}
                                    </button>
                                </div>
                                <div className="px-3 md:pl-8 pb-2 md:pb-6 p-[20px] md:pt-[120px] bg-gradient-to-b from-primary rounded-b-[0px]  md:rounded-b-3xl to-secondary w-full">
                                    <div className="flex flex-row justify-between items-center mb-2 md:mb-5">
                                        <p className="font-skillet font-[400] text-[#FAFAFA] text-[16px] leading-3 md:text-[36px] md:leading-[28.65px] uppercase max-w-[70%]">
                                            {product.title}
                                        </p>
                                        <p className="font-skillet font-[400] text-[#FAFAFA] text-[16px] leading-3 md:text-[36px] md:leading-[28.65px] uppercase">
                                            ₹ {Math.floor(productPrice)}
                                        </p>
                                    </div>

                                    <div className="hidden md:flex md:flex-row md:gap-4">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAdd(product.variants.edges[0].node.id)
                                            }
                                            }
                                            className={` ${shaking === product.variants.edges[0].node.id ? '' : ''} border-2 border-[#FAFAFA] text-[#FAFAFA] md:w-[150px] flex justify-center items-center md:px-2 px-[2px] text-[12px] leading-1 rounded-lg pt-[4px] pb-[4px] font-regola-pro md:text-[16px] font-[600] md:leading-[21.28px] tracking-[0.12em]`}
                                        >
                                            {shaking === product.variants.edges[0].node.id ? <div class="spinner1"></div> : 'ADD TO CART'}
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            type="button"
                                            className="bg-[#279C66] text-[#FAFAFA] md:px-2 px-[2px] rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px] leading-1 md:text-[16px] font-[600] md:leading-[21.28px] tracking-[0.12em] mt-2 md:mt-0"
                                        >
                                            BUY NOW
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 mb-3 gap-1 md:hidden flex justify-center items-center flex-row ">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdd(product.variants.edges[0].node.id)
                                }
                                }
                                className={` ${shaking === product.variants.edges[0].node.id ? '' : ''}  border-2 border-[#333333] text-[#333333] md:w-[150px] flex justify-center items-center md:px-2 px-[8px] text-[10px] leading-3 rounded-lg pt-[4px] pb-[4px] font-regola-pro md:text-[16px] font-[600] md:leading-[21.28px] `}
                            >
                                {shaking === product.variants.edges[0].node.id ? <div class="spinner1"></div> : 'ADD TO CART'}
                            </button>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                type="button"
                                className="bg-[#279C66] text-[#FAFAFA] md:px-2 px-[8px] rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[10px] leading-4 md:text-[16px] font-[600] md:leading-[21.28px]"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

export default ProductSmallCard;
