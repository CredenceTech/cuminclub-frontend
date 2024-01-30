import React, { useEffect, useState } from 'react'
import {
    graphQLClient,
    getPageAccessibilityQuery,
} from "../api/graphql";

const Accessibility = () => {
    const [data, setData] = useState(null)
    const fetchAccessibilityPage = async () => {
        try {
            const body = {
                handle: "accessibility-statement"
            }
            const response = await graphQLClient.request(getPageAccessibilityQuery, body)
            console.log("Product Detail", response);
            setData(response);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchAccessibilityPage()
    }, [])

    const AccessibilityBody = data?.page?.body || '';

    return (
        <section className="text-gray-600 body-font">
            <div className="container  px-5 py-24 mx-auto">
                <div className="mb-20">
                    <h1>{data?.page?.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: AccessibilityBody }} />
                </div>
            </div>
        </section>
    )
}

export default Accessibility