import React from 'react'
import { useDispatch } from 'react-redux'
import { addMeal } from '../state/mealdata'

const MealCard = ({ item, selected, setSelected, buttonTrigger }) => {
    const dispatch = useDispatch()

    return (
        <div onClick={() => {
            if (buttonTrigger) {
                dispatch(addMeal(item))
            }
            setSelected(item)
        }} className={`pb-16 pt-5 px-10 whitespace-nowrap bg-[#FBAE36] transform transition-transform duration-300 hover:scale-110 cursor-pointer rounded-xl`}>
            <div className="w-full">
                <p className={`text-3xl lg:text-5xl ${item?.id === selected?.id ? "text-[#53940F]" : 'text-[#FFF]'} font-skillet text-center `}> {item?.noMeal}</p>
                <p className={`text-lg font-skillet  text-[#333333] text-center -m-1 `}>{item?.price}</p>
            </div>
        </div>
    )
}

export default MealCard