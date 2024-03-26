import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { customerAccessTokenData, userEmails } from '../state/user';
import { fetchCustomerInfoQuery, graphQLClient } from '../api/graphql';
import LoadingAnimation from './Loader';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DataNotFound from './DataNotFound';

const Subscription = () => {
    const [data, setData] = useState(null);
    const loginUserCustomerId = useSelector(customerAccessTokenData);
    const [isLoading, setIsLoading] = useState(false);
    // const [userDetail, setUserDetail] = useState(null);
    const nagivate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [holdDay, setHoldDay] = useState(0);
    const [subscriptionId, setSubscriptionId] = useState('');
    const [error, setError] = useState('');
    const [pauseRespo, setPauseRespo] = useState(null);
    const [resumeRespo, setResumeRespo] = useState(null); 
    const userEmail = useSelector(userEmails);

    console.log(userEmail, "User Email")

    useEffect(() => {
        if (!loginUserCustomerId) {
            nagivate("/login");
        }
    }, [loginUserCustomerId])

    // const getCustomerDetail = async () => {
    //     setIsLoading(true);
    //     const body = {
    //         customerAccessToken: loginUserCustomerId,
    //     }
    //     try {
    //         const response = await graphQLClient.request(fetchCustomerInfoQuery, body);
    //         setUserDetail(response)
    //         setIsLoading(false);
    //     } catch (error) {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (loginUserCustomerId) {
    //         getCustomerDetail()
    //     }
    // }, [])

    const fetchSubscription = async (userData) => {
        setIsLoading(true);
        try {
            const url = `${import.meta.env.VITE_SHOPIFY_API_URL}/stripe/get`;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            setIsLoading(false);
            const data = await response.json();
            setData(data?.data);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching Get Store Detail:', error);
        }
    };

    useEffect(() => {
        const body = {
            email: userEmail,
            limit: 10
        }

        if (userEmail) {
            fetchSubscription(body);
        }
    }, [userEmail]);

    function formatDate(isoDateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(isoDateString).toLocaleDateString(undefined, options);
    }
    function formatDateInMilisecond(isoDateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(isoDateString * 1000).toLocaleDateString(undefined, options);
    }
    const handleCancel = () => {
        setShowAlert(false);
        setSubscriptionId(null);
        setError('');
        setHoldDay(0);
    }

    useEffect(() => {
        if (pauseRespo?.success) {
            toast.success(pauseRespo?.message)
            setShowAlert(false);
            setHoldDay(0);
            const body = {
                // email: userDetail?.customer?.email,
                email: userEmail,
                limit: 10
            }
            if (userEmail) {
                fetchSubscription(body);
            }
        }
    }, [pauseRespo, userEmail])

    useEffect(() => {
        if (resumeRespo?.success) {
            toast.success(resumeRespo?.message)
            const body = {
                // email: userDetail?.customer?.email,
                email: userEmail,
                limit: 10
            }
            if (userEmail) {
                fetchSubscription(body);
            }
        }
    }, [resumeRespo, userEmail])

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!holdDay) {
            setError("No. of pause day is required")
            return
        }
        if (!subscriptionId) {
            toast.error("Subscription id is required");
            return
        }

        if (holdDay) {
            setIsLoading(true);
            try {
                const body = {
                    days: holdDay,
                    subscription_id: subscriptionId
                }
                const url = `${import.meta.env.VITE_SHOPIFY_API_URL}/stripe/pause`;
                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(body)
                });
                setIsLoading(false);
                const data = await response.json();
                setPauseRespo(data);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching Get Store Detail:', error);
            }
        }
    }

    const handleResume = async (subscriptionId) => {
        setIsLoading(true);
        try {
            const body = {
                subscription_id: subscriptionId
            }
            const url = `${import.meta.env.VITE_SHOPIFY_API_URL}/stripe/resume`;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            setIsLoading(false);
            const data = await response.json();
            setResumeRespo(data);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching Get Store Detail:', error);
        }
    }

    const handlePause = (subscriptionId) => {
        setShowAlert(true)
        setSubscriptionId(subscriptionId)
    }

    console.log(data, "Data")

    return (
        <>
            {isLoading ? <LoadingAnimation /> :
            data?.length === 0 ? <DataNotFound/> :
            <section className="body-font relative">
                <div className="container p-5 pt-10 mx-auto">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Subscription expire
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Total amount
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((item, i) => (
                                    <tr className="odd:bg-white  even:bg-gray-50  border-b " key={i}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                            {item?.customer_details?.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {formatDateInMilisecond(item?.expires_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item?.amount_total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{item?.pause_collection ? <span onClick={() => { handleResume(item?.subscription) }} className="px-2 py-1 font-semibold cursor-pointer leading-tight text-gray-800 bg-gray-200 rounded-sm">Resume</span> : <span onClick={() => { handlePause(item?.subscription) }} className="px-2 py-1 font-semibold cursor-pointer leading-tight text-green-700 bg-green-100 rounded-sm">Pause</span>}</div>
                                            {!item?.pause_collection && <p className="font-medium text-gray-800 ">Next Billing Date:- {formatDateInMilisecond(item?.next_billing_date)}</p>}
                                            {item?.pause_collection && <p className="font-medium text-gray-800 ">Resume Date:- {formatDate(item?.resume_date)}</p>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section> }
            {/* model for pause subscription */}
            <div className={`fixed inset-0 h-full w-full z-[300] flex items-center justify-center ${showAlert ? 'visible' : 'hidden'}`}>
                <div className="bg-gray-900 bg-opacity-50  absolute inset-0"></div>
                <div className="relative bg-white w-2/3 md:w-1/3 rounded-lg shadow ">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                        <h3 className="text-xl font-semibold text-gray-900 ">
                            Pause your subscription.
                        </h3>
                        <button onClick={handleCancel} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" autoComplete='off' onSubmit={handleForgotPassword}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Enter hold day in number</label>
                                <input type="number" name="email" id="email" value={holdDay}  onChange={(e) => { 
                                    const newValue = e.target.value <= 0 ? 0 : e.target.value; 
                                    setHoldDay(newValue); 
                                    setError('') 
                                }} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50" placeholder="enter hold day in number." />
                            </div>
                            {error && <p className="block text-red-600">{error}</p>}
                            <button type="submit" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Subscription