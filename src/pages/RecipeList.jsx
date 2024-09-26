import React from 'react'
import biryaniBurrito from '../assets/recipeimages/BiryaniBurrito.png';
import Rajmatacos from '../assets/recipeimages/Rajmatacos.png';
import Dalparatha from '../assets/recipeimages/Dalparatha.png';
import DalAmritsari from '../assets/recipeimages/DalAmritsari.png';
import Burritobowl from '../assets/recipeimages/Burritobowl.png';
import Cholesliders from '../assets/recipeimages/Cholesliders.png';
import DalMakhaniveggiePulao from '../assets/recipeimages/DalMakhaniveggiePulao.png';
import Palakkhichdi from '../assets/recipeimages/Palakkhichdi.png';
import Kormadelightpizza from '../assets/recipeimages/Kormadelightpizza.png';
import Cholechaat from '../assets/recipeimages/Cholechaat.png';


const RecipeList = () => {
    const RecipesList = [
        {
            id: 1,
            name: 'Biryani Burrito',
            img: biryaniBurrito,
            timing: '10 Minutes'
        },
        {
            id: 2,
            name: 'Rajma tacos',
            img: Rajmatacos,
            timing: '10 Minutes'
        },
        {
            id: 3,
            name: 'Dal paratha',
            img: Dalparatha,
            timing: '10 Minutes',
            sahipanirkit: 'Shahi biryani kit'

        },
        {
            id: 4,
            name: 'Dal Amritsari',
            img: DalAmritsari,
            timing: '10 Minutes'
        },
        {
            id: 5,
            name: 'Burrito bowl',
            img: Burritobowl,
            timing: '10 Minutes'
        },
        {
            id: 6,
            name: 'Chole sliders',
            img: Cholesliders,
            timing: '10 Minutes'
        },
        {
            id: 7,
            name: 'Dal Makhani veggie Pulao',
            img: DalMakhaniveggiePulao,
            timing: '10 Minutes'
        },
        {
            id: 8,
            name: 'Palak khichdi',
            img: Palakkhichdi,
            timing: '10 Minutes',
            sahipanirkit: 'Shahi biryani kit'
        },
        {
            id: 9,
            name: 'Korma delight pizza',
            img: Kormadelightpizza,
            timing: '10 Minutes',
            sahipanirkit: 'Shahi biryani kit'
        },
        {
            id: 10,
            name: 'Chole chaat',
            img: Cholechaat,
            timing: '10 Minutes',
            sahipanirkit: 'Shahi biryani kit'
        },
    ]
    return (
        <div className='relative'>
            <div className="bg-[#FAFAFA]">
                <div className="px-[60px] grid pt-2 grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-1">
                        <p className="text-[#2B2B2B] pt-4 font-regola-pro text-[12px] leading-[9.55px] font-[300]">{"Home > Recipes"}</p>
                    </div>
                    <div className="col-span-1 lg:col-span-2"></div>
                    <div className="col-span-2 lg:col-span-3  pt-4">
                        <div className="flex items-center gap-x-10">
                            <div>
                                <label htmlFor="type-select" className="block">
                                    <h2 className="text-[#757575] font-regola-pro text-[24px] leading-[30.91px] font-[300]">Type</h2>
                                </label>
                                <select
                                    id="type-select"
                                    className="mt-2  bg-[#FAFAFA] text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]" >
                                    <option className='text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]' value="" disabled selected>
                                        Select
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product-select" className="block">
                                    <h2 className="text-[#757575] font-regola-pro text-[24px] leading-[30.91px] font-[300]">Products</h2>
                                </label>
                                <select
                                    id="product-select"
                                    className="mt-2  bg-[#FAFAFA] text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]" >
                                    <option className='text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]' value="" disabled selected>
                                        Select
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#FAFAFA]">
                <div className="pl-[60px] pt-[60px] pr-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {RecipesList.map((recipe) => (
                        <div key={recipe.id} className="bg-[#FFFFFF] ">
                            <img
                                src={recipe.img}
                                alt={recipe.name}
                                className="w-full h-50 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-[#333333] font-skillet text-[40px] leading-[26px] font-[400]">
                                    {recipe.name}
                                </h3>
                                <div className='flex justify-between'>
                                    <div className="flex items-center mt-6 text-gray-600">
                                        <svg
                                            width="21"
                                            height="21"
                                            viewBox="0 0 21 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg" >
                                            <path
                                                d="M10.5016 6.99971V11.8997H14.0016M8.40156 0.699707H12.6016M10.5016 3.49971C5.86237 3.49971 2.10156 7.26052 2.10156 11.8997C2.10156 16.5389 5.86237 20.2997 10.5016 20.2997C15.1408 20.2997 18.9016 16.5389 18.9016 11.8997C18.9016 7.26052 15.1408 3.49971 10.5016 3.49971Z"
                                                stroke="#1D1929"
                                                strokeWidth="1.4"
                                            />
                                        </svg>
                                        <span className="text-[#393939] font-regola-pro text-[24px] leading-[15.6px] font-[300] pl-3">
                                            {recipe.timing}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-6 text-gray-600">
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4992 20.3002L0.699219 10.5002L10.4992 0.700195H18.8992C19.6724 0.700195 20.2992 1.327 20.2992 2.1002V10.5002L10.4992 20.3002Z" stroke="#1D1929" stroke-width="1.4" stroke-linejoin="round" />
                                            <path d="M13.2992 6.3002C13.2992 7.07339 13.926 7.7002 14.6992 7.7002C15.4724 7.7002 16.0992 7.07339 16.0992 6.3002C16.0992 5.527 15.4724 4.9002 14.6992 4.9002C13.926 4.9002 13.2992 5.527 13.2992 6.3002Z" stroke="#1D1929" stroke-width="1.4" stroke-linejoin="round" />
                                        </svg>

                                        <span className="text-[#393939] font-regola-pro text-[24px] leading-[15.6px] font-[300] pl-3">
                                            {recipe?.sahipanirkit}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RecipeList