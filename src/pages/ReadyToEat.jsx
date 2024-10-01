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
import videoimage from '../assets/videoimage.png'
import kormavideo from '../assets/video/Korma-Reel.mp4'
import ReactPlayer from "react-player";
function ReadyToEat() {

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
    const [playing, setPlaying] = useState(true);

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

    useEffect(() => {
        const apiCall = async () => {
            try {
                const result = await graphQLClient.request(getProductCollectionsQuery, {
                    first: 15,
                    reverse: false,
                    query: selectedCategory?.node?.title,
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

                setApiResponse(collections);
                setRawResponse(collections);
            } catch (error) {
                // Handle errors here
                console.error("Error fetching data:", error);
            }
        };
        apiCall();
    }, [selectedCategory]);

    const handleAddToCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
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
        setIsLoading(true);
        const response = await graphQLClient.request(createCartMutation, params);
        setIsLoading(false);
        dispatch(addCartData(response));
        setLoading((prevLoading) => ({
            ...prevLoading,
            [cartItems.merchandiseId]: false,
        }));
    };

    const updateCartItem = async (a, cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: cartItem,
        };
        setIsLoading(true);
        const response = await graphQLClient.request(
            updateCartItemMutation,
            params
        );
        setIsLoading(false);
        dispatch(setCartResponse(response.cartLinesUpdate));
        setLoading((prevLoading) => ({
            ...prevLoading,
            [a]: false,
        }));
    };

    const updateCart = async (cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: [cartItem],
        };
        setIsLoading(true);
        const response = await graphQLClient.request(updateCartMutation, params);
        setIsLoading(false);
        dispatch(setCartResponse(response.cartLinesAdd));
        setLoading((prevLoading) => ({
            ...prevLoading,
            [cartItem.merchandiseId]: false,
        }));
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

    const product = [
        {
            id: 1,
            isLong: true,
            image: food1,
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 2,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31_1.png?v=1718710992"',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Punjabi chole'
        },
        {
            id: 3,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31_1.png?v=1718710992"',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 4,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 5,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 6,
            isLong: true,
            image: food1,
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 7,
            isLong: false,
            image: "https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992",
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 8,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 9,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 10,
            isLong: true,
            image: food1,
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 11,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 12,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 13,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 14,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 15,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 16,
            isLong: true,
            image: food1,
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
    ]

    const handleVideoEnd = () => {
        setPlaying(false);
    };

    const handlePlayAgain = () => {
        setPlaying(true);
    };


    return (

        <div className="w-full bg-[#EFE9DA]">
            <div className="grid grid-cols-2 lg:grid-cols-3 " >
                <div className=" col-span-2">
                    <div className="h-[357px] bg-[#0F0B05] "></div>
                    <div className="pt-[60px] px-[60px]">
                        <div className="grid grid-cols-2 gap-4 md:gap-10">
                            <>
                                <div className="col-span-2 relative rounded-3xl">
                                    {rawResonse?.collections?.edges?.map((category, index) => (
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={category.node.title}
                                                initial={{ y: 100, x: -100, opacity: 0 }}
                                                animate={{ y: 0, x: 0, opacity: 1 }}
                                                exit={{ y: -100, x: 100, opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <div
                                                    key={category.node.title}
                                                    ref={productEdgesRef}
                                                    id={`product-edges-${category.node.title}`}
                                                    className="grid grid-cols-1"
                                                >
                                                    {product.slice(0, 1)?.map((item) => (
                                                        <>
                                                            <div className='bg-[#EADEC1] rounded-3xl' key={item?.id}>
                                                                <AnimatePresence mode="popLayout">
                                                                    <motion.div
                                                                        initial={{ y: 500, opacity: 0 }}
                                                                        animate={{ y: 0, opacity: 1 }}
                                                                        exit={{ y: -500, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        <div className="relative">
                                                                            <img src={item?.image} alt="product" className="w-full h-[300px] rounded-t-3xl" />
                                                                            <button type="button" className="bg-[#FBAE36] text-[20.36px] leading-[27.08px] absolute top-5 left-5 text-[#333333] px-3 rounded-[10px] pt-2 pb-[8px] tracking-[0.12em] font-regola-pro font-[800]">LENTIL</button>
                                                                        </div>
                                                                        <div className=" px-10 py-5">
                                                                            <div className="flex flex-row justify-between pt-[18px] pb-2">
                                                                                <p className="font-regola-pro font-[800] uppercase text-[#333333] text-[30px] leading-[23.88px]">{item?.name}</p>
                                                                                <p className="font-regola-pro font-[800] text-[#333333] text-[30px] leading-[23.88px]">₹ 99</p>
                                                                            </div>
                                                                            <p className="text-[20px] leading-[15.92px] font-[500] font-regola-pro text-[#757575] pt-2 pb-3">{item?.description}</p>
                                                                            <div className="flex gap-x-4 mt-1">
                                                                                <button type="button" className="border-2 border-[#333333] text-[#333333] px-3 rounded-lg py-[4px] font-regola-pro  text-[16px] font-[800] leading-[21.28px] tracking-[0.12em]">ADD TO CART</button>
                                                                                <button type="button" className="bg-[#26965C] text-[#FAFAFA] px-3 rounded-lg py-[4px] font-regola-pro  text-[16px] font-[800] leading-[21.28px] tracking-[0.12em]">BUY NOW</button>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                </AnimatePresence>
                                                            </div>

                                                        </>
                                                    ))}
                                                </div>

                                            </motion.div>
                                        </AnimatePresence>
                                    ))}
                                </div>
                            </>

                        </div>
                    </div>

                </div>
                <div className="col-span-1 relative h-[891px] w-full bg-[#0F0B05]">
                    {/* {!playing && (
                        <img
                            src={videoimage}
                            alt="Video Thumbnail"
                            className="absolute inset-0 w-full h-full object-cover z-10"
                        />
                    )} */}
                    <ReactPlayer
                        className="bg-cover"
                        url={kormavideo}
                        width="100%"
                        height="100%"
                        playing={playing}
                        onEnded={handleVideoEnd}
                    />
                    {!playing && (
                        <div className="absolute inset-0 flex justify-center z-20 items-center">
                            <button
                                onClick={handlePlayAgain}
                                className="text-white p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EFEFEF"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-[60px]">
                {rawResonse?.collections?.edges?.map((category, index) => (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={category.node.title}
                            initial={{ y: 100, x: -100, opacity: 0 }}
                            animate={{ y: 0, x: 0, opacity: 1 }}
                            exit={{ y: -100, x: 100, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div
                                key={category.node.title}
                                ref={productEdgesRef}
                                id={`product-edges-${category.node.title}`}
                                className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10"
                            >
                                {/* {product.slice(2)?.map((product) => (
                                    <>
                                        <div key={product.node.id} className="bg-[#EADEC1] relative rounded-3xl">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    initial={{ y: 500, x: -500, opacity: 0 }}
                                                    animate={{ y: 0, x: 0, opacity: 1 }}
                                                    exit={{ y: -500, x: 500, opacity: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <img src={product.node.featuredImage.url} alt="product" className="w-full h-[250px] md:h-full rounded-t-3xl" />
                                                    <div className="absolute top-0 left-0 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full flex flex-col justify-between h-full">
                                                        <div className="p-5">
                                                            <button type="button" className="bg-[#279C66] text-[#FAFAFA] text-[20.36px] leading-[27.08px] px-3 rounded-[10px] py-1 font-futuraBold font-[800]">CURRY</button>
                                                        </div>
                                                        <div className="px-5 pb-5">
                                                            <p className="font-futuraBold text-[#FAFAFA] text-[30px] leading-[23.88px] uppercase mb-4">{product.node.title}</p>
                                                            <div className="flex flex-col md:flex-row md:gap-4">
                                                                <button type="button" onClick={() =>
                                                                    handleAddToCart(
                                                                        product.node.variants.edges[0].node.id,
                                                                        product.node.sellingPlanGroups?.edges[0]?.node
                                                                            ?.sellingPlans?.edges[0]?.node?.id
                                                                    )
                                                                } className="border-2 border-[#FAFAFA] text-[#FAFAFA] px-3 rounded-lg py-1 font-futuraBold text-[16px] font-[800] leading-[21.28px] tracking-[0.12em] text-left">ADD TO CART</button>
                                                                <button type="button" className="bg-[#26965C] text-[#FAFAFA] px-3 rounded-lg py-1 font-futuraBold text-[16px] font-[800] leading-[21.28px] tracking-[0.12em]">BUY NOW</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                    </>
                                ))} */}
                                {product.slice(1)?.map((item) => (
                                    <>
                                        {item?.isLong
                                            ?
                                            <div className='col-span-2 bg-[#EADEC1] rounded-3xl' key={item?.id}>
                                                <AnimatePresence mode="popLayout">
                                                    <motion.div
                                                        initial={{ y: 500, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -500, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="relative">
                                                            <img src={item?.image} alt="product" className="w-full h-[300px] rounded-t-3xl" />
                                                            <button type="button" className="bg-[#FBAE36] text-[20.36px] leading-[27.08px] absolute top-5 left-5 text-[#333333] px-3 rounded-[10px] pt-2 pb-[8px] tracking-[0.12em] font-regola-pro font-[800]">LENTIL</button>
                                                        </div>
                                                        <div className=" px-10 py-5">
                                                            <div className="flex flex-row justify-between pt-[18px] pb-2">
                                                                <p className="font-regola-pro font-[800] uppercase text-[#333333] text-[30px] leading-[23.88px]">{item?.name}</p>
                                                                <p className="font-regola-pro font-[800] text-[#333333] text-[30px] leading-[23.88px]">₹ 99</p>
                                                            </div>
                                                            <p className="text-[20px] leading-[15.92px] font-[500] font-regola-pro text-[#757575] pt-2 pb-3">{item?.description}</p>
                                                            <div className="flex gap-x-4 mt-1">
                                                                <button type="button" className="border-2 border-[#333333] text-[#333333] px-2 rounded-lg  pt-[4px] pb-[4px] font-regola-pro  text-[16px] font-[800] leading-[21.28px] tracking-[0.12em]">ADD TO CART</button>
                                                                <button type="button" className="bg-[#26965C] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro  text-[16px] font-[800] leading-[21.28px] tracking-[0.12em]">BUY NOW</button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                            :
                                            <div key={item?.id} className="bg-[#EADEC1] relative rounded-3xl">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        initial={{ y: 500, x: -500, opacity: 0 }}
                                                        animate={{ y: 0, x: 0, opacity: 1 }}
                                                        exit={{ y: -500, x: 500, opacity: 0 }}
                                                        transition={{ duration: 0.4 }}
                                                    >
                                                        <img src={item?.image} alt="product" className="w-full h-[250px] md:h-full rounded-t-3xl" />
                                                        <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full">
                                                            <div className="p-5">
                                                                <button type="button" className="bg-[#279C66] text-[#FAFAFA] text-[20.36px] leading-[27.08px] px-3 tracking-[0.12em] rounded-[10px] pt-2 pb-[8px] font-regola-pro font-[800]">CURRY</button>
                                                            </div>
                                                            <div className="px-3 md:pl-8 pb-6 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full">
                                                                <p className="font-regola-pro font-[800] text-[#FAFAFA] text-[30px] leading-[23.88px] uppercase mb-5">{item?.name}</p>
                                                                <div className="flex flex-col md:flex-row md:gap-4">
                                                                    <button type="button" className="border-2 border-[#FAFAFA] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[800] leading-[21.28px] tracking-[0.12em] text-left">ADD TO CART</button>
                                                                    <button type="button" className="bg-[#26965C] text-[#FAFAFA] px-2 rounded-lg pt-[4px] pb-[4px] font-regola-pro text-[16px] font-[800] leading-[21.28px] tracking-[0.12em]">BUY NOW</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        }

                                    </>
                                ))}
                            </div>

                        </motion.div>
                    </AnimatePresence>
                ))}

            </div>

        </div>

    )
}
export default ReadyToEat