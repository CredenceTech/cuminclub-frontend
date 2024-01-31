import React from 'react'
import { useDispatch } from 'react-redux'
import { addMeal } from '../state/mealdata'

const MealCard = ({ item, selected, setSelected, buttonTrigger }) => {
    const dispatch = useDispatch()

    return (
        <div onClick={() => {
            if(buttonTrigger){
               dispatch(addMeal(item))
            }
            setSelected(item)
        }} className={`p-3 ${item?.id === selected?.id ? "bg-[#53940F]" : 'bg-white border border-[#53940F]'}  cursor-pointer rounded-lg flex items-center justify-center`}>
            <div className="w-full">
                <p className={`text-3xl ${item?.id === selected?.id ? "text-[#fff]" : 'text-[#53940F]'} text-center `}> {item?.noMeal}</p>
                <p className={`text-base ${item?.id === selected?.id ? "text-[#fff]" : 'text-[#53940F]'} text-center -m-1 `}>{item?.price}<strike className="pl-2 text-gray-300">{item?.discountPrice}</strike></p>
            </div>
        </div>
    )
}

export default MealCard