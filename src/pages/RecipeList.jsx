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
            timing: '10 Minutes'
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
            timing: '10 Minutes'
        },
        {
            id: 9,
            name: 'Korma delight pizza',
            img: Kormadelightpizza,
            timing: '10 Minutes'
        },
        {
            id: 10,
            name: 'Chole chaat',
            img: Cholechaat,
            timing: '10 Minutes'
        },
    ]
    return (
        <div className='relative z-[51]'>
            <div className="bg-[#FAFAFA]">
                <div className="container mx-auto grid grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-1 pl-6">
                        <p className="text-[#2B2B2B] pt-4 text-lg">{"Home > Recipes"}</p>
                    </div>
                    <div className="col-span-1 lg:col-span-2"></div>
                    <div className="col-span-2 lg:col-span-3 pl-6 pt-4">
                        <div className="flex space-x-8 items-center">
                            <div>
                                <label htmlFor="type-select" className="block">
                                    <h2 className="text-gray-600">Type</h2>
                                </label>
                                <select
                                    id="type-select"
                                    className="mt-2 p-2 border border-gray-300 rounded" >
                                    <option value="" disabled selected>
                                        Select
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product-select" className="block">
                                    <h2 className="text-gray-600">Products</h2>
                                </label>
                                <select
                                    id="product-select"
                                    className="mt-2 p-2 border border-gray-300 rounded" >
                                    <option value="" disabled selected>
                                        Select
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#FAFAFA]">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {RecipesList.map((recipe) => (
                        <div key={recipe.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img
                                src={recipe.img}
                                alt={recipe.name}
                                className="w-full h-50 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {recipe.name}
                                </h3>
                                <div className="flex items-center mt-2 text-gray-600">
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
                                    <span className="ml-2">
                                        {recipe.timing}
                                    </span>
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