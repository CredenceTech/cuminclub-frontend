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
    const [data, setData] = useState(null);
    const [dataRecommended, setDataRecommended] = useState(null);
    const [productQty, setDataProductQty] = useState(0);
    const [redChilli, setDataRedChilli] = useState([]);
    const [whiteChilli, setDataWhiteChilli] = useState([]);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(location.state.id, "Product Id")

    // useEffect(() => {
    //     apiResponse();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await graphQLClient.request(getProductDetailQuery);
                console.log("Product Detail", response);
                setData(response.product);
                if (response && response.product && response.product.metafields) {
                    const spiceLevelData = response.product.metafields.find(x => x.key === 'spice_level');
                    if (spiceLevelData) {
                        const RC = spiceLevelData.value;
                        const WC = (4 - spiceLevelData.value);
                        const RCL = [];
                        const WCL = [];
                        for (let i = 1; i <= RC; i++) {
                            RCL.push(i);
                        }
                        for (let i = 1; i <= WC; i++) {
                            WCL.push(i);
                        }
                        setDataRedChilli(RCL);
                        setDataWhiteChilli(WCL);
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
                const response = await graphQLClient.request(getProductRecommendedQuery);
                console.log("Product Recommended", response);
                // const recommendedList = [];
                response.productRecommendations;
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
                const WC = (4 - spiceLevelData.value);
                for (let i = 1; i <= RC; i++) {
                    listItems.push(<img src={redChillyImage} alt="chilly" />);
                }
                for (let i = 1; i <= WC; i++) {
                    listItems.push(<img src={whiteChillyImage} alt="chilly" />);
                }
            }
        }
        return listItems;
    };

    const increaseQuantity = () => {
        setDataProductQty(productQty + 1);
    };

    const decreaseQuantity = () => {
        if (productQty > 0) {
            setDataProductQty(productQty - 1);
        }
    };

    return (
        <>
            <div className="flex flex-wrap ml-20 mt-16">
                <div className='w-2/3'>
                    <div className="text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                        {data?.title}
                    </div>
                    <img className="shadow ml-96 h-[240px] w-[240px]" src={data?.featuredImage?.url} />
                    <div className="w-[425px] ml-72 mt-5 text-center text-zinc-800 text-xl font-normal font-['Outfit'] ">
                        {data?.description}<br /><br />
                    </div>
                    <div className="flex" style={{ marginLeft: '460px' }}>
                        {redChilli?.map(item => (
                            <img src={redChillyImage} alt="chilly" />
                        ))}
                        {whiteChilli?.map(item => (
                            <img src={whiteChillyImage} alt="chilly" />
                        ))}
                    </div>
                    <div className="flex mt-4" style={{ marginLeft: '445px' }}>
                        <img className={productQty >= 0 ? 'cursor-pointer' : null} src={minusImage} alt="minus" onClick={decreaseQuantity} />
                        <input className='w-[40px] h-[30px] ml-3 mr-3 text-center' name="qty" id="qty" value={productQty} />
                        <img className='cursor-pointer' src={plusImage} alt="plus" onClick={increaseQuantity} />
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
                                    {item?.description}
                                </div>
                                <div className="flex ml-20 mt-2">
                                    {generateImages(item?.variants?.edges[0]?.node?.product?.metafields)}
                                </div>
                                <div className="flex ml-16 mt-4">
                                    <img src={minusImage} alt="minus" />
                                    <input name={'qty' + index} value={item?.qty} className='w-[40px] h-[30px] ml-3 mr-3  text-center border border-stone-400' />
                                    <img src={plusImage} alt="plus" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>


    )
}

export default ProductDetail