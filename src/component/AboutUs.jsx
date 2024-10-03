import React from 'react'
import image from '../assets/Rectangle 150.png'
import team from '../assets/team.png'
import mission from '../assets/mission.png'
import beginin from '../assets/beginin.png'
import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
const slides = [
    {
        year: "2019",
        image: beginin,
        title: "The Beginning",
        description: "Instantly Yours was founded with a very simple yet powerful vision: To offer quick, convenient, and hygienic food solutions for modern lifestyles. From the very start, our focus has been on bringing effortless mealtime satisfaction to kitchens everywhere.",
    },
    {
        year: "2020",
        image: image,
        title: "Growth Phase",
        description: "Expansion of facilities and new partnerships...",
    },
    {
        year: "2021",
        image: beginin,
        title: "New Horizons",
        description: "Entering new markets and increasing our product range...",
    },
    {
        year: "2022",
        image: image,
        title: "New Horizons",
        description: "Entering new markets and increasing our product range...",
    },
    {
        year: "2023",
        image: beginin,
        title: "New Horizons",
        description: "Entering new markets and increasing our product range...",
    },
    {
        year: "2024",
        image: image,
        title: "New Horizons",
        description: "Entering new markets and increasing our product range...",
    },
    {
        year: "2025",
        image: beginin,
        title: "New Horizons",
        description: "Entering new markets and increasing our product range...",
    },
    {
        year: "2021",
        image: image,
        title: "New Horizons",
        description: "Entering new markets and increasing our product range...",
    },
];


const AboutUs = () => {

    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    return (
        <div className=' bg-[#ffffff]'>
            <div className='2xl:container md:pl-[45px] 3xl:pl-0'>
                <div className='pt-12'>
                    <h3 className='text-[24px] leading-[28.8px] font-[400] font-regola-pro text-[#333333]'>Read About Us</h3>
                    <h1 className='md:text-[36px] md:leading-[43.2px] text-2xl font-regola-pro font-[500] mb-4 text-[#333333]'>
                        The Story Behind Instantly Yours
                    </h1>
                    <p className='text-[24px] leading-[28.8px] font-[400] text-[#757575] mb-14'>We’re all about making mealtime effortless and enjoyable. With X+ ready-to-eat and ready-to-cook products – comfort and convenience come first.</p>
                </div>
                <div className=''>
                    <h1 className='md:text-[36px] md:leading-[43.2px] font-regola-pro text-2xl font-[500] mb-4 text-[#333333]'>How did We Become a Reality?</h1>
                    <p className='text-[24px] leading-[28.8px] font-[400] font-regola-pro text-[#757575] mb-14'>It all started with a simple wish: To enjoy clean, comforting food that feels like home, no matter where you are. Instantly Yours was born from this very idea, sparked by four friends who wanted to make mealtime easier and healthier for everyone.</p>
                </div>
            </div>
            <div className=''>
                <div className='flex md:flex-row flex-col-reverse' >
                    <div className='w-full h-[439px] '>
                        <img src={team} alt="team" className='w-full h-[100%]' />
                    </div>
                </div>
                <div className='flex md:flex-row flex-col' >

                    <div className='w-full md:w-1/2 px-12 py-10 self-center'>
                        <p className='text-[24px] leading-[28.8px] font-[400] font-regola-pro text-[#757575]'>Nishant Jaiswal and Priyank Shah, originally successful in the textile industry, began exploring agriculture and organic farming. This journey led them to discover a fascinating food preservation method called retorting. It’s a process that keeps food fresh and full of flavour without any preservatives—just pure, authentic taste.</p>
                    </div>
                    <div className='w-full md:w-1/2 px-24 py-10 self-center'>
                        <p className='text-[24px] leading-[28.8px] font-[400] font-regola-pro text-[#757575]'>Meanwhile, Rahul Jaiswal was studying in the United States. He often said, “I miss the familiar taste of homemade Indian meals. It’s difficult out here.” At the same time, back in Surat, Saurav Dhawan, fresh out of college, was trying to find quick, clean meals while starting his career. </p>
                    </div>
                </div>
            </div>
            <div className='2xl:container pl-5 lg:pl-[45px] pr-7 3xl:pl-0 text-left'>
                <p className='text-[24px] leading-[28.8px] font-[400] text-[#757575] font-regola-pro  pb-14 mt-14'>When brought together, the four realised how so many Indians are facing a challenge:</p>
                <div className=''>
                    <h1 className='md:text-[36px] md:leading-[43.2px] text-2xl font-regola-pro font-[500] mb-10 text-[#333333]'>
                        Finding safe, convenient, and comforting food that didn’t sacrifice quality.
                    </h1>
                    <p className='text-[24px] leading-[28.8px] font-[400] text-[#757575] font-regola-pro mb-7'>This led to the making of “Instantly Yours.” What do we aim at? To bring you the taste of home, wherever you are. We believe in offering convenience without compromising on health. Our meals are preservative-free, made with care and designed to bring you comfort and joy.</p>
                    <p className='text-[24px] leading-[28.8px] font-[400] text-[#757575] font-regola-pro pb-14'> At our heart, we love making every meal easy and satisfying. We’re always looking for ways to innovate and improve. To make food as nutritious as it is delicious. Because for us, convenience should never come at the cost of quality.</p>
                </div>
            </div>

            <div className='my-[30px]'>
                <div className='2xl:container pl-5 lg:pl-[45px] pr-7 3xl:pl-0 text-left'>
                    <h1 className='md:text-[36px] md:leading-[43.2px] text-3xl font-regola-pro font-[400] mb-8 text-[#333333]'>Meet the Team</h1>
                    <p className='md:w-[50vw] leading-[19.36px] text-[16px] font-inter text-[#757575] font-[400] mb-10'>Every day, we come to work with one simple mindset: To make meals that we’d be proud to serve our own families. It’s not just about creating food. It’s about sharing something real and comforting with people, no matter where they are.</p>
                </div>

                <div className="flex gap-x-10 pl-5 md:pl-[45px] overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <div className="shrink-0">
                        <div className="md:w-[488px] md:h-[488px] bg-[#D9D9D9] snap-center"></div>
                        <h1 className='md:text-[36px] md:leading-[43.2px] text-xl font-[400] font-inter text-[#333333] md:mt-10 mt-3'>Saurav Dhavan</h1>
                        <p className='leading-[19.36px] text-[16px] text-[#757575] font-inter font-[400] md:mt-3 mt-1'>Lorem, Ipsum.</p>
                    </div>
                    <div className="shrink-0">
                        <div className="md:w-[488px] md:h-[488px] bg-[#D9D9D9] snap-center"></div>
                        <h1 className='md:text-[36px] md:leading-[43.2px] text-xl font-[400]  font-inter text-[#333333] md:mt-10 mt-3'>Rahul Jaiswal</h1>
                        <p className='leading-[19.36px] text-[16px] text-[#757575] font-inter font-[400] md:mt-3 mt-1'>Lorem, Ipsum.</p>
                    </div>
                    <div className="shrink-0">
                        <div className="md:w-[488px] md:h-[488px] bg-[#D9D9D9] snap-center"></div>
                        <h1 className='md:text-[36px] md:leading-[43.2px] text-xl font-[400] font-inter  text-[#333333] md:mt-10 mt-3'>Person A</h1>
                        <p className='leading-[19.36px] text-[16px] text-[#757575] font-inter font-[400] md:mt-3 mt-1'>Lorem, Ipsum.</p>
                    </div>
                    <div className="shrink-0">
                        <div className="md:w-[488px] md:h-[488px] bg-[#D9D9D9] snap-center"></div>
                        <h1 className='md:text-[36px] md:leading-[43.2px] text-xl font-[400] font-inter text-[#333333] md:mt-10 mt-3'>Person B</h1>
                        <p className='leading-[19.36px] text-[16px] text-[#757575] font-inter font-[400] md:mt-3 mt-1'>Lorem, Ipsum.</p>
                    </div>
                </div>
            </div>


            <div className='pl-5 lg:pl-[45px] pt-7 pr-7 3xl:pl-0 mt-20'>
                <div className='flex flex-col md:flex-row'>
                    <div className='w-full md:w-[60vw] h-[711px]'>
                        <img src={mission} alt="" className='w-full h-[711px]' />
                    </div>
                    <div className='px-10 w-full md:w-[40vw] mt-0 pt-0'>
                        <div className='flex gap-10 mt-0 pt-0'>
                            <button type='button' className='text-[#000000] font-inter text-[18px] leading-[21.78px] pr-3 font-[400] border-b-2 border-b-[#000000]'>Our Mission</button>
                            <button type='button' className='text-[#000000] font-inter text-[18px] leading-[21.78px] pr-3 font-[400] hover:border-b-2 border-b-[#000000] '>Our Vision</button>
                        </div>
                        <div className='pt-3'>
                            <h1 className='md:text-[36px] md:leading-[43.2px] font-[400] text-[#333333] font-inter mt-10'>Our Mission</h1>
                            <p className='mt-6 text-[#757575] text-[22px] leading-[26.63px] font-inter font-[400]'>Food should bring comfort, not compromise. That’s why we focus on creating meals that are convenient without cutting corners on quality.</p>
                            <p className='mt-6 text-[#757575] text-[22px] leading-[26.63px] font-inter font-[400]'>Our mission is to make wholesome, preservative-free food accessible to everyone, whether they’re in a rush or just craving something familiar. We understand that life gets busy, but that doesn’t mean your food should suffer.</p>
                            <p className='mt-6 text-[#757575] text-[22px] leading-[26.63px] font-inter font-[400]'>We’re here to prove that convenience doesn’t have to come with a trade-off. Each dish is a promise that you can have both—a quick meal that’s ready when you are and made with the same care as a dish you cooked yourself (from scratch).
                                <span>Our goal? To bring the taste of home to everyone, no matter where they are.</span>
                            </p>
                        </div>
                        {/* <div>Our Vision</div> */}
                    </div>
                </div>
            </div>

            {/* Slide Display */}
            <div className='relative'>
                <div className='flex lg:flex-row flex-col lg:pl-[180px] justify-between mt-28'>
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className='lg:w-[519px] ml-6 lg:ml-0 pr-7 lg:pr-0 lg:h-[322px] object-cover rounded-[13px]'
                    />
                    <div className='lg:w-[60vw] ml-10 pr-20 mt-8 lg:mt-0'>
                        <h1 className='md:text-[32px] leading-[38.73px] text-2xl font-inter font-[400] text-[#333333]'>{slides[currentSlide].title}</h1>
                        <p className='text-[16px] leading-[19.36px] font-inter text-[#757575] font-[400] mt-3 mb-16 lg:mb-0'>
                            {slides[currentSlide].description}
                        </p>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className='flex gap-3 pr-20 lg:absolute lg:right-10 lg:bottom-32 justify-center items-center ml-20 lg:ml-0'>
                    <button onClick={handlePrev} className='text-lg px-5 py-[14px] bg-[#D9D9D9] text-[#828282] rounded-full'>
                        &#8592;
                    </button>
                    <button onClick={handleNext} className='text-lg px-5 py-[14px] bg-[#D9D9D9] text-[#828282] rounded-full'>
                        &#8594;
                    </button>
                </div>
                {/* Timeline Dots */}
                <div className="timeline-dots overflow-x-auto scrollbar-hide flex md:ml-[180px] mt-10">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex flex-col items-center relative">
                            {/* Underline for the dot */}
                            <div className="flex items-center">
                                {/* Left underline */}
                                <span
                                    className={`block h-[2.5px] w-14 bg-[#D9D9D9] ${index === 0 ? 'visible' : ''}`}
                                />
                                {/* Dot */}
                                <span
                                    className={`h-5 w-5 rounded-full cursor-pointer ${index === currentSlide ? 'bg-[#757575]' : 'bg-[#D9D9D9]'}`}
                                    onClick={() => setCurrentSlide(index)}
                                // layoutId="underline"
                                />
                                {/* <motion.div className="underlineHeader" layoutId="underline" /> */}
                                {/* Right underline */}
                                <span
                                    className={`block h-[2.5px] w-14 bg-[#D9D9D9] ${index === slides.length + 1 ? 'invisible' : ''}`}
                                />
                            </div>

                            {/* Conditionally render the year below the active dot */}
                            {index === currentSlide && (
                                <motion.span className="text-2xl text-gray-600 font-inter font-[400] mt-2" layoutId="underline">{slide.year}</motion.span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-16 px-8 mt-14">
                <div className="container">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 mb-10 mt-5 ">
                            <h2 className="text-[36px] leading-[37.34px] font-[400] font-skillet text-[#333333]">
                                Your Health is Our Priority
                            </h2>
                            <p className="text-[28px] leading-[29.04px] text-[#757575] font-[400] font-skillet">
                                Don’t Believe Us, Believe Our Happy Customers
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-between items-start">
                            {/* Quotation Section */}
                            <div>
                                <div className="flex flex-col lg:ml-[100px]">
                                    <div className="relative">
                                        <svg width="58" height="44" viewBox="0 0 58 44" className="absolute top-0 -left-4 w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 43.7216V32.2159C0 28.7216 0.617898 25.0142 1.85369 21.0938C3.1321 17.1307 4.96449 13.3168 7.35085 9.65199C9.77983 5.9446 12.6989 2.72727 16.108 0L24.2898 6.64773C21.6051 10.483 19.2614 14.4886 17.2585 18.6648C15.2983 22.7983 14.3182 27.2301 14.3182 31.9602V43.7216H0ZM32.7273 43.7216V32.2159C32.7273 28.7216 33.3452 25.0142 34.581 21.0938C35.8594 17.1307 37.6918 13.3168 40.0781 9.65199C42.5071 5.9446 45.4261 2.72727 48.8352 0L57.017 6.64773C54.3324 10.483 51.9886 14.4886 49.9858 18.6648C48.0256 22.7983 47.0455 27.2301 47.0455 31.9602V43.7216H32.7273Z" fill="#B2B2B2" />
                                        </svg>
                                        <p className="px-6 font-inter leading-[29.05px] py-1 text-[24px] font-[400] text-[#757575]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </p>

                                        <svg width="58" height="44" viewBox="0 0 58 44" fill="none" className="absolute bottom-0 right-0 w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M57.0156 8.39233e-05V11.5058C57.0156 15.0001 56.3977 18.7075 55.1619 22.6279C53.8835 26.591 52.0511 30.4049 49.6648 34.0697C47.2358 37.7771 44.3168 40.9944 40.9077 43.7217L32.7259 37.074C35.4105 33.2387 37.7543 29.233 39.7571 25.0569C41.7173 20.9234 42.6974 16.4916 42.6974 11.7615V8.39233e-05H57.0156ZM24.2884 8.39233e-05V11.5058C24.2884 15.0001 23.6705 18.7075 22.4347 22.6279C21.1563 26.591 19.3239 30.4049 16.9375 34.0697C14.5085 37.7771 11.5895 40.9944 8.1804 43.7217L-0.00141907 37.074C2.68324 33.2387 5.02699 29.233 7.02982 25.0569C8.99005 20.9234 9.97017 16.4916 9.97017 11.7615V8.39233e-05H24.2884Z" fill="#B2B2B2" />
                                        </svg>
                                    </div>
                                    <p className="text-left font-inter pl-5 text-[#333333] pt-4 text-[24px] leading-[29.05px] font-[400]">Person Name</p>
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

        </div >
    )
}

export default AboutUs
