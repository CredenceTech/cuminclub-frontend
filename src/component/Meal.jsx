import React, { useState } from 'react'
import rightarrow from "../assets/rightArrow.svg"
import mealThreeImage from "../assets/mealThreeImage.svg";
import MealCard from './MealCard';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"

const Meal = ({ data, message, url }) => {
    const [selected, setSelected] = useState(data[0]);

    return (
        <section className="text-gray-600 body-font h-96 relative">
            <div className="container px-5 py-4 mx-auto">
                <motion.div initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="lg:w-1/2 md:w-2/3  mx-auto rounded-lg bg-white">
                    <div className='flex flex-col p-4 justify-center '>
                        <div className='flex justify-center items-center '>
                            <img src={mealThreeImage} className='h-[200px] w-[400px]' alt="meal" />
                        </div>
                        <div className=''>
                            <p className=' text-[#E91D24]'>{message} </p>
                            <div className="flex flex-row  mx-auto overflow-x-auto no-scrollbar  gap-2  mt-4">
                                {
                                    data?.map((item) => {
                                        return (<MealCard key={item?.id} item={item} selected={selected} setSelected={setSelected} />)
                                    })
                                }
                            </div>
                            <div className='mt-4 flex justify-center '>
                                <Link to={url} className='flex-col cursor-pointer  border border-[#E91D24] hover:bg-[#53940F]  rounded px-5 py-2'>
                                    <div className='flex flex-row justify-center'>
                                        <p className='pr-2 text-sm text-[#E91D24]'>Next</p>
                                        <img src={rightarrow} className='w-4 text-[#E91D24]' alt="arrow" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Meal