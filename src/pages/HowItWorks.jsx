import React from 'react'
import banner from '../assets/bannerHowItWorks.png'
export const HowItWorks = () => {
    return (
        <div className='bg-white'>
            {/* bannner section */}
            <div className='how-it-works-banner relative bg-cover h-[490px] bg-no-repeat' >
                <div className='absolute bottom-0 w-full'>
                    <h1 className='text-[#FFFFFF] font-regola-pro text-center font-[500] text-[36px] leading-[43px]'>Effortless Meals, Made Fresh and Simple</h1>
                    <p className='font-[400] pt-10 font-regola-pro leading-[28px] text-[24px] text-[#E7E7E7] text-center'>Enjoy fresh, wholesome meals without any hassle. Choose your favourites, get them delivered to your door </p>
                    <p className='font-[400] pb-10 font-regola-pro leading-[28px] text-[24px] text-[#E7E7E7] text-center'>and savour the convenience—all in just a few easy steps.</p>
                </div>

            </div>
        </div>
    )
}
