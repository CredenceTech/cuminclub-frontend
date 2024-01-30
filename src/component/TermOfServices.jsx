import React, { useEffect, useState } from 'react'
import {
    graphQLClient,
    getPageTermOfServiceQuery,
} from "../api/graphql";

const TermOfServices = () => {
    const [data, setData] = useState(null)
    const fetchTermOfServicesPage = async () => {
        try {
            const response = await graphQLClient.request(getPageTermOfServiceQuery)
            console.log("Product Detail", response);
            setData(response);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchTermOfServicesPage()
    }, [])

    const termOfServiceBody = data?.shop?.termsOfService?.body || '';

    return (
        <section className="text-gray-600 body-font">
            <div className="container  px-5 py-24 mx-auto">
                <div className="mb-20">
                    <h1>{data?.shop?.termsOfService?.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: termOfServiceBody }} />
                </div>
            </div>
        </section>
    )
}

export default TermOfServices