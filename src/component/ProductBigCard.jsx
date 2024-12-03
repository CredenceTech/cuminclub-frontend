import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { handleAddToCart, handleRemoveFromCart } from '../../utils/cartUtils';


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
    productPrice,
    setLoading,
    loading,
    rtcCategory 
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryColor, setCategoryColor] = useState(null);
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

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            setIsShaking,
        });
    }
    return (
        <>
            <div
                key={product.id + 4567}
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
                                className="flex text-[#FAFAFA] text-[10px] mobile-sm:text-[12px] px-2 mobile-sm:px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                            >
                                {getCategoryModified(categoryTag)}
                            </button>
                            {(rtcCategory===true) && 
                                  <button
                                  type="button"
                                  style={{ backgroundColor: '#000000' }}
                                  className="flex text-[#FAFAFA] text-[10px] mobile-sm:text-[12px] px-2 mobile-sm:px-3 tracking-[0.12em] uppercase rounded-[10px] py-[4px] font-regola-pro font-[600] mb-3"
                              >
                                  DIY KIT
                              </button>
                            }
                            <p className="font-skillet flex font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                                ₹ {Math.floor(productPrice)}
                            </p>
                        </div>
                        <p className="font-skillet font-[400] text-[#333333] text-[24px] leading-5 uppercase">
                            {product.title}
                        </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        {productQuantity > 0 ? (
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
                            <div className='flex flex-row absolute top-5 w-[400px] left-5 gap-2'>
                            <button
                                type="button"
                                style={{ backgroundColor: categoryColor }}
                                className="text-[18px] leading-[27.08px]  text-[#FFFFFF] uppercase px-3 rounded-[10px] py-[4px] tracking-[0.12em] font-regola-pro font-[600]"
                            >
                                {getCategoryModified(categoryTag)}
                            </button>
                            {(rtcCategory===true) && 
                                  <button
                                  type="button"
                                  style={{ backgroundColor: '#000000' }}
                                   className="text-[18px] leading-[27.08px]  text-[#FFFFFF] uppercase px-3 rounded-[10px] py-[4px] tracking-[0.12em] font-regola-pro font-[600]"
                              >
                                  DIY KIT
                              </button>
                            }
                            </div>
                           
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
                            <p className="text-[16px] xl:leading-[12.73px] 2xl:leading-[18px] leading-[19px] font-[500] font-regola-pro text-[#757575] pt-2 pb-3">
                                {windowWidth <= 1600 ? (product.description.length > 80
                                    ? `${product.description.substring(0, 80)}...`
                                    : product.description) : (product.description.length > 80
                                        ? `${product.description.substring(0, 200)}...`
                                        : product.description)}
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
