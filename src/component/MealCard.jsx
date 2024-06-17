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
        }} className={`pb-16 pt-5 px-10 bg-[#FBAE36]  cursor-pointer rounded-xl`}>
            <div className="w-full">
                <p className={`text-3xl ${item?.id === selected?.id ? "text-[#fff]" : 'text-[#53940F]'} text-center `}> {item?.noMeal}</p>
                <p className={`text-base   text-[#333333] text-center -m-1 `}>{item?.price}</p>
            </div>
        </div>
    )
}

export default MealCard