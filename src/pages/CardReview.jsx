import React from 'react'
import product from '../assets/Dish-1.jpg'
const CardReview = () => {
    return (
        <div className='bg-[#EFE9DA] '>
            <div className='container mx-auto min-h-[85vh]'>
                <h1 className='text-2xl md:text-6xl p-4 font-skillet text-gray-900 pt-9'>Review your Cart</h1>
                <div className='flex flex-col gap-4 md:gap-6 md:flex-row justify-between'>
                    <div className='w-full px-4 md:w-1/2'>
                        <div className='flex  items-center justify-between py-3 lg:mr-24 border-b border-black'>
                            <div className='flex flex-row items-center'>
                                <img src={product} alt="" className='h-[90px] w-[90px] rounded-lg' />
                                <div className='ml-4'>
                                    <h1 className='text-xl md:text-4xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                                    <p className='text-xl font-skillet text-gray-600'>₹ 99</p>
                                </div>
                            </div>
                            <div>
                                <button type='button' className='text-[#F15E2A] font-futura text-xl border-b border-b-[#F15E2A]'>Remove</button>
                            </div>
                        </div>
                        <div className='flex  items-center justify-between py-3 lg:mr-24 border-b border-black'>
                            <div className='flex flex-row items-center'>
                                <img src={product} alt="" className='h-[90px] w-[90px] rounded-lg' />
                                <div className='ml-4'>
                                    <h1 className='text-xl md:text-4xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                                    <p className='text-xl font-skillet text-gray-600'>₹ 99</p>
                                </div>
                            </div>
                            <div>
                                <button type='button' className='text-[#F15E2A] font-futura text-xl border-b border-b-[#F15E2A]'>Remove</button>
                            </div>
                        </div>
                        <div className='flex  items-center justify-between py-3 lg:mr-24 border-b border-black'>
                            <div className='flex flex-row items-center'>
                                <img src={product} alt="" className='h-[90px] w-[90px] rounded-lg' />
                                <div className='ml-4'>
                                    <h1 className='text-xl md:text-4xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                                    <p className='text-xl font-skillet text-gray-600'>₹ 99</p>
                                </div>
                            </div>
                            <div>
                                <button type='button' className='text-[#F15E2A] font-futura text-xl border-b border-b-[#F15E2A]'>Remove</button>
                            </div>
                        </div>
                        <div className='flex  items-center justify-between py-3 lg:mr-24 border-b border-black'>
                            <div className='flex flex-row items-center'>
                                <img src={product} alt="" className='h-[90px] w-[90px] rounded-lg' />
                                <div className='ml-4'>
                                    <h1 className='text-xl md:text-4xl font-skillet text-gray-900 '>Pav Bhaji</h1>
                                    <p className='text-xl font-skillet text-gray-600'>₹ 99</p>
                                </div>
                            </div>
                            <div>
                                <button type='button' className='text-[#F15E2A] font-futura text-xl border-b border-b-[#F15E2A]'>Remove</button>
                            </div>
                        </div>
                    </div>
                    <div className='bg-[#EADEC1] p-6 w-full h-auto md:w-1/2 rounded-2xl'>
                        <div className="flex flex-row justify-between">
                            <p className="text-base font-skillet  lg:text-2xl">Subtotal</p>
                            <p className="text-lg font-skillet lg:text-2xl">₹ 850.00</p>
                        </div>
                        <div className="flex mt-3 flex-row justify-between">
                            <p className="text-lg font-skillet  lg:text-2xl">Total</p>
                            <p className="text-xl text-[#279C66] font-skillet lg:text-3xl">₹ 850.00</p>
                        </div>
                        <p className='text-[#757575] text-end font-futura'>Tax included and shipping calculated at checkout</p>
                        <div className="flex mt-8 flex-row gap-3 flex-wrap">
                            <div className='h-[170px] w-[154px] rounded-lg bg-[#EFE9DA]'>
                                <p className='px-5 py-9 text-[#757575]'>Standard</p>
                            </div>
                            <div className='h-[170px] w-[154px] rounded-lg bg-[#EFE9DA]'>
                                <p className='px-5 py-9 text-[#757575]'>Express</p>
                            </div>
                            <div className='h-[170px] w-[154px] rounded-lg bg-[#EFE9DA]'>
                                <p className='px-5 py-9 text-[#757575]'>Bulk</p>
                            </div>
                        </div>
                        <button type='button' className='rounded-lg font-skillet text-2xl lg:text-4xl mt-4 bg-gray-900 text-gray-100 w-full py-4'>Checkout</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CardReview