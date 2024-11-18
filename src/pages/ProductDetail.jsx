import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProductCollectionsQuery, getProductDetailQuery, getProductRecommendedQuery, getProductDetailsQuery, graphQLClient, getProductDetailFull, getStepDetails, getFeedbackDetails, getProductDetailByHandle, getRelatedProducts, createCartMutation, updateCartItemMutation, updateCartMutation } from '../api/graphql';
import Rating from '../component/Rating';
import middleImg from '../assets/middle1-image1.png'
import AddFeedback from '../component/AddFeedback';
import { wrap } from "popmotion";
import ReactPlayer from 'react-player';
import LoadingAnimation from '../component/Loader';
import { addCartData, cartData, selectCartResponse, setCartResponse } from '../state/cartData';

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
    const isBulk = location.state?.isBulk || false;
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

    const handlePlayAgain = () => {
        setPlaying(true);
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

    const colors = ['#fbae3666', '#279c6666', '#f15e2a66', '#fbae3666', '#279c6666', '#f15e2a66'];


    const fetchRelatedProducts = async (first) => {
        setLoading(true);
        try {
            const result = await graphQLClient.request(getRelatedProducts, {
                first: 50,
                sortKey: "TITLE",
                reverse: false
            });

            const products = result?.products?.edges || [];
            const filteredProducts = products.filter(product => {
                const bulkValue = product.node.bulkMetafield?.value;
                return bulkValue === null || bulkValue === "false";
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
                                    description: JSON.parse(descriptionField?.value)?.children[0]?.children[0]?.value || '',
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
                    let relatedAdditionalProducts = await fetchRelatedProducts(6);
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
            return 0;
        }
        const totalRating = reviews.reduce((acc, review) => {
            const rating = parseInt(review?.rating);
            return acc + (isNaN(rating) ? 5 : rating);
        }, 0);

        return (totalRating / reviews.length).toFixed(2);
    };

    const averageRating = parseFloat(calculateAverageRating(feedbacks));

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
    console.log("first feednablk ", feedbacks)

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
        const handleScroll = () => {
            if (homeImg?.reference?.image?.originalSrc) {
                const scrollPosition = window.scrollY;
                const rotationAngle = scrollPosition * 0.2;
                setRotation(rotationAngle);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [homeImg]);


    const scrollContainerRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slidesPerView = 4;
    const totalSlides = productData?.images?.edges?.length || 0;
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
                                <div className='flex flex-col items-start'>
                                    <button type='button'
                                        className='font-[400] bg-[#FBAE36] md:text-[14px] text-[12px] md:leading-[18.62px] leading-[14px] tracking-[0.02em] font-regola-pro px-4 py-[6px] rounded-lg text-[#333333]'>{productData?.collections?.edges[0]?.node?.title} </button>
                                    <div className="flex">
                                        <Rating rating={averageRating} text={`${feedbacks?.length !== undefined ? feedbacks?.length : 0} Reviews`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`md:w-3/5 w-full pt-1  relative md:pt-8 md:pr-7 gap-x-[40px] flex items-center ${homeImg?.reference?.image?.originalSrc ? 'flex-row' : 'md:flex-row flex-col'} md:h-[650px] h-auto`}>
                            {/* <div className='relative w-4/6 max-w-[553px] shrink-1'> */}
                            <div className={`relative ${homeImg?.reference?.image?.originalSrc ? '-left-[48%] mt-[-31%] md:mt-0 md:-left-16 md:h-[553px] h-auto md:w-[553px] w-[80%]' : 'md:pr-6 md:pl-6 md:h-[553px] h-[553px] md:w-[553px] w-[553px] flex justify-center items-center'} `}>
                                <img
                                    src={homeImg?.reference?.image?.originalSrc ? homeImg?.reference?.image?.originalSrc : homeImg}
                                    // src={data?.images?.edges[0]?.node?.src}
                                    className={`spin-on-scroll ${homeImg?.reference?.image?.originalSrc ? 'h-[500px] md:h-[553px] w-[500px] md:w-[553px] max-w-[180%] md:max-w-[100%]' : 'md:h-[553px] w-auto h-[500px]'}`}
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                    alt={``}
                                />
                            </div>

                            <div className={`flex md:h-full h-auto flex-col relative ${homeImg?.reference?.image?.originalSrc ? 'md:-left-10 left-[-20px] w-[25%]' : ''} gap-y-2`}>
                                {/* <div className='flex relative  flex-col gap-y-2'> */}
                                <div ref={scrollContainerRef} className={`flex ${homeImg?.reference?.image?.originalSrc ? 'flex-col  md:h-[600px] h-[400px] overflow-x-auto w-[115%] md:w-full' : 'md:flex-col  md:h-[600px] h-auto flex-row overflow-x-auto w-[80%] md:w-auto ml-[10%] md:ml-0'}  scrollbar-hide`}>
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

                                <div className="flex md:flex-col flex-row md:justify-start justify-center gap-y-4 gap-3 -right-[55px] md:absolute unset bottom-0 mt-4">
                                    {/* Conditional Rendering for Previous Slide Button */}
                                    {isMobile && !homeImg?.reference?.image?.originalSrc ? (
                                        <button
                                            onClick={prevRightSlide}
                                            className="p-2 bg-[#1c1515ae] text-white rounded-full"
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
                                            className="p-2 bg-[#1c1515ae] text-white rounded-full"
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
                                            className="p-2 bg-[#1c1515ae] text-white rounded-full"
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
                                    <div className='flex items-center'>
                                        <button type='button'
                                            className='font-[400] bg-[#FBAE36] md:text-[14px] text-[12px] md:leading-[18.62px] leading-[14px] tracking-[0.02em] font-regola-pro px-4 py-[6px] rounded-lg text-[#333333]'>{productData?.collections?.edges[0]?.node?.title} </button>
                                        <div className="flex ml-4">
                                            <Rating rating={averageRating} text={`${feedbacks?.length !== undefined ? feedbacks?.length : 0} Reviews`} />
                                        </div>
                                    </div>
                                </div>
                                <p className='md:text-[20px] text-[16px] font-[500] font-regola-pro mt-3 md:pl-2 pl-0 text-[#757575]'>Net weight: {`${productData?.variants.edges[0]?.node.weight}`}{`${getWeightSymbol(productData?.variants.edges[0]?.node.weightUnit)}`}</p>
                                <p className='md:text-[20px] text-[16px] font-[500] font-regola-pro md:mt-2 mt-1 md:pl-2 pl-0 text-[#757575]'>{`₹ ${productData?.priceRange?.minVariantPrice?.amount || 0}`}</p>
                                <p className="md:text-[20px] text-[16px] font-[400] font-regola-pro md:leading-[24px] leading-[20px] md:mt-3 mt-1 md:pl-2 pl-0 text-[#757575]">
                                    {productData?.description}
                                </p>

                                {isBulk && <button
                                    style={{ backgroundColor: `${getMetafieldData("product_background_color", productData?.metafields) ? getMetafieldData("product_background_color", productData?.metafields) : '#FBAE36'}` }}
                                    onClick={() => { window.open('https://wa.me/919510537693?text=Hello') }} className='w-[200px] ml-2 my-3 text-center font-[600] leading-[25px] font-regola-pro py-2 rounded text-[22px] text-[#FFFFFF]' type='button'>Send Enquiry</button>
                                }
                                <div className="accordion-container md:m-2 ml-0 mr-0 mt-2 mb-2 text-[#333333] md:pt-4 pt-3">
                                    {accordianData.map((item, i) => (
                                        <div key={i} className="mb-2">
                                            <motion.button
                                                onClick={() => toggleCategoryMeals(item.id)}
                                                className="px-5 py-2 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                                variants={categoryVariants}
                                                initial="closed"
                                                animate={
                                                    openCategoryMeals === item.id ? "open" : "closed"
                                                }
                                                transition={{ duration: 0.3 }}
                                            >
                                                <span className="md:text-[22px] text-[16px] font-[400] md:leading-[23px] leading-[16px] font-regola-pro text-[#393939]">{item.title}</span>
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
                                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
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
                                                            <div dangerouslySetInnerHTML={{ __html: item.description }} />
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

                                {!isBulk && <div className='flex md:pl-2 pl-0 flex-row gap-x-5 md:pt-4 pt-2'>
                                    <button
                                        style={{ color: `${getMetafieldData("product_text_color", productData?.metafields) ? getMetafieldData("product_text_color", productData?.metafields) : '#EB7E01'}` }}
                                        className={` ${shaking === productData?.variants.edges[0].node.id ? 'animate-shake' : ''} product-buttons px-8 py-3 bg-[#EDEDED] font-[600] font-regola-pro md:leading-[24.47px] leading-[16px] rounded md:text-[22.8px] text-[16px]' type='button`} onClick={() => {
                                            handleAddToCart(productData?.variants.edges[0].node.id)
                                        }}> {shaking === productData?.variants.edges[0].node.id ? 'Adding...' : 'ADD TO CART'}</button>
                                    <button
                                        style={{ backgroundColor: `${getMetafieldData("product_background_color", productData?.metafields) ? getMetafieldData("product_background_color", productData?.metafields) : '#FBAE36'}` }}
                                        className='product-buttons px-8 py-3 bg-[#FEB14E] font-[600] font-regola-pro md:leading-[24.47px] leading-[16px] rounded md:text-[22.8px] text-[16px] text-[#FFFFFF]' type='button'>Subscribe</button>
                                </div>}
                                {isBulk && <p className="text-[16px] font-[400] font-regola-pro leading-[17.8px] mt-6 pl-2 text-[#393939]">
                                    *Suitable for vegetarians, No dairy ingredients useds
                                </p>}
                            </div>
                        </div>
                    </div>
                    {/* step section */}
                    <section>
                        <div
                            style={{ backgroundColor: `${getMetafieldData("product_background_color", productData?.metafields) ? getMetafieldData("product_background_color", productData?.metafields) : '#FBAE36'}` }}
                            className=" grid grid-cols-10 md:pt-10 pt-7">
                            <div className="col-span-10 md:col-span-2 md:pl-[122px] pl-3 text-[#FFFFFF]">
                                <div className='md:max-w-[157px]'>
                                    <h2 className="md:text-[48px] text-[44px] font-skillet font-[400 md:leading-[52px] leading-[44px] md:mb-4 mb-2">Steps</h2>
                                    <p className="md:text-[18px] text-[16px] font-[600] md:leading-[23px] leading-[16px] font-regola-pro">
                                        Perfect garnishes:
                                    </p>
                                    <p className="md:text-[18px] text-[16px] font-[400] md:leading-[23px] leading-[20px] md:mt-0 mt-2 font-regola-pro">
                                        Fresh coriander leaves A swirl of cream A small piece of butter
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-10 md:col-span-8 pl-3 pt-4 relative overflow-hidden">
                                <div className="w-full mb-4  flex lg:mb-0 ">
                                    <div className={`md:w-[80vw] ${isRte ? 'w-[100vw]' : 'w-[100vw]'} flex gap-x-5`}>
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
                                                <div className={`relative md:h-[505px] ${isRte ? 'h-[600px]' : 'h-[200px]'} bg-[#333333] rounded-[11.2px] `}>
                                                    {steps && <ReactPlayer
                                                        className="bg-cover"
                                                        url={steps[imageIndex]?.video}
                                                        width="100%"
                                                        height="100%"
                                                        muted={true}
                                                        playing={playing}
                                                        controls={true}
                                                        onEnded={handleVideoEnd}
                                                    />}
                                                    {/* {!playing && (
                                            <div className="absolute inset-0 flex justify-center z-20 items-center">
                                                <button
                                                    onClick={handlePlayAgain}
                                                    className="text-white p-4 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EFEFEF"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg> 
                                                                               </button>
                                            </div>
                                        )} */}
                                                    {/* <img
                                            className="w-full h-[505px] rounded-lg"
                                            src={steps[imageIndex].src}
                                            alt={steps[imageIndex].alt}
                                            style={{
                                                transition: "background-image 1s ease-in-out"
                                            }}
                                        /> */}
                                                </div>
                                                <div className="flex ">
                                                    <h3
                                                        style={{ color: `${getMetafieldData("product_text_color", productData?.metafields) ? getMetafieldData("product_text_color", productData?.metafields) : '#FFFFFF82'}` }}
                                                        className="md:text-[104px] text-[64px] md:p-3 p-2 md:mt-0 mt-0 md:mt-4 md:pr-8 pr-4 font-[500] font-regola-pro md:leading-[125px] leading-[64px] mb-4">{imageIndex + 1}</h3>
                                                    {steps && <p className="text-[15px] md:text-[24px] font-[500] leading-[20px] md:leading-[31px] font-regola-pro w-5/6 pt-4 md:pt-8 text-[#FFFFFF]">{steps[imageIndex]?.description?.length > 140
                                                        ? `${steps[imageIndex].description.slice(0, 130)}...`
                                                        : steps[imageIndex].description}</p>}
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
                                            <div className={`w-[430%] md:h-[505px] ${isRte ? 'h-[600px]' : 'h-[200px]'} rounded-tl-[11.2px]  rounded-bl-[11.2px] bg-black   relative -left-[10%] overflow-hidden`}>
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
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.77066 1.47219L4.18733 4.05552H13.3029V5.77775H4.18733L6.77066 8.36108L5.55286 9.57887L0.890625 4.91663L5.55286 0.254395L6.77066 1.47219Z" fill="#636363" />
                                                        </svg>
                                                    </button>
                                                    {/* prev button */}
                                                    <button type='button' onClick={() => { paginate(1); setPlaying(true) }} className='text-lg h-[35px] md:h-[51px] w-[35px] md:w-[51px] flex justify-center items-center bg-[#DCDCDC] rounded-full'>
                                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.64062 0.254395L13.3029 4.91663L8.64062 9.57887L7.42283 8.36108L10.0062 5.77775H0.890625V4.05552H10.0062L7.42283 1.47219L8.64062 0.254395Z" fill="#636363" />
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
                    <div className="py-[90px] px-[30px] md:px-[51px]">
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
                                    Don’t Believe Us, Believe Our Happy Customers
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
                                {feedbacks &&
                                    <div>
                                        <div className="flex flex-col mt-[70px]">
                                            <div className="relative">
                                                <svg width="58" height="44" viewBox="0 0 58 44" className="absolute -top-10 md:-top-4  left-0 md:-left-9 w-[57.02px] h-[43.72px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 43.7216V32.2159C0 28.7216 0.617898 25.0142 1.85369 21.0938C3.1321 17.1307 4.96449 13.3168 7.35085 9.65199C9.77983 5.9446 12.6989 2.72727 16.108 0L24.2898 6.64773C21.6051 10.483 19.2614 14.4886 17.2585 18.6648C15.2983 22.7983 14.3182 27.2301 14.3182 31.9602V43.7216H0ZM32.7273 43.7216V32.2159C32.7273 28.7216 33.3452 25.0142 34.581 21.0938C35.8594 17.1307 37.6918 13.3168 40.0781 9.65199C42.5071 5.9446 45.4261 2.72727 48.8352 0L57.017 6.64773C54.3324 10.483 51.9886 14.4886 49.9858 18.6648C48.0256 22.7983 47.0455 27.2301 47.0455 31.9602V43.7216H32.7273Z" fill="#B2B2B2" />
                                                </svg>
                                                {feedbacks && <p className="px-6 py-1 font-[400] md:text-[24px] font-inter leading-[29px]  text-[#757575] ">{feedbacks[ActiveTestimonialIndex]?.review}</p>}
                                                <svg width="58" height="44" viewBox="0 0 58 44" fill="none" className="absolute -bottom-7  right-0 md:-right-10 w-[57.02px] h-[43.72px]" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M57.0156 8.39233e-05V11.5058C57.0156 15.0001 56.3977 18.7075 55.1619 22.6279C53.8835 26.591 52.0511 30.4049 49.6648 34.0697C47.2358 37.7771 44.3168 40.9944 40.9077 43.7217L32.7259 37.074C35.4105 33.2387 37.7543 29.233 39.7571 25.0569C41.7173 20.9234 42.6974 16.4916 42.6974 11.7615V8.39233e-05H57.0156ZM24.2884 8.39233e-05V11.5058C24.2884 15.0001 23.6705 18.7075 22.4347 22.6279C21.1563 26.591 19.3239 30.4049 16.9375 34.0697C14.5085 37.7771 11.5895 40.9944 8.1804 43.7217L-0.00141907 37.074C2.68324 33.2387 5.02699 29.233 7.02982 25.0569C8.99005 20.9234 9.97017 16.4916 9.97017 11.7615V8.39233e-05H24.2884Z" fill="#B2B2B2" />
                                                </svg>
                                            </div>
                                            {feedbacks && <p className="text-left pl-5 text-[#333333] pt-4 font-[400] md:text-[24px] font-inter leading-[29px]">{feedbacks[ActiveTestimonialIndex]?.reviewerName}</p>}
                                        </div>
                                    </div>
                                }
                            </div>


                        </div>
                        {feedbacks &&
                            <div className='flex justify-end'>
                                <div className='flex gap-3'>
                                    <button type='button' onClick={() => { paginateTestimonial(-1) }} className='w-[53px] h-[53px] flex justify-center items-center bg-[#5F5F5F] rounded-full'>
                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.77066 1.47219L4.18733 4.05552H13.3029V5.77775H4.18733L6.77066 8.36108L5.55286 9.57887L0.890625 4.91663L5.55286 0.254395L6.77066 1.47219Z" fill="white" />
                                        </svg>
                                    </button>
                                    <button type='button' onClick={() => { paginateTestimonial(1) }} className='w-[53px] h-[53px] flex justify-center items-center bg-[#5F5F5F] rounded-full'>
                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.64062 0.254395L13.3029 4.91663L8.64062 9.57887L7.42283 8.36108L10.0062 5.77775H0.890625V4.05552H10.0062L7.42283 1.47219L8.64062 0.254395Z" fill="white" />
                                        </svg>
                                    </button>
                                </div>
                            </div>}

                    </div>
                    {productData?.relatedProducts?.references?.edges &&
                        <>
                            <div><p className='pl-[50px] pr-5 md:pr-[51px] md:pl-[51px] text-[36px] md:pt-10 pt-6 leading-[37.34px] font-skillet'>You May Also Like</p></div>
                            <div className='pl-[50px] pr-5 md:pr-[51px] md:pl-[51px] flex justify-between items-center py-14 '>
                                <div className='flex flex-row justify-between pr-[50px] md:pr-[0px] md:justify-start gap-x-8 flex-wrap w-full '>
                                    {productData?.relatedProducts?.references?.edges?.map((item, i) => (
                                        <div key={i} className='flex flex-col lg:justify-start mb-[20px]'>
                                            <div
                                                style={{ background: `${colors[i % colors.length]}` }}
                                                onClick={() => { navigate(`/product-details/${item?.node?.handle}`) }}
                                                className='relative flex justify-center items-center rounded-2xl w-[110px] h-[151px] sm:w-[150px] sm:h-[180px] md:w-[170px] md:h-[201px] overflow-visible'
                                            >
                                                <div
                                                    className='w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[191px] md:h-[195.62px] object-fill'
                                                    style={{
                                                        position: 'absolute',
                                                        top: '51%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        borderRadius: '50%'
                                                    }}
                                                >
                                                    <img
                                                        src={item?.node?.metafield?.reference?.image?.originalSrc}
                                                        alt=""
                                                        className="rounded-full object-cover"
                                                    />
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
                                                <div className='h-auto'>
                                                    <button type='button' className='text-lg h-[37px] w-[37px] bg-[#EBEBEB] text-[#1D1929] rounded' onClick={() => {
                                                        handleAddToCart(item?.node?.variants.edges[0].node.id)
                                                    }
                                                    }>+</button>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>
                        </>}
                </> : <LoadingAnimation />
            }
        </div >
    )
}

export default ProductDetail