import React from 'react'
import ladingImage from '../assets/landingbanner.png'
import sahipanir from '../assets/sahipanir.png'
const Recipes = () => {

    const items = [
        ' IY Biryani (chicken or vegetarian) (prepared)',
        '4 large tortilla wraps or rumali rotis',
        '1 cup shredded lettuce',
        '1 cup grated cheese (cheddar or any preferred cheese)',
        '1/2 cup mint mayo',
        '1/2 cup sour cream'
    ];
    const InstructionsText = [
        {
            id: 1,
            text: 'Warm the tortilla wraps or rumali rotis on a skillet for about 1-2 minutes on each side until they are pliable and warm.'
        },
        {
            id: 2,
            text: 'Spread 2 tablespoons of mint mayo on a warm tortilla or rumali roti. Add 1/2 cup biryani,  1/4 cup shredded lettuce, 1/4 cup grated cheese, and a dollop of sour cream.'
        },
        {
            id: 3,
            text: 'Fold the sides of the tortilla or rumali roti inward towards the center. Carefully roll from the bottom up, keeping the filling tightly packed. Ensure the ends are tucked in to prevent spillage.'
        },
        {
            id: 4,
            text: 'Serve hot with salsa or sour cream.'
        },

    ]
    return (
        <div className='relative -top-28'>
            <div className='bg-[#C75801]'>
                <div className='container mx-auto grid grid-cols-2 lg:grid-cols-3'>
                    <div className="col-span-1 pl-6">
                        <p className='text-[#FFFFFF] pt-4 text-lg'>{"Recipes > Biryani burrito"}</p>
                        <p className='pb-20 pt-4 text-8xl font-skillet text-[#FFFFFF]'> Biryani <br /> Burrito</p>
                        <div className='flex gap-5 pb-8' >
                            <button className='px-4 rounded py-2 bg-[#EADEC1] text-base text-[#C75801]' type='button'>Download PDF</button>
                            <button className='px-4 rounded py-2 bg-[#EADEC1] text-base text-[#C75801]' type='button'>Share Recipe</button>
                        </div>
                    </div>
                    <div className='col-span-1 lg:col-span-2'>
                        <img src={ladingImage} alt="" />
                    </div>
                </div>
            </div>
            <div className='bg-[#FAFAFA]'>
                <div className='container bg-[#FAFAFA] mx-auto grid grid-cols-3 sticky top-0'>
                    <div className='col-span-1 flex gap-x-11 py-3'>
                        <div className=''>
                            <p className='text-[#757575]'>Prep Time</p>
                            <p className='text-[#231F20] text-lg'>10 mins</p>
                        </div>
                        <div className=''>
                            <p className='text-[#757575]'>Cook Time</p>
                            <p className='text-[#231F20] text-lg'>25 mins</p>
                        </div>
                    </div>
                    <div className='col-span-2 flex justify-between items-center'>
                        <div className='border-r-2 px-10 py-3 bg-[] border-r-[#C75801]'>
                            <p className='text-lg text-[#231F20]'> Step 1 <span className='text-[#757575] text-sm'> {"(2 mins)"}</span> </p>
                        </div>
                        <div className='border-r-2 px-10 py-3 bg-[] border-r-[#C75801]'>
                            <p className='text-lg text-[#231F20]'> Step 2 <span className='text-[#757575] text-sm'> {"(2 mins)"}</span> </p>
                        </div>
                        <div className='border-r-2 px-10 py-3 bg-[] border-r-[#C75801]'>
                            <p className='text-lg text-[#231F20]'> Step 3 <span className='text-[#757575] text-sm'> {"(2 mins)"}</span> </p>
                        </div>
                        <div className='px-10 py-3 '>
                            <p className='text-lg text-[#231F20]'> Step 4 <span className='text-[#757575] text-sm'> {"(2 mins)"}</span> </p>
                        </div>
                    </div>
                </div>
                <div className='container mx-auto grid grid-cols-3'>
                    <div className='col-span-1'>
                        <p className='text-4xl py-6 font-skillet'>Ingredients</p>
                        <ol className='pr-4 pb-7'>
                            {items.map((item, index) => (
                                <div key={index} className='flex '>
                                    <p className='text-xl text-[#000000] leading-10'>{index + 1}. </p>
                                    <p className='pl-4 text-xl text-[#000000] leading-10'> {item}</p>
                                </div>
                            ))}
                        </ol>
                    </div>
                    <div className='pl-7 lg:pl-16 col-span-2'>
                        <p className='text-4xl p-6 font-skillet'>Instructions</p>
                        {InstructionsText?.map((item, i) => (
                            <div className='flex mb-5'>
                                <div className=''>
                                    <p className='text-5xl text-[#e9bc9982] font-semibold'>{item?.id}</p>
                                </div>
                                <div className='border-b ml-4 border-b-[#C6C6C6]'>
                                    <p className='text-xl pb-4 text-[#333333]  pr-40'>{item?.text}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            <div className='bg-[#FFFFFF] pt-7'>
                <div className='container mx-auto '>
                    <div className='flex justify-center items-center'>
                        <div className='pr-20'>
                            <img src={sahipanir} alt="" className='w-full  h-[400px]' />
                        </div>
                        <div className='pl-8'>
                            <h1 className='text-[#C75801] font-skillet text-4xl '>Make this recipe Instantly Yours</h1>
                            <p>Made with our </p>
                            <h1 className='text-[#333333] font-skillet text-5xl '>Shahi biryani kit</h1>
                            <p className='pb-32'>About the product</p>
                            <div className='flex gap-5 pb-8' >
                                <button className='px-4 rounded py-1 bg-[#231F20] text-sm text-[#FFFFFF]' type='button'>Add to Cart</button>
                                <button className='px-4 rounded py-1 bg-[#231F20] text-sm text-[#FFFFFF]' type='button'>Buy Noew</button>
                            </div>

                        </div>
                    </div>


                </div>
            </div>

        </div>
    )
}

export default Recipes