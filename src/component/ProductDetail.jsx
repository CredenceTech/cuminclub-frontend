import React, { useEffect, useState } from 'react'
import { getProductDetailQuery, graphQLClient } from "../api/graphql";
import redChillyImage from "../assets/red-chilly.svg";
import plusImage from "../assets/plus.svg";
import minusImage from "../assets/minus.svg";

const ProductDetail = () => {
    const [detail, setDetail] = useState();

    useEffect(() => {
        const list = apiResponse();
        setDetail(list);
        console.log('i fire once', detail);
    }, []);

    const apiResponse = async () => {
        const response = await graphQLClient.request(getProductDetailQuery);
        console.log(response, "Product Detail");
        return response;
    }



    return (

        <div className="w-[1440px] h-[1381px] relative ml-20">
            <img className="w-[255px] h-60 left-[353px] top-[188px] absolute shadow" src="https://via.placeholder.com/255x240" />
            <div className="w-[263px] h-[23px] left-[348px] top-[140px] absolute text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                {detail.title}
            </div>
            <div className="w-[351px] h-[54px] left-[826px] top-[188px] absolute">
                <div className="w-[351px] h-[54px] left-0 top-0 absolute bg-neutral-100 rounded-[10px]" />
                <div className="left-[25px] top-[19px] absolute text-zinc-800 text-xl font-medium font-['Outfit']">Serving Size</div>
            </div>
            <div className="w-[351px] h-[54px] left-[826px] top-[257px] absolute">
                <div className="w-[351px] h-[54px] left-0 top-0 absolute bg-neutral-100 rounded-[10px]" />
                <div className="left-[25px] top-[19px] absolute text-zinc-800 text-xl font-medium font-['Outfit']">Ingredients</div>
            </div>
            <div className="w-[351px] h-[229px] left-[826px] top-[326px] absolute">
                <div className="w-[351px] h-[229px] left-0 top-0 absolute bg-neutral-100 rounded-[10px]" />
                <div className="left-[25px] top-[20px] absolute text-zinc-800 text-xl font-medium font-['Outfit']">Nutrition Facts</div>
                <div className="w-[301px] left-[25px] top-[70px] absolute"><span className="text-zinc-800 text-[15px] font-semibold font-['Outfit']">2 Servings per pack<br /></span><span className="text-zinc-800 text-[15px] font-medium font-['Outfit']"><br /></span><span className="text-zinc-800 text-[15px] font-semibold font-['Outfit']">Per serving nutrition facts:<br /></span><span className="text-zinc-800 text-[15px] font-normal font-['Outfit']">Calories 138Kcal, Protein 6g, Total Carbohydrate 6g, Total Fat 10g, Sodium 504mg, Saturated Fat 4g, Dietary Fibre 2g, Total Sugars 2g, Added Sugars 1g, Calcium 105mg, Iron 1mg, Potassium 104mg</span></div>
                <div className="w-[301px] h-[0px] left-[25px] top-[55px] absolute border border-zinc-800"></div>
            </div>
            <div className="w-[351px] h-[54px] left-[826px] top-[570px] absolute">
                <div className="w-[351px] h-[54px] left-0 top-0 absolute bg-neutral-100 rounded-[10px]" />
                <div className="left-[25px] top-[19px] absolute text-zinc-800 text-xl font-medium font-['Outfit']">How To Prepare</div>
            </div>
            <div className="w-[441px] left-[262px] top-[454px] absolute text-center text-zinc-800 text-xl font-normal font-['Outfit']">
                A beloved Indian menu item all around the world!
                This flavorful dish is made with Indian cottage cheese cubes in a smooth spinach base, with tomatoes providing a tangy twist.<br /><br /></div>

            <div className="w-[71.70px] h-[11.39px] left-[445.16px] top-[565px] absolute mt-[5px]">
                <div className="w-[18.90px] h-[11.39px] left-0 top-0 absolute">
                    <img src={redChillyImage} alt="chilly" />
                </div>
                <div className="w-[18.91px] h-[11.39px] left-[17.60px] top-0 absolute">
                    <img src={redChillyImage} alt="chilly" />
                </div>
                <div className="w-[18.91px] h-[11.39px] left-[35.19px] top-0 absolute">
                    <img src={redChillyImage} alt="chilly" />
                </div>
                <div className="w-[18.90px] h-[11.39px] left-[52.79px] top-0 absolute">
                    <img src={redChillyImage} alt="chilly" />
                </div>
            </div>
            <div className="w-[116px] h-[36.39px] left-[423px] top-[589.39px] absolute">
                <img src={minusImage} alt="minus" />
                <div className="w-[52.31px] h-[36.39px] left-[31.84px] top-0 absolute bg-white rounded-[5px] border border-zinc-800" />
                <div className="w-[23.88px] h-[28.43px] left-[46.63px] top-[4.55px] absolute text-center text-zinc-800 text-xl font-bold font-['Outfit']">
                    10
                </div>

                <img src={plusImage} alt="plus" />
            </div>
            <div className="w-[1104px] h-[471px] left-[168px] top-[661px] absolute">
                <div className="left-[365px] top-0 absolute text-center text-lime-600 text-[40px] font-semibold font-['Outfit']">
                    Recommended Sides
                </div>
                <div className="left-[378px] top-[39px] absolute text-center text-zinc-800 text-xl font-normal font-['Outfit'] mt-2.5">
                    Recommended Sides with Palak Paneer
                </div>
                <div className="w-[258px] h-[383px] left-0 top-[88px] absolute">
                    <div className="w-[258px] h-[383px] left-0 top-0 absolute bg-white rounded-2xl shadow border border-stone-300" />
                    <div className="w-[191px] h-[184.95px] left-[33px] top-[20.52px] absolute" />
                    <div className="w-[233px] left-[13px] top-[269px] absolute text-center text-zinc-800 text-xs font-normal font-['Outfit']">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </div>
                    <div className="left-[68px] top-[245px] absolute text-center text-lime-600 text-xl font-bold font-['Outfit']">
                        Shahi Paneer
                    </div>
                    <div className="w-[104.65px] h-[13.35px] relative">
                        <div className="w-[22.16px] h-[13.35px] left-0 top-0 absolute">
                            <img src={redChillyImage} alt="chilly" />
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[20.62px] top-0 absolute">
                            <img src={redChillyImage} alt="chilly" />
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[41.25px] top-0 absolute">
                            <img src={redChillyImage} alt="chilly" />
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[61.87px] top-0 absolute">
                            <img src={redChillyImage} alt="chilly" />
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[82.49px] top-0 absolute">
                            <img src={redChillyImage} alt="chilly" />
                        </div>
                    </div>
                    <div className="w-[102px] h-8 left-[78px] top-[326px] absolute">
                        <div className="w-[46px] h-8 left-[28px] top-0 absolute bg-white rounded-[5px] border border-zinc-800" />
                        <div className="left-[41px] top-[4px] absolute text-center text-zinc-800 text-xl font-bold font-['Outfit']">
                            10
                        </div>
                    </div>
                    <img className="w-[204px] h-[205px] left-[27px] top-[25px] absolute" src="https://via.placeholder.com/204x205" />
                    <div className="w-[104.65px] h-[13.35px] left-[77.03px] top-[301.14px] absolute">
                        <div className="w-[22.16px] h-[13.35px] left-0 top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[20.62px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[41.25px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[61.87px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[82.49px] top-0 absolute">
                        </div>
                    </div>
                </div>
                <div className="w-[258px] h-[383px] left-[282px] top-[88px] absolute">
                    <div className="w-[258px] h-[383px] left-0 top-0 absolute bg-white rounded-2xl shadow border border-stone-300" />
                    <div className="w-[191px] h-[184.95px] left-[33px] top-[20.52px] absolute" />
                    <div className="w-[233px] left-[13px] top-[269px] absolute text-center text-zinc-800 text-xs font-normal font-['Outfit']">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </div>
                    <div className="left-[64px] top-[245px] absolute text-center text-lime-600 text-xl font-bold font-['Domine']">
                        Shahi Paneer
                    </div>
                    <div className="w-[102px] h-8 left-[78px] top-[326px] absolute">
                        <div className="w-[46px] h-8 left-[28px] top-0 absolute bg-white rounded-[5px] border border-zinc-800" />
                        <div className="left-[41px] top-[4px] absolute text-center text-zinc-800 text-xl font-bold font-['Outfit']">
                            10
                        </div>
                    </div>
                    <img className="w-[204px] h-[205px] left-[27px] top-[25px] absolute" src="https://via.placeholder.com/204x205" />
                    <div className="w-[84.03px] h-[13.35px] left-[88px] top-[301.14px] absolute">
                        <div className="w-[22.16px] h-[13.35px] left-0 top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[20.62px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[41.25px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[61.87px] top-0 absolute">
                        </div>
                    </div>
                </div>
                <div className="w-[258px] h-[383px] left-[564px] top-[88px] absolute">
                    <div className="w-[258px] h-[383px] left-0 top-0 absolute bg-white rounded-2xl shadow border border-stone-300" />
                    <div className="w-[191px] h-[184.95px] left-[33px] top-[20.52px] absolute" />
                    <div className="w-[233px] left-[13px] top-[269px] absolute text-center text-zinc-800 text-xs font-normal font-['Outfit']">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
                    <div className="left-[68px] top-[245px] absolute text-center text-lime-600 text-xl font-bold font-['Outfit']">Shahi Paneer</div>
                    <div className="w-[102px] h-8 left-[78px] top-[326px] absolute">
                        <div className="w-[46px] h-8 left-[28px] top-0 absolute bg-white rounded-[5px] border border-zinc-800" />
                        <div className="left-[41px] top-[4px] absolute text-center text-zinc-800 text-xl font-bold font-['Outfit']">10</div>
                    </div>
                    <img className="w-[204px] h-[205px] left-[27px] top-[25px] absolute" src="https://via.placeholder.com/204x205" />
                    <div className="w-[84.03px] h-[13.35px] left-[88px] top-[301.14px] absolute">
                        <div className="w-[22.16px] h-[13.35px] left-0 top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[20.62px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[41.25px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[61.87px] top-0 absolute">
                        </div>
                    </div>
                </div>
                <div className="w-[258px] h-[383px] left-[846px] top-[88px] absolute">
                    <div className="w-[258px] h-[383px] left-0 top-0 absolute bg-white rounded-2xl shadow border border-stone-300" />
                    <div className="w-[191px] h-[184.95px] left-[33px] top-[20.52px] absolute" />
                    <div className="w-[233px] left-[13px] top-[269px] absolute text-center text-zinc-800 text-xs font-normal font-['Outfit']">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
                    <div className="left-[68px] top-[245px] absolute text-center text-lime-600 text-xl font-bold font-['Outfit']">Shahi Paneer</div>
                    <div className="w-[102px] h-8 left-[78px] top-[326px] absolute">
                        <div className="w-[46px] h-8 left-[28px] top-0 absolute bg-white rounded-[5px] border border-zinc-800" />
                        <div className="left-[41px] top-[4px] absolute text-center text-zinc-800 text-xl font-bold font-['Outfit']">10</div>
                    </div>
                    <img className="w-[204px] h-[205px] left-[27px] top-[25px] absolute" src="https://via.placeholder.com/204x205" />
                    <div className="w-[84.03px] h-[13.35px] left-[88px] top-[301.14px] absolute">
                        <div className="w-[22.16px] h-[13.35px] left-0 top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[20.62px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[41.25px] top-0 absolute">
                        </div>
                        <div className="w-[22.16px] h-[13.35px] left-[61.87px] top-0 absolute">
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default ProductDetail

