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
import pavbhajiImg from '../assets/pavbhaji.png'
function ReadyToEat() {
    const location = useLocation();
    const [apiProductResponse, setApiProductResponse] = useState(null)
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [dataRecommended, setDataRecommended] = useState(null);
    const [images, setImages] = useState([]);
    const [openCategoryMeals, setOpenCategoryMeals] = useState(null);
    const [productId, setProductId] = useState("gid://shopify/Product/8264164016354");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    // Array of image sources
    const imagess = [
        { src: step1, alt: 'Step-1' },
        { src: food1, alt: 'Food-1' },
        { src: step1, alt: 'Step-2' },
        { src: food1, alt: 'Food-2' },
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
                        productId: "gid://shopify/Product/8264164016354",
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
                <div className="md:w-1/2 w-full relative my-10 md:pr-7 gap-x-5 flex items-center">
                    {/* <div className='relative -left-16 w-4/6'> */}
                    <div className='relative -left-16'>
                        <img
                            // src={recipreDetails}
                            src={data?.images?.edges[0]?.node?.src}
                            className=" w-[553px]"
                            alt={`carousel-`}
                        />
                    </div>
                    <div className='flex relative -left-10 flex-col gap-y-2'>
                        <img
                            src={detailrectange}
                            className=" h-[130px] w-[100px]"
                            alt={`carousel-`}
                        />
                        <img
                            src={detailrectange}
                            className=" h-[130px] w-[100px]"
                            alt={`carousel-`}
                        />
                        <img
                            src={detailrectange}
                            className="h-[130px] w-[100px]"
                            alt={`carousel-`}
                        />
                        <img
                            src={detailrectange}
                            className=" h-[130px] w-[100px]"
                            alt={`carousel-`}
                        />
                    </div>
                </div>
                <div className="lg:flex-grow md:w-1/2 mt-14 lg:mr-20 2xl:mr-40 w-full mb-10 md:mb-0">
                    {/*  accordion sadasdasd */}
                    <div className='px-4 md:px-0'>
                        <h1 className="sm:text-5xl font-skillet text-2xl text-[#EB7E01]">
                            {data?.title}
                        </h1>
                        <div className='flex items-center'>
                            <button type='button' className='text-[14px] font-[400] font-regola-pro px-4 py-[6px] bg-[#FEB14E] rounded-lg text-[#333333]'>Heat & Eat</button>
                            <div className="flex ml-4">
                                <Rating rating={4} text={"200 Reviews"} />
                            </div>
                        </div>
                        <p className='text-[24px] font-[500] font-regola-pro mt-3 pl-2 text-[#757575]'>{`₹ ${'250' || 0}`}</p>

                        <div className="flex justify-center items-center relative">
                        </div>
                        <p className="text-[24px] font-[400] font-regola leading-[28.8px] mt-3 pl-2 text-[#757575]">
                            {data?.description}
                        </p>
                        <div className="accordion-container m-2  text-[#333333]">
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
                                        <span className="text-[22px] font-[400] leading-[23px] font-regola text-[#393939]">{item.title}</span>
                                        <span>
                                            <motion.svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                initial={{ rotate: 0 }}
                                                animate={{
                                                    rotate: openCategoryMeals === item.id ? 180 : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <motion.path d="M7.99961 9.5999L12.7996 14.3999L17.5996 9.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
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
                                                <p className="pt-2 text-[18px] font-[400] font-regola text-[#393939]">
                                                    {item.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        <div className='flex pl-2 flex-row gap-x-5'>
                            <button className='px-8 py-2 bg-[#EDEDED] font-[600] leading-[25px] rounded text-[22px] text-[#EB7E01]' type='button'>Add to Cart</button>
                            <button className='px-8 py-2 bg-[#FEB14E] font-[600] leading-[25px] rounded text-[22px] text-[#FFFFFF]' type='button'>Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* step section */}
            <section>
                <div className="bg-[#FEB14E] grid grid-cols-6 pt-10">
                    <div className="col-span-6 md:col-span-1 pl-20 text-[#FFFFFF]">
                        <h2 className="text-5xl font-skillet font-semibold mb-4">Steps</h2>
                        <p className="text-[18px] font-[600] leading-[23px] font-regola-pro ">
                            Perfect garnishes:
                        </p>
                        <p className="text-[18px] font-[600] leading-[23px] font-regola-pro">
                            Fresh coriander leaves A swirl of cream A small piece of butter
                        </p>
                    </div>
                    <div className="col-span-6 md:col-span-5 pl-4 pt-4">
                        <div className="w-full mb-4  flex lg:mb-0">
                            <div className="w-full flex gap-x-7">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className='w-5/6 h-[505px]'
                                >
                                    <img
                                        className="w-full h-[505px] rounded-lg"
                                        src={imagess[currentIndex].src}
                                        alt={imagess[currentIndex].alt}
                                    // style={{
                                    //     transition: "background-image 1s ease-in-out"
                                    // }}
                                    />
                                </motion.div>
                                <motion.div
                                    key={previousIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                    className='w-1/6 h-[505px] relative overflow-hidden'
                                >
                                    <div className="w-[230%] h-[505px] relative -left-[10%] overflow-hidden">
                                        <img
                                            className="w-full h-full rounded-lg"
                                            src={imagess[previousIndex].src}
                                            alt={imagess[previousIndex].alt}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        <div className='flex justify-between items-center pb-10'>
                            <div className="flex ">
                                <h3 className="text-[105px] p-3 font-[500] font-regola-pro leading-[125px] opacity-50 text-[#FFFFFF] mb-4">1</h3>
                                <p className="text-[24px] font-[500] leading-[31px] font-regola-pro w-5/6 pt-8 text-[#FFFFFF]">
                                    Melt 1 tablespoon of butter in a pan over high heat, add the spices
                                    from the Spice Pouch (small pouch), and sauté for 30 seconds or
                                    until fragrant.
                                </p>
                            </div>
                            <div className='flex gap-3 pr-4'>
                                {/* next button */}
                                <button type='button' onClick={handlePrev} className='text-lg px-5 py-[14px] bg-[#DCDCDC] text-[#636363] rounded-full'>
                                    &#8592;
                                </button>
                                {/* prev button */}
                                <button type='button' onClick={handleNext} className='text-lg px-5 py-[14px] bg-[#DCDCDC] text-[#636363] rounded-full'>
                                    &#8594;
                                </button>
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
            </section>
            {/* <div className='p-10'>
                <div className="relative bg-cover bg-center bg-no-repeat 2xl:h-[700px] bg-custom-image-middle1  rounded-lg flex flex-col justify-center p-10">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#000000a6] md:rounded-l-lg"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl text-[#FAFAFA] mb-4 sm:text-2xl">Recipe</h2>
                        <div className="w-full md:w-1/2">
                            <p className="text-lg text-[#CECECE] font-normal font-sans " >
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            </p>
                        </div>
                        <button className="bg-white text-black mt-4 py-2 px-6 rounded">Learn More</button>
                        <div className='flex gap-3 mt-44 pr-4'>
                            
                            <button type='button' className='text-lg px-5 py-[14px] bg-[#DCDCDC] text-[#636363] rounded-full'>
                                &#8592;
                            </button>
                            <button type='button' className='text-lg px-5 py-[14px] bg-[#DCDCDC] text-[#636363] rounded-full'>
                                &#8594;
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="py-16 md:px-[51px]">
                <div className="">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 mb-10">
                            <h2 className="text-[36px] font-[400] leading-[38px] font-skillet text-[#333333]">
                                Your Health is Our Priority
                            </h2>
                            <p className="text-[36px] font-[400] leading-[38px] text-[#757575] font-skillet">
                                Don’t Believe Us, Believe Our Happy Customers
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-between items-start">
                            {/* Quotation Section */}
                            <div>
                                <div className="flex flex-col lg:ml-20">
                                    <div className="relative">
                                        <svg width="58" height="44" viewBox="0 0 58 44" className="absolute -top-3 -left-4 w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 43.7216V32.2159C0 28.7216 0.617898 25.0142 1.85369 21.0938C3.1321 17.1307 4.96449 13.3168 7.35085 9.65199C9.77983 5.9446 12.6989 2.72727 16.108 0L24.2898 6.64773C21.6051 10.483 19.2614 14.4886 17.2585 18.6648C15.2983 22.7983 14.3182 27.2301 14.3182 31.9602V43.7216H0ZM32.7273 43.7216V32.2159C32.7273 28.7216 33.3452 25.0142 34.581 21.0938C35.8594 17.1307 37.6918 13.3168 40.0781 9.65199C42.5071 5.9446 45.4261 2.72727 48.8352 0L57.017 6.64773C54.3324 10.483 51.9886 14.4886 49.9858 18.6648C48.0256 22.7983 47.0455 27.2301 47.0455 31.9602V43.7216H32.7273Z" fill="#B2B2B2" />
                                        </svg>
                                        <p className="px-6 py-1 font-[400] md:text-[24px] font-inter leading-[29px] text-[#757575]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </p>

                                        <svg width="58" height="44" viewBox="0 0 58 44" fill="none" className="absolute -bottom-7 right-0 w-8 h-8" xmlns="http://www.w3.org/2000/svg">
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
                            <button type='button' className='text-lg px-5 py-[14px] bg-[#5F5F5F] text-[#FFFFFF] rounded-full'>
                                &#8592;
                            </button>
                            {/* prev button */}
                            <button type='button' className='text-lg px-5 py-[14px] bg-[#5F5F5F] text-[#FFFFFF] rounded-full'>
                                &#8594;
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div><p className='px-5 md:px-[51px] text-3xl font-skillet'>You May Also Like</p></div>
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
                                    <p className='text-[#231F20] text-base font-[600] md:text-[20px] font-regola-pro leading-[24px] '>
                                        {item?.node?.title}
                                    </p>
                                    <p className='text-[#757575] mt-1 font-[400] md:text-[18px] font-regola-pro leading-[21px]'>
                                        ₹ {item?.node?.priceRange?.minVariantPrice?.amount}
                                    </p>
                                </div>
                                <div className='h-auto'>
                                    <button type='button' className='text-lg h-10 w-10 bg-[#EBEBEB] text-[#1D1929] rounded'>+</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default ReadyToEat