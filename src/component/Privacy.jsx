import React, { useEffect, useState } from 'react'
import {
    graphQLClient,
    getPagePrivacyPolicyQuery,
} from "../api/graphql";
const Privacy = () => {
    const [data, setData] = useState(null)
    const fetchPrivacyPage = async () => {
        try {
            const response = await graphQLClient.request(getPagePrivacyPolicyQuery)
            console.log("Product Detail", response);
            setData(response);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchPrivacyPage()
    }, [])

    const privacyPolicyBody = data?.shop?.privacyPolicy?.body || '';

    return (
        <section className="text-gray-600 body-font">
            <div className="container  px-5 py-24 mx-auto">
                <div className="mb-20">
                    <h1 className='mb-2 text-[24px] font-bold'>{data?.shop?.privacyPolicy?.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: privacyPolicyBody }} />
                </div>
            </div>
        </section>
    )
}

export default Privacy