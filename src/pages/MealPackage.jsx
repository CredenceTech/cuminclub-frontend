import React, { useState } from 'react'
import Meal from '../component/Meal';

const MealPackage = () => {
    const data = [
        {
            id: 1,
            noMeal: "5 Meals",
            price: "₹1210.12/meal",
            discountPrice: "₹1110.12/meal",
            no: 5
        },
        {
            id: 2,
            noMeal: "10 Meals",
            price: "₹2110.12/meal",
            discountPrice: "₹2510.12/meal",
            no: 10
        },

    ]

    return (
        <>
            <Meal data={data} message={'Select Your Meal Package'} url={"/subscription"} />
        </>
    )
}

export default MealPackage;