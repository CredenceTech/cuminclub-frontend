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
import ProductBigCard from "../component/ProductBigCard";
import ProductSmallCard from "../component/ProductSmallCard";

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
    const [isIpaid, setIsIpaid] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsIpaid(window.innerWidth <= 1280);
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

    const [rtcTrueProducts, setRtcTrueProducts] = useState([]);
    const [rteTrueProducts, setRteTrueProducts] = useState([]);
    useEffect(() => {
        const apiCall = async () => {

            const rtcTrue = [];
            const rteTrue = [];
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
                            const metafields = product?.node?.metafields;

                            if (metafields) {
                                metafields?.forEach((metafield) => {
                                    if (metafield && metafield.key === "rtc" && metafield.value === "true") {
                                        rtcTrue.push({
                                            ...product.node,
                                            superTitle: category.node.title,
                                        });
                                    }
                                    if (metafield && metafield.key === "rte" && metafield.value === "true") {
                                        rteTrue.push({
                                            ...product.node,
                                            superTitle: category.node.title,
                                        });
                                    }
                                });
                            }
                            return {
                                ...product.node,
                                superTitle: category.node.title,
                            };
                        })
                        .filter(product => product !== null)
                );

                setRtcTrueProducts(rtcTrue);
                setRteTrueProducts(rteTrue);
                setApiResponse(collections);
                setRawResponse(collections);
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

    return (

        <div className="w-full bg-[#EFE9DA]">
            <ProductFliter excludeCategories={[]} />
            <div className="px-[20px] md:px-[60px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ y: 100, x: -100, opacity: 0 }}
                        animate={{ y: 0, x: 0, opacity: 1 }}
                        exit={{ y: -100, x: 100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-[30px] md:text-[42px] py-[20px] container mx-auto leading-[33px] font-[500] font-skillet text-[#333333]">Ready to cook</h1>
                        <div
                            ref={productEdgesRef}
                            className="container mx-auto grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10"
                        >
                            {rtcTrueProducts?.map((product, productIndex) => {
                                // Determine if this is a long product layout
                                const isLong = isIpaid ? (productIndex % 5 === 0) :
                                    ((productIndex % 15 === 0) ||
                                        (productIndex % 15 === 6) ||
                                        (productIndex % 15 === 10));


                                const productLargeImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_large_card_image')?.reference?.image?.originalSrc;
                                const productSmallImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_small_card_image')?.reference?.image?.originalSrc;
                                const rtc = product?.metafields?.find(mf => mf && mf.key === "rtc").value === "true" ? true : false;

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
                                        rtcCategory={rtc}
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
                                        rtcCategory={rtc}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="px-[20px] md:px-[60px] md:pb-[60px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ y: 100, x: -100, opacity: 0 }}
                        animate={{ y: 0, x: 0, opacity: 1 }}
                        exit={{ y: -100, x: 100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-[30px] md:text-[42px] py-[20px] md:pt-[60px] container mx-auto leading-[33px] font-[500] font-skillet text-[#333333]">Ready to eat</h1>
                        <div
                            ref={productEdgesRef}
                            className="container mx-auto grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10"
                        >
                            {rteTrueProducts?.map((product, productIndex) => {
                                // Determine if this is a long product layout
                                const isLong = isIpaid ? (productIndex % 5 === 0) :
                                    ((productIndex % 15 === 0) ||
                                        (productIndex % 15 === 6) ||
                                        (productIndex % 15 === 10));


                                const productLargeImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_large_card_image')?.reference?.image?.originalSrc;
                                const productSmallImage =
                                    product?.metafields?.find((mf) => mf?.key === 'product_small_card_image')?.reference?.image?.originalSrc;
                                const rtc = product?.metafields?.find(mf => mf && mf.key === "rtc").value === "true" ? true : false;

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
                                        rtcCategory={rtc}
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
                                        rtcCategory={rtc}
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
