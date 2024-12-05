import React, { useEffect, useState } from 'react'
import { getPageCancellationPolicyQuery, graphQLClient } from '../api/graphql';

export const CancellationPolicy = () => {
    const [data, setData] = useState(null)
    const fetchCancellationPolicyPage = async () => {
        try {
            const body = {
                handle: "cancellation-policy"
            }
            const response = await graphQLClient.request(getPageCancellationPolicyQuery, body)
            setData(response);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchCancellationPolicyPage()
    }, [])

    const CancellationBody = data?.page?.body || '';
  return (
    <section className="text-gray-600 body-font">
    <div className="container  px-5 py-24 mx-auto">
        <div className="mb-20">
            <h1 className='mb-2 text-[24px] font-bold'>{data?.page?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: CancellationBody }} />
        </div>
    </div>
</section>
  )
}
