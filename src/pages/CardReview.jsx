import React, { useState, useEffect } from 'react'
import product from '../assets/Dish-1.jpg'
import { createCartMutation, graphQLClient, updateCartItemMutation, updateCartMutation } from '../api/graphql';
import { addCartData, cartData, clearCartData, clearCartResponse, selectCartResponse, setCartResponse, } from '../state/cartData';
import { useDispatch, useSelector } from 'react-redux';
import LoadingAnimation from "../component/Loader";
import {
    fetchCustomerInfoQuery,
    registerAccountMutation,
    signInMutation,
} from "../api/graphql";
import plus from "../assets/cross.svg"
import OrderProduct from '../component/OrderProduct'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addCustomerAccessToken, addUserId, customerAccessTokenData, userEmails } from '../state/user';
import { filterData } from '../state/selectedCountry';
import toast from 'react-hot-toast';
import BlazeSDK from '@juspay/blaze-sdk-web';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearCheckoutData, clearCheckoutResponse, selectCheckoutResponse } from '../state/checkoutData';
import BundleProductsModal from '../component/BundleProductsModal';

const CardReview = () => {
    const cartDatas = useSelector(cartData);
    const location = useLocation();
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
    const checkoutResponse = useSelector(selectCheckoutResponse);
    const queryParams = new URLSearchParams(location.search);
    const isBuyNow = queryParams.get("isBuyNow");
    const [bundleModalData, setBundleModalData] = useState(null);
    const [isSelectedModel, setIsSelectedModel] = useState(null);
    const openBundleModal = (data) => {
        setBundleModalData(data);
    };
    const closeBundleModal = () => {
        setBundleModalData(null);
    };

    // useEffect(() => {
    //     if (isBuyNow === true) {
    //         fbq('track', 'InitiateCheckout', {
    //             content_ids: checkoutResponse?.checkout?.lineItems?.edges[0]?.node.variant.id.split("/").pop(),
    //             content_type: 'product',
    //             value: checkoutResponse?.checkout?.lineItems?.edges[0]?.node?.variant?.priceV2?.amount,
    //             currency: 'INR',
    //         });
    //         gtag('event', 'conversion', {
    //             'send_to': 'AW-16743837274/zisbCK38h_gZENrcirA-',
    //             'value': checkoutResponse?.checkout?.lineItems?.edges[0]?.node?.variant?.priceV2?.amount,
    //             'currency': 'INR'
    //         });
    //     }
    //     else {
    //         fbq('track', 'InitiateCheckout', {
    //             content_ids: cartResponse.cart?.lines?.edges.map(line => line.node.merchandise.product.id.split("/").pop()),
    //             content_type: 'product_group',
    //             value: cartResponse?.cart?.cost?.totalAmount?.amount,
    //             currency: 'INR',
    //         });
    //         gtag('event', 'conversion', {
    //             'send_to': 'AW-16743837274/zisbCK38h_gZENrcirA-',
    //             'value': cartResponse?.cart?.cost?.totalAmount?.amount,
    //             'currency': 'INR'
    //         });
    //     }

    // }, [isBuyNow, checkoutResponse, cartResponse])

    // const handlePurchasePixel = () => {
    //     if (isBuyNow === true) {
    //         fbq('track', 'Purchase', {
    //             value: checkoutResponse?.checkout?.lineItems?.edges[0]?.node?.variant?.priceV2?.amount,
    //             currency: 'INR',
    //         });
    //         gtag('event', 'conversion', {
    //             'send_to': 'AW-16743837274/g336COLsjPgZENrcirA-',
    //             'value': checkoutResponse?.checkout?.lineItems?.edges[0]?.node?.variant?.priceV2?.amount,
    //             'currency': 'INR',
    //             'transaction_id': ''
    //         });
    //     }
    //     else {
    //         fbq('track', 'Purchase', {
    //             value: cartResponse?.cart?.cost?.totalAmount?.amount,
    //             currency: 'INR',
    //         });
    //         gtag('event', 'conversion', {
    //             'send_to': 'AW-16743837274/g336COLsjPgZENrcirA-',
    //             'value': cartResponse?.cart?.cost?.totalAmount?.amount,
    //             'currency': 'INR',
    //             'transaction_id': ''
    //         });
    //     }
    // };

    const cancelOrder = () => {
        dispatch(clearCheckoutData())
        dispatch(clearCheckoutResponse())
    }
    const callbackMethod = (response) => {
        let result = JSON.parse(response)
        if (result?.payload?.methodName === "clearCart") {

            if (checkoutResponse !== null) {
                fbq('track', 'Purchase', {
                    value: checkoutResponse?.checkout?.lineItems?.edges[0]?.node?.variant?.priceV2?.amount,
                    currency: 'INR',
                });
                gtag('event', 'conversion', {
                    'send_to': 'AW-16743837274/g336COLsjPgZENrcirA-',
                    'value': checkoutResponse?.checkout?.lineItems?.edges[0]?.node?.variant?.priceV2?.amount,
                    'currency': 'INR',
                    'transaction_id': ''
                });
                dispatch(clearCheckoutData());
                dispatch(clearCheckoutResponse());
            } else {
                fbq('track', 'Purchase', {
                    value: cartResponse?.cart?.cost?.totalAmount?.amount,
                    currency: 'INR',
                });
                gtag('event', 'conversion', {
                    'send_to': 'AW-16743837274/g336COLsjPgZENrcirA-',
                    'value': cartResponse?.cart?.cost?.totalAmount?.amount,
                    'currency': 'INR',
                    'transaction_id': ''
                });
                dispatch(clearCartData());
                dispatch(clearCartResponse());
            }

        }
        if (result?.payload?.ctaAction === "shopMore") {
            navigate("/", { replace: true });
            BlazeSDK.terminate();
            return;
        } else if (result?.payload?.ctaAction === "trackOrder") {
            navigate("/Invoices", { replace: true });
            BlazeSDK.terminate();
            return;
        }



    };



    useEffect(() => {
        const sdkPayload = createSDKPayload({
            merchantId: 'instantly',
            environment: 'release',
            shopUrl: 'https://76ac20-2.myshopify.com'
        });

        console.log('Initiating Blaze SDK with payload:', sdkPayload);
        BlazeSDK.initiate(sdkPayload, callbackMethod);

    }, [])

    useEffect(() => {
        if (loginUserCustomerId) {
            setIsLogin(true)
            getCustomerDetail();
        }
    }, [loginUserCustomerId])

    useEffect(() => {
        createCheckoutURL(loginUserCustomerId);
    }, [])

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
        setLoading((prevLoading) => ({ ...prevLoading, [productId]: true }));
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
        continuePayment();
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
        const cart = cartResponse?.cart;
        const checkout = checkoutResponse?.cart;
        let processPayload;
        if (isBuyNow) {
            processPayload = createSDKPayload({
                "action": "startCheckout",
                "cart":
                {
                    "token": checkout.id.split('Cart/')[1],
                    "note": "",
                    "attributes": {},
                    "original_total_price": checkout.cost.totalAmount.amount * 100,
                    "total_price": checkout.cost.totalAmount.amount * 100,
                    "total_discount": 0,
                    "total_weight": parseInt(calculateTotalWeight(checkout.lines)),
                    "item_count": parseInt(calculateTotalQuantity(checkout.lines)),
                    "items": checkout.lines.edges.map(edge => {
                        const product = edge.node.merchandise.product;
                        const variant = edge.node.merchandise;
                        const quantity = edge.node.quantity;
                        const price = variant.priceV2.amount * 100;

                        return {
                            "id": parseInt(variant.id.split("/").pop()),
                            "properties": {},
                            "quantity": quantity,
                            "variant_id": parseInt(variant.id.split("/").pop()),
                            "key": `${variant.id.split("/").pop()}:${new URLSearchParams(checkout.id.split('?')[1]).get('key')}`,
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
                                "alt": product.title,
                                "height": 2000,
                                "url": product.metafields[0].reference.image.originalSrc,
                                "width": 2000
                            },
                            "image": product.metafields[0].reference.image.originalSrc,
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
                    "currency": checkout.cost.totalAmount.currencyCode,
                    "items_subtotal_price": checkout.cost.subtotalAmount.amount * 100,
                    "cart_level_discount_applications": []
                },
            });
            console.log("ttttttttt", processPayload);
        }
        else {
            processPayload = createSDKPayload({
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
                                "alt": product.title,
                                "height": 2000,
                                "url": product.metafields[0].reference.image.originalSrc,
                                "width": 2000
                            },
                            "image": product.metafields[0].reference.image.originalSrc,
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
        }

        console.log('Processing payment with payload:', processPayload);

        BlazeSDK.process(processPayload);
        setIsLoading(false)
    }

    function initiatePayment(payload) {

        processPayment(payload);
    }


    const continuePayment = async () => {
        setIsLoading(true);
        const payload = {
            email: userEmail?.email,
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
        updateCartResponseWithRelatedProducts();
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
                    <h1 className='text-2xl md:text-[54px] leading-[54px] font-[400] p-4 font-skillet text-[#231F20] pt-5 lg:pt-9'>Review your {isBuyNow ? "Order" : "Cart"}</h1>
                    <div className='flex flex-col gap-4 md:gap-6 md:flex-row justify-between'>
                        <div className='w-full px-4 md:w-1/2 mb-4'>
                            {(isBuyNow && checkoutResponse !== null) && (
                                <div className='flex flex-col'>
                                    <div className="flex flex-row items-center">
                                        <img
                                            src={
                                                checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.product
                                                    ?.metafields?.find(metafield => metafield && metafield.key === "image_for_home")?.reference?.image?.originalSrc
                                            }
                                            alt={
                                                checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.product?.title
                                            }
                                            className="h-[85.1px] w-[85.1px] rounded-lg"
                                        />
                                        <div className="ml-4">
                                            <h1 className="text-xl md:text-[36px] leading-[20px] md:leading-[36px] font-[400] font-skillet text-[#333333]">
                                                {checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.product?.title}
                                            </h1>
                                            <p className="font-skillet text-[#757575] text-[24px] md:text-[28px] leading-[28.18px] font-[400]">
                                                <span className="text-[20px] leading-[20.1px]">₹</span>{" "}
                                                {checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.priceV2?.amount}
                                            </p>
                                            {(checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.product?.metafields?.find(
                                                (metafield) => metafield && metafield.key === "bundle_product"
                                            )?.value) && <p onClick={() => openBundleModal(checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.product?.metafields?.find(
                                                (metafield) => metafield && metafield.key === "bundle_product"
                                            )?.value)} className="font-regola-pro text-[#333333] cursor-pointer text-[18px] md:text-[20px] leading-[28.18px] font-[400] underline hover:text-gray-700">
                                                    view products
                                                </p>
                                            }
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => cancelOrder()}
                                                type="button"
                                                className="text-[#F15E2A] flex flex-col m-0 md:m-7 font-regola-pro font-[500] text-xl border-b border-b-[#F15E2A]"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </div>
                                    <div className='ml-24'>
                                        {(checkoutResponse?.cart?.lines?.edges[0]?.node?.merchandise?.product?.metafields?.find(metafield => metafield && metafield.key === "bundle_product")?.value) && bundleModalData && <BundleProductsModal data={bundleModalData} onClose={closeBundleModal} />}
                                    </div>
                                </div>)}

                            {(!isBuyNow) && cartResponse?.cart?.lines?.edges?.map((line, index) => {
                                return <div className='py-3 lg:mr-24 border-b-[0.99px] border-[#A3A3A3]'>
                                    <div key={index} className='flex  items-center justify-between '>
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
                                                {(line?.node?.merchandise?.product
                                                    ?.metafields?.find(metafield => metafield && metafield.key === "bundle_product")?.value) && <p className="font-regola-pro text-[#333333] cursor-pointer text-[18px] md:text-[20px] leading-[28.18px] font-[400] underline hover:text-gray-700" onClick={() => {
                                                        openBundleModal(line?.node?.merchandise?.product
                                                            ?.metafields?.find(metafield => metafield && metafield.key === "bundle_product")?.value); setIsSelectedModel(index)
                                                    }}>
                                                        view products
                                                    </p>
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
                                    <div className='ml-24'>
                                        {(line?.node?.merchandise?.product?.metafields?.find(metafield => metafield && metafield.key === "bundle_product")?.value) && (isSelectedModel === index) && bundleModalData && <BundleProductsModal data={bundleModalData} onClose={closeBundleModal} />}
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
                                {(!isBuyNow) &&
                                    <div className="mt-3">
                                        <div className="flex flex-row justify-between mb-2">
                                            <p className="text-[1.5rem] font-skillet lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Amount</p>
                                            <p className="text-[1.5rem] text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">
                                                ₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{parseInt(cartResponse?.cart?.cost?.totalAmount?.amount) || 0}</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-row justify-between mt-3 border-t border-[#333333] pt-3">
                                            <p className="text-[1.5rem] font-skillet lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Total</p>
                                            <p className="text-[1.5rem] text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">
                                                ₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{(parseInt(cartResponse?.cart?.cost?.totalAmount?.amount) || 0) + shippingCost}</span>
                                            </p>
                                        </div>
                                    </div>
                                }

                                {(isBuyNow) && <div className="mt-3">
                                    <div className="flex flex-row justify-between mb-2">
                                        <p className="text-[1.5rem] font-skillet lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Amount</p>
                                        <p className="text-[1.5rem] text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">
                                            ₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{parseInt(checkoutResponse?.cart?.cost?.totalAmount?.amount) || 0}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-row justify-between mt-3 border-t border-[#333333] pt-3">
                                        <p className="text-[1.5rem] font-skillet lg:text-[37.34px] font-[400] leading-[37.45px] text-[#333333]">Total</p>
                                        <p className="text-[1.5rem] text-[#279C66] font-skillet lg:text-[37px] font-[400] leading-[37.5px]">
                                            ₹ <span className='lg:text-[52px] font-[400] leading-[52.5px]'>{parseInt(checkoutResponse?.cart?.cost?.totalAmount?.amount) || 0}</span>
                                        </p>
                                    </div>
                                </div>}
                                <p className='text-[#757575] text-[16px] md:text-[20px] font-[500] leading-[26.45px] text-start md:text-end font-regola-pro'>Tax included and shipping calculated at checkout</p>

                                {/* <h2 className="text-[#333333] text-[28px] md:text-[30px] font-regola-pro leading-[43.2px] font-bold mb-2 mt-5 ">Account Details</h2> */}
                                <form onSubmit={formikForLogin.handleSubmit}>
                                    <button type='submit' className="rounded-lg font-skillet text-[24px] md:text-4xl font-[300] leading-[30px] md:font-[700] md:leading-[50px] mt-[20px] bg-[#000000] text-gray-100 w-full py-4" >Checkout</button>
                                </form>

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