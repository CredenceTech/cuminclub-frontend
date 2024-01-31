import React from 'react'
import Meal from '../component/Meal'

const Subscription = () => {
    const data = [
        {
            id: 1,
            noMeal: "One Time",
            price: "₹1210.12/meal",
            discountPrice: "₹1110.12/meal"
        },
        {
            id: 2,
            noMeal: "Subscription",
            price: "₹2110.12/meal",
            discountPrice: "₹2510.12/meal"
        },
    ]
    return (
        <>
            <Meal data={data} message={'Select Your Subscriptions'} url={"/products"} />
        </>
    )
}

export default Subscription