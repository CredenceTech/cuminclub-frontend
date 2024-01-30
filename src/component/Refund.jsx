import React, { useEffect, useState } from 'react'
import {
    graphQLClient,
    getPageRefundQuery,
} from "../api/graphql";

const Refund = () => {
    const [data, setData] = useState(null)
    const fetchRefeundPage = async () => {
        try {
            const response = await graphQLClient.request(getPageRefundQuery)
            console.log("Product Detail", response);
            setData(response);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchRefeundPage()
    }, [])

    const refeundBody = data?.shop?.refundPolicy?.body || '';

    return (
        <section className="text-gray-600 body-font">
            <div className="container  px-5 py-24 mx-auto">
                <div className="mb-20">
                    <h1>{data?.shop?.refundPolicy?.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: refeundBody }} />
                </div>
            </div>
        </section>
    )
}

export default Refund