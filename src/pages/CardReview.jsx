import React, { useState, useEffect } from 'react'
import product from '../assets/Dish-1.jpg'
import { createCartMutation, getCartQuery, graphQLClient, updateCartItemMutation, updateCartMutation } from '../api/graphql';
import { addCartData, cartData, clearCartData, clearCartResponse, selectCartResponse, setCartResponse, } from '../state/cartData';
import { useDispatch, useSelector } from 'react-redux';
import LoadingAnimation from "../component/Loader";
import {
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
import { addCustomerAccessToken, addUserId, customerAccessTokenData, userEmails } from '../state/user';
import { filterData } from '../state/selectedCountry';
import toast from 'react-hot-toast';
import BlazeSDK from '@juspay/blaze-sdk-web';
import { useNavigate } from 'react-router-dom';

const CardReview = () => {
    const cartDatas = useSelector(cartData);
    const cartResponse = useSelector(selectCartResponse);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState("");
    const [isCouponCodeApply, setIsCouponCodeApply] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const loginUserCustomerId = useSelector(customerAccessTokenData);
    const dispatch = useDispatch();
    const [userDetail, setUserDetail] = useState(null);
    const [isMoreAddress, setIsMoreAddress] = useState(false);
    const filterDatas = useSelector(filterData);
    // const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState({});
    const userEmail = useSelector(userEmails);
    const [shippingMethod, setShippingMethod] = useState('prepaidStandard');

    const shippingCost = shippingMethod === 'expressShipping' ? 150 : 0;

    const callbackMethod = (response) => {
        console.log('Response from SDK:', response);
        let result = JSON.parse(response)
        if (result?.payload?.methodName === "clearCart") {
            dispatch(clearCartData());
            dispatch(clearCartResponse());
        }
        if (result?.payload?.ctaAction === "shopMore") {
            navigate("/");
        } else if (result?.payload?.ctaAction === "trackOrder") {
            navigate("/Invoices");
        }
    };


    useEffect(() => {
        console.log(loginUserCustomerId)
        if (loginUserCustomerId) {
            setIsLogin(true)
            getCustomerDetail();
            const sdkPayload = createSDKPayload({
                merchantId: 'instantly',
                environment: 'release',
                shopUrl: 'https://76ac20-2.myshopify.com'
            });

            console.log('Initiating Blaze SDK with payload:', sdkPayload);
            BlazeSDK.initiate(sdkPayload, callbackMethod);
        }
    }, [loginUserCustomerId])

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



    const handleRemoveFromCart = (productId, sellingPlanId) => {
        // setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        const productInCart = cartResponse.cart.lines.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            if (sellingPlanId) {
                updateCartItem(cartId, {
                    id: id,
                    sellingPlanId: sellingPlanId,
                    quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
                }, productId);
            } else {
                updateCartItem(cartId, {
                    id: id,
                    quantity: quantityInCart === 1 ? 0 : quantityInCart - 1,
                }, productId);
            }
        }
    };

    const handleRemoveWholeProductFromCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        const productInCart = cartResponse.cart.lines.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            if (sellingPlanId) {
                updateCartItem(cartId, {
                    id: id,
                    sellingPlanId: sellingPlanId,
                    quantity: 0,
                }, productId);
            } else {
                updateCartItem(cartId, {
                    id: id,
                    quantity: 0,
                }, productId);
            }
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

    const validationSchemaForLogin = Yup.object().shape({
        // consent: Yup.boolean().oneOf([true], 'You need to accept the terms and conditions')
    })
    const validationSchemaForWithoutLogin = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
    });

    // const validationSchemaForAddMoreAdd = Yup.object().shape({
    //     consent: Yup.boolean().oneOf([true], 'You need to accept the terms and conditions')
    // });


    const initialValuesForAddMoreAdd = {
        consent: false,
    }

    const initialValuesByLoginForWithoutLogin = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        consent: false,
    }


    const initialValuesForLogin = {
        consent: false
    }

    const formikForLogin = useFormik({
        initialValues: initialValuesForLogin || null,
        validationSchema: validationSchemaForLogin || null,
        onSubmit: async (values) => {
            console.log('formikForLogin submitted with values:', values);
            createCheckoutURL(loginUserCustomerId);

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
                }
            }
            // Handle form submission logic here
        },
    });
    // const formikForAddMoreAdd = useFormik({
    //     initialValues: initialValuesForAddMoreAdd || null,
    //     validationSchema: validationSchemaForAddMoreAdd || null,
    //     onSubmit: (values) => {
    //         console.log('formikForAddMoreAdd submitted with values:', values);
    //     },
    // });

    const createCheckoutURL = async (customerAccessToken) => {
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
                checkoutConnectWithCustomer(checkoutId, customerAccessToken);
        }
    }


    const checkoutConnectWithCustomer = async (checkoutId, customerAccessToken) => {

        const params = {
            checkoutId: checkoutId,
            customerAccessToken: customerAccessToken,
        };
        setIsLoading(true);
        const response = await graphQLClient.request(checkoutConnectWithCustomerMutation, params);
        setIsLoading(false);
        if (response && response.checkoutCustomerAssociateV2) {
            const updatedBody = {
                checkoutUrlId: checkoutId,
            };
            console.log(updatedBody)
            continuePayment(updatedBody);
        }
    }



    function createSDKPayload(data) {
        return {
            requestId: Math.random().toString(36).substring(7),
            service: 'in.breeze.onecco',
            payload: data
        };
    }

    function calculateTotalWeight(cartData) {
        return cartData.edges.reduce((total, edge) => {
            const { quantity, merchandise } = edge.node;
            const productWeight = merchandise.weight;
            return total + (quantity * productWeight);
        }, 0);
    }

    function calculateTotalQuantity(cartData) {
        return cartData.edges.reduce((total, edge) => {
            const { quantity } = edge.node;
            return total + quantity;
        }, 0);
    }

    function processPayment(payload) {
        console.log(cartResponse);
        if (!payload.checkoutId) {
            console.error('Checkout ID is missing');
            return;
        }
        const cart = cartResponse?.cart;

        console.log(cart);
        const processPayload = createSDKPayload({
            "action": "startCheckout",
            "cart":
            {
                "token": cart.id.split('Cart/')[1],
                "note": "",
                "attributes": {},
                "original_total_price": cart.cost.totalAmount.amount * 100,
                "total_price": cart.cost.totalAmount.amount * 100,
                "total_discount": 0,
                "total_weight": parseInt(calculateTotalWeight(cart.lines)),
                "item_count": parseInt(calculateTotalQuantity(cart.lines)),
                "items": cart.lines.edges.map(edge => {
                    const product = edge.node.merchandise.product;
                    const variant = edge.node.merchandise;
                    const quantity = edge.node.quantity;
                    const price = variant.priceV2.amount * 100;

                    return {
                        "id": parseInt(variant.id.split("/").pop()),
                        "properties": {},
                        "quantity": quantity,
                        "variant_id": parseInt(variant.id.split("/").pop()),
                        "key": `${variant.id.split("/").pop()}:${new URLSearchParams(cart.id.split('?')[1]).get('key')}`,
                        "title": product.title,
                        "price": price,
                        "original_price": price,
                        "presentment_price": parseInt(variant.priceV2.amount),
                        "discounted_price": price,
                        "line_price": price * quantity,
                        "original_line_price": price * quantity,
                        "total_discount": 0,
                        "discounts": [],
                        "sku": "",
                        "grams": variant.weight,
                        "vendor": "Instanly Yours",
                        "taxable": true,
                        "product_id": parseInt(product.id.split("/").pop()),
                        "product_has_only_default_variant": true,
                        "gift_card": false,
                        "final_price": price,
                        "final_line_price": price * quantity,
                        "url": `/products/${product.handle}?variant=${variant.id.split("/").pop()}`,
                        "featured_image": {
                            "aspect_ratio": 1,
                            "alt": product.featuredImage.altText || product.title,
                            "height": 2000,
                            "url": product.featuredImage.url,
                            "width": 2000
                        },
                        "image": product.featuredImage.url,
                        "handle": product.handle,
                        "requires_shipping": true,
                        "product_type": "",
                        "product_title": product.title,
                        "product_description": "",
                        "variant_title": null,
                        "variant_options": ["Default Title"],
                        "options_with_values": [
                            {
                                "name": "Title",
                                "value": "Default Title"
                            }
                        ],
                        "line_level_discount_allocations": [],
                        "line_level_total_discount": 0,
                        "has_components": false
                    };
                }),
                "requires_shipping": true,
                "currency": cart.cost.totalAmount.currencyCode,
                "items_subtotal_price": cart.cost.subtotalAmount.amount * 100,
                "cart_level_discount_applications": []
            },
        });

        console.log('Processing payment with payload:', processPayload);

        BlazeSDK.process(processPayload);
        setIsLoading(false)
    }

    function initiatePayment(payload) {

        processPayment(payload);
    }


    const continuePayment = async (addressBody) => {
        setIsLoading(true);
        const payload = {
            email: userEmail?.email,
            // currency: filterDatas.currency_code.toLowerCase(),
            checkoutId: addressBody.checkoutUrlId
        }

        initiatePayment(payload);
    };

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

    const handleAddToCart = (productId, sellingPlanId) => {
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
        if (cartDatas === null) {
            if (sellingPlanId) {
                addToCart({ merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
            } else {
                addToCart({ merchandiseId: productId, quantity: 1 });
            }
        }

        const productInCart = cartResponse?.cart?.lines?.edges.find(cartItem => {
            return cartItem.node.merchandise.id === productId;
        });

        if (productInCart) {
            const quantityInCart = productInCart.node.quantity;
            const cartId = cartDatas?.cartCreate?.cart?.id
            const id = productInCart?.node?.id
            if (sellingPlanId) {
                updateCartItem(cartId, { id: id, sellingPlanId: sellingPlanId, quantity: quantityInCart + 1 }, productId);
            } else {
                updateCartItem(cartId, { id: id, quantity: quantityInCart + 1 }, productId);
            }
        } else {
            const cartId = cartDatas?.cartCreate?.cart?.id
            if (sellingPlanId) {
                updateCart(cartId, { merchandiseId: productId, sellingPlanId: sellingPlanId, quantity: 1 });
            } else {
                updateCart(cartId, { merchandiseId: productId, quantity: 1 });
            }
        }
    };

    const addToCart = async (cartItems) => {
        const params = {
            "cartInput": {
                "lines": [
                    cartItems
                ]
            }
        }
        const response = await graphQLClient.request(createCartMutation, params);
        dispatch(addCartData(response))
        setLoading((prevLoading) => ({
            ...prevLoading,
            [cartItems.merchandiseId]: false,
        }));
    }





    return (
        <>
            <div className='bg-[#EFE9DA] '>
                <div className='px-4 lg:px-[45px] min-h-[85vh]'>
                    <h1 className='text-2xl md:text-[54px] leading-[54px] font-[400] p-4 font-skillet text-[#231F20] pt-5 lg:pt-9'>Review your Cart</h1>
                    <div className='flex flex-col gap-4 md:gap-6 md:flex-row justify-between'>
                        <div className='w-full px-4 md:w-1/2 mb-4'>
                            {cartResponse?.cart?.lines?.edges?.map((line, index) => {
                                return <div key={index} className='flex  items-center justify-between py-3 lg:mr-24 border-b-[0.99px] border-[#A3A3A3]'>
                                    <div className='flex flex-row items-center'>
                                        <img src={
                                            line?.node?.merchandise?.product
                                                ?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc
                                        }
                                            alt={line?.node?.merchandise?.product?.title} className='h-[85.1px] w-[85.1px] rounded-lg' />
                                        <div className='ml-4'>
                                            <h1 className='text-xl md:text-[36px] leading-[20px] md:leading-[36px] font-[400] font-skillet text-[#333333] '>{line?.node?.merchandise?.product?.title}</h1>
                                            <p className='font-skillet text-[#757575] text-[24px] md:text-[28px] leading-[28.18px] font-[400]'><span className='text-[20px] leading-[20.1px] '>₹</span> {line?.node?.merchandise?.priceV2?.amount}</p>
                                            {loading[line.node.merchandise.id] ? <svg width="60" height="60" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#4fa94d" data-testid="three-dots-svg"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="60" cy="15" r="9" attributeName="fill-opacity" from="1" to="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate></circle></svg> :
                                                <div className="flex gap-2 items-center">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z"
                                                                fill="#333333"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                                                        {line.node.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleAddToCart(line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id)
                                                        }
                                                    >
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.84615V8.30769H4.84615V9.69231H8.30769V13.1538H9.69231V9.69231H13.1538V8.30769H9.69231V4.84615H8.30769Z"
                                                                fill="#333333"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() =>
                                            handleRemoveWholeProductFromCart(
                                                line.node.merchandise.id, line.node.merchandise.product?.sellingPlanGroups?.edges[0]?.node?.sellingPlans?.edges[0]?.node?.id
                                            )
                                        } type='button' className='text-[#F15E2A] flex flex-col m-0 md:m-7 font-regola-pro font-[500] text-xl border-b border-b-[#F15E2A]'>Remove</button>
                                    </div>
                                </div>
                            })}

                        </div>
                        <div className='bg-[#EFE9DA]  w-full md:w-1/2 mb-10'>
                            <div className='bg-[#EADEC1] p-8 rounded-2xl'>
                                {/* <div className="flex flex-row justify-between">
                                    <p className="  font-skillet  lg:text-[24px] font-[400] leading-[24.5px] text-[#333333]">Subtotal</p>
                                    <p className="text-lg font-skillet lg:text-[24px] font-[400] leading-[24.5px] text-[#333333]">₹ <span className='lg:text-[32px] font-[400] leading-[32.5px]'>803.6</span></p>
                                </div> */}
                                <div className="mt-3">
                                    <div className="flex flex-row justify-between mb-2">
                                        <p className="text-[1.5rem] font-skillet lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Amount</p>
                                        <p className="text-[1.5rem] text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">
                                            ₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{parseInt(cartResponse?.cart?.cost?.totalAmount?.amount) || 0}</span>
                                        </p>
                                    </div>

                                    {/* <div className="flex flex-row justify-between">
                                        <p className="text-[1.5rem] font-skillet lg:text-[28px] font-[400] leading-[30px] text-[#333333]">Shipping</p>
                                        <p className="text-[1.5rem] font-skillet lg:text-[28px] font-[400] leading-[30px] text-[#333333]">
                                            {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                                        </p>
                                    </div> */}

                                    <div className="flex flex-row justify-between mt-3 border-t border-[#333333] pt-3">
                                        <p className="text-[1.5rem] font-skillet lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Total</p>
                                        <p className="text-[1.5rem] text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">
                                            ₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{(parseInt(cartResponse?.cart?.cost?.totalAmount?.amount) || 0) + shippingCost}</span>
                                        </p>
                                    </div>
                                </div>
                                <p className='text-[#757575] text-[20px] font-[500] leading-[26.45px] text-end font-regola-pro'>Tax included and shipping calculated at checkout</p>
                                {/* <div className="flex mt-8 flex-row text-center gap-y-5 whitespace-nowrap justify-between gap-3">
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center font-[400] text-[20px] leading-[24px] font-regola-pro text-[#757575]'>Standard</p>
                                    </div>
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center font-[400] text-[20px] leading-[24px] font-regola-pro text-[#757575]'>Express</p>
                                    </div>
                                    <div className='h-[80px] w-[220px] rounded-lg bg-[#EFE9DA]'>
                                        <p className='px-5 py-8 text-center font-[400] text-[20px] leading-[24px] font-regola-pro text-[#757575]'>Bulk</p>
                                    </div>
                                </div> */}


                                {isLogin && !isMoreAddress ?
                                    <>
                                        {/* <h2 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-2 mt-5 ">Account Details</h2> */}
                                        <form onSubmit={formikForLogin.handleSubmit}>
                                            {/* {userDetail?.customer?.addresses?.edges.map((address, i) => (
                                                <div onClick={() => { setAddress(address?.node) }} className="flex w-full flex-row items-start my-2 " key={i}>
                                                    <input
                                                        type="radio"
                                                        id={`address${i + 1}`}
                                                        name="address"
                                                        value={`${address?.node?.id}`}
                                                        onChange={formikForLogin.handleChange}
                                                        checked={formikForLogin.values.address === `${address?.node?.id}`}
                                                        className="bg-[#EFE9DA] mt-2 rounded border outline-none mr-2"
                                                    />
                                                    <div className='pl-3'>
                                                        <label htmlFor={`address${i + 1}`} className="text-[20px] font-regola-pro leading-[22.8px] font-[400] text-[#757575]">
                                                            {`${address?.node?.address1}   ${address?.node?.city} ${address?.node?.province}
                                                              ${address?.node?.zip}`}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                            {formikForLogin.touched.address && formikForLogin.errors.address && (<label className="text-sm text-red-500">{formikForLogin.errors.address}</label>)} */}


                                            {/* <div className='flex justify-center items-center pt-3'>
                                                <button onClick={() => setIsMoreAddress(true)} type='button' className="text-white text-center w-full lg:w-1/2 bg-[#EB7E01] mb-3 border-0 py-2 px-6 focus:outline-none  hover:bg-[#fa9017] rounded-3xl text-lg"> + Add New Address</button>
                                            </div> */}

                                            {/* <div className="mt-5 mb-6">
                                                <h3 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-2 mt-5">Shipping Method</h3>
                                                <div className='border border-[#333333] rounded-lg'>
                                                    <div
                                                        className={`flex items-center rounded-t-lg justify-between p-3 cursor-pointer ${shippingMethod === "prepaidStandard" ? "bg-[#2B2B2B] text-white" : "bg-[#EFE9DA] text-[#757575]"}`}
                                                        onClick={() => setShippingMethod("prepaidStandard")} // Update state on click
                                                    >
                                                        <input
                                                            type="radio"
                                                            id="prepaidStandard"
                                                            name="shippingMethod"
                                                            value="prepaidStandard"
                                                            checked={shippingMethod === "prepaidStandard"}
                                                            className="mr-3"
                                                        />
                                                        <label htmlFor="prepaidStandard" className="flex justify-between w-full text-[18px] font-regola-pro font-[400]">
                                                            <span>Prepaid Standard (4-10 Business Days)</span>
                                                            <span>FREE</span>
                                                        </label>
                                                    </div>
                                                    <div
                                                        className={`flex items-center justify-between p-3 rounded-b-lg cursor-pointer ${shippingMethod === "expressShipping" ? "bg-[#2B2B2B] text-white" : "bg-[#EFE9DA] text-[#757575]"}`}
                                                        onClick={() => setShippingMethod("expressShipping")}
                                                    >
                                                        <input
                                                            type="radio"
                                                            id="expressShipping"
                                                            name="shippingMethod"
                                                            value="expressShipping"
                                                            checked={shippingMethod === "expressShipping"}
                                                            className="mr-3"
                                                        />
                                                        <label htmlFor="expressShipping" className="flex justify-between w-full text-[18px] font-regola-pro font-[400]">
                                                            <div className="flex flex-col">
                                                                <span>Express Shipping</span>
                                                                <span className="text-[14px] text-[#757575]">(Prepaid Order Only)</span>
                                                            </div>
                                                            <span className="text-right">₹150</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {shippingMethod === '' && (
                                                    <label className="text-sm text-red-500">Please select a shipping method</label>
                                                )}
                                            </div>

                                            <div className="relative flex flex-row items-start mb-2 ">
                                                <input type="checkbox" id="consent" name="consent" onChange={formikForLogin.handleChange} value={formikForLogin.values.consent} className="bg-[#EFE9DA] mt-2 rounded border  outline-none  " />
                                                <div className='pl-3'>
                                                    <label htmlFor="consent" className="text-[#2B2B2B] font-[300] text-[18px] font-regola-pro leading-[20.8px] ">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                                    <p className="text-[#757575] font-[300] text-[18px] font-regola-pro leading-[20.8px] mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                                                </div>
                                            </div> */}
                                            {/* {formikForLogin.touched.consent && formikForLogin.errors.consent && (<label className="text-sm text-red-500">{formikForLogin.errors.consent}</label>)} */}


                                            <button type='submit' className="rounded-lg font-skillet text-2xl lg:text-4xl mt-[20px] bg-[#000000] text-gray-100 w-full py-4">Checkout</button>
                                        </form>
                                    </>
                                    :
                                    null
                                }
                                {!isLogin ?
                                    <>
                                        <h2 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold my-5">Account Details</h2>
                                        <form onSubmit={formikForWitoutLogin.handleSubmit}>
                                            <div className="relative flex flex-col mb-4">
                                                <input type="text" placeholder='Email' name="email" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.email} className="w-full lg:w-[70%] bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]   py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForWitoutLogin.touched.email && formikForWitoutLogin.errors.email && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.email}</label>)}
                                            </div>
                                            <div className="relative flex flex-col mb-4">
                                                <input type="password" placeholder='Password' name="password" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.password} className="w-full lg:w-[70%] bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForWitoutLogin.touched.password && formikForWitoutLogin.errors.password && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.password}</label>)}
                                            </div>
                                            <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                                <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                    <input type="text" placeholder='First Name' name="firstName" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.firstName} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.firstName && formikForWitoutLogin.errors.firstName && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.firstName}</label>)}
                                                </div>
                                                <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                                    <input type="text" placeholder='Last Name' name="lastName" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.lastName} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.lastName && formikForWitoutLogin.errors.lastName && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.lastName}</label>)}
                                                </div>
                                            </div>
                                            {/* <h2 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-4">Shipping Address</h2>
                                            <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                                <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                    <input type="text" placeholder='First Name' name="firstName1" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.firstName1} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.firstName1 && formikForWitoutLogin.errors.firstName1 && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.firstName1}</label>)}
                                                </div>
                                                <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                                    <input type="text" placeholder='Last Name' name="lastName1" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.lastName1} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.lastName1 && formikForWitoutLogin.errors.lastName1 && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.lastName1}</label>)}
                                                </div>
                                            </div> */}
                                            {/* <div className="relative flex flex-col mb-4">
                                                <input type="text" placeholder='Shipping Address' name="address1" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.address1} className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForWitoutLogin.touched.address1 && formikForWitoutLogin.errors.address1 && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.address1}</label>)}
                                            </div> */}
                                            {/* <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                                <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                                    <select
                                                        name="province"
                                                        onChange={formikForWitoutLogin.handleChange}
                                                        value={formikForWitoutLogin.values.province}
                                                        className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro text-[20px] py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out"
                                                    >
                                                        <option value="" disabled>Select State</option>
                                                        {statesOfIndia.map((state, index) => (
                                                            <option key={index} value={state.name}>{state.name}</option>
                                                        ))}
                                                    </select>
                                                    {formikForWitoutLogin.touched.province && formikForWitoutLogin.errors.province && (
                                                        <label className="text-sm text-red-500">{formikForWitoutLogin.errors.province}</label>
                                                    )}
                                                </div>
                                                <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                    <input type="text" placeholder='City' name="city" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.city} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.city && formikForWitoutLogin.errors.city && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.city}</label>)}
                                                </div>
                                            </div>
                                            <div className=" relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                                <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                                    <input type="text" placeholder='Zip Code' name="zip" onChange={formikForWitoutLogin.handleChange} value={formikForLogin.values.zip} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.zip && formikForWitoutLogin.errors.zip && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.zip}</label>)}
                                                </div>
                                                <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                    <input type="text" placeholder='Phone Number' name='phoneNumber' onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.phoneNumber} className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                    {formikForWitoutLogin.touched.phoneNumber && formikForWitoutLogin.errors.phoneNumber && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.phoneNumber}</label>)}
                                                </div>
                                            </div> */}
                                            {/* <div className="relative flex flex-col mb-4">
                                                <input type="text" placeholder='Phone Number' name='phoneNumber' onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.phoneNumber} className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForWitoutLogin.touched.phoneNumber && formikForWitoutLogin.errors.phoneNumber && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.phoneNumber}</label>)}
                                            </div> */}
                                            {/* <div className="mt-5 mb-6">
                                                <h3 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-2 mt-5">Shipping Method</h3>
                                                <div className='border border-[#333333] rounded-lg'>
                                                    <div
                                                        className={`flex items-center rounded-t-lg justify-between p-3 cursor-pointer ${shippingMethod === "prepaidStandard" ? "bg-[#2B2B2B] text-white" : "bg-[#EFE9DA] text-[#757575]"}`}
                                                        onClick={() => setShippingMethod("prepaidStandard")} // Update state on click
                                                    >
                                                        <input
                                                            type="radio"
                                                            id="prepaidStandard"
                                                            name="shippingMethod"
                                                            value="prepaidStandard"
                                                            checked={shippingMethod === "prepaidStandard"}
                                                            className="mr-3"
                                                        />
                                                        <label htmlFor="prepaidStandard" className="flex justify-between w-full text-[18px] font-regola-pro font-[400]">
                                                            <span>Prepaid Standard (4-10 Business Days)</span>
                                                            <span>FREE</span>
                                                        </label>
                                                    </div>
                                                    <div
                                                        className={`flex items-center justify-between p-3 rounded-b-lg cursor-pointer ${shippingMethod === "expressShipping" ? "bg-[#2B2B2B] text-white" : "bg-[#EFE9DA] text-[#757575]"}`}
                                                        onClick={() => setShippingMethod("expressShipping")}
                                                    >
                                                        <input
                                                            type="radio"
                                                            id="expressShipping"
                                                            name="shippingMethod"
                                                            value="expressShipping"
                                                            checked={shippingMethod === "expressShipping"}
                                                            className="mr-3"
                                                        />
                                                        <label htmlFor="expressShipping" className="flex justify-between w-full text-[18px] font-regola-pro font-[400]">
                                                            <div className="flex flex-col">
                                                                <span>Express Shipping</span>
                                                                <span className="text-[14px] text-[#757575]">(Prepaid Order Only)</span>
                                                            </div>
                                                            <span className="text-right">₹150</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {shippingMethod === '' && (
                                                    <label className="text-sm text-red-500">Please select a shipping method</label>
                                                )}
                                            </div>
                                            <div className="relative flex flex-row items-start mb-2">
                                                <input type="checkbox" id="consent" name="consent" onChange={formikForWitoutLogin.handleChange} value={formikForWitoutLogin.values.consent} className="bg-[#EFE9DA] mt-2 rounded border  outline-none  " />
                                                <div className='pl-3'>
                                                    <label htmlFor="consent" className=" text-[#2B2B2B] font-[300] text-[18px] font-regola-pro leading-[20.8px] ">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                                    <p className="text-[#757575] font-[300] text-[18px] font-regola-pro leading-[20.8px] mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                                                </div>
                                            </div>
                                            {formikForWitoutLogin.touched.consent && formikForWitoutLogin.errors.consent && (<label className="text-sm text-red-500">{formikForWitoutLogin.errors.consent}</label>)} */}
                                            <button type='submit' className="rounded-lg font-skillet text-2xl lg:text-4xl mt-[20px] bg-[#000000] text-gray-100 w-full py-4">Checkout</button>
                                        </form>
                                    </> : null
                                }
                                {isMoreAddress && isLogin ?
                                    <form onSubmit={formikForAddMoreAdd.handleSubmit}>
                                        {/* <div className="flex items-center mt-4 mb-2">
                                            {userDetail?.customer?.addresses?.edges.length > 0 && <span title='Go back' className='mr-5 cursor-pointer' onClick={() => { setIsMoreAddress(false) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="mb-4 w-6 h-6">
                                                    <path fill="#333333" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                                </svg>
                                            </span>}
                                            <h2 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-4 mr-2">Shipping Address</h2>
                                        </div>
                                        <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                            <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                <input type="text" placeholder='First Name' name="firstName1" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.firstName1} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForAddMoreAdd.touched.firstName1 && formikForAddMoreAdd.errors.firstName1 && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.firstName1}</label>)}
                                            </div>
                                            <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                                <input type="text" placeholder='Last Name' name="lastName1" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.lastName1} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForAddMoreAdd.touched.lastName1 && formikForAddMoreAdd.errors.lastName1 && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.lastName1}</label>)}
                                            </div>
                                        </div>
                                        <div className="relative flex flex-col mb-4">
                                            <input type="text" placeholder='Shipping Address' name="address1" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.address1} className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                            {formikForAddMoreAdd.touched.address1 && formikForAddMoreAdd.errors.address1 && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.address1}</label>)}
                                        </div>
                                        <div className="relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                          
                                            <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                               
                                                <select
                                                    name="province"
                                                    onChange={formikForAddMoreAdd.handleChange}
                                                    value={formikForAddMoreAdd.values.province}
                                                    className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro text-[20px] py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out"
                                                >
                                                    <option value="" disabled>Select State</option>
                                                    {statesOfIndia.map((state, index) => (
                                                        <option key={index} value={state.name}>{state.name}</option>
                                                    ))}
                                                </select>

                                               
                                                {formikForAddMoreAdd.touched.province && formikForAddMoreAdd.errors.province && (
                                                    <label className="text-sm text-red-500">{formikForAddMoreAdd.errors.province}</label>
                                                )}
                                            </div>
                                            <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                <input type="text" placeholder='City' name="city" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.city} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForAddMoreAdd.touched.city && formikForAddMoreAdd.errors.city && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.city}</label>)}
                                            </div>
                                        </div>
                                        <div className=" relative flex flex-row  md:flex-col lg:flex-row gap-2 mb-1">
                                            <div className="w-1/2 md:w-full lg:w-1/2 flex flex-col relative mb-4">
                                                <input type="text" placeholder='Zip Code' name="zip" onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.zip} className="w-full  bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForAddMoreAdd.touched.zip && formikForAddMoreAdd.errors.zip && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.zip}</label>)}
                                            </div>
                                            <div className="w-1/2 md:w-full lg:w-1/2 relative flex flex-col mb-4">
                                                <input type="text" placeholder='Phone Number' name='phoneNumber' onChange={formikForAddMoreAdd.handleChange} value={formikForAddMoreAdd.values.phoneNumber} className="w-full bg-[#EFE9DA] rounded-[10px] outline-none text-[#757575] font-[400] font-regola-pro  text-[20px]  py-3 px-4 leading-[24px] transition-colors duration-200 ease-in-out" />
                                                {formikForAddMoreAdd.touched.phoneNumber && formikForAddMoreAdd.errors.phoneNumber && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.phoneNumber}</label>)}
                                            </div>
                                        </div> */}

                                        {/* <div className="mt-5 mb-6">
                                            <h3 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-2 mt-5">Shipping Method</h3>
                                            <div className='border border-[#333333] rounded-lg'>
                                                <div
                                                    className={`flex items-center rounded-t-lg justify-between p-3 cursor-pointer ${shippingMethod === "prepaidStandard" ? "bg-[#2B2B2B] text-white" : "bg-[#EFE9DA] text-[#757575]"}`}
                                                    onClick={() => setShippingMethod("prepaidStandard")} // Update state on click
                                                >
                                                    <input
                                                        type="radio"
                                                        id="prepaidStandard"
                                                        name="shippingMethod"
                                                        value="prepaidStandard"
                                                        checked={shippingMethod === "prepaidStandard"}
                                                        className="mr-3"
                                                    />
                                                    <label htmlFor="prepaidStandard" className="flex justify-between w-full text-[18px] font-regola-pro font-[400]">
                                                        <span>Prepaid Standard (4-10 Business Days)</span>
                                                        <span>FREE</span>
                                                    </label>
                                                </div>
                                                <div
                                                    className={`flex items-center justify-between p-3 rounded-b-lg cursor-pointer ${shippingMethod === "expressShipping" ? "bg-[#2B2B2B] text-white" : "bg-[#EFE9DA] text-[#757575]"}`}
                                                    onClick={() => setShippingMethod("expressShipping")}
                                                >
                                                    <input
                                                        type="radio"
                                                        id="expressShipping"
                                                        name="shippingMethod"
                                                        value="expressShipping"
                                                        checked={shippingMethod === "expressShipping"}
                                                        className="mr-3"
                                                    />
                                                    <label htmlFor="expressShipping" className="flex justify-between w-full text-[18px] font-regola-pro font-[400]">
                                                        <div className="flex flex-col">
                                                            <span>Express Shipping</span>
                                                            <span className="text-[14px] text-[#757575]">(Prepaid Order Only)</span>
                                                        </div>
                                                        <span className="text-right">₹150</span>
                                                    </label>
                                                </div>
                                            </div>
                                            {shippingMethod === '' && (
                                                <label className="text-sm text-red-500">Please select a shipping method</label>
                                            )}
                                        </div>
                                        <div className="relative flex flex-row items-start mb-2">
                                            <input type="checkbox" id="consent" name="consent" onChange={formikForAddMoreAdd.handleChange} value={formikForWitoutLogin.values.consent} className="bg-[#EFE9DA] mt-2 rounded border  outline-none  " />
                                            <div className='pl-3'>
                                                <label htmlFor="consent" className="text-[#2B2B2B] font-[300] text-[18px] font-regola-pro leading-[20.8px] ">I would like to receive order tracking updates, promotions, and special offers through text.*</label>
                                                <p className="text-[#757575] font-[300] text-[18px] font-regola-pro leading-[20.8px] mt-3">*Consent is not a condition to purchase. Msg & data rates may apply. Msg frequency varies.</p>
                                            </div>
                                        </div>
                                        {formikForAddMoreAdd.touched.consent && formikForAddMoreAdd.errors.consent && (<label className="text-sm text-red-500">{formikForAddMoreAdd.errors.consent}</label>)} */}
                                        <button type='submit' className="rounded-lg font-skillet text-2xl lg:text-4xl mt-[20px] bg-[#000000] text-gray-100 w-full py-4">Checkout</button>
                                    </form>
                                    : null
                                }

                                {/* <button type='button' className='rounded-lg font-skillet text-2xl lg:text-4xl mt-[110px] bg-gray-900 text-gray-100 w-full py-4'>Checkout</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <LoadingAnimation />}
        </>
    )
}

export default CardReview