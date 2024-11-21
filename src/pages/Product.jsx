import React, { useState, useEffect, useRef } from "react";
import {
    createCartMutation,
    getCartQuery,
    getProductCollectionsQuery,
    getProductDetailQuery,
    graphQLClient,
    updateCartItemMutation,
    updateCartMutation,
} from "../api/graphql";
import { useDispatch, useSelector } from "react-redux";
import { addMeal, selectMealItems } from "../state/mealdata";
import mealThreeImage from "../assets/mealThreeImage.png";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "../component/CartComponent";
import { cartIsOpen, openCart } from "../state/cart";
import {
    addCartData,
    cartData,
    selectCartResponse,
    setCartResponse,
} from "../state/cartData";
import { FilterDrawer } from "../component/FilterDrawer";
import LoadingAnimation from "../component/Loader";
import { totalQuantity } from "../utils";
import Popup from "../component/Popup";
import SpiceLevel from "../component/SpiceLevel";
import cardIcon from '../assets/cartnew.png';
import { AnimatePresence, motion } from "framer-motion";
import food1 from '../assets/food1.png'
import FilterButton from '../component/DropdownFilter';
import productImage from '../assets/Dish-1.jpg';
import { categoryrData } from "../state/selectedCategory";
import headerImage2 from '../assets/header2.png'
import ProductFliter from "../component/ProductFliter";

export const Product = () => {

    const [apiResponse, setApiResponse] = useState(null);
    const [rawResonse, setRawResponse] = useState(null);
    const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const mealData = useSelector(selectMealItems);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isCartOpen = useSelector(cartIsOpen);
    const selectedCategory = useSelector(categoryrData);
    const [activeTitle, setActiveTitle] = useState();
    const cartDatas = useSelector(cartData);
    const cartResponse = useSelector(selectCartResponse);
    const [popupState, setPopupState] = useState(true);
    const [loading, setLoading] = useState({});
    const categoryTitleRefs = useRef([]);
    const [currentCategory, setCurrentCategory] = useState("");
    const [selectedTab, setSelectedTab] = useState('BUY NOW');
    const [selectedValue, setSelectedValue] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shaking, setIsShaking] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    useEffect(() => {
        const handleScroll = () => {
            for (let i = 0; i < categoryTitleRefs.current.length; i++) {
                const categoryTitleRef = categoryTitleRefs.current[i];
                const rect = categoryTitleRef.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    setCurrentCategory(categoryTitleRef.textContent);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    useEffect(() => {
        setActiveTitle(currentCategory);
    }, [currentCategory]);

    // useEffect(() => {
    //     getCartData();
    // }, [cartDatas]);

    // const getCartData = async () => {
    //     const params = {
    //         cartId: cartDatas?.cartCreate?.cart?.id,
    //     };
    //     const response = await graphQLClient.request(getCartQuery, params);
    //     dispatch(setCartResponse(response));
    // };

    const productEdgesRef = useRef();

    const handleCategorySelect = (title) => {
        setActiveTitle(title);
        const productEdgesElement = document.getElementById(
            `product-edges-${title}`
        );

        if (productEdgesElement) {
            productEdgesElement.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        if (cartResponse && totalQuantity(cartResponse) == mealData.no) {
            // dispatch(openCart());
        }
    }, [cartResponse]);

    useEffect(() => {
        const handleSelectedOptionsChange = (selectedOptions) => {
            const filteredData = apiResponse?.collections?.edges?.filter((order) => {
                return order.node.products.edges.some((product) => {
                    const productTags = product.node.tags;
                    return selectedOptions.every((selectedOption) =>
                        productTags.includes(selectedOption)
                    );
                });
            });
            const newData = {
                collections: {
                    edges: filteredData,
                },
            };
            setFilteredOptions(newData);
            setRawResponse(newData);
        };

        handleSelectedOptionsChange(selectedOptions);
    }, [selectedOptions]);

    const handleSelectedOptionsChange = (newSelectedOptions) => {
        setSelectedOptions(newSelectedOptions);
    };

    const [transformedProducts, setTransformedProducts] = useState(null);

    useEffect(() => {
        const apiCall = async () => {
            try {
                const query = selectedCategory?.node?.title === "Premium" ? '' : selectedCategory?.node?.title || '';
                const result = await graphQLClient.request(getProductCollectionsQuery, {
                    first: 15,
                    reverse: false,
                    query: query,
                });
                const collections = result;
                const bundleIndex = collections.collections.edges.findIndex(
                    (item) => item.node.title === "Bundles"
                );

                if (bundleIndex !== -1) {
                    const bundleItem = collections.collections.edges.splice(
                        bundleIndex,
                        1
                    )[0];
                    collections.collections.edges.push(bundleItem);
                }
                const transformedProducts = collections.collections.edges.flatMap(category =>
                    category.node.products.edges
                        .map(product => {
                            const bulk = product.node.metafields.find(mf => mf && mf.key === "bulk");
                            const isPremium = product.node.metafields.find(mf => mf && mf.key === "premium")?.value === "true";
                            if (bulk?.value === "true") {
                                return null;
                            }
                            if (selectedCategory?.node?.title === "Premium" && !isPremium) {
                                return null;
                            }
                            return {
                                ...product.node,
                                superTitle: category.node.title,
                            };
                        })
                        .filter(product => product !== null)
                );


                setApiResponse(collections);
                setRawResponse(collections);
                setTransformedProducts(transformedProducts);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        apiCall();
    }, [selectedCategory]);


    const handleAddToCart = (productId, sellingPlanId) => {
        setIsShaking(productId);
        if (cartDatas === null) {
            if (sellingPlanId) {
                addToCart({
                    merchandiseId: productId,
                    sellingPlanId: sellingPlanId,
                    quantity: 1,
                });
            } else {
                addToCart({ merchandiseId: productId, quantity: 1 });
            }
        }

        const productInCart = cartResponse?.cart?.lines?.edges.find((cartItem) => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id;
            const id = productInCart?.node?.id;
            if (sellingPlanId) {
                updateCartItem(productId, cartId, {
                    id: id,
                    sellingPlanId: sellingPlanId,
                    quantity: quantityInCart + 1,
                });
            } else {
                updateCartItem(productId, cartId, {
                    id: id,
                    quantity: quantityInCart + 1,
                });
            }
        } else {
            const cartId = cartDatas?.cartCreate?.cart?.id;
            if (sellingPlanId) {
                updateCart(cartId, {
                    merchandiseId: productId,
                    sellingPlanId: sellingPlanId,
                    quantity: 1,
                });
            } else {
                updateCart(cartId, { merchandiseId: productId, quantity: 1 });
            }
        }
    };

    const handleRemoveFromCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        const productInCart = cartResponse.cart.lines.edges.find((cartItem) => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id;
            const id = productInCart?.node?.id;
            if (sellingPlanId) {
                updateCartItem(productId, cartId, {
                    id: id,
                    sellingPlanId: sellingPlanId,
                    quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
                });
            } else {
                updateCartItem(productId, cartId, {
                    id: id,
                    quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
                });
            }
        }
    };

    const addToCart = async (cartItems) => {
        const params = {
            cartInput: {
                lines: [cartItems],
            },
        };
        const response = await graphQLClient.request(createCartMutation, params);
        dispatch(addCartData(response));
        setIsShaking(null);
    };

    const updateCartItem = async (a, cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: cartItem,
        };
        const response = await graphQLClient.request(
            updateCartItemMutation,
            params
        );
        dispatch(setCartResponse(response.cartLinesUpdate));
        setIsShaking(null);
    };

    const updateCart = async (cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: [cartItem],
        };
        const response = await graphQLClient.request(updateCartMutation, params);
        dispatch(setCartResponse(response.cartLinesAdd));
        setIsShaking(null);
    };

    const getProductQuantityInCart = (productId) => {
        const productInCart = cartResponse?.cart?.lines?.edges?.find((cartItem) => {
            return cartItem.node.merchandise.id === productId;
        });
        return productInCart ? productInCart?.node?.quantity : 0;
    };

    const openCountryDrawer = () => {
        setIsCountryDrawerOpen(true);
    };

    const closeCountryDrawer = () => {
        setIsCountryDrawerOpen(false);
    };

    const [data, setData] = useState(null);

    const getProductDetail = async (productId) => {
        const response = await graphQLClient.request(getProductDetailQuery, {
            productId: productId,
        });

        const metafields = response.product.metafields;

        if (metafields) {
            for (const metafield of metafields) {
                if (metafield && metafield.key === "component_reference") {
                    const dataArray = JSON.parse(metafield.value);
                    setData(dataArray);
                    break;
                }
            }
        }
    };

    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            const details = [];

            for (const productId of data) {
                const response = await graphQLClient.request(getProductDetailQuery, {
                    productId,
                });

                details.push(response);
            }

            setProductDetails(details);
        };

        if (data !== null) {
            fetchProductDetails();
        }
    }, [data]);

    useEffect(() => {
        async function fetchData() {
            try {
                let data;

                for (let index = 0; index < productDetails.length; index++) {
                    const product = productDetails[index];
                    const productId = product.product.variants.edges[0].node.id;
                    const productIds =
                        product?.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans
                            ?.edges[0]?.node?.id;

                    await new Promise((resolve) => setTimeout(resolve, 500 * index));

                    if (cartDatas === null) {
                        if (data === undefined) {
                            const params = {
                                cartInput: {
                                    lines: [{ merchandiseId: productId, quantity: 1 }],
                                },
                            };
                            const response = await graphQLClient.request(
                                createCartMutation,
                                params
                            );
                            data = response;
                            dispatch(addCartData(response));
                        } else {
                            const cartId = data?.cartCreate?.cart?.id;

                            if (productIds) {
                                updateCart(cartId, {
                                    merchandiseId: productId,
                                    sellingPlanId: sellingPlanId,
                                    quantity: 1,
                                });
                            } else {
                                updateCart(cartId, { merchandiseId: productId, quantity: 1 });
                            }
                        }
                    } else {
                        const cartId = cartDatas?.cartCreate?.cart?.id;

                        if (productIds) {
                            updateCart(cartId, {
                                merchandiseId: productId,
                                sellingPlanId: sellingPlanId,
                                quantity: 1,
                            });
                        } else {
                            updateCart(cartId, { merchandiseId: productId, quantity: 1 });
                        }
                    }
                }
            } catch (error) {
                console.error(`Error fetching data:`, error);
            }
        }

        if (productDetails !== null) {
            fetchData();
        }
    }, [productDetails]);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (

        <div className="w-full bg-[#EFE9DA]">
            <ProductFliter />
            <div className="p-[20px] md:p-[60px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ y: 100, x: -100, opacity: 0 }}
                        animate={{ y: 0, x: 0, opacity: 1 }}
                        exit={{ y: -100, x: 100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div
                            ref={productEdgesRef}
                            className="container mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10"
                        >
                            {transformedProducts?.map((product, productIndex) => {
                                // Determine if this is a long product layout
                                const isLong = isMobile ? (productIndex % 5 === 0) :
                                    ((productIndex % 15 === 0) ||
                                        (productIndex % 15 === 6) ||
                                        (productIndex % 15 === 10));


                                const productLargeImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_large_card_image')?.reference?.image?.originalSrc;
                                const productSmallImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_small_card_image')?.reference?.image?.originalSrc;

                                const productPrice = product.priceRange.minVariantPrice.amount;
                                const categoryTag = product.superTitle || 'Lentils'; // Replace with appropriate category if available

                                return isLong ? (
                                    <div className="col-span-2 bg-[#EADEC1] rounded-3xl cursor-pointer group overflow-hidden" onClick={() => { navigate(`/product-details/${product.handle}`) }} key={product.id}>
                                        <AnimatePresence mode="popLayout">
                                            <motion.div
                                                initial={{ y: 500, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -500, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative flex justify-center items-center ">
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
                                                                handleAddToCart(product.variants.edges[0].node.id)
                                                            }
                                                            }
                                                            className={` ${shaking === product.variants.edges[0].node.id ? '' : ''} border-2 border-[#333333] w-[150px] flex justify-center items-center text-[#333333] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[14px] md:text-[16px] font-[600] leading-4 md:leading-[21.28px] tracking-[0.12em]`}
                                                        >
                                                            {shaking === product.variants.edges[0].node.id ? <div class="spinner1"></div> : 'ADD TO CART'}
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
                                ) : (
                                    <div key={product.id} className="md:col-span-1 bg-[#EADEC1] rounded-3xl  group overflow-hidden cursor-pointer" onClick={() => { navigate(`/product-details/${product.handle}`) }}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                initial={{ y: 500, x: -500, opacity: 0 }}
                                                animate={{ y: 0, x: 0, opacity: 1 }}
                                                exit={{ y: -500, x: 500, opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="h-full"
                                            >
                                                <div className="relative rounded-t-3xl rounded-b-[0px]  md:rounded-3xl flex justify-center items-center">
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
                                                                        handleAddToCart(product.variants.edges[0].node.id)
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
                                                            handleAddToCart(product.variants.edges[0].node.id)
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
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>

    )
}
