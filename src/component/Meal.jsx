import React, { useState } from 'react'
import mealThreeImage from "../assets/mealThreeImage.png";
import food_bag from "../assets/food_bag.png";
import food_thela from "../assets/food_thela.png";
import MealCard from './MealCard';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"

const Meal = ({ data, message, url, buttonTrigger = false }) => {
    const [selected, setSelected] = useState(data[0]);

    return (
        <section className="text-gray-600 body-font h-[85vh] lg:min-h-[85vh] bg-[#F1663C] relative">
            <div className="container px-5 py-4 mx-auto">
                <motion.div initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="lg:w-5/6 md:w-5/6 md:mt-6 flex justify-center items-center  mx-auto rounded-lg bg-[#F1663C]">
                    <div className='flex flex-col p-4 justify-center '>
                        <div className='flex mt-5 md:mt-14 justify-center items-center '>
                            <p className='text-[#FAFAFA] text-xl font-skillet font-medium md:text-4xl'>{message}</p>
                        </div>
                        <div className=' mt-6 md:mt-16'>
                            <div className="flex flex-col md:flex-row  mx-auto overflow-x-auto  md:w-[400px] lg:w-full no-scrollbar gap-2 lg:gap-x-10  mt-4">
                                {
                                    data?.map((item) => {
                                        return (<MealCard key={item?.id} item={item} selected={selected} setSelected={setSelected} buttonTrigger={buttonTrigger} />)
                                    })
                                }
                            </div>
                            <div className='mt-5 lg:mt-14 flex justify-center '>
                                <Link to={url} className='flex-col cursor-pointer  bg-[#EADEC1]  rounded-lg px-10 py-2'>
                                    <div className='flex flex-row justify-center'>
                                        <p className='pr-2 text-lg font-medium text-[#231F20]'>Continue</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className='hidden sm:flex'>
                <img src={food_bag} className=' h-[300px] w-[250px] absolute bottom-0 left-0' alt="meal" />
                <img src={food_thela} className=' h-[250px] w-[200px] absolute bottom-0 right-0' alt="meal" />
            </div>
        </section>
    )
}

export default Meal