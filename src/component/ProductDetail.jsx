import React, { useEffect, useState } from 'react'
import { getProductDetailQuery, getProductRecommendedQuery, graphQLClient } from "../api/graphql";
import redChillyImage from "../assets/red-chilly.svg";
import whiteChillyImage from "../assets/white-chilli.svg";
import plusImage from "../assets/plus.svg";
import minusImage from "../assets/minus.svg";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';

const metafieldList = [
    { value: 'spice_level', text: 'Spice Level' },
    { value: 'ingredient', text: 'Ingredient' },
    { value: 'nutrition_facts', text: 'Nutrition Facts' },
    { value: 'how_to_prepare', text: 'How To Prepare' },
];

const ProductDetail = () => {
    var rootElement = document.getElementById('root');
    rootElement.classList.remove('backgroundImage');
    rootElement.classList.add('backgroundImage2');

    const location = useLocation();
    const [apiProductResponse, setApiProductResponse] = useState(null);
    const [apiRecommendedResponse, setApiRecommendedResponse] = useState(null);

    const [data, setData] = useState(null);
    const [dataRecommended, setDataRecommended] = useState(null);
    const [redChilli, setDataRedChilli] = useState([]);
    // const [productQty, setDataProductQty] = useState(0);
    // const [whiteChilli, setDataWhiteChilli] = useState([]);

    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    console.log(location.state.id, "Product Id")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await graphQLClient.request(getProductDetailQuery, {
                    productId: location.state.id
                });
                console.log("Product Detail", response);
                setData(response.product);
                setApiProductResponse(true);
                if (response && response.product && response.product.metafields) {
                    const spiceLevelData = response.product.metafields.find(x => x.key === 'spice_level');
                    if (spiceLevelData) {
                        const RC = spiceLevelData.value;
                        const RCL = [];
                        // const WC = (4 - spiceLevelData.value);
                        // const WCL = [];
                        for (let i = 1; i <= RC; i++) {
                            RCL.push(i);
                        }
                        // for (let i = 1; i <= WC; i++) {
                        //     WCL.push(i);
                        // }
                        setDataRedChilli(RCL);
                        //  setDataWhiteChilli(WCL);
                    }
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        const fetchProductRecommendedData = async () => {
            try {
                const response = await graphQLClient.request(getProductRecommendedQuery, {
                    productId: location.state.id
                });
                console.log("Product Recommended", response);
                setApiRecommendedResponse(true);
                let recommendedList = response.productRecommendations.map(data => ({
                    ...data,
                    qty: 0,
                }));
                console.log("dataRecommended", recommendedList);
                setDataRecommended(recommendedList);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
        fetchProductRecommendedData();
    }, []);


    const getMetafieldData = (key, list) => {
        let metaContent = '';
        if (list) {
            let findValue = list.find((x) => x.key === key);
            if (findValue) {
                metaContent = findValue.value;
            }
        }
        return metaContent;
    };

    const generateImages = (list) => {
        const listItems = [];
        if (list) {
            const spiceLevelData = list.find(x => x.key === 'spice_level');
            if (spiceLevelData) {
                const RC = spiceLevelData.value;
                //   const WC = (4 - spiceLevelData.value);
                for (let i = 1; i <= RC; i++) {
                    listItems.push(<img src={redChillyImage} alt="chilly" />);
                }
                // for (let i = 1; i <= WC; i++) {
                //     listItems.push(<img src={whiteChillyImage} alt="chilly" />);
                // }
            }
        }
        return listItems;
    };

    // const increaseQuantity = () => {
    //     setDataProductQty(productQty + 1);
    // };

    // const decreaseQuantity = () => {
    //     if (productQty > 0) {
    //         setDataProductQty(productQty - 1);
    //     }
    // };

    const getProductQuantityInCart = (productId) => {
        const cartItem = cartItems.find((item) => item.merchandiseId === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    const handleAddToCart = (productId) => {
        const existingItemIndex = cartItems.findIndex(
            (item) => item.merchandiseId === productId
        );

        if (existingItemIndex !== -1) {
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: updatedCart[existingItemIndex].quantity + 1,
            };
            setCartItems(updatedCart);
        } else {
            setCartItems([...cartItems, { merchandiseId: productId, quantity: 1 }]);
        }

        setCartCount((prevCount) => prevCount + 1);
    };

    const handleRemoveFromCart = (productId) => {
        const existingItemIndex = cartItems.findIndex(
            (item) => item.merchandiseId === productId
        );

        if (existingItemIndex !== -1) {
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: Math.max(0, updatedCart[existingItemIndex].quantity - 1),
            };

            setCartCount((prevCount) => Math.max(0, prevCount - 1));
            if (updatedCart[existingItemIndex].quantity === 0) {
                updatedCart.splice(existingItemIndex, 1);
            }

            setCartItems(updatedCart);
        }
    };

    return (
        <>
            {apiProductResponse ? (
                <div className="flex flex-wrap ml-20 mt-16">
                    <div className='w-2/3'>
                        <div className="text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                            {data?.title}
                        </div>
                        <img className="shadow ml-96 h-[240px] w-[240px]" src={data?.featuredImage?.url} />
                        <div className="w-[425px] ml-72 mt-5 text-center text-zinc-800 text-xl font-normal font-['Outfit'] ">
                            {data?.description}<br /><br />
                        </div>
                        <div className="flex" style={{ marginLeft: '450px' }}>
                            {redChilli?.map(item => (
                                <img src={redChillyImage} alt="chilly" />
                            ))}
                            {/* {whiteChilli?.map(item => (
                                <img src={whiteChillyImage} alt="chilly" />
                            ))} */}
                        </div>
                        {/* <div className="flex mt-4" style={{ marginLeft: '445px' }}>
                        <img className={productQty >= 0 ? 'cursor-pointer' : null} src={minusImage} alt="minus" onClick={decreaseQuantity} />
                        <input className='w-[40px] h-[30px] ml-3 mr-3 text-center' name="qty" id="qty" value={productQty} />
                        <img className='cursor-pointer' src={plusImage} alt="plus" onClick={increaseQuantity} />
                        </div> */}
                        <div className="flex gap-2 items-center mt-4" style={{ marginLeft: '445px' }}>
                            <button onClick={() =>
                                handleRemoveFromCart(
                                    data?.variants?.edges[0]?.node?.id
                                )
                            }>
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
                                {getProductQuantityInCart(
                                    data?.variants?.edges[0]?.node?.id
                                )}
                            </span>
                            <button onClick={() =>
                                handleAddToCart(
                                    data?.variants?.edges[0]?.node?.id
                                )
                            }>
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
                    </div>
                    <div className="w-1/3 -ml-48 mt-1">
                        <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }} >
                            <AccordionSummary>
                                <Typography>Spice Level</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <pre style={{ whiteSpace: 'pre-wrap', width: '100%' }}>
                                        {getMetafieldData('spice_level', data?.metafields)}
                                    </pre>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }} >
                            <AccordionSummary>
                                <Typography>Ingredient</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <pre style={{ whiteSpace: 'pre-wrap', width: '100%' }}>
                                        {getMetafieldData('ingredient', data?.metafields)}
                                    </pre>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }} >
                            <AccordionSummary>
                                <Typography>Nutrition Facts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <pre style={{ whiteSpace: 'pre-wrap', width: '100%' }}>
                                        {getMetafieldData('nutrition_facts', data?.metafields)}
                                    </pre>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }} >
                            <AccordionSummary>
                                <Typography>How To Prepare</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <pre style={{ whiteSpace: 'pre-wrap', width: '100%' }}>
                                        {getMetafieldData('how_to_prepare', data?.metafields)}
                                    </pre>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div >
            ) : (
                <p>Loading...</p>
            )}
            {apiRecommendedResponse ? (
                <div className="">
                    <div className="text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                        Recommended Sides
                    </div>
                    <div className="text-center text-zinc-800 text-xl font-normal font-['Outfit']">
                        Recommended Sides with {data?.title}
                    </div>
                    <div className="flex flex-wrap">
                        {dataRecommended?.map((item, index) => (
                            <div style={{ width: '22%' }}>
                                <div className="w-[258px] h-[430px] ml-48 mb-3.5 bg-white rounded-2xl shadow border border-stone-300">
                                    <img className="ml-6 mt-2 h-[205px] w-[204px]" src={item?.variants?.edges[0]?.node?.image?.url} />
                                    <div className="text-center text-lime-600 text-xl font-bold font-['Outfit']">
                                        {item?.title}
                                    </div>
                                    <div className="text-center text-zinc-800 text-xs font-normal font-['Outfit']">
                                        {/* {item?.description} */}
                                        {(item?.variants?.edges[0]?.node?.product?.metafields &&
                                            item?.variants?.edges[0]?.node?.product?.metafields.find(
                                                (metafield) =>
                                                    metafield?.key === "small_descriptions"
                                            )?.value) ||
                                            ""}
                                    </div>
                                    <div className="flex ml-20 mt-2">
                                        {generateImages(item?.variants?.edges[0]?.node?.product?.metafields)}
                                    </div>
                                    {/* <div className="flex ml-16 mt-4">
                                        <img src={minusImage} alt="minus" />
                                        <input name={'qty' + index} value={item?.qty} className='w-[40px] h-[30px] ml-3 mr-3 text-center border border-stone-400' />
                                        <img src={plusImage} alt="plus" />
                                    </div> */}
                                    <div className="flex gap-2 items-center ml-16 mt-4">
                                        <button onClick={() =>
                                            handleRemoveFromCart(
                                                item?.variants?.edges[0]?.node?.id
                                            )
                                        }>
                                            <svg width="18" height="18" viewBox="0 0 18 18"
                                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z"
                                                    fill="#333333"
                                                />
                                            </svg>
                                        </button>
                                        <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                                            {getProductQuantityInCart(
                                                item?.variants?.edges[0]?.node?.id
                                            )}
                                        </span>
                                        <button onClick={() =>
                                            handleAddToCart(
                                                item?.variants?.edges[0]?.node?.id
                                            )
                                        }>
                                            <svg width="18" height="18" viewBox="0 0 18 18"
                                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.84615V8.30769H4.84615V9.69231H8.30769V13.1538H9.69231V9.69231H13.1538V8.30769H9.69231V4.84615H8.30769Z"
                                                    fill="#333333"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>


    )
}

export default ProductDetail