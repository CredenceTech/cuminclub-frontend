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
import ProductBigCard from "../component/ProductBigCard";
import ProductSmallCard from "../component/ProductSmallCard";

function ReadyToCook() {

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
    const [transformedProducts, setTransformedProducts] = useState(null);
    const [muted, setMuted] = useState(true);
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

    useEffect(() => {
        const apiCall = async () => {
            try {
                const result = await graphQLClient.request(getProductCollectionsQuery, {
                    first: 15,
                    reverse: false,
                    query: '',
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
                            const rtc = product.node.metafields.find(mf => mf && mf.key === "rtc");
                            const shouldInclude = rtc?.value === "true";
                            if (shouldInclude) {
                                return {
                                    ...product.node,
                                    superTitle: category.node.title,
                                };
                            }
                            return null;
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

    const handleVideoEnd = () => {
        setPlaying(false);
    };

    const handlePlayAgain = () => {
        setPlaying(true);
    };

    const toggleMute = () => {
        setMuted(!muted);
    };

    return (

        <div className="w-full bg-[#EFE9DA] relative -top-[100px]">
            <div className="grid grid-cols-2 lg:grid-cols-3" >
                <div className="col-span-2 order-last lg:order-first">
                    <div className="h-[100px] hidden lg:flex lg:h-[357px] bg-[#0F0B05] "><div className="text-[120px] w-full pt-[120px] pl-[120px] font-skillet text-white font-[400] ">Cooking made sexy.</div></div>
                    <div className="pt-[20px] lg:pt-[60px] px-[20px] lg:px-[60px]">
                        <div className="grid grid-cols-2 gap-4 md:gap-10">
                            <>
                                <div className="col-span-2 relative rounded-3xl">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            initial={{ y: 100, x: -100, opacity: 0 }}
                                            animate={{ y: 0, x: 0, opacity: 1 }}
                                            exit={{ y: -100, x: 100, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div
                                                ref={productEdgesRef}
                                                className="grid grid-cols-1"
                                            >
                                                {transformedProducts?.slice(0, 1)?.map((product, productIndex) => (
                                                    <>
                                                        <ProductBigCard
                                                            key={product?.id}
                                                            product={product}
                                                            categoryTag={product.superTitle}
                                                            productLargeImage={product?.metafields?.find((mf) => mf?.key === 'product_large_card_image')?.reference?.image?.originalSrc}
                                                            productSmallImage={product?.metafields?.find((mf) => mf?.key === 'product_small_card_image')?.reference?.image?.originalSrc}
                                                            shaking={shaking}
                                                            setIsShaking={setIsShaking}
                                                            cartResponse={cartResponse}
                                                            cartDatas={cartDatas}
                                                            addCartData={addCartData}
                                                            productPrice={Math.floor(product.priceRange.minVariantPrice.amount)}
                                                            setCartResponse={setCartResponse}
                                                        />
                                                    </>
                                                ))}
                                            </div>

                                        </motion.div>
                                    </AnimatePresence>
                                    {/* ))} */}
                                </div>
                            </>

                        </div>
                    </div>

                </div>
                <div className="col-span-2 lg:col-span-1 relative h-[500px] lg:h-[891px] w-full bg-[#0F0B05]">
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
                        muted={muted}
                        playsinline
                        config={{
                            file: {
                                attributes: {
                                    playsInline: true, // For iOS
                                    controls: true,
                                },
                            },
                        }}
                    />
                    {!playing && (
                        <div className="absolute inset-0 flex justify-center z-20 items-center">
                            <button
                                onClick={handlePlayAgain}
                                className="text-white p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EFEFEF"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>                            </button>
                        </div>
                    )}
                    <div className="absolute z-[30] top-[100px] right-4">
                        <button
                            onClick={toggleMute}
                            className="bg-gray-800 text-white p-2 rounded-full">
                            {muted ?
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" width='30px' viewBox="0 -960 960 960" fill="#E8EAED">
                                    <path
                                        d="M806-56 677.67-184.33q-27 18.66-58 32.16-31 13.5-64.34 21.17v-68.67q20-6.33 38.84-13.66 18.83-7.34 35.5-19l-154.34-155V-160l-200-200h-160v-240H262L51.33-810.67 98.67-858l754.66 754L806-56Zm-26.67-232-48-48q19-33 28.17-69.62 9.17-36.61 9.17-75.38 0-100.22-58.34-179.11Q652-739 555.33-762.33V-831q124 28 202 125.5t78 224.5q0 51.67-14.16 100.67-14.17 49-41.84 92.33Zm-134-134-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5t-7.5 28.5Zm-170-170-104-104 104-104v208Zm-66.66 270v-131.33l-80-80H182v106.66h122L408.67-322Zm-40-171.33Z" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" width='30px' viewBox="0 -960 960 960" fill="#E8EAED">
                                    <path
                                        d="M560-131v-68.67q94.67-27.33 154-105 59.33-77.66 59.33-176.33 0-98.67-59-176.67-59-78-154.33-104.66V-831q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm426.67 45.33v-332Q599-628 629.5-582T660-480q0 55-30.83 100.83-30.84 45.84-82.5 64.5ZM413.33-634l-104 100.67H186.67v106.66h122.66l104 101.34V-634Zm-96 154Z" />
                                </svg>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-[20px] lg:p-[60px]">
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
                            {transformedProducts?.slice(1)?.map((product, productIndex) => {
                                const isLong = isMobile ? ((productIndex >= 4) && (productIndex % 4 === 0)) : ((productIndex >= 4) &&
                                    ((productIndex - 4) % 10 === 0 || (productIndex - 8) % 10 === 0));

                                const productLargeImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_large_card_image')?.reference?.image?.originalSrc;
                                const productSmallImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_small_card_image')?.reference?.image?.originalSrc;

                                const productPrice = product.priceRange.minVariantPrice.amount;
                                const categoryTag = product.superTitle || 'Lentils'; // Replace with appropriate category if available

                                return isLong ? (
                                    <ProductBigCard
                                        key={product?.id}
                                        product={product}
                                        categoryTag={categoryTag}
                                        productLargeImage={productLargeImage}
                                        productSmallImage={productSmallImage}
                                        shaking={shaking}
                                        setIsShaking={setIsShaking}
                                        cartResponse={cartResponse}
                                        cartDatas={cartDatas}
                                        addCartData={addCartData}
                                        productPrice={productPrice}
                                        setCartResponse={setCartResponse}
                                        setLoading={setLoading}
                                        loading={loading}
                                    />
                                ) : (
                                    <ProductSmallCard
                                        key={product?.id}
                                        product={product}
                                        categoryTag={categoryTag}
                                        productSmallImage={productSmallImage}
                                        shaking={shaking}
                                        setIsShaking={setIsShaking}
                                        cartResponse={cartResponse}
                                        cartDatas={cartDatas}
                                        addCartData={addCartData}
                                        productPrice={productPrice}
                                        setCartResponse={setCartResponse}
                                        setLoading={setLoading}
                                        loading={loading}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>

    )
}
export default ReadyToCook;