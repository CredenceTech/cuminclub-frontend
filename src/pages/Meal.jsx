import React, { useState } from 'react'
import rightarrow from "../assets/rightarrow.svg"
import line from "../assets/line.svg"
import mealBoy1 from "../assets/mealBoy1.svg"
import mealBoy2 from "../assets/mealBoy2.svg"
import leftarrow from "../assets/leftarrow.svg"
const Meal = () => {
    const [isSeleted, setIsSelected] = useState(false);
    const [isMonthSelected, setIsMonthSelected] = useState(false);
    const [isPriceSelected, setIsPriceSelected] = useState(false);
    const onSelect = (selectValue) => {
        setIsSelected(selectValue)
    }
    return (
        <section className="text-gray-600 backgroundImage min-h-full body-font relative">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-1/2 md:w-2/3 mx-auto rounded-lg relative bg-white">
                    <div className='flex flex-row pl-6 pt-6 pb-10'>
                        <div className='w-2/6'>
                            <h1 className="sm:text-3xl text-2xl font-medium whitespace-nowrap title-font mb-0 text-[#243F2F]">Build Your Meal</h1>
                            <p className='text-lg text-[#80BC42]'>Each meal serves 1 adult</p>
                            <div className="flex flex-col flex-wrap mt-4">
                                <div className={`${isMonthSelected ? "hidden" : ""}`}>
                                    <div onClick={() => { onSelect(false) }} className={`p-2 ${isSeleted ? "borderInMeal" : "bg-[#80BC42]"} cursor-pointer rounded-lg flex flex-row items-center justify-center`}>
                                        <div className="w-2/6 p-2 ">
                                            <h1 className="leading-7 text-5xl pb-2 text-[#243F2F]">6</h1>
                                            <p className="text-lg text-[#243F2F] ">Meals</p>
                                        </div>
                                        <div className="w-4/6">
                                            <p className="text-lg text-center  text-[#243F2F] ">₹175.00/meal</p>
                                            <p className='text-base text-center -m-1 text-[#E91D24]'><strike>₹200.00/meal</strike></p>
                                        </div>
                                    </div>
                                    <div onClick={() => { onSelect(true) }} className={`p-2  mt-4  ${isSeleted ? "bg-[#80BC42]" : "borderInMeal"} cursor-pointer rounded-lg flex flex-row items-center justify-center`}>
                                        <div className="w-2/6 p-2 ">
                                            <h1 className="leading-7 text-5xl pb-2 text-[#243F2F]">12</h1>
                                            <p className="text-lg text-[#243F2F] ">Meals</p>
                                        </div>
                                        <div className="w-4/6">
                                            <p className="text-lg text-center  text-[#243F2F] ">₹140.00/meal</p>
                                            <p className='text-base text-center -m-1 text-[#E91D24]'><strike>₹185.00/meal</strike></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isMonthSelected ? "" : "hidden"}`}>
                                    <div onClick={() => { setIsPriceSelected(false) }} className={`p-2 ${isPriceSelected ? "borderInMeal" : "bg-[#80BC42]"} cursor-pointer rounded-lg flex items-center justify-center`}>
                                        <div className="w-full">
                                            <div className='flex items-center'>
                                                <button className={` ${isPriceSelected ? "bg-[#80BC42] text-white" : "bg-[#ffffff] text-[#243F2F] "} mx-auto text-xs  px-5 py-1 rounded-2xl items-center `}>ON TIME</button>
                                            </div>
                                            <p className="text-3xl text-center text-[#243F2F] ">₹200.00</p>
                                            <p className='text-base text-center -m-1 text-[#E91D24]'><strike>per meal</strike></p>
                                        </div>
                                    </div>
                                    <div onClick={() => { setIsPriceSelected(true) }} className={`p-2  mt-4  ${isPriceSelected ? "bg-[#80BC42]" : "borderInMeal"} cursor-pointer rounded-lg flex flex-row items-center justify-center`}>
                                        <div className="w-full">
                                            <div className='flex items-center'>
                                                <button className={` ${isPriceSelected ? "bg-[#ffffff] text-[#243F2F]" : "bg-[#80BC42] text-white"} mx-auto text-xs  px-5 py-1 rounded-2xl items-center `}>Subscription</button>
                                            </div>
                                            <p className="text-3xl text-center text-[#243F2F] ">₹175.00</p>
                                            <p className='text-base text-center -m-1 text-[#E91D24]'><strike>per meal</strike></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-2  mt-4 flex flex-row items-center justify-between'>
                                    <div onClick={() => { setIsMonthSelected(false) }} className={`flex-col ${isMonthSelected ? "" : "hidden"} cursor-pointer`}>
                                        <div className='flex flex-row justify-center'>
                                            <img src={leftarrow} className='w-4 mr-2' alt="arrow" />
                                            <p className=' text-sm text-[#243F2F]'>Previous</p>
                                        </div>
                                        <div>
                                            <img src={line} className='w-20' alt="line" />
                                        </div>
                                    </div>
                                    <div></div>
                                    <div onClick={() => { setIsMonthSelected(true) }} className='flex-col cursor-pointer'>
                                        <div className='flex flex-row justify-center'>
                                            <p className='pr-2 text-sm text-[#243F2F]'>Next</p>
                                            <img src={rightarrow} className='w-4' alt="arrow" />
                                        </div>
                                        <div>
                                            <img src={line} className='w-14' alt="line" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='w-4/6 absolute bottom-0 right-[-40px]'>
                            {isMonthSelected ?
                                <img src={mealBoy2} className='h-[450px]' alt="boy" />
                                :
                                <img src={mealBoy1} className='h-[500px]' alt="boy" />
                            }

                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}

export default Meal;