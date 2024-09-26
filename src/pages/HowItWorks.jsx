import React, { useRef, useState } from 'react'
import banner from '../assets/bannerHowItWorks.png'
import howitworks1 from '../assets/howitworks1.png'
import imagefooter from '../assets/footer-image.png'
import { AnimatePresence, motion } from "framer-motion";
import howitworks3 from '../assets/howitworks3.png'
export const HowItWorks = () => {
    const swiperContainerRef = useRef(null);
    const [data, setData] = useState(null);
    const [openCategoryMeals, setOpenCategoryMeals] = useState(null);

    const toggleCategoryMeals = (id) => {
        setOpenCategoryMeals(openCategoryMeals === id ? null : id);
    };

    const categoryVariants = {
        open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
        closed: {
            borderBottomRightRadius: "0.375rem",
            borderBottomLeftRadius: "0.375rem",
        },
    };

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

    const recipData = [
        {
            title: 'Busy Professionals',
            desc: 'Quick, wholesome meals that fit into your hectic day.'
        },
        {
            title: 'Students',
            desc: "Tasty and easy options for fueling up between classes."
        },
        {
            title: 'Health-Conscious',
            desc: 'Fresh, preservative-free meals you can trust.'
        },
        {
            title: 'Meal Planners',
            desc: 'Effortless meal prep with our flexible subscription service.'
        },
        {
            title: 'Meal Planners',
            desc: 'Effortless meal prep with our flexible subscription service.'
        },
    ]
    const swiperDta = [
        {
            title: 'Starts with Fresh, High-Quality Ingredients',
            desc: 'We go straight to the source—selecting the freshest, highest-quality ingredients from suppliers we trust. Because we prioritise raw materials, there’s no need for artificial preservatives. It’s the difference between food that’s made for convenience and food that’s made to nourish.'
        },
        {
            title: 'Traditional Cooking, Just Like Home',
            desc: "Imported from Korea, these two machines fill 30 pouches per minute, combining speed with precision."
        },
        {
            title: 'Keeping It Safe and Delicious',
            desc: 'A Turkish marvel that seals 24 trays per minute. It guarantees every product is packaged securely.'
        },
        {
            title: 'Sealing in Freshness',
            desc: 'This semi-automatic machine handles spout pouch filling and sealing with complete efficiency.'
        },
        {
            title: 'Sealing in Freshness',
            desc: 'This semi-automatic machine handles spout pouch filling and sealing with complete efficiency.'
        },
        {
            title: 'Sealing in Freshness',
            desc: 'This semi-automatic machine handles spout pouch filling and sealing with complete efficiency.'
        },
        {
            title: 'Sealing in Freshness',
            desc: 'This semi-automatic machine handles spout pouch filling and sealing with complete efficiency.'
        },
    ]

    const handleNextClick = () => {
        if (swiperContainerRef.current) {
            swiperContainerRef.current.scrollBy({
                left: 350,
                behavior: 'smooth'
            });
        }
    };

    const accordianData = [
        {
            title: "How do you keep your meals fresh without preservatives?",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quod perferendis eum quo fuga eius consequuntur voluptatum, explicabo consectetur aperiam dignissimos itaque, accusamus ab fugit aliquid ut mollitia? Unde ipsam enim, eum cupiditate totam eligendi molestiae sint minima alias corporis!',
            id: 1,
        },
        {
            title: "Are your meals truly preservative-free?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quod perferendis eum quo fuga eius consequuntur voluptatum, explicabo consectetur aperiam dignissimos itaque, accusamus ab fugit aliquid ut mollitia? Unde ipsam enim, eum cupiditate totam eligendi molestiae sint minima alias corporis!",
            id: 2,
        },
        {
            title: "What’s the difference between your ready-to-eat and ready-to-cook meals?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quod perferendis eum quo fuga eius consequuntur voluptatum, explicabo consectetur aperiam dignissimos itaque, accusamus ab fugit aliquid ut mollitia? Unde ipsam enim, eum cupiditate totam eligendi molestiae sint minima alias corporis!",
            id: 3,
        },
        {
            title: " How long do the meals stay fresh?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quod perferendis eum quo fuga eius consequuntur voluptatum, explicabo consectetur aperiam dignissimos itaque, accusamus ab fugit aliquid ut mollitia? Unde ipsam enim, eum cupiditate totam eligendi molestiae sint minima alias corporis!",
            id: 4,
        },
        {
            title: "How does your subscription service work?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quod perferendis eum quo fuga eius consequuntur voluptatum, explicabo consectetur aperiam dignissimos itaque, accusamus ab fugit aliquid ut mollitia? Unde ipsam enim, eum cupiditate totam eligendi molestiae sint minima alias corporis!",
            id: 5,
        },
    ];

    return (
        <div className='bg-white'>
            <div className='how-it-works-banner relative bg-cover h-[490px] bg-no-repeat' >
                <div className='absolute bottom-0 w-full'>
                    <h1 className='text-[#FFFFFF] font-regola-pro text-center font-[500] text-[36px] leading-[43.2px]'>Effortless Meals, Made Fresh and Simple</h1>
                    <p className='font-[400] px-[106px] pt-8 pb-10 font-regola-pro leading-[28.8px] text-[24px] text-[#E7E7E7] text-center'>Enjoy fresh, wholesome meals without any hassle. Choose your favourites, get them delivered to your door and savour the convenience—all in just a few easy steps. </p>
                </div>
            </div>
            <div className='md:px-[60px] px-[30px]'>
                <div className='pt-[70px] max-w-[1148px]'>
                    <h1 className='text-[20px] md:text-[36px] font-regola-pro leading-[43.2px] font-[500] mb-4 text-[#333333]'>Our Simple Steps to Great Meals</h1>
                    <p className='font-[400] font-regola-pro leading-[28.8px] text-[24px] text-[#757575] pb-14'>We believe good food should be simple, and so should the process of enjoying it. Instantly Yours makes it easy for you to get delicious, wholesome meals delivered straight to your door. Here’s how →</p>
                </div>
            </div>
            <div className='md:px-[60px] px-[30px]'>
                <div className="grid grid-cols-2 gap-10">
                    <div className="col-span-1 ">
                        <div className='flex flex-col'>
                            <div>
                                <img src={howitworks1} alt="" className='h-[345px]' />
                            </div>
                            <div className='flex pt-3'>
                                <div className='px-4'>
                                    <h1 className='font-[500] font-regola-pro leading-[115.2px] text-[96px] text-[#6B6B6B61]'>1</h1>
                                </div>
                                <div>
                                    <h3 className='font-[500] font-regola-pro leading-[43.2px] py-4 text-[36px] text-[#333333]'>Pick Your Favourite</h3>
                                    <p className='font-[400] font-regola-pro leading-[28px] text-[24px] text-[#757575] pt-3'>Scroll through our menu and let your taste buds do the talking. From meals that are ready in a flash to dishes that make you feel like a chef, we’ve got plenty of options for both ready-to-eat and ready-to-cook lovers.</p>
                                    <p className='font-[400] pt-5 font-regola-pro leading-[28.8px] text-[24px] text-[#757575]'>Take your time scrolling through, and when something catches your eye, go ahead and make it yours. Plus, you get to select your favourites and tweak your order just the way you like it.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 ">
                        <div className='flex flex-col'>
                            <div className='w-full bg-[#E7E7E7]'>
                                <img src='https://placehold.co/623x345' alt="" className='w-full h-[345px]' />
                            </div>
                            <div className='flex pt-3'>
                                <div className='px-4'>
                                    <h1 className='font-[500] font-regola-pro leading-[115.2px] text-[96px] text-[#6B6B6B61]'>2</h1>
                                </div>
                                <div>
                                    <h3 className='font-[500] font-regola-pro leading-[43.2px] py-4 text-[36px] text-[#333333]'>Delivered Right to You</h3>
                                    <p className='font-[400] font-regola-pro leading-[28.8px] text-[24px] text-[#757575] pt-3'>Once you’ve picked your favourites, we get busy in the kitchen. Every meal is prepared carefully and sent straight to your door.
                                        We make sure everything stays in the best shape, so all you have to do is open your box and dig in when you're ready.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className='flex flex-col'>
                            <div className='w-full'>
                                <img src={howitworks3} alt="" className='w-full h-[634px]' />
                            </div>
                            <div className='flex pb-[50px] pt-3'>
                                <div className='px-4'>
                                    <h1 className='font-[500] font-regola-pro leading-[115.2px] text-[96px] text-[#6B6B6B61]'>3</h1>
                                </div>
                                <div className='max-w-[1166px]'>
                                    <h3 className='font-[500] font-regola-pro leading-[43.2px] py-4 text-[36px] text-[#333333]'>Heat, Eat, Enjoy!</h3>
                                    <p className='font-[400] font-regola-pro leading-[28.8px] text-[24px] text-[#757575] pt-3'>Now for the fun part—time to enjoy! Got a ready-to-eat meal? Pop it in the microwave or stove (your choice), and in just a few minutes, you’re all set to enjoy a hot, satisfying meal without any fuss.</p>
                                    <p className='font-[400] pt-5 font-regola-pro leading-[28.8px] text-[24px] text-[#757575]'>If you’ve got a ready-to-cook dish, it’s just as simple—follow the steps written on the backside of the package and you’ll have a fresh, homemade-style meal on your plate in no time. Then, sit back, relax and savour every bite</p>
                                    <p className='font-[400] pt-5 font-regola-pro leading-[28.8px] text-[24px] text-[#757575]'>The best part? You’ve got more meals on the way, so you can keep the good times rolling, meal after meal.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-[#F2F2F2] md:py-[88px] py-[30px] md:pl-[88px] pl-[30px] relative'>
                <div className="relative flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/4 text-section text-white flex flex-col justify-between">
                        <div className=''>
                            <h2 className="text-[20px] md:text-[36px] font-regola-pro leading-[43.2px] font-[500] text-[#333333]">
                                Who’s This For?
                            </h2>
                            <p className="font-[400] max-w-[294px] text-[24px] leading-[28.8px] text-[#757575] mt-1 font-regola-pro">Our meals are for anyone who values great food without the hassle.</p>
                        </div>
                    </div>
                    <div className="w-full lg:min-w-3/4 ml-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-x-7">
                        {recipData?.map((item, i) => (
                            <div key={i} className="relative min-w-[250px] bg-[#C4C4C4] h-[300px] md:h-[362px] md:min-w-[280px]">
                                <div className="absolute inset-0 bottom-0 z-10 bg-gradient-to-b from-[#00000073]  to-[#00000000]"></div>
                                <div className="absolute bottom-0 font-regola-pro z-20 left-0  whitespace-normal p-[23px] ">
                                    <h2 className='font-[500] mb-4 text-[#FFFFFF] text-[21.75px] font-regola-pro leading-[26.1px]'> {item?.title}</h2>
                                    <p className='font-[300] text-[#FFFFFF] text-[18px] font-regola-pro leading-[21.6px]'> {item?.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='md:px-[60px] px-[30px]'>
                <div className='pt-[60px]'>
                    <h1 className='text-[20px] md:text-[36px] font-regola-pro leading-[43.2px] font-[500] mb-4 text-[#333333]'>How Do We Guarantee Fresh and Preservative-Free Meals?</h1>
                    <p className='font-[400] font-regola-pro leading-[28.8px] text-[24px] text-[#757575] pb-14'>We believe that real food doesn’t need any artificial help to stay fresh. Here’s how we do it →</p>
                </div>
            </div>

            <div className='md:py-[30px] relative pt-[20px] md:pl-[60px] pl-[30px]'>
                <div ref={swiperContainerRef} className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-x-7">
                    {swiperDta?.map((item, i) => (
                        <div key={i} className="relative min-w-[247px] bg-[#C4C4C4] h-[400px] md:h-[569px] md:min-w-[347px]">
                            <div className="absolute bottom-0 font-regola-pro z-20 left-0  whitespace-normal p-4 pr-8">
                                <h2 className='font-[400] mb-5 text-[#000000] text-[26px] font-regola-pro leading-[31.2px]'> {item?.title}</h2>
                                <p className='font-[400] text-[#757575] text-[16px] font-regola-pro leading-[19.2px]'> {item?.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* next btn */}
                <div
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 w-[40px] h-[40px] md:w-[57px] md:h-[57px] bg-[#FFFFFF] flex items-center justify-center"
                    onClick={handleNextClick}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="14"
                        viewBox="0 0 19 14"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.5338 0.141846L18.3918 6.99985L11.5338 13.8579L9.74245 12.0665L13.5425 8.26652H0.133789V5.73318H13.5425L9.74245 1.93318L11.5338 0.141846Z"
                            fill="#1D1929"
                        />
                    </svg>
                </div>
            </div>

            <div className="w-full pt-[60px] px-[180px] pb-[60px] flex justify-center items-center">
                {/* Quotation Section */}
                <div>
                    <div className="flex flex-col">
                        <div className="relative">
                            <svg width="41" height="28" viewBox="0 0 41 28" className="absolute -top-5 -left-8 w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.314 0.431999L13.706 27.056H0.266L7.946 0.431999H18.314ZM40.714 0.431999L36.106 27.056H22.666L30.346 0.431999H40.714Z" fill="#757575" />
                            </svg>
                            <p className="font-regola-pro leading-[43.2px] py-1 text-[36px] text-center font-[400] text-[#333333]">“At the end of the day, it’s about keeping things real. We rely on nature and tradition to make our meals taste great. No artificial preservatives, just clean and wholesome food you can feel good about.”
                            </p>
                            <svg width="41" height="28" viewBox="0 0 41 28" fill="none" className="absolute -bottom-4 -right-9 w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.686 27.568L27.294 0.944H40.734L33.054 27.568H22.686ZM0.285999 27.568L4.894 0.944H18.334L10.654 27.568H0.285999Z" fill="#757575" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>


            <div className='p-[112px] items-center justify-center text-center'>
                <h1 className='text-[20px] md:text-[36px] font-regola-pro leading-[43.2px] font-[500] mb-8 text-[#333333]'>Frequently Asked Questions</h1>
                <div className="accordion-container m-2  text-[#333333]">
                    {accordianData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola text-[#333333]">{item.title}</span>
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
            </div>


        </div>
    )
}
