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

export const ReadyToCook = () => {

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

    const options = [
        {
            id: 1,
            noMeal: "6 Meals",
            price: "for ₹999.00",
            discountPrice: "₹2510.12/meal",
            no: 6,
            subscriptionType: [
                {
                    id: 1,
                    type: "oneTime",
                    noMeal: "One Time",
                    price: "₹2110.12/meal",
                    discountPrice: "₹2510.12/meal",
                },
                {
                    id: 2,
                    type: "subscription",
                    noMeal: "Subscription",
                    price: "₹2110.12/meal",
                    discountPrice: "2000.12/meal",
                },
            ],
        },
        {
            id: 2,
            noMeal: "12 Meals",
            price: "for ₹999.00",
            discountPrice: "₹1110.12/meal",
            no: 12,
            subscriptionType: [
                {
                    id: 1,
                    type: "oneTime",
                    noMeal: "One Time",
                    price: "₹1210.12/meal",
                    discountPrice: "₹1110.12/meal",
                },
                {
                    id: 2,
                    type: "subscription",
                    noMeal: "Subscription",
                    price: "₹1210.12/meal",
                    discountPrice: "₹1000.12/meal",
                },
            ],
        },
        {
            id: 3,
            noMeal: "18 Meals",
            price: "for ₹999.00",
            discountPrice: "₹1110.12/meal",
            no: 18,
            subscriptionType: [
                {
                    id: 1,
                    type: "oneTime",
                    noMeal: "One Time",
                    price: "₹1210.12/meal",
                    discountPrice: "₹1110.12/meal",
                },
                {
                    id: 2,
                    type: "subscription",
                    noMeal: "Subscription",
                    price: "₹1210.12/meal",
                    discountPrice: "₹1000.12/meal",
                },
            ],
        },
    ]

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
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
        {
            id: 7,
            isLong: false,
            image: 'https://cdn.shopify.com/s/files/1/0682/8458/0066/files/Rectangle_31.png?v=1718710992',
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
            isLong: true,
            image: food1,
            description: 'lorem ipusn for teh test pesreuse on the roof tof the icn pressure',
            name: 'Dal makhani'
        },
    ]

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    return (

        <div className="w-full bg-[#EFE9DA]">
            <div className="w-full relative md:h-[303px]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-black z-10"></div>
                <img
                    src={headerImage2}
                    alt="Header Image"
                    className="w-full h-full object-cover"
                    style={{
                        zIndex: 1,
                    }}
                />
                <div className="absolute top-0 left-0 z-20 p-6 md:p-10">
                    <h1 className="font-skillet text-[35px] lg:text-[44px] font-[400] leading-[44.4px] text-white text-left ">
                        Real Indian Food, Ready in 2 Minutes
                    </h1>
                    <p className="font-regola-pro max-w-[600px] text-xl lg:text-[20px] font-normal leading-[24px] text-left text-[#DFDFDF]">
                        Heat, Cook, and Repeat – Get deliciousness served to your plate in minutes.
                    </p>
                </div>
            </div>

            <div className="p-[40px]">
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 mt-10 gap-4 md:gap-10">
                        {product?.map((item) => (
                            <React.Fragment key={item?.id}>
                                {item?.isLong ? (
                                    <div className="col-span-2 bg-[#EADEC1] rounded-3xl">
                                        <AnimatePresence mode="popLayout">
                                            <motion.div
                                                initial={{ y: 500, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -500, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={item?.image}
                                                        alt="product"
                                                        className="w-full h-[230px] rounded-t-3xl"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-[#FBAE36] tracking-tight absolute top-4 left-4 text-gray-900 px-3 rounded-lg py-1 font-futuraBold"
                                                    >
                                                        LENTIL
                                                    </button>
                                                </div>
                                                <div className="px-10 py-2">
                                                    <div className="flex flex-row justify-between">
                                                        <p className="text-base font-futuraBold uppercase lg:text-2xl">
                                                            {item?.name}
                                                        </p>
                                                        <p className="text-base font-futuraBold lg:text-2xl">
                                                            ₹ 99
                                                        </p>
                                                    </div>
                                                    <p className="text-lg font-futura text-[#515151]">
                                                        {item?.description}
                                                    </p>
                                                    <div className="flex gap-x-4 mt-1">
                                                        <button
                                                            type="button"
                                                            className="border-2 border-gray-900 text-gray-900 px-3 rounded-lg py-1 font-futuraBold"
                                                        >
                                                            ADD TO CART
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold"
                                                        >
                                                            BUY NOW
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="bg-[#EADEC1] relative rounded-3xl">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                initial={{ y: 500, x: -500, opacity: 0 }}
                                                animate={{ y: 0, x: 0, opacity: 1 }}
                                                exit={{ y: -500, x: 500, opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <img
                                                    src={item?.image}
                                                    alt="product"
                                                    className="w-full h-[250px] md:h-full rounded-t-3xl"
                                                />
                                                <div className="absolute top-0 left-0 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full flex flex-col justify-between h-full">
                                                    <div className="p-4">
                                                        <button
                                                            type="button"
                                                            className="bg-[#26965C] tracking-tight  text-gray-100 px-3 rounded-lg py-1 font-futuraBold"
                                                        >
                                                            CURRY
                                                        </button>
                                                    </div>
                                                    <div className="px-3 md:pl-8 pb-4">
                                                        <p className="text-base font-futuraBold text-gray-100 uppercase lg:text-2xl">
                                                            {item?.name}
                                                        </p>
                                                        <div className="flex flex-col md:flex-row md:gap-4">
                                                            <button
                                                                type="button"
                                                                className="border-2 border-gray-100 text-gray-100 px-3 rounded-lg py-1 font-futuraBold"
                                                            >
                                                                ADD TO CART
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold"
                                                            >
                                                                BUY NOW
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* <div className="p-[60px]">
                {rawResonse?.collections?.edges?.map((category, index) => (
                    <AnimatePresence mode="wait" key={category.node.title}>
                        <motion.div
                            initial={{ y: 100, x: -100, opacity: 0 }}
                            animate={{ y: 0, x: 0, opacity: 1 }}
                            exit={{ y: -100, x: 100, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div
                                ref={productEdgesRef}
                                id={`product-edges-${category.node.title}`}
                                className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
                            >
                                {category.node.products.edges.map((product, productIndex) => {
                                    const isLong =
                                        productIndex === 0 ||
                                        ((productIndex - 1) % 12 === 0 && productIndex !== 1) ||
                                        ((productIndex - 9) % 12 === 0);

                                    return isLong ? (
                                        <div className="col-span-2 bg-[#EADEC1] rounded-3xl " key={product.node.id}>
                                            <AnimatePresence mode="popLayout">
                                                <motion.div
                                                    initial={{ y: 500, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -500, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="relative flex justify-center items-center">

                                                        <img
                                                            src={product.node.featuredImage.url}
                                                            alt="product"
                                                            className="md:w-[180px] md:h-[180px] mt-1"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="bg-[#FBAE36] tracking-tight absolute top-4 left-4 text-gray-900 px-3 rounded-lg py-1 font-futuraBold"
                                                        >
                                                            LENTIL
                                                        </button>
                                                    </div>
                                                    <div className="px-10 py-3">
                                                        <div className="flex flex-row justify-between">
                                                            <p className="text-base font-futuraBold uppercase lg:text-2xl">
                                                                {product.node.title}
                                                            </p>
                                                            <p className="text-base font-futuraBold lg:text-2xl">₹ 99</p>
                                                        </div>
                                                        <p className="text-[18px] leading-[20px] font-futura text-[#515151]">
                                                            {product.node.description}
                                                        </p>
                                                        <div className="flex gap-x-4 mt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleAddToCart(
                                                                        product.node.variants.edges[0].node.id,
                                                                        product.node.sellingPlanGroups?.edges[0]?.node
                                                                            ?.sellingPlans?.edges[0]?.node?.id
                                                                    )
                                                                }
                                                                className="border-2 border-gray-900 text-gray-900 px-3 rounded-lg py-1 font-futuraBold"
                                                            >
                                                                ADD TO CART
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="bg-[#26965C] text-gray-100 px-3 rounded-lg py-1 font-futuraBold"
                                                            >
                                                                BUY NOW
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        // Normal Product Card Layout
                                        <div key={product.node.id} className="bg-[#EADEC1] relative rounded-3xl flex justify-center items-center">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    initial={{ y: 500, x: -500, opacity: 0 }}
                                                    animate={{ y: 0, x: 0, opacity: 1 }}
                                                    exit={{ y: -500, x: 500, opacity: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <img
                                                        src={product.node.featuredImage.url}
                                                        alt="product"
                                                        className="w-full h-[250px] md:h-[300px] md:w-[300px] mt-2 ml-2"
                                                    />
                                                    <div className="absolute top-0 left-0 bg-gradient-to-b from-primary rounded-3xl to-secondary w-full flex flex-col justify-between h-full">
                                                        <div className="p-5">
                                                            <button
                                                                type="button"
                                                                className="bg-[#279C66] text-[#FAFAFA] text-[16.36px] leading-[27.08px] px-3 rounded-[10px] py-1 font-futuraBold font-[800]"
                                                            >
                                                                CURRY
                                                            </button>
                                                        </div>
                                                        <div className="px-5 pb-5">
                                                            <p className="font-futuraBold text-[#FAFAFA] text-[22px] leading-[23.88px] uppercase mb-4">
                                                                {product.node.title}
                                                            </p>
                                                            <div className="flex flex-col md:flex-row md:gap-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleAddToCart(
                                                                            product.node.variants.edges[0].node.id,
                                                                            product.node.sellingPlanGroups?.edges[0]?.node
                                                                                ?.sellingPlans?.edges[0]?.node?.id
                                                                        )
                                                                    }
                                                                    className="border-2 border-[#FAFAFA] text-[#FAFAFA] px-3 rounded-lg py-1 font-futuraBold text-[16px] font-[800] leading-[21.28px] text-left"
                                                                >
                                                                    ADD TO CART
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="bg-[#26965C] text-[#FAFAFA] px-3 rounded-lg py-1 font-futuraBold text-[16px] font-[800] leading-[21.28px] "
                                                                >
                                                                    BUY NOW
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                ))}
            </div> */}



            {/* <div className="p-[60px]">

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
                                className="container mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10"
                            >
                                {category.node.products.edges.map((product) => (
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
                                ))}
                            </div>

                        </motion.div>
                    </AnimatePresence>
                ))}

            </div> */}

        </div>

    )
}
