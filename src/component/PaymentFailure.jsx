import React from "react";

function PaymentFailure() {
    return (
        <div className="flex justify-center items-center h-screen bg-[#e91d249c]">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Payment Failed!</h1>
                <p className="text-lg">Sorry, something went wrong with your payment.</p>
            </div>
        </div>
    );
}

export default PaymentFailure;
