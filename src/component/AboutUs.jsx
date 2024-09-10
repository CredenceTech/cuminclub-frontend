import React from 'react'
import image from '../assets/Rectangle 150.png'
import image1 from '../assets/image 1.png'

import { useState } from 'react';

const slides = [
    {
        year: "2019",
        image: image,
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
        <div className=' w-full h-auto bg-white px-8 lg:pl-0'>
            <div className='container font-sans'>
                <div className='md:px-16 pt-12'>
                    <h3 className='text-2xl font-[400] text-[#333333]'>Read About Us</h3>
                    <h1 className='md:text-4xl text-3xl font-[500] mb-4 text-[#333333]'>
                        The Story Behind Instantly Yours
                    </h1>
                    <p className='text-2xl text-[#757575] font-light mb-14'>We’re all about making mealtime effortless and enjoyable. With X+ ready-to-eat and ready-to-cook products – comfort and convenience come first.</p>
                </div>
                <div className='md:px-16 '>
                    <h1 className='md:text-4xl text-3xl font-[500] mb-4 text-zinc-800'>How did We Become a Reality?</h1>
                    <p className='text-[24px] text-[#757575] font-light mb-14'>It all started with a simple wish: To enjoy clean, comforting food that feels like home, no matter where you are. Instantly Yours was born from this very idea, sparked by four friends who wanted to make mealtime easier and healthier for everyone.</p>
                </div>
                <div className='flex md:flex-row flex-col-reverse md:pl-16 justify-between items-center md:gap-28 gap-1 text-left' >
                    <p className='text-2xl text-[#757575] font-light mb-14 mr-10 mt-9'>Nishant Jaiswal and Priyank Shah, originally successful in the textile industry, began exploring agriculture and organic farming. This journey led them to discover a fascinating food preservation method called retorting. It’s a process that keeps food fresh and full of flavour without any preservatives—just pure, authentic taste.</p>
                    <div className='md:w-[230vw] w-[80vw] h-[50vw] md:h-[23vw] bg-[#D9D9D9] mr-10'></div>
                </div>
                <div className='flex md:flex-row flex-col md:pl-16 justify-between items-center md:gap-28 gap-1 text-left'>
                    <div className='md:w-[230vw] w-[80vw] h-[50vw] md:h-[23vw] bg-[#D9D9D9] mr-10 md:mr-0'></div>
                    <p className='text-2xl text-[#757575] font-light mb-14 mr-10 mt-9'>Meanwhile, Rahul Jaiswal was studying in the United States. He often said, “I miss the familiar taste of homemade Indian meals. It’s difficult out here.” At the same time, back in Surat, Saurav Dhawan, fresh out of college, was trying to find quick, clean meals while starting his career. </p>
                </div>
                <p className='text-2xl text-[#757575] font-light md:pl-16 pb-14 mt-14'>When brought together, the four realised how so many Indians are facing a challenge:</p>
                <div className='md:pl-16'>
                    <h1 className='md:text-4xl text-3xl font-[500] mb-10 text-[#333333]'>
                        Finding safe, convenient, and comforting food that didn’t sacrifice quality.
                    </h1>
                    <p className='text-2xl text-[#757575] font-light mb-14'>This led to the making of “Instantly Yours.” What do we aim at? To bring you the taste of home, wherever you are. We believe in offering convenience without compromising on health. Our meals are preservative-free, made with care and designed to bring you comfort and joy.</p>
                    <p className='text-2xl text-[#757575] font-light pb-14'> At our heart, we love making every meal easy and satisfying. We’re always looking for ways to innovate and improve. To make food as nutritious as it is delicious. Because for us, convenience should never come at the cost of quality.</p>
                </div>
                <div className='md:pl-16 pb-16'>
                    <h1 className='md:text-4xl text-3xl font-[500] mb-8 text-[#333333]'>Meet the Team</h1>
                    <p className=' w-[50vw] text-xl text-[#757575] font-light mb-10'>Every day, we come to work with one simple mindset: To make meals that we’d be proud to serve our own families. It’s not just about creating food. It’s about sharing something real and comforting with people, no matter where they are.</p>
                    <div className="flex md:gap-16 gap-5 overflow-x-auto">
                        <div className="shrink-0">
                            <div className="md:w-[30vw] w-[35vw] h-[35vw] md:h-[30vw] bg-[#D9D9D9] snap-center"></div>
                            <h1 className='md:text-4xl text-xl font-[400] md:font-[300] text-[#333333] md:mt-10 mt-3'>Saurav Dhavan</h1>
                            <p className='text-lg text-[#757575] font-light md:mt-3 mt-1'>Lorem, Ipsum.</p>
                        </div>
                        <div className="shrink-0">
                            <div className="md:w-[30vw] w-[35vw] h-[35vw] md:h-[30vw] bg-[#D9D9D9] snap-center"></div>
                            <h1 className='md:text-4xl text-xl font-[400] md:font-[300] text-[#333333] md:mt-10 mt-3'>Rahul Jaiswal</h1>
                            <p className='text-lg text-[#757575] font-light md:mt-3 mt-1'>Lorem, Ipsum.</p>
                        </div>
                        <div className="shrink-0">
                            <div className="md:w-[30vw] w-[35vw] h-[35vw] md:h-[30vw] bg-[#D9D9D9] snap-center"></div>
                            <h1 className='md:text-4xl text-xl font-[400] md:font-[300] text-[#333333] md:mt-10 mt-3'>Person A</h1>
                            <p className='text-lg text-[#757575] font-light md:mt-3 mt-1'>Lorem, Ipsum.</p>
                        </div>
                    </div>
                </div>
                <div className='lg:pl-16 flex lg:flex-row flex-col items-center'>
                    <div className='w-[70vw] h-[45vw] bg-[#D9D9D9]'>
                        <img src={image1} alt="" className='lg:mx-96 ml-36 mt-20 lg:mt-80 w-10 h-10 lg:w-0 lg:h-0' />
                    </div>
                    <div className='lg:w-[500px] lg:ml-10 mt-8 lg:mt-0'>
                        <div className='flex gap-4'>
                            <h3 className='text-[#000000] underline underline-offset-4 decoration-2 text-xl'>Our Mission</h3>
                            <h3 className='text-[#000000] text-xl'>Our Vision</h3>
                        </div>
                        <div className='lg:w-96 w-80'>
                            <h1 className='text-4xl font-[300] text-[#333333] mt-10'>Our Mission</h1>
                            <p className='mt-6 text-[#757575] font-light text-2xl'>Food should bring comfort, not compromise. That’s why we focus on creating meals that are convenient without cutting corners on quality.</p>
                            <p className='mt-6 text-[#757575] text-xl'>Our mission is to make wholesome, preservative-free food accessible to everyone, whether they’re in a rush or just craving something familiar. We understand that life gets busy, but that doesn’t mean your food should suffer.</p>
                            <p className='mt-6 text-[#757575] text-xl'>We’re here to prove that convenience doesn’t have to come with a trade-off. Each dish is a promise that you can have both—a quick meal that’s ready when you are and made with the same care as a dish you cooked yourself (from scratch).
                                <span>Our goal? To bring the taste of home to everyone, no matter where they are.</span>
                            </p>
                        </div>
                        {/* <div>Our Vision</div> */}
                    </div>
                </div>
                {/* Slide Display */}
                <div className='relative'>
                    <div className='flex lg:flex-row flex-col lg:pl-60 justify-between mt-28'>
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className='lg:w-[40vw] ml-6 lg:ml-0 pr-7 lg:pr-0 lg:h-[25vw] object-cover rounded-2xl'
                        />
                        <div className='lg:w-[60vw] ml-10 pr-20 mt-8 lg:mt-0'>
                            <h1 className='lg:text-4xl text-3xl font-[300] text-[#333333]'>{slides[currentSlide].title}</h1>
                            <p className='text-lg text-[#757575] font-light mt-3 mb-16 lg:mb-0'>
                                {slides[currentSlide].description}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className='flex gap-3 pr-20 lg:absolute lg:right-10 lg:bottom-32 justify-center items-center ml-20 lg:ml-0'>
                        <button onClick={handlePrev} className='text-lg px-5 py-[14px] bg-[#D9D9D9] text-[#757575] rounded-full'>
                            &#8592;
                        </button>
                        <button onClick={handleNext} className='text-lg px-5 py-[14px] bg-[#D9D9D9] text-[#757575] rounded-full'>
                            &#8594;
                        </button>
                    </div>
                    {/* Timeline Dots */}
                    <div className="timeline-dots flex justify-center mt-10">
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
                                    />
                                    {/* Right underline */}
                                    <span
                                        className={`block h-[2.5px] w-14 bg-[#D9D9D9] ${index === slides.length + 1 ? 'invisible' : ''}`}
                                    />
                                </div>

                                {/* Conditionally render the year below the active dot */}
                                {index === currentSlide && (
                                    <span className="text-2xl text-gray-600 font-light mt-2">{slide.year}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='lg:pl-16 pb-52 mt-32 flex lg:flex-row flex-col justify-between'>
                    <div>
                        <h2 class="lg:text-5xl text-4xl font-medium font-skillet  text-[#333333]">Your Health is Our Priority</h2>
                        <p class="lg:text-4xl text-3xl text-[#757575] font-normal font-skillet ">Don’t Believe Us, Believe Our Happy Customers</p>
                    </div>
                    <div className='lg:w-[28vw] mt-8 lg:mt-0'>
                        <p className='text-[#757575] font-light text-2xl'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        <h3 className='text-[#333333] text-2xl font-light mt-5 mb-4 md:mb-0'>Person Name</h3>
                    </div>
                    <div className='flex gap-3 pr-20 lg:absolute lg:right-10 lg:bottom-32 justify-center items-center ml-20 mt-10 lg:mt-0 lg:ml-0'>
                        <button className='text-lg px-5 py-[14px] bg-[#757575] text-[#D9D9D9] rounded-full'>
                            &#8592;
                        </button>
                        <button className='text-lg px-5 py-[14px] bg-[#757575] text-[#D9D9D9] rounded-full'>
                            &#8594;
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AboutUs