import React, { useEffect } from 'react'
import { clearCartData, clearCartResponse } from '../state/cartData'
import { useDispatch } from 'react-redux';

const PaymentSuccess = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(clearCartData())
        dispatch(clearCartResponse())
    }, [])
    return (
        <div className="flex justify-center items-center h-screen bg-[#53940f80]">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-lg">Thank you for your purchase.</p>
            </div>
        </div>
    )
}

export default PaymentSuccess
