import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, } from 'react-redux';
import { handleAddToCart, handleRemoveFromCart } from '../../utils/cartUtils';
import { selectCartResponse } from '../state/cartData';

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
    productPrice,
    setLoading,
    loading
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function getCategoryModified(category){
        if (category?.toUpperCase() === "CURRIES") {
            return "CURRY";
         } else if (category?.toUpperCase() === "LENTILS") {
            return "LENTIL";
         }
       else if (category?.toUpperCase() === "SWEETS") {
             return "SWEET";
         }
         else {
             return category;
         }
         return category;
    }

    const [categoryColor, setCategoryColor] = useState(null);
    useEffect(() => {
        if (categoryTag?.toUpperCase() === "CURRIES") {
            setCategoryColor("#FB7D36");
        } else if (categoryTag?.toUpperCase() === "LENTILS") {
            setCategoryColor("#FBAE36");
        }
        else if (categoryTag?.toUpperCase() === "RICE") {
            setCategoryColor("#279C66");
        } else if (categoryTag?.toUpperCase() === "SWEETS") {
            setCategoryColor("#ba7e05");
        }
        else {
            setCategoryColor('#279C66');
        }
    }, [categoryTag]);

    const [productQuantity, setProductQuantity] = useState(0);
    const getProductQuantityInCart = (productId) => {
        const productInCart = cartResponse?.cart.lines?.edges?.find((cartItem) => {
            return cartItem.node.merchandise.id === productId;
        });
        return productInCart ? productInCart.node.quantity : 0;
    };

    useEffect(() => {
        const productId = product.variants.edges[0].node.id;
        const quantity = getProductQuantityInCart(productId);
        setProductQuantity(quantity);

    }, [cartResponse, product]);


    const handleAdd = async (productId, sellingPlanId) => {
        await handleAddToCart({
            productId,
            sellingPlanId,
            cartResponse,
            cartDatas,
            addCartData,
            setCartResponse,
            setIsShaking,
            dispatch,
            setLoading
        });
    };

    const handleRemove = async (productId, sellingPlanId) => {
        await handleRemoveFromCart({
            productId,
            sellingPlanId,
            cartResponse,
            cartDatas,
            dispatch,
            setCartResponse,
            setLoading,
        });
    }
    return (
        <>
            <div
                key={product.id}
                className="flex md:hidden group cursor-pointer col-span-2 border-b-2 border-[#CCCCCC]  px-2 pt-2 pb-[24px]"
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
                <div className="w-3/5 flex flex-col justify-center pl-3 py-1">
                    <div>
                        <div className='flex flex-row justify-between'>
                            <button
                                type="button"
                                style={{ backgroundColor: categoryColor }}
                                className="flex text-[#FAFAFA] text-[12px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                            >
                                 {getCategoryModified(categoryTag)}
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
                        {productQuantity > 0 ?                        
                        (
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(product.variants.edges[0].node.id);
                                    }}
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

                                {shaking === product.variants.edges[0].node.id ? (
                                <div className="spinner1"></div>
                            ) : (
                                <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                                    {productQuantity}
                                </span>
                            )}
                               
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAdd(product.variants.edges[0].node.id);
                                    }}
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
                        
                        ) : <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAdd(product.variants.edges[0].node.id);
                            }}
                            className={`${shaking === product.variants.edges[0].node.id ? '' : ''
                                } bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px] flex font-[700] items-center justify-center`}
                        >
                            {shaking === product.variants.edges[0].node.id ? (
                                <div className="spinner1"></div>
                            ) : (
                                'ADD TO CART'
                            )}
                        </button>}

                        {/* <button
                            onClick={(e) => e.stopPropagation()}
                            type="button"
                            className="bg-[#279C66] text-[#FAFAFA] w-full rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[12px]  font-[600]"
                        >
                            BUY NOW
                        </button> */}
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
                                className="w-full h-full md:h-full object-cover rounded-t-3xl rounded-b-[0px]  md:rounded-3xl group-hover:scale-110 transform transition-transform duration-200"
                            />
                            <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full">
                                <div className="p-2 md:p-5">
                                    <button
                                        type="button"
                                        style={{ backgroundColor: categoryColor }}
                                        className=" text-[#FAFAFA] text-[12px] md:text-[18px] md:leading-[27.08px] px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600]"
                                    >
                                       {getCategoryModified(categoryTag)}
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
                                            {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO CART'}
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
                                {shaking === product.variants.edges[0].node.id ? <div className="spinner1"></div> : 'ADD TO CART'}
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
