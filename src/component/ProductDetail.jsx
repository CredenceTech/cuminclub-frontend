import React, { useEffect, useState } from 'react'
import { getProductDetailQuery, graphQLClient } from "../api/graphql";
import redChillyImage from "../assets/red-chilly.svg";
import plusImage from "../assets/plus.svg";
import minusImage from "../assets/minus.svg";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';


const ProductDetail = () => {
    const [detail, setDetail] = useState();

    useEffect(() => {
        apiResponse();
    }, []);

    const apiResponse = async () => {
        const response = await graphQLClient.request(getProductDetailQuery);
        setDetail(response);
        console.log(detail, "Product Detail");
        return response;
    }

    return (
        <div >
            <div className="flex flex-wrap w-full ml-20 mt-16">
                <div className='w-2/3'>
                    <div className="text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                        Palak panir
                    </div>
                    <img className="shadow ml-96" src="https://via.placeholder.com/255x240" />
                    <div className="w-[425px] ml-72 mt-5 text-center text-zinc-800 text-xl font-normal font-['Outfit'] ">
                        A beloved Indian menu item all around the world!
                        This flavorful dish is made with Indian cottage cheese cubes in a smooth spinach base,
                        with tomatoes providing a tangy twist.<br /><br />
                    </div>
                    <div className="flex" style={{ marginLeft: '460px' }}>
                        <img src={redChillyImage} alt="chilly" />
                        <img src={redChillyImage} alt="chilly" />
                        <img src={redChillyImage} alt="chilly" />
                        <img src={redChillyImage} alt="chilly" />
                    </div>
                    <div className="flex mt-4" style={{ marginLeft: '445px' }}>
                        <img src={minusImage} alt="minus" />
                        <input className='w-[40px] h-[30px] ml-3 mr-3' name="qty" />
                        <img src={plusImage} alt="plus" />
                    </div>
                </div>
                <div className="w-1/3 -ml-48 mt-1">
                    <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }}>
                        <AccordionSummary>
                            <Typography>Serving Size</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Accordion Content</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }} >
                        <AccordionSummary>
                            <Typography>Ingredients</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Accordion Content Ingredients</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }}>
                        <AccordionSummary>
                            <Typography>Nutrition Facts</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <span className="text-zinc-800 text-[15px] font-semibold font-['Outfit']">
                                    2 Servings per pack<br />
                                </span>
                                <span className="text-zinc-800 text-[15px] font-medium font-['Outfit']"><br /></span>
                                <span className="text-zinc-800 text-[15px] font-semibold font-['Outfit']">
                                    Per serving nutrition facts:<br />
                                </span>
                                <span className="text-zinc-800 text-[15px] font-normal font-['Outfit']">
                                    Calories 138Kcal, Protein 6g, Total Carbohydrate 6g, Total Fat 10g, Sodium 504mg, Saturated Fat 4g,
                                    Dietary Fibre 2g, Total Sugars 2g, Added Sugars 1g, Calcium 105mg, Iron 1mg, Potassium 104mg
                                </span>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='w-[300px]' style={{ background: '#F5F5F5' }}>
                        <AccordionSummary>
                            <Typography>How To Prepare</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Accordion Content How To Prepare</Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
            <div className="">
                <div className="text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                    Recommended Sides
                </div>
                <div className="text-center text-zinc-800 text-xl font-normal font-['Outfit']">
                    Recommended Sides with Palak Paneer
                </div>
                <div className="w-[258px] h-[383px] ml-48 bg-white rounded-2xl shadow border border-stone-300">
                    <img className="ml-6 mt-2" src="https://via.placeholder.com/204x205" />
                    <div className="text-center text-lime-600 text-xl font-bold font-['Outfit']">
                        Shahi Paneer
                    </div>
                    <div className="text-center text-zinc-800 text-xs font-normal font-['Outfit']">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </div>
                    <div className="flex ml-20 mt-2">
                        <img src={redChillyImage} alt="chilly" />
                        <img src={redChillyImage} alt="chilly" />
                        <img src={redChillyImage} alt="chilly" />
                        <img src={redChillyImage} alt="chilly" />
                    </div>
                    <div className="flex ml-16 mt-4">
                        <img src={minusImage} alt="minus" />
                        <input className='w-[40px] h-[30px] ml-3 mr-3 border border-stone-400' name="qty1" />
                        <img src={plusImage} alt="plus" />
                    </div>
                </div>
            </div>
        </div>


    )
}

export default ProductDetail

