import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from 'react-router-dom';
import { getProductCollectionsQuery, getProductDetailQuery, getProductRecommendedQuery, graphQLClient } from '../api/graphql';
import Rating from '../component/Rating';
import recipreDetails from "../assets/recipreDetails.png"
import detailrectange from "../assets/detailrectange.png"
import food1 from '../assets/food1.png';
import step1 from '../assets/recipeimages/step1.png'
import stepVideo1 from '../assets/productDetailsVideo/rtc-step1.mp4'
import stepVideo2 from '../assets/productDetailsVideo/rtc-step2.mp4'
import stepVideo3 from '../assets/productDetailsVideo/rtc-step3.mp4'
import pavbhajiImg from '../assets/pavbhaji.png'
import middleImg from '../assets/middle1-image1.png'
import { wrap } from "popmotion";
import ReactPlayer from 'react-player';

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
    const [apiProductResponse, setApiProductResponse] = useState(null)
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [dataRecommended, setDataRecommended] = useState(null);
    const [images, setImages] = useState([]);
    const [openCategoryMeals, setOpenCategoryMeals] = useState(null);
    const [productId, setProductId] = useState("gid://shopify/Product/8264167719138");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const isBulk = location.state?.isBulk || false;
    const [[page, direction], setPage] = useState([0, 0]);
    const [playing, setPlaying] = useState(true);
    // Array of image sources
    const imagess = [
        { src: stepVideo1, alt: 'Step-1', desc: 'Melt 1 tablespoon of butter in a pan over high heat, add the spices from the Spice Pouch (small pouch), and sauté for 30 seconds or until fragrant.' },
        { src: stepVideo2, alt: 'Food-2', desc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium, voluptatem earum commodi maxime, ipsam, quia eveniet a nisi eos vero excepturi quisquam ducimus quas odio harum officiis.' },
        { src: stepVideo3, alt: 'Step-3', desc: 'Melt 1 tablespoon of butter in a pan over high heat, add the spices from the Spice Pouch (small pouch), and sauté for 30 seconds or until fragrant.' },
    ];
    const previousIndex = currentIndex === 0 ? imagess.length - 1 : currentIndex - 1;

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagess.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imagess.length - 1 : prevIndex - 1
        );
    };

    const handleVideoEnd = () => {
        setPlaying(false);
    };

    const handlePlayAgain = () => {
        setPlaying(true);
    };



    const imageIndex = wrap(0, imagess.length, page);
    const nextImageIndex = wrap(0, imagess.length, page + 1);
    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    useEffect(() => {
        const apiCall = async () => {
            try {
                const result = await graphQLClient.request(getProductCollectionsQuery, {
                    first: 1,
                    reverse: false,
                    query: "",
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
                setApiResponse(collections?.collections?.edges[0]?.node?.products?.edges.splice(0, 6));
            } catch (error) {
                // Handle errors here
                console.error("Error fetching data:", error);
            }
        };
        apiCall();
    }, []);

    const colors = ['#fbae3666', '#279c6666', '#f15e2a66', '#fbae3666', '#279c6666', '#f15e2a66'];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getProductDetail = async () => {
                    const response = await graphQLClient.request(getProductDetailQuery, {
                        // productId: location.state?.id || productId,
                        productId: "gid://shopify/Product/8264167719138",
                    });
                    setData(response.product);
                    setImages(
                        response?.product?.images?.edges.map((edge) => edge.node?.src)
                    );
                    // refs.current = response?.product?.images?.edges.map(() =>
                    //     React.createRef()
                    // );
                    setApiProductResponse(true);
                };

                const getProductRecommended = async () => {
                    const response = await graphQLClient.request(
                        getProductRecommendedQuery,
                        {
                            productId: location.state?.id || productId,
                        }
                    );
                    const recommendedList = response.productRecommendations.map(
                        (data) => ({
                            ...data,
                            qty: 0,
                        })
                    );
                    setDataRecommended(recommendedList);
                };

                await Promise.all([getProductDetail(), getProductRecommended()]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [location.state?.id]);

    const getMetafieldData = (key, list) => {
        let metaContent = "";
        if (list) {
            let findValue = list.find((x) => x.key === key);
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
            description: getMetafieldData("ingredient", data?.metafields),
            id: 1,
        },
        {
            title: "Nutrition Facts",
            description: getMetafieldData("nutrition_facts", data?.metafields),
            id: 2,
        },
        {
            title: "How To Prepare",
            description: getMetafieldData("how_to_prepare", data?.metafields),
            id: 3,
        },
    ];
    return (
        <div className='bg-white'>
            <div className="flex md:flex-row flex-col pb-10">
                <div className="md:w-1/2 w-full  relative my-10 md:pr-7 gap-x-[40px] flex items-center">
                    <div className='relative w-4/6 max-w-[553px] shrink-1'>
                        {/* <div className='relative -left-16  '> */}
                        <img
                            src={recipreDetails}
                            // src={data?.images?.edges[0]?.node?.src}
                            // className="h-[588.08px] w-[553px]"
                            alt={`carousel-`}
                        />
                    </div>
                    {/* <div className='flex relative -left-10 flex-col gap-y-2'> */}
                    <div className='flex relative  flex-col gap-y-2'>
                        <img
                            src={detailrectange}
                            className=" h-[163px] w-[130px]"
                            alt={`carousel-`}
                        />
                        <img
                            src={detailrectange}
                            className=" h-[163px] w-[130px]"
                            alt={`carousel-`}
                        />
                        <img
                            src={detailrectange}
                            className="h-[163px] w-[130px]"
                            alt={`carousel-`}
                        />
                        <img
                            src={detailrectange}
                            className="h-[163px] w-[130px]"
                            alt={`carousel-`}
                        />
                    </div>
                </div>
                <div className="lg:flex-grow md:max-w-[645px] md:w-1/2 mt-14 lg:mr-20 2xl:mr-40 w-full mb-10 md:mb-0">
                    {/*  accordion sadasdasd */}
                    <div className='px-4 md:px-0'>
                        <h1 className="sm:text-5xl font-skillet text-2xl text-[#EB7E01]">
                            {data?.title}
                        </h1>
                        <div className='flex items-center'>
                            <button type='button' className='text-[14px] font-[400] font-regola-pro px-4 py-[6px] bg-[#FBAE36] rounded-lg text-[#333333]'>{isBulk ? "Bulk Packaging" : "DIY COOKING KIT"} </button>
                            <div className="flex ml-4">
                                <Rating rating={4} text={"200 Reviews"} />
                            </div>
                        </div>
                        <p className='text-[24px] font-[500] font-regola-pro mt-3 pl-2 text-[#757575]'>{`₹ ${'250' || 0}`}</p>

                        <div className="flex justify-center items-center relative">

                        </div>
                        <p className="text-[24px] font-[400] font-regola-pro leading-[28.8px] mt-3 pl-2 text-[#757575]">
                            {data?.description}
                        </p>

                        {isBulk && <button className='w-[200px] ml-2 my-3 text-center bg-[#EB7E01] font-[600] leading-[25px] font-regola-pro py-2 rounded text-[22px] text-[#FFFFFF]' type='button'>Send Enquiry</button>
                        }
                        <div className="accordion-container m-2  text-[#333333] pt-4">
                            {accordianData.map((item) => (
                                <div key={item.id} className="mb-2">
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
                                        <span className="text-[22px] font-[400] leading-[23px] font-regola-pro text-[#393939]">{item.title}</span>
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
                                                <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939]">
                                                    {item.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        {!isBulk && <div className='flex pl-2 flex-row gap-x-5 pt-4'>
                            <button className='px-8 py-2 bg-[#EDEDED] font-[600] leading-[25px] rounded text-[22px] text-[#EB7E01]' type='button'>Add to Cart</button>
                            <button className='px-8 py-2 bg-[#FEB14E] font-[600] leading-[25px] rounded text-[22px] text-[#FFFFFF]' type='button'>Subscribe</button>
                        </div>}
                        {isBulk && <p className="text-[16px] font-[400] font-regola-pro leading-[17.8px] mt-6 pl-2 text-[#393939]">
                            *Suitable for vegetarians, No dairy ingredients useds
                        </p>}
                    </div>
                </div>
            </div>
            {/* step section */}
            <section>
                <div className="bg-[#EB7E01] grid grid-cols-6 pt-10">
                    <div className="col-span-6 md:col-span-1 pl-20 text-[#FFFFFF]">
                        <h2 className="text-[48px] font-skillet font-[400 leading-[52px] mb-4">Steps</h2>
                        <p className="text-[18px] font-[600] leading-[23px] font-regola-pro ">
                            Perfect garnishes:
                        </p>
                        <p className="text-[18px] font-[400] leading-[23px] font-regola-pro">
                            Fresh coriander leaves A swirl of cream A small piece of butter
                        </p>
                    </div>
                    <div className="col-span-6 md:col-span-5 pl-3 pt-4 relative">
                        <div className="w-full mb-4  flex lg:mb-0 ">
                            <div className="w-[80vw] flex gap-x-7">
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={page}
                                        // src={imagess[imageIndex]}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}

                                        className='w-5/6  '
                                    >
                                        <div className='relative h-[505px] bg-[#333333] rounded-[11.2px] '>
                                            <ReactPlayer
                                                className="bg-cover"
                                                url={imagess[imageIndex].src}
                                                width="100%"
                                                height="100%"
                                                playing={playing}
                                                controls={true}
                                                onEnded={handleVideoEnd}
                                            />
                                            {/* {!playing && (
                                            <div className="absolute inset-0 flex justify-center z-20 items-center">
                                                <button
                                                    onClick={handlePlayAgain}
                                                    className="text-white p-4 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EFEFEF"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>                            </button>
                                            </div>
                                        )} */}
                                            {/* <img
                                            className="w-full h-[505px] rounded-lg"
                                            src={imagess[imageIndex].src}
                                            alt={imagess[imageIndex].alt}
                                            style={{
                                                transition: "background-image 1s ease-in-out"
                                            }}
                                        /> */}
                                        </div>
                                        <div className="flex ">
                                            <h3 className="text-[104px] p-3 pr-8 font-[500] font-regola-pro leading-[125px] text-[#FFFFFF82] mb-4">{imageIndex + 1}</h3>
                                            <p className="text-[24px] font-[500] leading-[31px] font-regola-pro w-5/6 pt-8 text-[#FFFFFF]">{imagess[imageIndex]?.desc}</p>
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
                                    <div className="w-[430%] h-[505px] rounded-tl-[11.2px]  rounded-bl-[11.2px] bg-black   relative -left-[10%] overflow-hidden">
                                        <ReactPlayer
                                            className="bg-cover"
                                            url={imagess[nextImageIndex].src}
                                            width="100%"
                                            height="100%"
                                            playing={false}
                                        />
                                    </div>
                                    <div className='absolute bottom-20 right-0'>

                                        <div className='flex gap-3 pr-[60px] pt-[32px]'>
                                            {/* next button */}
                                            <button type='button' onClick={() => { paginate(-1); setPlaying(true) }} className='text-lg h-[51px] w-[51px] flex justify-center items-center bg-[#DCDCDC] rounded-full'>
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.77066 1.47219L4.18733 4.05552H13.3029V5.77775H4.18733L6.77066 8.36108L5.55286 9.57887L0.890625 4.91663L5.55286 0.254395L6.77066 1.47219Z" fill="#636363" />
                                                </svg>
                                            </button>
                                            {/* prev button */}
                                            <button type='button' onClick={() => { paginate(1); setPlaying(true) }} className='text-lg h-[51px] w-[51px] flex justify-center items-center bg-[#DCDCDC] rounded-full'>
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
            {!isBulk && <div className='p-10'>
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
            }

            <div className="py-[90px] md:px-[51px]">
                <div className="">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 mb-10">
                            <h2 className="text-[36px] font-[400] leading-[37.34px] font-skillet text-[#333333]">
                                Your Health is Our Priority
                            </h2>
                            <p className="text-[28px] font-[400] leading-[29.04px] text-[#757575] font-skillet">
                                Don’t Believe Us, Believe Our Happy Customers
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-between items-start">
                            {/* Quotation Section */}
                            <div>
                                <div className="flex flex-col lg:ml-20">
                                    <div className="relative">
                                        <svg width="58" height="44" viewBox="0 0 58 44" className="absolute -top-4 -left-9 w-[57.02px] h-[43.72px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 43.7216V32.2159C0 28.7216 0.617898 25.0142 1.85369 21.0938C3.1321 17.1307 4.96449 13.3168 7.35085 9.65199C9.77983 5.9446 12.6989 2.72727 16.108 0L24.2898 6.64773C21.6051 10.483 19.2614 14.4886 17.2585 18.6648C15.2983 22.7983 14.3182 27.2301 14.3182 31.9602V43.7216H0ZM32.7273 43.7216V32.2159C32.7273 28.7216 33.3452 25.0142 34.581 21.0938C35.8594 17.1307 37.6918 13.3168 40.0781 9.65199C42.5071 5.9446 45.4261 2.72727 48.8352 0L57.017 6.64773C54.3324 10.483 51.9886 14.4886 49.9858 18.6648C48.0256 22.7983 47.0455 27.2301 47.0455 31.9602V43.7216H32.7273Z" fill="#B2B2B2" />
                                        </svg>
                                        <p className="px-6 py-1 font-[400] md:text-[24px] font-inter leading-[29px] text-[#757575]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </p>

                                        <svg width="58" height="44" viewBox="0 0 58 44" fill="none" className="absolute -bottom-7 right-0 w-[57.02px] h-[43.72px]" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M57.0156 8.39233e-05V11.5058C57.0156 15.0001 56.3977 18.7075 55.1619 22.6279C53.8835 26.591 52.0511 30.4049 49.6648 34.0697C47.2358 37.7771 44.3168 40.9944 40.9077 43.7217L32.7259 37.074C35.4105 33.2387 37.7543 29.233 39.7571 25.0569C41.7173 20.9234 42.6974 16.4916 42.6974 11.7615V8.39233e-05H57.0156ZM24.2884 8.39233e-05V11.5058C24.2884 15.0001 23.6705 18.7075 22.4347 22.6279C21.1563 26.591 19.3239 30.4049 16.9375 34.0697C14.5085 37.7771 11.5895 40.9944 8.1804 43.7217L-0.00141907 37.074C2.68324 33.2387 5.02699 29.233 7.02982 25.0569C8.99005 20.9234 9.97017 16.4916 9.97017 11.7615V8.39233e-05H24.2884Z" fill="#B2B2B2" />
                                        </svg>
                                    </div>
                                    <p className="text-left pl-5 text-[#333333] pt-4 font-[400] md:text-[24px] font-inter leading-[29px]">Person Name</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='flex gap-3'>
                            {/* next button */}
                            <button type='button' className='w-[53px] h-[53px] flex justify-center items-center bg-[#5F5F5F] rounded-full'>
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.77066 1.47219L4.18733 4.05552H13.3029V5.77775H4.18733L6.77066 8.36108L5.55286 9.57887L0.890625 4.91663L5.55286 0.254395L6.77066 1.47219Z" fill="white" />
                                </svg>
                            </button>
                            {/* prev button */}
                            <button type='button' className='w-[53px] h-[53px] flex justify-center items-center bg-[#5F5F5F] rounded-full'>
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.64062 0.254395L13.3029 4.91663L8.64062 9.57887L7.42283 8.36108L10.0062 5.77775H0.890625V4.05552H10.0062L7.42283 1.47219L8.64062 0.254395Z" fill="white" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div><p className='px-5 md:px-[51px] text-[36px] leading-[37.34px] font-skillet'>You May Also Like</p></div>
            <div className='px-5 md:px-[51px] flex justify-between items-center py-14 '>
                <div className='flex flex-row justify-around md:justify-between gap-x-8 flex-wrap w-full '>
                    {apiResponse?.map((item, i) => (
                        <div key={i} className='flex flex-col justify-between lg:justify-start'>
                            <div
                                style={{ background: `${colors[i]}` }}
                                className='relative flex justify-center items-center rounded-2xl w-[110px] h-[151px] sm:w-[150px] sm:h-[180px] md:w-[170px] md:h-[201px] overflow-visible'
                            >
                                <img
                                    src={pavbhajiImg}
                                    alt=""
                                    className='w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[191px] md:h-[195.62px] object-cover'
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        overflow: 'visible',
                                    }}
                                />
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
                                    <button type='button' className='text-lg h-[37px] w-[37px] bg-[#EBEBEB] text-[#1D1929] rounded'>+</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>

        </div >
    )
}

export default ProductDetail