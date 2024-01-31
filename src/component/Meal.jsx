import React, { useState } from 'react'
import mealThreeImage from "../assets/mealThreeImage.png";
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
                    className="lg:w-5/6 md:w-5/6 md:h-[75vh] flex justify-center items-center  mx-auto rounded-lg bg-white">
                    <div className='flex flex-col p-4 justify-center '>
                        <div className='flex mt-5 md:mt-14 justify-center items-center '>
                            <img src={mealThreeImage} className='h-[100px] md:h-[170px] w-[200px] md:w-[400px] lg:w-[500px]' alt="meal" />
                        </div>
                        <div className=' mt-6 md:mt-16'>
                            <p className=' text-[#E91D24]'>{message} </p>
                            <div className="flex flex-col md:flex-row  mx-auto overflow-x-auto  md:w-[400px] lg:w-full no-scrollbar  gap-2  mt-4">
                                {
                                    data?.map((item) => {
                                        return (<MealCard key={item?.id} item={item} selected={selected} setSelected={setSelected} />)
                                    })
                                }
                            </div>
                            <div className='mt-4 flex justify-center '>
                                <Link to={url} className='flex-col cursor-pointer  border border-[#E91D24]  rounded px-5 py-2'>
                                    <div className='flex flex-row justify-center'>
                                        <p className='pr-2 text-sm text-[#E91D24]'>Next</p>
                                        <svg width="21" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.0693 0.624305L23.6407 9.08584C23.8 9.24287 23.9264 9.42937 24.0127 9.63467C24.0989 9.83997 24.1433 10.06 24.1433 10.2823C24.1433 10.5046 24.0989 10.7246 24.0127 10.9299C23.9264 11.1352 23.8 11.3217 23.6407 11.4788L15.0693 19.9403C14.9101 20.0974 14.7211 20.2221 14.5132 20.3071C14.3052 20.3921 14.0823 20.4359 13.8573 20.4359C13.6322 20.4359 13.4093 20.3921 13.2013 20.3071C12.9934 20.2221 12.8044 20.0974 12.6453 19.9403C12.4861 19.7832 12.3598 19.5967 12.2737 19.3914C12.1876 19.1861 12.1432 18.966 12.1432 18.7438C12.1432 18.5216 12.1876 18.3016 12.2737 18.0963C12.3598 17.891 12.4861 17.7045 12.6453 17.5474L18.2904 11.9746L1.85725 11.9746C1.40259 11.9746 0.966559 11.7963 0.64507 11.4789C0.323579 11.1616 0.142966 10.7311 0.142966 10.2823C0.142966 9.83348 0.323579 9.40303 0.64507 9.08566C0.966559 8.76829 1.40259 8.59 1.85725 8.59L18.2904 8.59L12.6453 3.01723C12.4855 2.86043 12.3587 2.674 12.2722 2.46867C12.1857 2.26334 12.1412 2.04315 12.1412 1.82077C12.1412 1.59838 12.1857 1.37819 12.2722 1.17286C12.3587 0.967528 12.4855 0.781102 12.6453 0.624305C12.8043 0.467011 12.9932 0.342225 13.2012 0.257083C13.4092 0.171943 13.6321 0.128118 13.8573 0.128118C14.0824 0.128118 14.3053 0.171943 14.5133 0.257083C14.7213 0.342225 14.9102 0.467012 15.0693 0.624305Z"
                                                fill="#E91D24" />
                                        </svg>
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