import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProductCollectionsQuery, getProductDetailQuery, getProductRecommendedQuery, getProductDetailsQuery, graphQLClient, getProductDetailFull, getStepDetails, getFeedbackDetails, getProductDetailByHandle, getRelatedProducts, createCartMutation, updateCartItemMutation, updateCartMutation, checkoutCreate } from '../api/graphql';
import Rating from '../component/Rating';
import middleImg from '../assets/middle1-image1.png'
import AddFeedback from '../component/AddFeedback';
import { wrap } from "popmotion";
import ReactPlayer from 'react-player';
import LoadingAnimation from '../component/Loader';
import { addCartData, cartData, selectCartResponse, setCartResponse } from '../state/cartData';
import { addCheckoutData, setCheckoutResponse } from '../state/checkoutData';

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

function ProductDetail() {
    const location = useLocation();
    const productId = location.state?.productId;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openCategoryMeals, setOpenCategoryMeals] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isBulk, setIsBulk] = useState(false);
    const [[page, direction], setPage] = useState([0, 0]);
    const [[testiPage, testidirection], settestiPage] = useState([0, 0]);
    const [playing, setPlaying] = useState(false);
    const [productData, setProductData] = useState(null);
    const [homeImg, setHomeImage] = useState(null);
    const [steps, setSteps] = useState(null);
    const [feedbacks, setFeedbacks] = useState(null);
    const [loading, setLoading] = useState(false);
    const previousIndex = currentIndex === 0 ? steps?.length - 1 : currentIndex - 1;
    const [relatedProducts, setRelatedProducts] = useState(null)
    const { handle } = useParams();
    const [isAddFeedbackOpen, setIsAddFeedbackOpen] = useState(false);
    const [deliveryPostcode, setDeliveryPostcode] = useState('');
    const [etd, setEtd] = useState(null);
    const [logo, setLogo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const cartDatas = useSelector(cartData);
    const cartResponse = useSelector(selectCartResponse);
    const pickupPostcode = '394421';
    const [isRte, setIsRte] = useState(false)
    const [shaking, setIsShaking] = useState(null);
    const [initialRating, setInitialRating] = useState(0);
    const [initialReviewCount, setInitialReviewCount] = useState(0);
    const section1Ref = useRef(null);
    const [visibleFeedbackCount, setVisibleFeedbackCount] = useState(3);
    const [buyNowLoading, setBuyNowLoading] = useState(null)
    const handleAddToCheckout = async (variantId) => {
        try {
            setBuyNowLoading(variantId);
            const params = {
                input: {
                    lineItems: [
                        {
                            variantId: variantId,
                            quantity: 1,
                        },
                    ],
                },
            };
            const response = await graphQLClient.request(checkoutCreate, params);
            if (response?.checkoutCreate?.userErrors?.length > 0) {
                console.error('GraphQL user errors:', response.checkoutCreate.userErrors);
                return;
            }
            dispatch(setCheckoutResponse(response?.checkoutCreate));
            dispatch(addCheckoutData(response));
            setBuyNowLoading(null)
            navigate('/cardReview', { state: { isBuyNow: true } });
        } catch (error) {
            console.error('Error adding to checkout:', error);
        }
    };

    const handleAddToCart = (productId, sellingPlanId) => {
        setIsShaking(productId)
        // setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
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
        } else {

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
        }
    };


    const addToCart = async (cartItems) => {
        const params = {
            cartInput: {
                lines: [cartItems],
            },
        };
        // setIsLoading(true);
        const response = await graphQLClient.request(createCartMutation, params);
        // setIsLoading(false);
        dispatch(addCartData(response));
        dispatch(setCartResponse(response.cartCreate))
        setIsShaking(null)
        // setLoading((prevLoading) => ({
        //     ...prevLoading,
        //     [cartItems.merchandiseId]: false,
        // }));
    };

    const updateCartItem = async (a, cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: cartItem,
        };
        // setIsLoading(true);
        const response = await graphQLClient.request(
            updateCartItemMutation,
            params
        );
        // setIsLoading(false);
        dispatch(setCartResponse(response.cartLinesUpdate));
        // setLoading((prevLoading) => ({
        //     ...prevLoading,
        //     [a]: false,
        // }));
        setIsShaking(null)
    };

    const updateCart = async (cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: [cartItem],
        };
        // setIsLoading(true);
        const response = await graphQLClient.request(updateCartMutation, params);
        // setIsLoading(false);
        dispatch(setCartResponse(response.cartLinesAdd));
        // setLoading((prevLoading) => ({
        //     ...prevLoading,
        //     [cartItem.merchandiseId]: false,
        // }));
        setIsShaking(null)
    };

    const fetchServiceability = async () => {
        const url = `${import.meta.env.VITE_SHIP_ROCKET_API}/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=1&cod=1`;
        const token = import.meta.env.VITE_SHIP_ROCKET_API_TOKEN

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const estimated_date = new Date(data?.data.available_courier_companies[0].etd);
            setEtd(estimated_date);
        } catch (error) {
            console.error("Error details:", error);
            console.log("Something went wrong!!");
        } finally {
            console.log("");
        }
    };

    const options = { weekday: 'long' };
    const dayOfWeek = etd?.toLocaleDateString('en-US', options);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDeliveryDate = etd?.toLocaleDateString('en-US', dateOptions);

    const handleBlur = () => {
        if (deliveryPostcode) {
            fetchServiceability();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && deliveryPostcode) {
            fetchServiceability();
        }
    };

    const openAddFeedback = () => {
        setIsAddFeedbackOpen(true);
    };

    const closeAddFeedback = () => {
        setIsAddFeedbackOpen(false);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % steps?.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? steps?.length - 1 : prevIndex - 1
        );
    };

    const handleVideoEnd = () => {
        setPlaying(false);
    };

    const ActiveTestimonialIndex = wrap(0, feedbacks?.length, testiPage);
    const imageIndex = wrap(0, steps?.length, page);
    const nextImageIndex = wrap(0, steps?.length, page + 1);
    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };
    const paginateTestimonial = (newDirection) => {
        settestiPage([testiPage + newDirection, newDirection]);
    };

    const containsNONG = (title) => {

        return title?.includes("NONG");
    };


    const colors = ['#fbae3666', '#279c6666', '#f15e2a66', '#fbae3666', '#279c6666', '#f15e2a66'];


    const fetchRelatedProducts = async (isBulk) => {
        setLoading(true);
        console.log(isBulk);
        try {
            const result = await graphQLClient.request(getRelatedProducts, {
                first: 50,
                sortKey: "TITLE",
                reverse: false,
            });

            const products = result?.products?.edges || [];
            const filteredProducts = products.filter((product) => {
                const bulkValue = product.node.bulkMetafield?.value;

                // Check bulkMetafield value based on isBulk flag
                if (isBulk) {
                    return bulkValue === "true";
                } else {
                    return bulkValue === null || bulkValue === "false";
                }
            });

            return filteredProducts;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };




    const fetchStepsQueyDetails = async (stepId) => {
        try {
            const stepPromises = stepId.map(async (stepId) => {
                const stepData = await graphQLClient.request(getStepDetails, { id: stepId });
                return stepData;
            });
            const stepsData = await Promise.all(stepPromises);
            return stepsData;
        } catch (error) {
            console.error("Error fetching image:", error);
            return '';
        }
    };
    const fetchFeedbackQueyDetails = async (feedbacks) => {
        try {
            const feedbackPromises = feedbacks.map(async (feedback) => {
                const feedbackData = await graphQLClient.request(getFeedbackDetails, { id: feedback });
                return feedbackData;
            });
            const feedbackData = await Promise.all(feedbackPromises);
            return feedbackData;
        } catch (error) {
            console.error("Error fetching image:", error);
            return '';
        }
    };

    const getRandomProducts = (filteredAdditionalProducts, remainingCount) => {
        const shuffledProducts = filteredAdditionalProducts.sort(() => 0.5 - Math.random());
        const additionalProducts = shuffledProducts.slice(0, remainingCount);
        return additionalProducts;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setProductData(null);
            setFeedbacks(null);
            setSteps(null)
            try {
                const getProductDetail = async () => {
                    const response = await graphQLClient.request(getProductDetailByHandle, {
                        handle: handle
                    });

                    setProductData(response?.product);

                    const homeImage = response?.product?.metafields?.find(field => field?.key === 'image_for_home');
                    const rte = response?.product?.metafields?.find(mf => mf && mf.key === "rte");
                    const initialRatingString = response?.product?.metafields?.find(mf => mf && mf.key === "initial_star_rating")?.value || "0";
                    const initialReviewsCountString = response?.product?.metafields?.find(mf => mf && mf.key === "initial_reviews_count")?.value || "0";
                    const initailRating = parseFloat(initialRatingString);
                    const initailReviewsCount = parseInt(initialReviewsCountString, 10);

                    const bulk = response?.product?.metafields?.find(field => field?.key === 'bulk').value;
                    if (bulk === "true") {
                        setIsBulk(true)
                    }
                    else {
                        setIsBulk(false);
                    }

                    setInitialRating(initailRating);
                    setInitialReviewCount(initailReviewsCount);

                    if (rte.value === "true") {
                        setIsRte(true)
                    }
                    else {
                        setIsRte(false)
                    }
                    setHomeImage(homeImage);
                    setLogo(homeImage);

                    const stepsField = response?.product?.metafields?.find(field => field?.key === 'add_product_steps');
                    const feedbackField = response?.product?.metafields?.find(field => field?.key === 'add_feedbacks');

                    // Fetch steps
                    if (stepsField && stepsField.value) {
                        const stepIds = JSON.parse(stepsField.value);
                        if (Array.isArray(stepIds) && stepIds.length > 0) {
                            const stepsData = await fetchStepsQueyDetails(stepIds);
                            const parsedSteps = await Promise.all(stepsData?.map(async (step) => {
                                const descriptionField = step.metaobject.fields.find(field => field.key === 'description');
                                const videoField = step.metaobject.fields.find(field => field.key === 'video');
                                const refField = step.metaobject.fields.find(field => field.key === 'name');
                                const timeField = step.metaobject.fields.find(field => field.key === 'time');


                                return {
                                    id: step?.metaobject?.id,
                                    description: descriptionField?.value,
                                    video: videoField?.reference?.sources[0]?.url,
                                    ref: refField ? refField.value : '',
                                    time: timeField ? timeField.value : ''
                                };
                            }));
                            setSteps(parsedSteps);
                        }
                    }

                    // Fetch feedbacks
                    if (feedbackField && feedbackField.value) {
                        const feedbackIds = JSON.parse(feedbackField.value);
                        if (Array.isArray(feedbackIds) && feedbackIds.length > 0) {
                            const feedbackData = await fetchFeedbackQueyDetails(feedbackIds);
                            const parsedFeedback = await Promise.all(feedbackData?.map(async (feedback) => {
                                const reviewerNameField = feedback.metaobject.fields.find(field => field.key === 'reviewer_name');
                                const reviewField = feedback.metaobject.fields.find(field => field.key === 'feedback');
                                const ratingField = feedback.metaobject.fields.find(field => field.key === 'rating');

                                return {
                                    id: feedback?.metaobject?.id,
                                    review: reviewField?.value,
                                    reviewerName: reviewerNameField?.value,
                                    rating: ratingField?.value
                                };
                            }));
                            setFeedbacks(parsedFeedback);
                        }
                    }

                    // Related Products Logic
                    let currentRelatedProducts = response?.product?.relatedProducts?.references?.edges || [];

                    let relatedAdditionalProducts;
                    if (bulk === "true") {
                        relatedAdditionalProducts = await fetchRelatedProducts(true)
                    }
                    else {
                        relatedAdditionalProducts = await fetchRelatedProducts(false)
                    }

                    if (currentRelatedProducts.length < 6) {
                        const remainingCount = 6 - currentRelatedProducts.length;
                        const existingProductIds = new Set(currentRelatedProducts.map(product => product.node.id));
                        const filteredAdditionalProducts = relatedAdditionalProducts
                            .filter(product => !existingProductIds.has(product.node.id))
                            .map(product => ({
                                node: product.node
                            }));
                        const additionalProducts = getRandomProducts(filteredAdditionalProducts, remainingCount);
                        currentRelatedProducts = [
                            ...currentRelatedProducts,
                            ...additionalProducts
                        ];
                    }

                    setProductData(prevData => ({
                        ...prevData,
                        relatedProducts: {
                            references: {
                                edges: currentRelatedProducts
                            }
                        }
                    }));
                };

                await getProductDetail();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [handle]);


    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return initialRating ? initialRating : 0;
        }
        const totalRating = reviews.reduce((acc, review) => {
            const rating = parseFloat(review?.rating);
            return acc + (isNaN(rating) ? 5 : rating);
        }, 0);
        const averageReviewRating = totalRating / reviews.length;
        const combinedRating = (averageReviewRating + initialRating) / 2;
        return parseFloat(combinedRating.toFixed(2));
    };

    const averageRating = calculateAverageRating(feedbacks);


    const getMetafieldData = (key, list) => {
        let metaContent = "";
        if (list) {
            let findValue = list?.find((x) => x?.key === key);
            if (findValue) {
                metaContent = findValue.value;
            }
        }
        return metaContent;
    };

    const categoryVariants = {
        open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
        closed: {
            borderBottomRightRadius: "0.375rem",
            borderBottomLeftRadius: "0.375rem",
        },
    };
    const toggleCategoryMeals = (id) => {
        setOpenCategoryMeals(openCategoryMeals === id ? null : id);
    };

    const accordianData = [
        {
            title: "Ingredient",
            description: getMetafieldData("ingredient", productData?.metafields),
            id: 1,
        },
        {
            title: "Nutritional Facts",
            description: getMetafieldData("nutrition_facts", productData?.metafields),
            id: 2,
        },
        // {
        //     title: "How To Prepare",
        //     description: getMetafieldData("how_to_prepare", productData?.metafields),
        //     id: 3,
        // },
    ];

    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking && homeImg?.reference?.image?.originalSrc) {
                ticking = true;
                requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    const rotationAngle = scrollPosition * 0.2;
                    setRotation(rotationAngle);
                    ticking = false;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [homeImg]);

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

    function getCategoryColor(categoryTag) {
        if (categoryTag?.toUpperCase() === "CURRIES") {
            return "#FB7D36";
        } else if (categoryTag?.toUpperCase() === "LENTILS") {
            return "#FBAE36";
        }
        else if (categoryTag?.toUpperCase() === "RICE") {
            return "#279C66";
        } else if (categoryTag?.toUpperCase() === "SWEETS") {
            return "#BA7E05";
        }
        else {
            return '#279C66';
        }
        return '#279C66';
    }
    function getCategoryModified(category) {
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

    const scrollContainerRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slidesPerView = isMobile && !homeImg?.reference?.image?.originalSrc ? 3 : 4;
    const totalSlides = productData?.images?.edges?.length || 0;

    const nextSlide = () => {
        if (scrollContainerRef.current && currentSlide < Math.ceil(totalSlides - slidesPerView)) {
            scrollContainerRef.current.scrollBy({ top: 150, behavior: 'smooth' });
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (scrollContainerRef.current && currentSlide > 0) {
            scrollContainerRef.current.scrollBy({ top: -150, behavior: 'smooth' });
            setCurrentSlide((prev) => prev - 1);
        }
    };

    const nextleftSlide = () => {
        if (scrollContainerRef.current && currentSlide < Math.ceil(totalSlides - slidesPerView)) {
            scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const prevRightSlide = () => {
        if (scrollContainerRef.current && currentSlide > 0) {
            scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
            setCurrentSlide((prev) => prev - 1);
        }
    };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    };
    const feedbackLength = parseInt(feedbacks?.length || 0, 10);
    const initialCount = initialReviewCount;
    const totalReviewcounts = feedbackLength + initialCount;


    const weightUnitSymbols = {
        GRAMS: 'g',
        KILOGRAMS: 'kg',
        POUNDS: 'lbs',
        OUNCES: 'oz',
    };

    const getWeightSymbol = (weightUnit) => {
        return weightUnitSymbols[weightUnit] || weightUnit;
    };

    const leftPositions = ['left-[0px]', 'left-[30px]', 'left-[20px]', 'left-[0px]'];

    return (
        <div className='bg-white other-page'>

            {!loading ?
                <>
                    <div className="flex md:flex-row flex-col pb-10">
                        <div className={`${homeImg?.reference?.image?.originalSrc ? 'flex' : 'flex'} mt-3 flex-row md:hidden`} >
                            <div className={`ml-6 mr-4 -mt-2 ${homeImg?.reference?.image?.originalSrc ? 'hidden' : 'flex'} `}>
                                <img
                                    src={logo?.reference?.image?.originalSrc}
                                    className={`w-[150px] h-auto`}
                                    alt={``}
                                />
                            </div>
                            <div className={`flex flex-col md:ml-5 ${homeImg?.reference?.image?.originalSrc ? 'ml-[60%]' : 'ml-2 w-[48%]'}`}>
                                <h1
                                    style={{
                                        color: `${getMetafieldData("product_text_color", productData?.metafields) ? getMetafieldData("product_text_color", productData?.metafields) : '#EB7E01'}`
                                    }}
                                    className={`leading-[22px] font-skillet md:text-[52.87px] text-[35px] md:leading-[56.74px] font-[400] md:mb-0 mb-2 `
                                    } >
                                    {productData?.title}
                                </h1>
                                {containsNONG(productData?.title) && <p className="md:text-[20px] pb-1 text-[16px] font-[400] font-regola-pro md:leading-[24px] leading-[20px] md:mt-3 mt-1 md:pl-2 pl-0 text-[#757575]">
                                    *No Onion No Garlic
                                </p>
                                }

                                {!isBulk && <div className='flex flex-col items-start'>
                                    <button type='button'
                                        style={{
                                            backgroundColor: `${getCategoryColor(productData?.collections?.edges[0]?.node?.title)}`
                                        }}
                                        className='font-[400] uppercase md:text-[14px] text-[12px] md:leading-[18.62px] leading-[14px] tracking-[0.02em] font-regola-pro px-4 py-[6px] rounded-lg text-[#FFFFFF]'>{getCategoryModified(productData?.collections?.edges[0]?.node?.title)} </button>
                                    <div onClick={() => scrollToSection(section1Ref)} className="flex">
                                        <Rating rating={averageRating} text={`${totalReviewcounts}`} />
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div className={`md:w-3/5 w-full pt-1  relative md:pt-8 md:pr-7 gap-x-[40px] flex items-center ${homeImg?.reference?.image?.originalSrc ? 'flex-row' : 'md:flex-row flex-col'} md:h-[650px] h-auto`}>
                            {/* <div className='relative w-4/6 max-w-[553px] shrink-1'> */}
                            <div className={`relative ${homeImg?.reference?.image?.originalSrc ? 'product-detail-spin-home' : 'md:pr-6 md:pl-6 md:h-[553px] h-[553px] md:w-[553px] w-[553px] flex justify-center items-center'} `}>
                                <img
                                    src={homeImg?.reference?.image?.originalSrc ? homeImg?.reference?.image?.originalSrc : homeImg}
                                    // src={data?.images?.edges[0]?.node?.src}
                                    className={`spin-on-scroll ${homeImg?.reference?.image?.originalSrc ? 'product-detail-spin-home-img' : 'md:h-auto md:max-h-[553px] w-auto h-[500px]'}`}
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                    alt={``}
                                />
                            </div>

                            <div className={`flex md:h-full h-auto flex-col relative ${homeImg?.reference?.image?.originalSrc ? 'md:-left-10 left-[-20px] w-[25%]' : 'w-full md:w-auto'} gap-y-2`}>
                                {/* <div className='flex relative  flex-col gap-y-2'> */}
                                <div ref={scrollContainerRef} className={`flex ${homeImg?.reference?.image?.originalSrc ? 'flex-col  md:h-[600px] h-[400px] overflow-x-auto w-[115%] md:w-full' : 'md:flex-col  md:h-[600px] h-auto flex-row overflow-x-scroll w-[100%] md:w-auto ml-[1%] md:ml-0'} scrollbar-hide`}>
                                    {productData?.images?.edges?.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`flex-shrink-0 cursor-pointer p-2 relative ${homeImg?.reference?.image?.originalSrc
                                                ? `${i > 3
                                                    ? leftPositions[Math.max(0, leftPositions.length - (i - 3) - 1)]
                                                    : leftPositions[i % leftPositions.length]} 
                                            my-0 md:my-0 md:left-0 w-[80px] md:w-[130px] md:h-[150px] h-[100px]`
                                                : 'md:w-[130px] w-[100px] md:h-[150px] h-[100px]'}`}
                                        >
                                            <img
                                                onClick={() => { setHomeImage(item?.node?.src); setRotation(0); }}
                                                src={item?.node?.src}
                                                className="w-full h-full rounded-md object-cover"
                                                alt={`carousel-${i}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className={` ${productData?.images?.edges.length <= 4 ? 'hidden' : 'flex'} md:flex-col flex-row md:justify-start justify-center gap-y-4 gap-3 -right-[55px] md:absolute unset bottom-0 mt-4`}>
                                    {/* Conditional Rendering for Previous Slide Button */}
                                    {isMobile && !homeImg?.reference?.image?.originalSrc ? (
                                        <button
                                            onClick={prevRightSlide}
                                            className={`p-2 bg-[#1c1515ae] text-white rounded-full ${homeImg?.reference?.image?.originalSrc ? 'flex' : 'hidden'}`}
                                            disabled={currentSlide === 0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                                <path d="M416-480 600-296l-56 56-240-240 240-240 56 56-184 184Z" />
                                            </svg>


                                        </button>
                                    ) : (
                                        // Previous Slide Button
                                        <button
                                            onClick={prevSlide}
                                            className={`p-2 bg-[#1c1515ae] text-white rounded-full`}
                                            disabled={currentSlide === 0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                                <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Conditional Rendering for Next Slide Button */}
                                    {isMobile && !homeImg?.reference?.image?.originalSrc ? (
                                        <button
                                            onClick={nextleftSlide}
                                            className={`p-2 bg-[#1c1515ae] text-white rounded-full ${homeImg?.reference?.image?.originalSrc ? 'flex' : 'hidden'}`}
                                            disabled={currentSlide >= Math.ceil(totalSlides - slidesPerView)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                                <path d="M544-480 360-296l56 56 240-240-240-240-56 56 184 184Z" />
                                            </svg>

                                        </button>
                                    ) : (
                                        // Next Slide Button
                                        <button
                                            onClick={nextSlide}
                                            className="p-2 bg-[#1c1515ae] text-white rounded-full"
                                            disabled={currentSlide >= Math.ceil(totalSlides - slidesPerView)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:flex-grow md:max-w-[645px] md:w-2/5 md:mt-14 mt-7 lg:mr-20 2xl:mr-40 w-full mb-0 md:mb-0">
                            {/*  accordion sadasdasd */}
                            <div className='px-4 md:px-0'>
                                <div className='hidden md:flex flex-col '>
                                    <h1
                                        style={{
                                            color: `${getMetafieldData("product_text_color", productData?.metafields) ? getMetafieldData("product_text_color", productData?.metafields) : '#EB7E01'}`
                                        }}
                                        className={`sm:text-5xl font-skillet md:text-[52.87px] text-[40px] md:leading-[56.74px] leading-[40px] font-[400] md:mb-0 mb-2 `
                                        } >
                                        {productData?.title}
                                    </h1>

                                    {containsNONG(productData?.title) && <p className="md:text-[20px] pb-2 text-[16px] font-[400] font-regola-pro md:leading-[24px] leading-[20px] md:mt-1 mt-1 pl-0 text-[#757575]">
                                        *No Onion No Garlic
                                    </p>
                                    }

                                    {!isBulk && <div className='flex items-center'>
                                        <button type='button'
                                            style={{
                                                backgroundColor: `${getCategoryColor(productData?.collections?.edges[0]?.node?.title)}`
                                            }}
                                            className='font-[400] md:text-[14px] text-[12px] md:leading-[18.62px] leading-[14px] tracking-[0.02em] font-regola-pro px-4 py-[6px] rounded-lg text-[#FFFFFF]'>{getCategoryModified(productData?.collections?.edges[0]?.node?.title)} </button>
                                        <div onClick={() => scrollToSection(section1Ref)} className="flex ml-4 cursor-pointer">
                                            <Rating rating={averageRating} text={`${totalReviewcounts}`} />
                                        </div>
                                    </div>
                                    }
                                </div>
                                <p className={`md:text-[29px] text-[25px] font-[500] font-skillet ${isBulk ? "mt-0" : "mt-3"} md:pl-2 pl-0 text-[#333333]`}>Net weight: {`${productData?.variants.edges[0]?.node.weight}`} {`${getWeightSymbol(productData?.variants.edges[0]?.node.weightUnit)}`}</p>
                                {isBulk && <p className='md:text-[29px] text-[25px] font-[500] font-skillet  md:pl-2 pl-0 text-[#333333]'>Output (Weight + dilution):  {`${getMetafieldData("bulk_output", productData?.metafields) ? getMetafieldData("bulk_output", productData?.metafields) : " N/A"}`}</p>}
                                <p className='md:text-[29px] text-[25px] font-[500] font-skillet  md:pl-2 pl-0 text-[#333333]'>{`₹ ${productData?.priceRange?.minVariantPrice?.amount || 0}`}</p>
                                {isBulk && <p className='md:text-[29px] text-[25px] font-[500] font-skillet  md:pl-2 pl-0 text-[#333333]'>Application:  {`${getMetafieldData("bulk_application", productData?.metafields) ? getMetafieldData("bulk_application", productData?.metafields) : " N/A"}`}</p>}
                                <p className="md:text-[20px] text-[16px] font-[400] font-regola-pro md:leading-[24px] leading-[20px] md:mt-3 mt-1 md:pl-2 pl-0 text-[#757575]">
                                    {productData?.description}
                                </p>

                                {/* {isBulk && <button
                                    style={{ backgroundColor: `${getMetafieldData("product_background_color", productData?.metafields) ? getMetafieldData("product_background_color", productData?.metafields) : '#FBAE36'}` }}
                                    onClick={() => { window.open('https://wa.me/919510537693?text=Hello') }} className='w-[200px] ml-2 my-3 text-center font-[600] leading-[25px] font-regola-pro py-2 rounded text-[22px] text-[#FFFFFF]' type='button'>Send Enquiry</button>
                                } */}
                                <div className="accordion-container md:m-2 ml-0 mr-0 mt-2 mb-2 text-[#333333] md:pt-4 pt-3">
                                    {accordianData.map((item, i) => (
                                        <div key={i} className="mb-2">
                                            <motion.button
                                                onClick={() => toggleCategoryMeals(item.id)}
                                                className="px-5 py-5 md:py-2 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                                variants={categoryVariants}
                                                initial="closed"
                                                animate={
                                                    openCategoryMeals === item.id ? "open" : "closed"
                                                }
                                                transition={{ duration: 0.3 }}
                                            >
                                                <span className="text-[22px] font-[400] leading-[23px] font-skillet text-[#393939]">{item.title}</span>
                                                <span>
                                                    <motion.svg width="14"
                                                        height="10"
                                                        viewBox="0 0 14 10"
                                                        fill="none"
                                                        initial={{ rotate: 0 }}
                                                        animate={{
                                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" strokeWidth="2.4" strokeLinecap="square" />
                                                    </motion.svg>
                                                </span>
                                            </motion.button>
                                            <AnimatePresence>
                                                {openCategoryMeals === item.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                                    >
                                                        {item.title === "Nutritional Facts" ? (
                                                            <div className='font-regola-pro' dangerouslySetInnerHTML={{ __html: item.description }} />
                                                        ) : (
                                                            <p className="md:pt-2 pt-0 md:text-[18px] text-[15px] font-[400] font-regola-pro text-[#393939]">{item.description}</p>
                                                        )}

                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>

                                {/* <div className='flex md:flex-row md:items-center flex-col ml-2 pt-4 '>
                                    <span className='font-regola-pro text-[#333333] font-[400] mt-2 text-[20px] mr-2 md:mt-0'>Check Delivery Date:</span>
                                    <input
                                        type="text"
                                        className='text-[18px] font-regola-pro mt-2 font-[400] text-[#333333] px-[10px] py-[7px] md:mt-0'
                                        value={deliveryPostcode}
                                        onChange={(e) => setDeliveryPostcode(e.target.value)}
                                        placeholder="Pincode"
                                        style={{
                                            border: '1px solid #ccc',
                                            marginRight: '10px',
                                            flex: 1,
                                            borderRadius: '4px',
                                        }}
                                        required
                                    />
                                    <button
                                        className='text-[18px] font-regola-pro mt-2 font-[400] md:mt-0'
                                        onClick={() => { handleBlur() }}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#FBAE36',
                                            color: '#333333',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Check
                                    </button>
                                </div>

                                {etd && <div className='ml-2 pt-3'>Will delivered by {dayOfWeek}, {formattedDeliveryDate}</div>} */}

                                <div className='flex md:pl-2 pl-0 flex-row gap-x-5 md:pt-4 pt-2'>
                                    <button
                                        style={{ color: `${getMetafieldData("product_text_color", productData?.metafields) ? getMetafieldData("product_text_color", productData?.metafields) : '#EB7E01'}` }}
                                        className={` ${shaking === productData?.variants.edges[0].node.id ? '' : ''} product-buttons px-2 md:px-8 py-3 md:w-[200px] flex justify-center items-center bg-[#EDEDED] font-[600] font-regola-pro md:leading-[24.47px] leading-[16px] rounded md:text-[22.8px] text-[16px]' type='button`} onClick={() => {
                                            handleAddToCart(productData?.variants.edges[0].node.id)
                                        }}> {shaking === productData?.variants.edges[0].node.id ? <div className="spinner1"></div> : 'Add To Cart'}</button>
                                    <button
                                        onClick={() =>
                                            handleAddToCheckout(productData?.variants.edges[0].node.id)
                                        }
                                        style={{ backgroundColor: `${getMetafieldData("product_background_color", productData?.metafields) ? getMetafieldData("product_background_color", productData?.metafields) : '#FBAE36'}` }}
                                        className='product-buttons px-8 py-3 bg-[#FEB14E] font-[600] font-regola-pro md:leading-[24.47px] leading-[16px] flex justify-center items-center rounded md:text-[22.8px] text-[16px] text-[#FFFFFF]' type='button'>
                                        {buyNowLoading === productData?.variants.edges[0].node.id ? <div className="spinner1"></div> : 'BUY NOW'}
                                    </button>
                                </div>
                                {isBulk && <p className="text-[16px] font-[400] font-regola-pro leading-[17.8px] mt-6 pl-2 text-[#393939]">
                                    *Suitable for vegetarians, No dairy ingredients used
                                </p>}
                            </div>
                        </div>
                    </div>
                    {/* step section */}
                    <section>
                        <div
                            style={{ backgroundColor: `${getMetafieldData("product_background_color", productData?.metafields) ? getMetafieldData("product_background_color", productData?.metafields) : '#FBAE36'}` }}
                            className=" grid grid-cols-10 pt-10 pb-10">
                            <div className="col-span-10 md:col-span-2 md:pl-[122px] pl-3 text-[#FFFFFF]">
                                <div className='md:max-w-[157px]'>
                                    <h2 className="md:text-[48px] text-[44px] font-skillet font-[400 md:leading-[52px] leading-[44px] md:mb-4 mb-2">Steps</h2>
                                    {/* <p className="md:text-[18px] text-[16px] font-[600] md:leading-[23px] leading-[16px] font-regola-pro">
                                        Perfect garnishes:
                                    </p>
                                    <p className="md:text-[18px] text-[16px] font-[400] md:leading-[23px] leading-[20px] md:mt-0 mt-2 font-regola-pro">
                                        Fresh coriander leaves A swirl of cream A small piece of butter
                                    </p> */}
                                </div>
                            </div>
                            <div className="col-span-10 md:col-span-8 pl-3 pt-4 relative overflow-hidden">
                                <div className="w-full mb-4  flex lg:mb-0 ">
                                    <div className={`md:w-[80vw] ${isRte ? 'w-[100vw] gap-x-1' : 'w-[100vw] gap-x-5'} flex `}>
                                        <AnimatePresence initial={false} custom={direction}>
                                            <motion.div
                                                key={page}
                                                // custom={direction}
                                                // variants={variants}
                                                // initial="enter"
                                                // animate="center"
                                                // exit="exit"
                                                // transition={{
                                                //     x: { type: "spring", stiffness: 300, damping: 30 },
                                                //     opacity: { duration: 0.2 }
                                                // }}

                                                className={`md:w-5/6 ${isRte ? 'w-[100%]' : 'w-5/6'} ${direction === 1 ? 'slide-out-previous' : 'slide-in-next'}`}
                                            >
                                                <div className={`relative md:h-[505px] ${isRte ? 'h-[600px]' : 'h-[200px]'} ${isBulk ? 'hidden' : 'flex'}  bg-[#333333] rounded-[11.2px] `}>
                                                    {steps && <ReactPlayer
                                                        className="bg-cover"
                                                        url={steps[imageIndex]?.video}
                                                        width="100%"
                                                        height="100%"
                                                        muted={true}
                                                        playing={isRte ? true : playing}
                                                        controls={isRte ? false : true}
                                                        onEnded={handleVideoEnd}
                                                        playsinline
                                                        config={{
                                                            file: {
                                                                attributes: {
                                                                    playsInline: true, // For iOS
                                                                    controls: isRte ? false : true,
                                                                },
                                                            },
                                                        }}
                                                    />}
                                                </div>
                                                <div className="flex ">
                                                    <h3
                                                        style={{ color: `${getMetafieldData("product_text_color", productData?.metafields) ? getMetafieldData("product_text_color", productData?.metafields) : '#FFFFFF82'}` }}
                                                        className="md:text-[104px] pt-4 md:pt-0 text-[64px] md:p-3 p-2 md:mt-0 mt-0 md:mt-4 md:pr-8 pr-4 font-[500] font-regola-pro md:leading-[125px] leading-[64px] mb-4">{imageIndex + 1}</h3>
                                                    {steps &&
                                                        // <p className="text-[15px] md:text-[24px] font-[500] leading-[20px] md:leading-[31px] font-regola-pro w-5/6 pt-4 md:pt-8 text-[#FFFFFF]">{steps[imageIndex]?.description?.length > 140
                                                        //     ? `${steps[imageIndex].description.slice(0, 130)}...`
                                                        //     : steps[imageIndex].description}</p>
                                                        <DescriptionRenderer description={steps[imageIndex].description} />}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                        <motion.div
                                            key={previousIndex}
                                            // initial={{ opacity: 0, x: 100 }}
                                            // animate={{ opacity: 1, x: 0 }}
                                            // exit={{ opacity: 0, x: -100 }}
                                            // transition={{ duration: 0.3 }}
                                            className='w-1/6 ml-10 relative'
                                        >
                                            <div className={`w-[430%] md:h-[505px] ${isRte ? 'h-[600px]' : 'h-[200px]'} ${isBulk ? 'hidden' : 'flex'} rounded-tl-[11.2px]  rounded-bl-[11.2px] bg-black   relative -left-[10%] overflow-hidden`}>
                                                {steps && <ReactPlayer
                                                    className="bg-cover"
                                                    url={steps[nextImageIndex]?.video}
                                                    width="100%"
                                                    height="100%"
                                                    playing={false}
                                                />}
                                            </div>
                                            <div className='absolute md:bottom-20 bottom-0 right-0'>

                                                <div className='flex gap-3 md:pr-[60px] pr-[10px] pt-[32px]'>
                                                    {/* next button */}
                                                    <button type='button' onClick={() => { paginate(-1); setPlaying(true) }} className='text-lg h-[35px] md:h-[51px] w-[35px] md:w-[51px] flex justify-center items-center bg-[#DCDCDC] rounded-full'>
                                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.77066 1.47219L4.18733 4.05552H13.3029V5.77775H4.18733L6.77066 8.36108L5.55286 9.57887L0.890625 4.91663L5.55286 0.254395L6.77066 1.47219Z" fill="#636363" />
                                                        </svg>
                                                    </button>
                                                    {/* prev button */}
                                                    <button type='button' onClick={() => { paginate(1); setPlaying(true) }} className='text-lg h-[35px] md:h-[51px] w-[35px] md:w-[51px] flex justify-center items-center bg-[#DCDCDC] rounded-full'>
                                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.64062 0.254395L13.3029 4.91663L8.64062 9.57887L7.42283 8.36108L10.0062 5.77775H0.890625V4.05552H10.0062L7.42283 1.47219L8.64062 0.254395Z" fill="#636363" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>


                            </div>

                            {/* Navigation Buttons */}
                            {/* <div className="absolute bottom-4 right-4 flex space-x-2 lg:static lg:flex lg:justify-end">
                        <button className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full">
                            ←
                        </button>
                        <button className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full">
                            →
                        </button>
                    </div> */}
                        </div>
                    </section >
                    {/* {
                        !isBulk && <div className='p-10'>
                            <div className="relative bg-cover bg-no-repeat 2xl:h-[600px]  rounded-lg flex flex-col justify-center">
                                <img src={middleImg} className="2xl:h-full w-full  rounded-lg" style={{ zIndex: 1 }} />
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#000000a6] md:rounded-l-lg md:max-w-[600px]" style={{ zIndex: 2 }}></div>
                                <div className="absolute inset-0 z-10 p-10">
                                    <h2 className="text-[36px] leading-[43px] font-[400] font-inter text-[#FAFAFA] mb-4 pt-4 pl-4">Recipe</h2>
                                    <div className="w-full md:max-w-[550px] pl-4">
                                        <p className="text-[16px] leading-[19px] text-[#CECECE] font-[400] font-inter " >
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        </p>
                                    </div>
                                    <button className="bg-white text-black mt-4 w-[155px] text-center py-2 rounded ml-4 font-[300] text-[16px] font-regola-pro">Learn More</button>
                                    <div className='flex gap-3 mt-44 pr-4 ml-4'>
                                        <button type='button' className='text-lg px-5 py-[14px] bg-[#DCDCDC] text-[#636363] rounded-full'>
                                            &#8592;
                                        </button>
                                        <button type='button' className='text-lg px-5 py-[14px] bg-[#DCDCDC] text-[#636363] rounded-full'>
                                            &#8594;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    } */}

                    {!isBulk &&
                        <div ref={section1Ref} className="pt-[90px] px-[30px] md:px-[51px]">
                            {isAddFeedbackOpen && (
                                <AddFeedback
                                    productId={productData?.id}
                                    productName={productData?.title}
                                    onClose={closeAddFeedback}
                                />
                            )}

                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/2">
                                    <h2 className="text-[36px] font-[400] leading-[37.34px] font-skillet text-[#333333]">
                                        Your Health is Our Priority
                                    </h2>
                                    <p className="text-[28px] font-[400] leading-[29.04px] text-[#757575] font-skillet">
                                        Don't Believe Us, Believe Our Happy Customers
                                    </p>
                                </div>

                                <div className="w-full md:w-1/2 flex  flex-col lg:mr-[60px]">
                                    {/* Quotation Section */}
                                    <div className='inline-flex justify-end  md:-mr-[40px]'>
                                        <button
                                            onClick={openAddFeedback}
                                            className="mt-4 bg-[#EB7E01] text-[#333333] px-4 py-2 rounded font-regola-pro"
                                        >
                                            Add Review
                                        </button>
                                    </div>
                                </div>


                            </div>
                            <div className="pt-5">
                                <div className="max-w-4xl mx-auto">
                                    {feedbacks?.slice(0, visibleFeedbackCount).map((review, index) => (
                                        <ReviewCard key={index} review={review} />
                                    ))}
                                    {feedbacks?.length > visibleFeedbackCount && (
                                        <div
                                            onClick={() => setVisibleFeedbackCount(prev => prev + 3)}
                                            className="flex items-center space-x-2 cursor-pointer">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-gray-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-gray-500 font-regola-pro font-medium">View more</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                    }

                    {
                        productData?.relatedProducts?.references?.edges &&
                        <>
                            <div><p className='pl-[30px] mobile-sm:pl-[50px] pr-5 md:pr-[51px] md:pl-[51px] text-[36px] md:pt-10 pt-6 leading-[37.34px] font-skillet'>You May Also Like</p></div>
                            <div className='pl-[30px] mobile-sm:pl-[50px] pr-5 md:pr-[51px] md:pl-[51px] flex justify-between items-center py-14 '>
                                <div className='flex flex-row justify-between pr-[50px] md:pr-[0px] md:justify-start gap-x-8 flex-wrap w-full '>
                                    {productData?.relatedProducts?.references?.edges?.map((item, i) => (
                                        <div key={i} className='flex flex-col lg:justify-start mb-[20px]'>
                                            <div
                                                style={{ background: `${colors[i % colors.length]}` }}
                                                className='relative flex justify-center items-center rounded-2xl w-[110px] mobile-sm:w-[130px] h-[151px] mobile-sm:h-[161px] sm:w-[150px] sm:h-[180px] md:w-[170px] md:h-[201px] overflow-visible'
                                            >
                                                <div
                                                    className='w-[140px] h-[140px] mobile-sm:w-[150px] mobile-sm:h-[150px] sm:w-[160px] sm:h-[160px] md:w-[191px] md:h-[195.62px] object-fill'
                                                    style={{
                                                        position: 'absolute',
                                                        top: '51%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        borderRadius: '50%'
                                                    }}
                                                >
                                                    <img
                                                        onClick={() => { navigate(`/product-details/${item?.node?.handle}`) }}
                                                        src={item?.node?.metafield?.reference?.image?.originalSrc}
                                                        alt=""
                                                        className="rounded-full object-cover"
                                                    />
                                                    <div onClick={(e) => { e.preventDefault(); handleAddToCart(item?.node?.variants.edges[0].node.id) }} className='md:hidden flex absolute -bottom-[4px] right-[10px]'>
                                                        <button type='button' className={`${shaking === item?.node?.variants.edges[0].node.id ? '' : ''} flex justify-center items-center text-[30px] h-[30px] w-[30px] bg-[#FFFFFF] text-[#333333] rounded`} onClick={() => {
                                                        }
                                                        }> {shaking === item?.node?.variants.edges[0].node.id ? <div className="spinner1"></div> : '+'}</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className='flex justify-between items-start  w-[110px] pt-2 sm:w-[150px]  md:w-[170px]  overflow-visible'
                                            >
                                                <div>
                                                    <p className='text-[#231F20] text-base font-[600] md:text-[20px] font-regola-pro leading-[25px] '>
                                                        {item?.node?.title}
                                                    </p>
                                                    <p className='text-[#757575] mt-1 font-[400] md:text-[18px] font-regola-pro leading-[21.6px]'>
                                                        ₹ {item?.node?.priceRange?.minVariantPrice?.amount}
                                                    </p>
                                                </div>
                                                <div className='hidden md:flex h-auto pt-4'>
                                                    <button type='button' className={`${shaking === item?.node?.variants.edges[0].node.id ? '' : ''} flex justify-center items-center text-lg h-[37px] w-[37px] bg-[#EBEBEB] text-[#1D1929] rounded`} onClick={() => {
                                                        handleAddToCart(item?.node?.variants.edges[0].node.id)
                                                    }
                                                    }> {shaking === item?.node?.variants.edges[0].node.id ? <div className="spinner1"></div> : '+'}</button>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>
                        </>
                    }
                </> : <LoadingAnimation />
            }
        </div >
    )
}

const ReviewCard = ({ review }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 140;

    const toggleExpand = () => setIsExpanded((prev) => !prev);

    const displayContent = isExpanded
        ? review?.review
        : review?.review?.length < maxLength ? review?.review : `${review?.review.slice(0, maxLength)}...`;

    return (
        <div className="p-2 md:p-4 border-b border-b-slate-600  mb-1 md:mb-2 flex space-x-2 md:space-x-4">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <div className="text-xl font-bold font-regola-pro text-gray-500">
                    {review?.reviewerName[0]}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-2">
                    <h3 className="text-left text-[#333333] font-[400] md:text-[20px] font-inter leading-[24px]">{review?.reviewerName}</h3>
                </div>
                <div className="flex items-center mb-2">
                    <Rating rating={review?.rating} />
                </div>
                <p className="font-[400] md:text-[18px] font-inter leading-[25px] text-[#757575] ">{displayContent}</p>
                {review?.review?.length > maxLength && (
                    <button
                        onClick={toggleExpand}
                        className="text-teal-500 text-sm font-regola-pro font-semibold focus:outline-none"
                    >
                        {isExpanded ? "Show less" : "Read more"}
                    </button>
                )}
            </div>
        </div>
    );
};

const DescriptionRenderer = ({ description }) => {
    const parsedDescription = JSON.parse(description);

    const renderContent = (children) => {
        return children?.map((child, index) => {
            if (child?.type === "text") {
                let content = child?.value;

                if (child?.bold) content = <strong key={index}>{content}</strong>;
                if (child?.italic) content = <em key={index}>{content}</em>;

                return content;
            } else if (child?.type === "paragraph") {
                return (
                    <p key={index} >
                        {renderContent(child?.children)}
                    </p>
                );
            }

            return null;
        });
    };

    return (
        <div className="text-[15px] md:text-[24px] font-[500] leading-[20px] md:leading-[31px] font-regola-pro w-5/6 pt-4 md:pt-8 text-[#FFFFFF]">
            {renderContent(parsedDescription?.children)}
        </div>
    );
};

export default ProductDetail