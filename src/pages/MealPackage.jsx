import React from 'react'
import Meal from '../component/Meal';

const MealPackage = () => {
    const data = [
        {
            id: 1,
            noMeal: "10 Meals",
            price: "₹2110.12/meal",
            discountPrice: "₹2510.12/meal",
            no: 10,
            subscriptionType: [
                {
                    id: 1,
                    type: "oneTime",
                    noMeal: "One Time",
                    price: "₹2110.12/meal",
                    discountPrice: "₹2510.12/meal",
                },
                {
                    id: 2,
                    type: "subscription",
                    noMeal: "Subscription",
                    price: "₹2110.12/meal",
                    discountPrice: "2000.12/meal",
                }
            ]
        },
        {
            id: 2,
            noMeal: "5 Meals",
            price: "₹1210.12/meal",
            discountPrice: "₹1110.12/meal",
            no: 5,
            subscriptionType: [
                {
                    id: 1,
                    type: "oneTime",
                    noMeal: "One Time",
                    price: "₹1210.12/meal",
                    discountPrice: "₹1110.12/meal",
                },
                {
                    id: 2,
                    type: "subscription",
                    noMeal: "Subscription",
                    price: "₹1210.12/meal",
                    discountPrice: "₹1000.12/meal",
                }
            ]
        },
    ]

    return (
        <>
            <Meal data={data} message={'Select Your Meal Package'} url={"/subscription"} buttonTrigger = {true} />
        </>
    )
}

export default MealPackage;