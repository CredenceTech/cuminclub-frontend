import React from 'react'
import Meal from '../component/Meal';

const MealPackage = () => {
    const data = [
        {
            id: 1,
            noMeal: "6 Meals",
            price: "for ₹999.00",
            discountPrice: "₹2510.12/meal",
            no: 6,
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
            noMeal: "12 Meals",
            price: "for ₹999.00",
            discountPrice: "₹1110.12/meal",
            no: 12,
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
        {
            id: 3,
            noMeal: "18 Meals",
            price: "for ₹999.00",
            discountPrice: "₹1110.12/meal",
            no: 18,
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
            <Meal data={data} message={'Select Your Meal Package'} url={"/products"} buttonTrigger={true} />
        </>
    )
}

export default MealPackage;