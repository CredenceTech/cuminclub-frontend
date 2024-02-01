import React from 'react'
import Meal from '../component/Meal'
import { useSelector } from 'react-redux'
import { selectMealItems } from '../state/mealdata'

const Subscription = () => {
    const mealData = useSelector(selectMealItems)

    console.log(mealData, "Meal Data")
    return (
        <>
            <Meal data={mealData.subscriptionType} message={'Select Your Subscriptions'} url={"/products"} />
        </>
    )
}

export default Subscription