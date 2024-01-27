import React, { useEffect, useState } from 'react'
import {
    graphQLClient,
    getCartQuery,
} from "../api/graphql";
import plus from "../assets/cross.svg"
import dish from "../assets/Dish-1.jpg"
import OrderProduct from '../component/OrderProduct'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Footer } from '../component/Footer';


const WithoutLoginCheckout = () => {
    const [coupon, setCoupon] = useState("NEW-05234");
    const [isCouponCodeApply, setIsCouponCodeApply] = useState(false);
    const [data, setData] = useState();
    const [isLogin, setIsLogin] = useState(1);

    const fetchData = async () => {
        const cartId = "gid://shopify/Cart/Z2NwLXVzLWNlbnRyYWwxOjAxSE1XWjE4WVNDVjYwSFdXNjdHRUYwODk4";
        try {
            const response = await graphQLClient.request(getCartQuery, cartId)
            console.log("Product Detail", response);
            setData(response.product);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const initialValuesByLogin = {
        1: {
            address: "address1",
            conset: false
        },
        2: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            firstName1: '',
            lastName1: '',
            shippingAddress: '',
            country: '',
            state: '',
            city: '',
            zipCode: '',
            phoneNumber: '',
            consent: false,
        }
    }

    const validationSchemaByLogin = {
        1: Yup.object().shape({
            address: Yup.string(),
            consent: Yup.boolean()
        }),
        2: Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            firstName1: Yup.string().required('Shipping First Name is required'),
            lastName1: Yup.string().required('Shipping Last Name is required'),
            shippingAddress: Yup.string().required('Shipping Address is required'),
            country: Yup.string().required('Country is required'),
            state: Yup.string().required('State is required'),
            city: Yup.string().required('City is required'),
            zipCode: Yup.string().matches(/^\d{6}(?:[-\s]\d{4})?$/, 'Invalid zip code format').required('Zip Code is required'),
            phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone Number is required'),
            consent: Yup.boolean()
        })
    };
    const initialValues = initialValuesByLogin[isLogin];
    const validationSchema = validationSchemaByLogin[isLogin];

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('Form submitted with values:', values);
            // Handle form submission logic here
        },
    });


    const data1 = [
        {
            productTitle: "Dal Makhna",
            id: 1,
            dish: dish,
            productCount: 3,
            spacel: false
        },
        {
            productTitle: "Palak Paneer",
            id: 2,
            dish: "https://cdn.shopify.com/s/files/1/0682/8458/0066/files/R1_Dal_Chawal_SGR05110.webp?v=1704777877",
            productCount: 4,
            spacel: true
        },
        {
            productTitle: "Green Salad",
            id: 3,
            dish: dish,
            productCount: 13,
            spacel: false
        },
        {
            productTitle: "Shahi Paneer ",
            id: 4,
            dish: "https://cdn.shopify.com/s/files/1/0682/8458/0066/files/R1_Dal_Chawal_SGR05110.webp?v=1704777877",
            productCount: 9,
            spacel: true
        },
        {
            productTitle: "Paneer Butter Masala",
            id: 5,
            dish: dish,
            productCount: 23,
            spacel: true
        },
    ]
    return (
        <section className="text-gray-600 body-font relative">
            <div className="container lg:px-20  mx-auto flex sm:flex-nowrap flex-wrap-reverse">
                <div className=" md:w-2/6 lg:w-3/6 bg-[#F5F5F5] flex flex-col md:ml-auto w-full mt-5 pt-4 pb-4 px-5 md:mt-0">
                    <form onSubmit={formik.handleSubmit}>
                        <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2  mt-2font-medium title-font">Account Details</h2>
                        {isLogin == 2 ?
                            <>
                                <div className="relative flex flex-col mb-4">
                                    <input type="text" placeholder='Email' name="email" onChange={formik.handleChange} value={formik.values.email} className="w-full lg:w-[70%] bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {formik.touched.email && formik.errors.email && (<label className="text-sm text-gray-600">{formik.errors.email}</label>)}
                                </div>
                                <div className="relative flex flex-col mb-4">
                                    <input type="text" placeholder='Password' name="password" onChange={formik.handleChange} value={formik.values.password} className="w-full lg:w-[70%] bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {formik.touched.password && formik.errors.password && (<label className="text-sm text-gray-600">{formik.errors.password}</label>)}
                                </div>
                                <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='First Name' name="firstName" onChange={formik.handleChange} value={formik.values.firstName} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.firstName && formik.errors.firstName && (<label className="text-sm text-gray-600">{formik.errors.firstName}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='Last Name' name="lastName" onChange={formik.handleChange} value={formik.values.lastName} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.lastName && formik.errors.lastName && (<label className="text-sm text-gray-600">{formik.errors.lastName}</label>)}
                                    </div>
                                </div>
                                <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2 font-medium title-font">Shipping Address</h2>
                                <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='First Name' name="firstName1" onChange={formik.handleChange} value={formik.values.firstName1} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.firstName1 && formik.errors.firstName1 && (<label className="text-sm text-gray-600">{formik.errors.firstName1}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='Last Name' name="lastName1" onChange={formik.handleChange} value={formik.values.lastName1} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.lastName1 && formik.errors.lastName1 && (<label className="text-sm text-gray-600">{formik.errors.lastName1}</label>)}
                                    </div>
                                </div>
                                <div className="relative flex flex-col mb-4">
                                    <input type="text" placeholder='Shipping Address' name="shippingAddress" onChange={formik.handleChange} value={formik.values.shippingAddress} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {formik.touched.shippingAddress && formik.errors.shippingAddress && (<label className="text-sm text-gray-600">{formik.errors.shippingAddress}</label>)}
                                </div>
                                <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='Country' name="country" onChange={formik.handleChange} value={formik.values.country} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.country && formik.errors.country && (<label className="text-sm text-gray-600">{formik.errors.country}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='State' name="state" onChange={formik.handleChange} value={formik.values.state} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.state && formik.errors.state && (<label className="text-sm text-gray-600">{formik.errors.state}</label>)}
                                    </div>
                                </div>
                                <div className=" relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                    <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                        <input type="text" placeholder='City' name="city" onChange={formik.handleChange} value={formik.values.city} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.city && formik.errors.city && (<label className="text-sm text-gray-600">{formik.errors.city}</label>)}
                                    </div>
                                    <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                        <input type="text" placeholder='Zip Code' name="zipCode" onChange={formik.handleChange} value={formik.values.zipCode} className="w-full  bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        {formik.touched.zipCode && formik.errors.zipCode && (<label className="text-sm text-gray-600">{formik.errors.zipCode}</label>)}
                                    </div>
                                </div>
                                <div className="relative flex flex-col mb-4">
                                    <input type="text" placeholder='Phone Number' name='phoneNumber' onChange={formik.handleChange} value={formik.values.phoneNumber} className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (<label className="text-sm text-gray-600">{formik.errors.phoneNumber}</label>)}
                                </div>
                            </> : null
                        }
                        {isLogin == 1 ?
                            <>
                                <div className="flex w-full md:w-4/6 flex-row items-start mb-4">
                                    <input
                                        type="radio"
                                        id="address1"
                                        name="address"
                                        value="address1"
                                        onChange={formik.handleChange}
                                        checked={formik.values.address === 'address1'}
                                        className="bg-white mt-2 rounded border outline-none mr-2"
                                    />
                                    <div className='pl-3'>
                                        <label htmlFor="address1" className="text-base text-gray-600">
                                            Shashank Bansal
                                            308, SNS Synergy, Piplod, Surat-07
                                            +919510537693
                                        </label>
                                    </div>
                                </div>

                                <div className="w-full md:w-4/6 flex flex-row items-start mb-4">
                                    <input
                                        type="radio"
                                        id="address2"
                                        name="address"
                                        value="address2"
                                        onChange={formik.handleChange}
                                        checked={formik.values.address === 'address2'}
                                        className="bg-white mt-2 rounded border outline-none mr-2"
                                    />
                                    <div className='pl-3'>
                                        <label htmlFor="address2" className="text-base text-gray-600">
                                            Another Address Example
                                            123, Street Name, City, Zip Code
                                            +919876543210
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full md:w-4/6 flex flex-row items-start mb-4">
                                    <input
                                        type="radio"
                                        id="address3"
                                        name="address"
                                        value="address3"
                                        onChange={formik.handleChange}
                                        checked={formik.values.address === 'address3'}
                                        className="bg-white mt-2 rounded border outline-none mr-2"
                                    />
                                    <div className='pl-3'>
                                        <label htmlFor="address3" className="text-base text-gray-600">
                                            Another Address Example
                                            123, Street Name, City, Zip Code
                                            +919876543210
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full md:w-4/6 flex flex-row items-start mb-4">
                                    <input
                                        type="radio"
                                        id="address4"
                                        name="address"
                                        value="address4"
                                        onChange={formik.handleChange}
                                        checked={formik.values.address === 'address4'}
                                        className="bg-white mt-2 rounded border outline-none mr-2"
                                    />
                                    <div className='pl-3'>
                                        <label htmlFor="address1" className="text-base text-gray-600">
                                            Another Address Example
                                            123, Street Name, City, Zip Code
                                            +919876543210
                                        </label>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <button onClick={() => setIsLogin(2)} type='button' className="text-white text-center w-1/2 bg-[#54940fe2] mb-3 border-0 py-2 px-6 focus:outline-none hover:bg-[#53940F] rounded-3xl text-lg"> + Add New Address</button>
                                </div>
                            </> : null}
                        <div className="relative flex flex-row items-start mb-4">
                            <input type="checkbox" id="consent" name="consent" onChange={formik.handleChange} value={formik.values.consent} className="bg-white mt-2 rounded border  outline-none  " />
                            <div className='pl-3'>
                                <label htmlFor="consent" className="text-xs text-gray-600">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                <p className="text-xs text-gray-500 mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                            </div>
                        </div>
                        <button type='submit' onClick={formik.handleSubmit} className="text-white text-left w-full bg-[#54940fe2] border-0 py-2 px-6 focus:outline-none hover:bg-[#53940F] rounded-3xl text-lg">Complete Checkout</button>
                    </form>
                </div>
                <div className="md:w-4/6 lg:w-4/6 w-full  md:py-2 mt-2 px-5 overflow-hidden">
                    <h2 className="text-[#53940F] text-lg lg:text-2xl mb-2 font-medium title-font">Account Details</h2>
                    <div className=" relative flex flex-row justify-between py-1">
                        {/* <div className=""> */}
                        <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">Meals Subtotal (16)</h2>
                        {/* </div> */}
                        <div className="whitespace-nowrap">
                            <p className="">₹2323.23</p>
                        </div>
                    </div>
                    <div className=" relative flex flex-row justify-between py-1">
                        <div className="">
                            <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">Sides (16)</h2>
                        </div>
                        <div className="whitespace-nowrap">
                            <p className="">₹2323.23</p>
                        </div>
                    </div>
                    <div className=" relative flex flex-row justify-between py-1">
                        <div className="">
                            <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">Discount</h2>
                        </div>
                        <div className="whitespace-nowrap">
                            <p className="">- ₹2323.23</p>
                        </div>
                    </div>
                    {coupon && isCouponCodeApply && <div className=" relative inline-flex flex-row  bg-[#53940F] rounded  items-center py-1">
                        <div className="">
                            <h2 className="title-font font-normal px-3 whitespace-nowrap text-white  text-base">{coupon}</h2>
                        </div>
                        <div onClick={() => { setCoupon(""); setIsCouponCodeApply(false) }} className="whitespace-nowrap flex items-center">
                            <button className='px-2'><img width={20} src={plus} alt="cross" /></button>
                        </div>
                    </div>}
                    <div className="relative flex flex-col my-3">
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
                    </div>
                    <div className='bg-[#000000] h-[1px] w-full mt-3'>
                    </div>
                    <div className=" relative flex flex-row justify-between py-1 mt-2">
                        <div className="">
                            <h2 className="title-font font-normal whitespace-nowrap text-gray-900 text-base">Order Total</h2>
                        </div>
                        <div className="whitespace-nowrap">
                            <p className="">₹10000.23</p>
                        </div>
                    </div>
                    <h2 className="text-[#53940F] text-lg lg:text-2xl mt-4 mb-1 font-medium title-font">My Order</h2>
                    <p className="text-[#000] text-base mb-2 font-normal title-font">Meals (16), Sides (4)</p>
                    {/* card view */}
                    <div className="flex flex-wrap -m-4">
                        {data1.map((item) => {
                            return (<OrderProduct key={item?.id} item={item} />)
                        })}

                    </div>
                </div>

            </div>
            <Footer />
        </section >

    )
}

export default WithoutLoginCheckout

