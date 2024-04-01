import React, { useEffect, useState } from 'react'
import {
    graphQLClient,
    getCartQuery,
    updateCartItemMutation,
    fetchCustomerInfoQuery,
    registerAccountMutation,
    signInMutation,
    createAddressMutation,
    createCheckoutURLMutation,
    checkoutConnectWithCustomerMutation,
} from "../api/graphql";
import plus from "../assets/cross.svg"
import OrderProduct from '../component/OrderProduct'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { cartData, selectCartResponse, setCartResponse } from "../state/cartData";
import LoadingAnimation from '../component/Loader';
import { addCustomerAccessToken, addUserId, customerAccessTokenData, userEmails } from '../state/user';
import { filterData } from '../state/selectedCountry';
import toast from 'react-hot-toast';


const WithoutLoginCheckout = () => {
    const [coupon, setCoupon] = useState("");
    const [isCouponCodeApply, setIsCouponCodeApply] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const cartDatas = useSelector(cartData);
    const loginUserCustomerId = useSelector(customerAccessTokenData);
    const dispatch = useDispatch();
    const cartResponse = useSelector(selectCartResponse);
    const [isLoading, setIsLoading] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
    const [isMoreAddress, setIsMoreAddress] = useState(false);
    const filterDatas = useSelector(filterData);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState({});
    const userEmail = useSelector(userEmails);
    useEffect(() => {
        if (loginUserCustomerId) {
            setIsLogin(true)
        }
    }, [loginUserCustomerId])

    const fetchData = async () => {
        const body = {
            cartId: cartDatas?.cartCreate?.cart?.id,
        }
        try {
            const response = await graphQLClient.request(getCartQuery, body)
            dispatch(setCartResponse(response));
        } catch (error) {
        }
    };

    const getCustomerDetail = async () => {
        setIsLoading(true);
        const body = {
            customerAccessToken: loginUserCustomerId,
        }
        try {
            const response = await graphQLClient.request(fetchCustomerInfoQuery, body);
            setUserDetail(response)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (loginUserCustomerId) {
            getCustomerDetail()
        }
    }, [loginUserCustomerId])

    useEffect(() => {
        fetchData()
    }, [cartDatas]);

    useEffect(() => {
        fetchData()
    }, [cartResponse?.cart?.estimatedCost?.totalAmount?.amount])


    useEffect(() => {
        if (userDetail?.customer?.addresses?.edges.length == 0) {
            setIsMoreAddress(true);
        }
    }, [userDetail])


    const handleAddToCart = (productId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        if (cartDatas === null) {
            addToCart({ merchandiseId: productId, quantity: 1 })
        }

        const productInCart = cartResponse?.cart?.lines?.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            updateCartItem(cartId, { id: id, quantity: quantityInCart + 1 }, productId)
        } else {
            const cartId = cartDatas?.cartCreate?.cart?.id
            updateCart(cartId, { merchandiseId: productId, quantity: 1 })
        }
    };

    const updateCartItem = async (cartId, cartItem, id) => {
        const params = {
            "cartId": cartId,
            "lines": cartItem
        }
        const response = await graphQLClient.request(updateCartItemMutation, params);
        dispatch(setCartResponse(response.cartLinesUpdate));
        setLoading((prevLoading) => ({
            ...prevLoading,
            [id]: false,
        }));
    }

    const updateCart = async (cartId, cartItem) => {
        const params = {
            "cartId": cartId,
            "lines": [
                cartItem
            ]
        }
        const response = await graphQLClient.request(updateCartMutation, params);
        dispatch(setCartResponse(response.cartLinesAdd));
        setLoading((prevLoading) => ({
            ...prevLoading,
            [cartItem.merchandiseId]: false,
        }));
    }

    const handleRemoveFromCart = (productId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        const productInCart = cartResponse.cart.lines.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            updateCartItem(cartId, { id: id, quantity: quantityInCart === 1 ? 0 : quantityInCart - 1 }, productId)
        }
    };

    const quantities = cartResponse?.cart?.lines?.edges.map(edge => edge.node.quantity) || [];
    // Calculating the total quantity
    const totalQuantity = quantities.reduce((acc, curr) => acc + curr, 0);

    // form handeling

    const validationSchemaForLogin = Yup.object().shape({
        address: Yup.string().required('Select an address'),
        consent: Yup.boolean().oneOf([true], 'You need to accept the terms and conditions')
    })
    const validationSchemaForWithoutLogin = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        firstName1: Yup.string().required('First Name is required'),
        lastName1: Yup.string().required('Last Name is required'),
        address1: Yup.string().required('Address is required'),
        country: Yup.string().required('Country is required'),
        province: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        zip: Yup.string().required('Zip Code is required'),
        phoneNumber: Yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid').required('Phone Number is required'),
        consent: Yup.boolean().oneOf([true], 'You need to accept the terms and conditions')
    });

    const validationSchemaForAddMoreAdd = Yup.object().shape({
        firstName1: Yup.string().required('First Name is required'),
        lastName1: Yup.string().required('Last Name is required'),
        address1: Yup.string().required('Address is required'),
        country: Yup.string().required('Country is required'),
        province: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        zip: Yup.string().required('Zip Code is required'),
        phoneNumber: Yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid').required('Phone Number is required'),
        consent: Yup.boolean().oneOf([true], 'You need to accept the terms and conditions')
    });


    const initialValuesForAddMoreAdd = {
        firstName1: '',
        lastName1: '',
        address1: '',
        country: '',
        province: '',
        city: '',
        zip: '',
        phoneNumber: '',
        consent: false,
    }

    const initialValuesByLoginForWithoutLogin = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        firstName1: '',
        lastName1: '',
        address1: '',
        country: '',
        province: '',
        city: '',
        zip: '',
        phoneNumber: '',
        consent: false,
    }

    const addAddress = async (values, body, customerAccessToken) => {
        setIsLoading(true);
        const response = await graphQLClient.request(createAddressMutation, body);
        setIsLoading(false);
        if (response?.customerAddressCreate?.customerUserErrors[0]?.code === "TAKEN") {
            toast.error(response?.customerAddressCreate?.customerUserErrors[0]?.message)
            return
        }
        if (response?.customerAddressCreate?.customerUserErrors[0]?.code) {
            toast.error(response?.customerAddressCreate?.customerUserErrors[0]?.message)
            return
        }
        if (response?.customerAddressCreate?.customerAddress?.id) {
            // setAddress(body);
            createCheckoutURL(customerAccessToken, values);
        }
    }

    const initialValuesForLogin = {
        address: userDetail?.customer?.addresses?.edges[0]?.node?.id || null,
        consent: false
    }

    const formikForLogin = useFormik({
        initialValues: initialValuesForLogin || null,
        validationSchema: validationSchemaForLogin || null,
        onSubmit: async (values) => {
            console.log('formikForLogin submitted with values:', values);
            // Handle form submission logic here
            createCheckoutURL(loginUserCustomerId, address);

        },
    });

    const formikForWitoutLogin = useFormik({
        initialValues: initialValuesByLoginForWithoutLogin || null,
        validationSchema: validationSchemaForWithoutLogin || null,
        onSubmit: async (values) => {
            console.log('formikForWitoutLogin submitted with values:', values);
            const body = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                acceptMarketing: false
            }
            setIsLoading(true);
            const response = await graphQLClient.request(registerAccountMutation, body);
            setIsLoading(false);
            if (response?.customerCreate?.customerUserErrors?.[0]?.message === 'Email has already been taken') {
                const logInBody = {
                    email: values.email,
                    password: values.password
                }
                setIsLoading(true);
                const response = await graphQLClient.request(signInMutation, logInBody);
                setIsLoading(false);
                if (response?.customerAccessTokenCreate?.customerUserErrors[0]?.code === "UNIDENTIFIED_CUSTOMER") {
                    toast.error('Incorrect email or password')
                    return
                }
                if (response?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
                    dispatch(addCustomerAccessToken(response?.customerAccessTokenCreate?.customerAccessToken?.accessToken))
                    const body = {
                        customerAccessToken: response?.customerAccessTokenCreate?.customerAccessToken?.accessToken,
                        address1: values.address1,
                        country: values.country,
                        province: values.province,
                        city: values.city,
                        zip: values.zip
                    }
                    addAddress(values, body, response?.customerAccessTokenCreate?.customerAccessToken?.accessToken);
                }
            }
            if (response?.customerCreate?.customer?.id) {
                dispatch(addUserId(response?.customerCreate?.customer?.id));
                const body = {
                    email: values.email,
                    password: values.password
                }
                setIsLoading(true);
                const responseLogin = await graphQLClient.request(signInMutation, body);
                setIsLoading(false);
                if (responseLogin?.customerAccessTokenCreate?.customerUserErrors[0]?.code === "UNIDENTIFIED_CUSTOMER") {
                    toast.error("Incorrect email or password.")
                    return
                }
                if (responseLogin?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
                    dispatch(addCustomerAccessToken(responseLogin?.customerAccessTokenCreate?.customerAccessToken?.accessToken))
                    const body = {
                        customerAccessToken: responseLogin?.customerAccessTokenCreate?.customerAccessToken?.accessToken,
                        address1: values.address1,
                        country: values.country,
                        province: values.province,
                        city: values.city,
                        zip: values.zip
                    }
                    addAddress(values, body, responseLogin?.customerAccessTokenCreate?.customerAccessToken?.accessToken);
                }
            }
            // Handle form submission logic here
        },
    });
    const formikForAddMoreAdd = useFormik({
        initialValues: initialValuesForAddMoreAdd || null,
        validationSchema: validationSchemaForAddMoreAdd || null,
        onSubmit: (values) => {
            console.log('formikForAddMoreAdd submitted with values:', values);
            const body = {
                customerAccessToken: loginUserCustomerId,
                address1: values.address1,
                country: values.country,
                province: values.province,
                city: values.city,
                zip: values.zip
            }
            addAddress(values, body, loginUserCustomerId);
            // Handle form submission logic here
        },
    });

    const createCheckoutURL = async (customerAccessToken, body) => {
        let lineItemList = [];
        console.log("cartResponse?.cart?.lines?.edges", cartResponse?.cart?.lines?.edges);
        cartResponse?.cart?.lines?.edges.map((data) => {
            let lineItem = {
                variantId: data?.node?.merchandise?.id,
                quantity: data?.node?.quantity,
            }
            lineItemList.push(lineItem);
        });
        const params = {
            lineItems: lineItemList,
        };
        console.log("params", params);
        const response = await graphQLClient.request(createCheckoutURLMutation, params);
        setIsLoading(false);
        if (response && response.checkoutCreate) {
            let checkoutId = response.checkoutCreate.checkout.id;
            if (checkoutId)
                checkoutConnectWithCustomer(checkoutId, customerAccessToken, body);
        }
    }


    const checkoutConnectWithCustomer = async (checkoutId, customerAccessToken, body) => {
        const params = {
            checkoutId: checkoutId,
            customerAccessToken: customerAccessToken,
        };
        setIsLoading(true);
        const response = await graphQLClient.request(checkoutConnectWithCustomerMutation, params);
        setIsLoading(false);
        if (response && response.checkoutCustomerAssociateV2) {
            continuePayment(body);
        }
    }

    const continuePayment = async (addressBody) => {
        setIsLoading(true);

        let productList = [];
        cartResponse?.cart?.lines?.edges.map((data) => {
            let pro = {
                name: data?.node?.merchandise?.product?.title,
                description: data?.node?.merchandise?.product?.title,
                images: data?.node?.merchandise?.product?.featuredImage?.url,
                unit_amount: data?.node?.merchandise?.priceV2?.amount,
                quantity: data?.node?.quantity,
                interval: 'week',
                interval_count: 2
            }
            productList.push(pro);
        });
        if (!addressBody) {
            toast.error('Please add address');
            setIsLoading(false);
            return
        }
        try {
            const url = `${import.meta.env.VITE_SHOPIFY_API_URL}/stripe`;
            const response = await fetch(url,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: userEmail,
                        products: productList,
                        currency: filterDatas.currency_code.toLowerCase(),
                        address: {
                            first_name: addressBody?.firstName1,
                            last_name: addressBody?.lastName1,
                            address1: addressBody?.address1,
                            address2: '',
                            city_name: addressBody?.city,
                            state: addressBody?.province,
                            zip_code: addressBody?.zip,
                            country: addressBody?.country
                        }
                    }),
                });
            const data = await response.json();
            setIsLoading(false);
            setAddress(null);
            if (data && data.success) {
                let session = data.data ? data.data : null;
                if (session.url) {
                    window.location.replace(session.url);
                }
            } else {
                toast.error(data?.message)
            }
            console.log("stripe", data);

        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong.");
            console.error('Error fetching Get stripe Detail:', error);
        }
    };


    return (
        <>
            {isLoading ?
                <div className="" >
                    <LoadingAnimation />
                </div> : null}
            <section className="text-gray-600 body-font home1 bg-[#FFFFFF]">
                <div className="container lg:px-20  mx-auto flex sm:flex-nowrap flex-wrap-reverse">
                    <div className=" md:w-2/6 lg:w-3/6 bg-[#F5F5F5] flex flex-col md:ml-auto w-full mt-5 pt-4 pb-4 px-5 md:mt-0">

                        {isLogin && !isMoreAddress ?
                            <>
                                <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2  mt-2font-medium title-font">Account Details</h2>
                                <form onSubmit={formikForLogin.handleSubmit}>
                                    {userDetail?.customer?.addresses?.edges.map((address, i) => (
                                        <div onClick={() => { setAddress(address?.node) }} className="flex w-full md:w-4/6 flex-row items-start mb-4" key={i}>
                                            <input
                                                type="radio"
                                                id={`address${i + 1}`}
                                                name="address"
                                                value={`${address?.node?.id}`}
                                                onChange={formikForLogin.handleChange}
                                                checked={formikForLogin.values.address === `${address?.node?.id}`}
                                                className="bg-white mt-2 rounded border outline-none mr-2"
                                            />
                                            <div className='pl-3'>
                                                <label htmlFor={`address${i + 1}`} className="text-base text-gray-600">
                                                    {`${address?.node?.address1}   ${address?.node?.city} ${address?.node?.province}  ${address?.node?.country}  ${address?.node?.zip}`}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {formikForLogin.touched.address && formikForLogin.errors.address && (<label className="text-sm text-red-500">{formikForLogin.errors.address}</label>)}


                                    <div className='flex justify-center items-center'>
                                        <button onClick={() => setIsMoreAddress(true)} type='button' className="text-white text-center w-full lg:w-1/2 bg-[#54940fe2] mb-3 border-0 py-2 px-6 focus:outline-none  hover:bg-[#53940F] rounded-3xl text-lg"> + Add New Address</button>
                                    </div>
                                    <div className="relative flex flex-row items-start mb-2 ">
                                        <input type="checkbox" id="consent" name="consent" onChange={formikForLogin.handleChange} value={formikForLogin.values.consent} className="bg-white mt-2 rounded border  outline-none  " />
                                        <div className='pl-3'>
                                            <label htmlFor="consent" className="text-xs text-gray-600">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                            <p className="text-xs text-gray-500 mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                                        </div>
                                    </div>
                                    {formikForLogin.touched.consent && formikForLogin.errors.consent && (<label className="text-sm text-red-500">{formikForLogin.errors.consent}</label>)}
                                    <button type='submit' className="text-white mt-4 text-left w-full bg-[#54940fe2] border-0 py-2 px-6 focus:outline-none hover:bg-[#53940F] rounded-3xl text-lg">Complete Checkout</button>
                                </form>
                            </>
                            :
                            null
                        }
                        {!isLogin ?
                            <>
                                <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2  mt-2font-medium title-font">Account Details</h2>
                                <form onSubmit={formikForWitoutLogin.handleSubmit}>
                                    <div className="relative flex flex-col mb-4">
                                        <input type="text" placeholder='Email' name="email" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.email} className="w-full lg:w-[70%] bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForWitoutLogin.touched.email && formikForWitoutLogin.errors.email && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.email}</label>)}
                                    </div>
                                    <div className="relative flex flex-col mb-4">
                                        <input type="text" placeholder='Password' name="password" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.password} className="w-full lg:w-[70%] bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForWitoutLogin.touched.password && formikForWitoutLogin.errors.password && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.password}</label>)}
                                    </div>
                                    <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                        <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                            <input type="text" placeholder='First Name' name="firstName" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.firstName} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.firstName && formikForWitoutLogin.errors.firstName && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.firstName}</label>)}
                                        </div>
                                        <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                            <input type="text" placeholder='Last Name' name="lastName" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.lastName} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.lastName && formikForWitoutLogin.errors.lastName && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.lastName}</label>)}
                                        </div>
                                    </div>
                                    <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2 font-medium title-font">Shipping Address</h2>
                                    <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                        <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                            <input type="text" placeholder='First Name' name="firstName1" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.firstName1} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.firstName1 && formikForWitoutLogin.errors.firstName1 && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.firstName1}</label>)}
                                        </div>
                                        <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                            <input type="text" placeholder='Last Name' name="lastName1" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.lastName1} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.lastName1 && formikForWitoutLogin.errors.lastName1 && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.lastName1}</label>)}
                                        </div>
                                    </div>
                                    <div className="relative flex flex-col mb-4">
                                        <input type="text" placeholder='Shipping Address' name="address1" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.address1} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForWitoutLogin.touched.address1 && formikForWitoutLogin.errors.address1 && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.address1}</label>)}
                                    </div>
                                    <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                        <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                            <input type="text" placeholder='Country' name="country" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.country} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.country && formikForWitoutLogin.errors.country && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.country}</label>)}
                                        </div>
                                        <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                            <input type="text" placeholder='State' name="province" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.province} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.province && formikForWitoutLogin.errors.province && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.province}</label>)}
                                        </div>
                                    </div>
                                    <div className=" relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                        <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                            <input type="text" placeholder='City' name="city" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.city} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.city && formikForWitoutLogin.errors.city && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.city}</label>)}
                                        </div>
                                        <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                            <input type="text" placeholder='Zip Code' name="zip" onChange={formikForWitoutLogin.handleChange} value={formikForLogin.values.zip} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            {formikForWitoutLogin.touched.zip && formikForWitoutLogin.errors.zip && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.zip}</label>)}
                                        </div>
                                    </div>
                                    <div className="relative flex flex-col mb-4">
                                        <input type="text" placeholder='Phone Number' name='phoneNumber' onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.phoneNumber} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForWitoutLogin.touched.phoneNumber && formikForWitoutLogin.errors.phoneNumber && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.phoneNumber}</label>)}
                                    </div>
                                    <div className="relative flex flex-row items-start mb-2">
                                        <input type="checkbox" id="consent" name="consent" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.consent} className="bg-white mt-2 rounded border  outline-none  " />
                                        <div className='pl-3'>
                                            <label htmlFor="consent" className="text-xs text-gray-600">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                            <p className="text-xs text-gray-500 mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                                        </div>
                                    </div>
                                    {formikForWitoutLogin.touched.consent && formikForWitoutLogin.errors.consent && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.consent}</label>)}
                                    <button type='submit' className="text-white mt-4 text-left w-full bg-[#54940fe2] border-0 py-2 px-6 focus:outline-none hover:bg-[#53940F] rounded-3xl text-lg">Complete Checkout</button>
                                </form>
                            </> : null
                        }
                        {isMoreAddress && isLogin ?
                            <form onSubmit={formikForAddMoreAdd.handleSubmit}>
                                <div className="flex items-center mb-2">
                                    {userDetail?.customer?.addresses?.edges.length > 0 && <span title='Go back' className='mr-5 cursor-pointer' onClick={() => { setIsMoreAddress(false) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6">
                                            <path fill="#53940F" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                        </svg>
                                    </span>}
                                    <h2 className="text-[#53940F] text-lg lg:text-2xl font-medium title-font mr-2">Shipping Address</h2>
                                </div>
                                <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='First Name' name="firstName1" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.firstName1} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForAddMoreAdd.touched.firstName1 && formikForAddMoreAdd.errors.firstName1 && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.firstName1}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='Last Name' name="lastName1" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.lastName1} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForAddMoreAdd.touched.lastName1 && formikForAddMoreAdd.errors.lastName1 && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.lastName1}</label>)}
                                    </div>
                                </div>
                                <div className="relative flex flex-col mb-4">
                                    <input type="text" placeholder='Shipping Address' name="address1" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.address1} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {formikForAddMoreAdd.touched.address1 && formikForAddMoreAdd.errors.address1 && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.address1}</label>)}
                                </div>
                                <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='Country' name="country" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.country} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForAddMoreAdd.touched.country && formikForAddMoreAdd.errors.country && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.country}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='State' name="province" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.province} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForAddMoreAdd.touched.province && formikForAddMoreAdd.errors.province && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.province}</label>)}
                                    </div>
                                </div>
                                <div className=" relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='City' name="city" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.city} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForAddMoreAdd.touched.city && formikForAddMoreAdd.errors.city && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.city}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='Zip Code' name="zip" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.zip} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formikForAddMoreAdd.touched.zip && formikForAddMoreAdd.errors.zip && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.zip}</label>)}
                                    </div>
                                </div>
                                <div className="relative flex flex-col mb-4">
                                    <input type="text" placeholder='Phone Number' name='phoneNumber' onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.phoneNumber} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {formikForAddMoreAdd.touched.phoneNumber && formikForAddMoreAdd.errors.phoneNumber && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.phoneNumber}</label>)}
                                </div>
                                <div className="relative flex flex-row items-start mb-2">
                                    <input type="checkbox" id="consent" name="consent" onChange={formikForAddMoreAdd.handleChange} value={formikForWitoutLogin.values.consent} className="bg-white mt-2 rounded border  outline-none  " />
                                    <div className='pl-3'>
                                        <label htmlFor="consent" className="text-xs text-gray-600">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                        <p className="text-xs text-gray-500 mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                                    </div>
                                </div>
                                {formikForAddMoreAdd.touched.consent && formikForAddMoreAdd.errors.consent && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.consent}</label>)}
                                <button type='submit' className="text-white mt-4 text-left w-full bg-[#54940fe2] border-0 py-2 px-6 focus:outline-none hover:bg-[#53940F] rounded-3xl text-lg">Complete Checkout</button>
                            </form>
                            : null
                        }
                    </div>
                    <div className="md:w-4/6 lg:w-4/6 w-full  md:py-2 mt-2 px-5 overflow-hidden">
                        <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2 font-medium title-font">Order Summary</h2>
                        <div className=" relative flex flex-row justify-between py-1">
                            {/* <div className=""> */}
                            <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">{`Meals Subtotal (${totalQuantity})`}</h2>
                            {/* </div> */}
                            <div className="whitespace-nowrap">
                                <p className="">{`₹ ${cartResponse?.cart?.estimatedCost?.totalAmount?.amount || 0}`}</p>
                            </div>
                        </div>
                        <div className=" relative flex flex-row justify-between py-1">
                            <div className="">
                                <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">{`Slides (${cartResponse?.cart?.lines?.edges.length || 0})`}</h2>
                            </div>
                            <div className="whitespace-nowrap">
                                <p className="">---</p>
                            </div>
                        </div>
                        {/* <div className=" relative flex flex-row justify-between py-1">
                  <div className="">
                      <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">Discount</h2>
                  </div>
                  <div className="whitespace-nowrap">
                      <p className="">- ₹2323.23</p>
                  </div>
              </div> */}
                        {coupon && isCouponCodeApply && <div className=" relative inline-flex flex-row  bg-[#53940F] rounded  items-center py-1">
                            <div className="">
                                <h2 className="title-font font-normal px-3 whitespace-nowrap text-white  text-base">{coupon}</h2>
                            </div>
                            <div onClick={() => { setCoupon(""); setIsCouponCodeApply(false) }} className="whitespace-nowrap flex items-center">
                                <button className='px-2'><img width={20} src={plus} alt="cross" /></button>
                            </div>
                        </div>}
                        {/* <div className="relative flex flex-col my-3">
                            <input
                                type="text"
                                value={coupon}
                                onChange={e => { setCoupon(e.target.value); setIsCouponCodeApply(false) }}
                                placeholder="Apply Coupon Code"
                                className="w-full bg-[#F5F5F5] rounded text-base outline-none text-gray-700 py-2 px-3 pr-16 leading-8 transition-colors duration-200 ease-in-out"
                            />
                            <label className="absolute top-2 right-2">
                                <button
                                    className="px-2 py-1 bg-[#53940F] rounded text-base text-gray-100 ml-2"
                                    onClick={() => { setIsCouponCodeApply(true); }}
                                >
                                    Apply
                                </button>
                            </label>
                        </div> */}
                        <div className='bg-[#000000] h-[1px] w-full mt-3'>
                        </div>
                        <div className=" relative flex flex-row justify-between py-1 mt-2">
                            <div className="">
                                <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">Order Total</h2>
                            </div>
                            <div className="whitespace-nowrap">
                                <p className="">{`₹ ${cartResponse?.cart?.estimatedCost?.totalAmount?.amount || 0}`}</p>
                            </div>
                        </div>
                        <h2 className="text-[#53940F] text-lg lg:text-2xl mt-4 mb-1 font-medium title-font">My Order</h2>
                        <p className="text-[#000] text-base mb-2 font-normal title-font">{`Meals (${totalQuantity}), Sides (${cartResponse?.cart?.lines?.edges.length || 0})`}</p>
                        {/* card view */}
                        <div className="flex flex-wrap -m-4">
                            {cartResponse?.cart?.lines?.edges.map((item, i) => {
                                return (<OrderProduct key={i} item={item} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} loading={loading} />)
                            })}

                        </div>
                    </div>

                </div>
            </section >


        </>

    )
}

export default WithoutLoginCheckout


