import React, { useRef } from 'react'
import ladingImage from '../assets/biryani.png'
import sahipanir from '../assets/sahipanir.png'
import BiryaniBurrito from '../assets/stepimages/BiryaniBurrito.svg'
import step1 from '../assets/stepimages/Step1.png';
import step2 from '../assets/stepimages/Step2.png';
import step3 from '../assets/stepimages/Step3.png';
import step4 from '../assets/stepimages/Step4.png';
import { motion, useScroll } from "framer-motion";

const Recipes = () => {
    const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const scrollYProgress = refs.map(ref => useScroll({ target: ref, offset: ["center center", "center start"] }).scrollYProgress);

    const items = [
        ' IY Biryani (chicken or vegetarian) (prepared)',
        '4 large tortilla wraps or rumali rotis',
        '1 cup shredded lettuce',
        '1 cup grated cheese (cheddar or any preferred cheese)',
        '1/2 cup mint mayo',
        '1/2 cup sour cream'
    ];

    const InstructionsText = [
        { id: 1, text: 'Warm the tortilla wraps or rumali rotis on a skillet for about 1-2 minutes on each side until they are pliable and warm.', img: step1, ref: refs[0] },
        { id: 2, text: 'Spread 2 tablespoons of mint mayo on a warm tortilla or rumali roti. Add 1/2 cup biryani,  1/4 cup shredded lettuce, 1/4 cup grated cheese, and a dollop of sour cream.', img: step2, ref: refs[1] },
        { id: 3, text: 'Fold the sides of the tortilla or rumali roti inward towards the center. Carefully roll from the bottom up, keeping the filling tightly packed. Ensure the ends are tucked in to prevent spillage.', img: step3, ref: refs[2] },
        { id: 4, text: 'Serve hot with salsa or sour cream.', img: step4, ref: refs[3] },
    ];

    return (
        <div className='relative'>
            <div className='bg-[#C75801]'>
                <div className='grid grid-cols-2 lg:grid-cols-3'>
                    <div className=" col-span-2 md:col-span-1 pl-[40px]">
                        <p className='text-[#FFFFFF] pt-4 font-regola-pro font-[300] text-[16px]'>{"Recipes > Biryani burrito"}</p>
                        <img src={BiryaniBurrito} className='pb-[200px] pt-4' alt="" />
                        <div className='flex gap-5 pb-10'>
                            <button className='px-4 rounded py-2 bg-[#EADEC1] text-base text-[#C75801]' type='button'>Download PDF</button>
                            <button className='px-4 rounded py-2 bg-[#EADEC1] text-base text-[#C75801]' type='button'>Share Recipe</button>
                        </div>
                    </div>
                    <div className='col-span-1 lg:col-span-2 hidden md:flex'>
                        <img src={ladingImage} className='h-full w-full' alt="" />
                    </div>
                </div>
            </div>
            <div className='bg-[#FAFAFA]'>
                <div className='grid grid-cols-3 sticky top-0 h-[61px] items-center bg-[#FAFAFA]'>
                    <div className='col-span-1 pl-10 hidden md:flex gap-x-16 items-center'>
                        <div className=''>
                            <p className='text-[#757575] font-regola-pro text-[14px]'>Prep Time</p>
                            <p className='text-[#231F20] font-regola-pro text-[16px]'>10 mins</p>
                        </div>
                        <div className=''>
                            <p className='text-[#757575] font-regola-pro text-[14px]'>Cook Time</p>
                            <p className='text-[#231F20] font-regola-pro text-[16px]'>25 mins</p>
                        </div>
                    </div>
                    <div className='col-span-3 md:col-span-2  flex overflow-x-auto bg-[#FFFFFF] flex-1 whitespace-nowrap scrollbar-hide justify-between items-center'>
                        <div className='flex flex-row w-full'>
                            {scrollYProgress.map((progress, index) => (
                                <div key={index} className={`relative h-[61px] flex items-center justify-center w-full px-10  ${index == 3 ? '' : 'border-r-[#C75801] border-r '} `}>
                                    <motion.div className="progress-bar" style={{ scaleX: progress }} />
                                    <p className='text-lg font-regola-pro text-[#231F20]'> Step {index + 1} <span className='text-[#757575] text-sm'> {"(2 mins)"}</span> </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='2xl:container 2xl:mx-auto grid grid-cols-4 mt-8 2xl:pl-10'>
                    <div className='col-span-4 pl-5 p-3 md:pl-10 2xl:pl-0 md:col-span-2'>
                        <p className='text-4xl mb-4 font-skillet'>Ingredients</p>
                        <ol className='lg:pr-28 pb-7'>
                            {items.map((item, index) => (
                                <div key={index} className='flex lg:pr-28 mb-4'>
                                    <p className='text-lg font-regola-pro text-[#333333] leading-10'>{index + 1}. </p>
                                    <p className='text-lg font-regola-pro pl-4 font-light leading-10 text-[#333333]'>{item}</p>
                                </div>
                            ))}
                        </ol>
                    </div>
                    <div className='col-span-4 md:col-span-2 p-3 md:p-0 md:pr-10 lg:pr-32'>
                        <p className='text-4xl p-6 font-skillet'>Instructions</p>
                        {InstructionsText.map(item => (
                            <div ref={item.ref} className='flex-col mb-5' key={item.id}>
                                <div className='flex mb-5'>
                                    <p className='text-6xl text-[#e9bc9982] font-skillet font-semibold'>{item.id}</p>
                                    <div className='pl-5'>
                                        <p className='text-xl pb-4 font-regola-pro font-[400] text-[#333333]'>{item.text}</p>
                                    </div>
                                </div>
                                <div className='pb-5'>
                                    <img src={item.img} alt="" className='h-[400px] w-full lg:max-w-[600px] border-b border-b-[#C6C6C6] pb-5' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='bg-[#FFFFFF] pt-7'>
                <div className='2xl:container 2xl:mx-auto'>
                    <div className='flex md:flex-row flex-col-reverse justify-center items-start'>
                        <div className='flex md:w-1/2 justify-center items-center'>
                            <img src={sahipanir} alt="" className='w-auto h-[300px] md:h-[450px]' />
                        </div>
                        <div className='md:w-1/2 pl-6 md:pl-0'>
                            <h1 className='text-[#C75801] font-skillet text-4xl'>Make this recipe Instantly Yours</h1>
                            <p className='text-[20px] font-[400] text-[#333333]'>Made with our </p>
                            <h1 className='text-[#333333] font-skillet text-5xl'>Shahi biryani kit</h1>
                            <p className='pb-32 hidden text-[20px] font-[400] md:flex'>About the product</p>
                            <div className='hidden md:flex gap-5 pb-8'>
                                <button className='px-4 rounded py-1 bg-[#231F20] text-sm text-[#FFFFFF]' type='button'>Add to Cart</button>
                                <button className='px-4 rounded py-1 bg-[#231F20] text-sm text-[#FFFFFF]' type='button'>Buy Now</button>
                            </div>
                        </div>
                    </div>
                    <div className='md:hidden flex-row'>
                        <p className='pb-20 font-regola-pro text-[20px] font-[400] pl-8 pt-6'>About the product</p>
                        <div className='gap-5'>
                            <button className='px-4 w-1/2 py-4 bg-[#231F20] font-regola-pro text-[16px] text-[#FFFFFF]' type='button'>Add to Cart</button>
                            <button className='px-4 w-1/2 py-4 bg-[#C75801] font-regola-pro text-[16px] text-[#FFFFFF]' type='button'>Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recipes