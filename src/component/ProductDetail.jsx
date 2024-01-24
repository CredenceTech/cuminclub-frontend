import React from 'react'

const ProductDetail = () => {
    return (
        // <div> 
        //     <div style={{ width: 802, height: 671, left: 319, top: 170, position: 'absolute' }}>
        //         <div style={{ width: 802, height: 271, left: 0, top: 0, position: 'absolute', background: 'white', boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.05)', borderRadius: 14 }} />
        //         <div style={{ width: 150, height: 228, left: 37, top: 21, position: 'absolute' }}>
        //             <img style={{ width: 150, height: 148.83, left: 0, top: 0, position: 'absolute' }} src="https://via.placeholder.com/150x149" />
        //             <div style={{ left: 14, top: 164, position: 'absolute', textAlign: 'center', color: '#80BC42', fontSize: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', wordWrap: 'break-word' }}>Creamy curry with paneer</div>
        //             <div style={{ left: 8, top: 179, position: 'absolute', textAlign: 'center', color: '#243F2F', fontSize: 16, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word' }}>Methi Matar Malai</div>
        //             <div style={{ width: 80, height: 22, left: 35, top: 206, position: 'absolute' }}>
        //                 <div style={{ width: 80, height: 22, left: 0, top: 0, position: 'absolute', borderRadius: 40, border: '1px #C3C3C3 solid' }} />
        //                 <div style={{ width: 18, height: 18, left: 60, top: 2, position: 'absolute', background: '#C3C3C3', borderRadius: 9999 }} />
        //                 <div style={{ left: 34, top: 5, position: 'absolute', textAlign: 'center', color: '#243F2F', fontSize: 16, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word' }}>0</div>
        //                 <div style={{ width: 18, height: 18, left: 2, top: 2, position: 'absolute', background: '#C3C3C3', borderRadius: 9999 }} />
        //                 <div style={{ width: 8, height: 8, left: 65, top: 7, position: 'absolute', background: 'white' }}></div>
        //                 <div style={{ width: 8, height: 2, left: 7, top: 12, position: 'absolute', background: 'white' }}></div>
        //             </div>
        //         </div>
        //         <div style={{ width: 230, height: 0, left: 224, top: 20, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', opacity: 0.50, border: '1px #243F2F dotted' }}></div>
        //         <div style={{ left: 261, top: 26, position: 'absolute' }}><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', wordWrap: 'break-word'">Recommended Side:</span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word'"> </span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', wordWrap: 'break-word'">8 Rotis</span></div>
        //         <div style={{ left: 261, top: 54, position: 'absolute' }}><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', wordWrap: 'break-word'">Requirement:</span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word'"> </span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', wordWrap: 'break-word'">a pot (to boil water)</span></div>
        //         <div style={{ width: 504, left: 261, top: 82, position: 'absolute', color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', lineHeight: 24, wordWrap: 'break-word' }}>Sweet green peas and earthy fenugreek leaves pair  beautifully in a creamy cashew-onion base enriched with milk and spices. A favorite in many a North Indian kitchen!</div>
        //         <div style={{ left: 261, top: 158, position: 'absolute' }}><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', wordWrap: 'break-word'">Serving Size:</span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word'"> </span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', wordWrap: 'break-word'">190 g cooked quantity</span></div>
        //         <div style={{ left: 261, top: 186, position: 'absolute' }}><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', lineHeight: 24, wordWrap: 'break-word'">Ingredients:</span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', lineHeight: 24, wordWrap: 'break-word'"> </span><span style="color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', lineHeight: 24, wordWrap: 'break-word'">Cashew, onion, green peas, green cardamom, green chilli, black<br />cardamom, cinnamon, bay leaf, garlic, ginger, milk, butter, sugar, salt, ghee,<br />cumin, fenugreek leaves, turmeric, milk cream</span></div>
        //         <div style={{ width: 30, height: 30, left: 742, top: 20, position: 'absolute' }}>
        //             <div style={{ width: 30, height: 30, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 9999, border: '1px #D9D9D9 solid' }} />
        //             <div style={{ width: 19.90, height: 12, left: 3, top: 15, position: 'absolute', transform: 'rotate(-30.30deg)', transformOrigin: '0 0' }}>
        //                 <div style={{ width: 16.11, height: 11.96, left: 0.02, top: 0.03, position: 'absolute', transform: 'rotate(-30.30deg)', transformOrigin: '0 0', background: '#FF473E' }}></div>
        //                 <div style={{ width: 3.62, height: 3.94, left: 7.58, top: -2.73, position: 'absolute', transform: 'rotate(-30.30deg)', transformOrigin: '0 0', background: '#FF6E83' }}></div>
        //                 <div style={{ width: 7.12, height: 3.83, left: 11.03, top: -6.44, position: 'absolute', transform: 'rotate(-30.30deg)', transformOrigin: '0 0', background: '#00B89C' }}></div>
        //             </div>
        //         </div>
        //         <div style={{ width: 30, height: 30, left: 702, top: 20, position: 'absolute' }}>
        //             <div style={{ width: 30, height: 30, left: 0, top: 0, position: 'absolute', background: 'white', borderRadius: 9999, border: '1px #D9D9D9 solid' }} />
        //             <img style={{ width: 20, height: 20, left: 5, top: 5, position: 'absolute' }} src="https://via.placeholder.com/20x20" />
        //         </div>
        //         <div style={{ width: 802, height: 50, left: 0, top: 281, position: 'absolute' }}>
        //             <div style={{ width: 802, height: 50, left: 0, top: 0, position: 'absolute', background: 'white', boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.05)', borderRadius: 8 }} />
        //             <div style={{ left: 20, top: 19, position: 'absolute', color: '#243F2F', fontSize: 16, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word' }}>Dietary Needs</div>
        //             <div style={{ width: 12.97, height: 8, left: 769, top: 29, position: 'absolute', background: 'black' }}></div>
        //         </div>
        //         <div style={{ width: 802, height: 330, left: 0, top: 341, position: 'absolute' }}>
        //             <div style={{ width: 802, height: 330, left: 0, top: 0, position: 'absolute', background: 'white', boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.05)', borderRadius: 8 }} />
        //             <div style={{ left: 20, top: 19, position: 'absolute', color: '#243F2F', fontSize: 16, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word' }}>How To Prepare</div>
        //             <div style={{ width: 12.97, height: 8, left: 769, top: 21, position: 'absolute', background: 'black' }}></div>
        //             <div style={{ left: 20, top: 51, position: 'absolute', color: '#80BC42', fontSize: 15, fontFamily: 'Urbanist', fontWeight: '600', wordWrap: 'break-word' }}>Stovetop Instructions:</div>
        //             <div style={{ left: 20, top: 76, position: 'absolute', color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', lineHeight: 24, wordWrap: 'break-word' }}>Bring 190ml (6.5 oz) of water to boil on a stovetop.<br />Empty the smaller green peas pack into a pot and cook for 6 mins.<br />Turn off the stove, add in the curry pack, stir well, and close the lid for 2 mins.<br />Serve hot with roti/rice and enjoy!</div>
        //             <div style={{ left: 20, top: 178, position: 'absolute', color: '#80BC42', fontSize: 15, fontFamily: 'Urbanist', fontWeight: '600', wordWrap: 'break-word' }}>Microwave Instructions:</div>
        //             <div style={{ left: 20, top: 203, position: 'absolute', color: '#243F2F', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '500', lineHeight: 24, wordWrap: 'break-word' }}>Empty the smaller green peas pack into a bowl and add 7.5 oz (220 ml) of water.<br />Microwave for 5 mins with a lid.<br />Remove the bowl from the microwave, add the gravy powder, and stir well.<br />Cover for 5 mins.<br />Stir well, and serve hot with roti/rice and enjoy!</div>
        //         </div>
        //     </div> 
        // </div>
        <div className=''>
            <div>

            </div>
            <div className="w-[802px] h-[671px] relative">
                <div className="w-[802px] h-[271px] left-0 top-0 absolute bg-white rounded-[14px] shadow" />
                <div className="w-[150px] h-[228px] left-[37px] top-[21px] absolute">
                    <img className="w-[150px] h-[148.83px] left-0 top-0 absolute" src="https://via.placeholder.com/150x149" />
                    <div className="left-[14px] top-[164px] absolute text-center text-lime-500 text-[10px] font-medium font-['Plus Jakarta Sans']">
                        Creamy curry with paneer
                    </div>
                    <div className="left-[8px] top-[179px] absolute text-center text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">
                        Methi Matar Malai
                    </div>
                    <div className="w-20 h-[22px] left-[35px] top-[206px] absolute">
                        <div className="w-20 h-[22px] left-0 top-0 absolute rounded-[40px] border border-stone-300" />
                        <div className="w-[18px] h-[18px] left-[60px] top-[2px] absolute bg-stone-300 rounded-full" />
                        <div className="left-[34px] top-[5px] absolute text-center text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">
                            0
                        </div>
                        <div className="w-[18px] h-[18px] left-[2px] top-[2px] absolute bg-stone-300 rounded-full" />
                    </div>
                </div>
                <div className="left-[261px] top-[26px] absolute">
                    <span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans']">
                        Recommended Side:
                    </span>
                    <span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans']">
                    </span>
                    <span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans']">
                        8 Rotis
                    </span>
                </div>
                <div className="left-[261px] top-[54px] absolute">
                    <span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans']">
                        Requirement:
                    </span>
                    <span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans']">
                    </span>
                    <span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans']">
                        a pot (to boil water)
                    </span>
                </div>
                <div className="w-[504px] left-[261px] top-[82px] absolute text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">
                    Sweet green peas and earthy fenugreek leaves pair  beautifully in a creamy cashew-onion base enriched with milk and spices. A favorite in many a North Indian kitchen!
                </div>
                <div className="left-[261px] top-[158px] absolute">
                    <span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans']">
                        Serving Size:
                    </span>
                    <span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans']">
                    </span>
                    <span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans']">
                        190 g cooked quantity
                    </span>
                </div>
                <div className="left-[261px] top-[186px] absolute">
                    <span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans'] leading-normal">
                        Ingredients:
                    </span>
                    <span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans'] leading-normal">
                    </span>
                    <span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">
                        Cashew, onion, green peas, green cardamom, green chilli, black<br />
                        cardamom, cinnamon, bay leaf, garlic, ginger, milk, butter, sugar, salt, ghee,<br />
                        cumin, fenugreek leaves, turmeric, milk cream
                    </span>
                </div>
                <div className="w-[30px] h-[30px] left-[742px] top-[20px] absolute">
                    <div className="w-[30px] h-[30px] left-0 top-0 absolute bg-white rounded-full border border-zinc-300" />
                    <div className="origin-top-left rotate-[-30.30deg] w-[19.90px] h-3 left-[3px] top-[15px] absolute">
                    </div>
                </div>
                <div className="w-[30px] h-[30px] left-[702px] top-[20px] absolute">
                    <div className="w-[30px] h-[30px] left-0 top-0 absolute bg-white rounded-full border border-zinc-300" />
                    <img className="w-5 h-5 left-[5px] top-[5px] absolute" src="https://via.placeholder.com/20x20" />
                </div>
                <div className="w-[802px] h-[50px] left-0 top-[281px] absolute">
                    <div className="w-[802px] h-[50px] left-0 top-0 absolute bg-white rounded-lg shadow" />
                    <div className="left-[20px] top-[19px] absolute text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">
                        Dietary Needs
                    </div>
                </div>
                <div className="w-[802px] h-[330px] left-0 top-[341px] absolute">
                    <div className="w-[802px] h-[330px] left-0 top-0 absolute bg-white rounded-lg shadow" />
                    <div className="left-[20px] top-[19px] absolute text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">
                        How To Prepare
                    </div>
                    <div className="left-[20px] top-[51px] absolute text-lime-500 text-[15px] font-semibold font-['Urbanist']">
                        Stovetop Instructions:
                    </div>
                    <div className="left-[20px] top-[76px] absolute text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">
                        Bring 190ml (6.5 oz) of water to boil on a stovetop.<br />
                        Empty the smaller green peas pack into a pot and cook for 6 mins.<br />
                        Turn off the stove, add in the curry pack, stir well, and close the lid for 2 mins.<br />
                        Serve hot with roti/rice and enjoy!
                    </div>
                    <div className="left-[20px] top-[178px] absolute text-lime-500 text-[15px] font-semibold font-['Urbanist']">
                        Microwave Instructions:
                    </div>
                    <div className="left-[20px] top-[203px] absolute text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">
                        Empty the smaller green peas pack into a bowl and add 7.5 oz (220 ml) of water.<br />
                        Microwave for 5 mins with a lid.<br />
                        Remove the bowl from the microwave, add the gravy powder, and stir well.<br />
                        Cover for 5 mins.<br />Stir well, and serve hot with roti/rice and enjoy!
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
        // <div>
        //     <div>
        //         <div>
        //             <img className="w-[150px] h-[148.83px]"   src="src/assets/food.png" />
        //             <div>
        //                 <span>
        //                     Creamy curry with paneer
        //                 </span>
        //             </div>
        //             <div>
        //                 <span>Methi Matar Malai</span>
        //             </div>
        //             <div>
        //                 <div className="w-20 h-[22px] rounded-[40px] border border-stone-300" />
        //                 <div className="w-[18px] h-[18px] bg-stone-300 rounded-full" />

        //             </div>
        //         </div>
        //         <div>
        //             <div>
        //                 <span>
        //                     Recommended Side:
        //                     <span> 8 Rotis</span>
        //                 </span>
        //             </div>
        //             <div>
        //                 <span>
        //                     Requirement:
        //                     <span>a pot (to boil water)</span>
        //                 </span>
        //             </div>
        //             <div>
        //                 Sweet green peas and earthy fenugreek leaves pair beautifully in a creamy cashew-onion base enriched
        //                 with milk and spices. A favorite in many a North Indian kitchen!
        //             </div>
        //             <div>
        //                 <span>
        //                     Serving Size:
        //                     <span> 190 g cooked quantity</span>
        //                 </span>
        //             </div>
        //             <div>
        //                 <span>Ingredients:
        //                     <span>
        //                         Cashew, onion, green peas, green cardamom, green chilli, black
        //                         cardamom, cinnamon, bay leaf, garlic, ginger, milk, butter, sugar, salt, ghee,
        //                         cumin, fenugreek leaves, turmeric, milk cream
        //                     </span>
        //                 </span>
        //             </div>
        //         </div>
        //     </div>
        //     <div>

        //     </div>
        //     <div>

        //     </div>
        //     {/* <div className="w-[802px] h-[671px] relative">
        //         <div className="w-[802px] h-[271px] left-0 top-0 absolute bg-white rounded-[14px] shadow" />
        //         <div className="w-[150px] h-[228px] left-[37px] top-[21px] absolute">
        //             <img className="w-[150px] h-[148.83px] left-0 top-0 absolute" src="https://via.placeholder.com/150x149" />
        //             <div className="left-[14px] top-[164px] absolute text-center text-lime-500 text-[10px] font-medium font-['Plus Jakarta Sans']">Creamy curry with paneer</div>
        //             <div className="left-[8px] top-[179px] absolute text-center text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">Methi Matar Malai</div>
        //             <div className="w-20 h-[22px] left-[35px] top-[206px] absolute">
        //                 <div className="w-20 h-[22px] left-0 top-0 absolute rounded-[40px] border border-stone-300" />
        //                 <div className="w-[18px] h-[18px] left-[60px] top-[2px] absolute bg-stone-300 rounded-full" />
        //                 <div className="left-[34px] top-[5px] absolute text-center text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">0</div>
        //                 <div className="w-[18px] h-[18px] left-[2px] top-[2px] absolute bg-stone-300 rounded-full" />
        //             </div>
        //         </div>
        //         <div className="left-[261px] top-[26px] absolute"><span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans']">Recommended Side:</span><span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans']"> </span><span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans']">8 Rotis</span></div>
        //         <div className="left-[261px] top-[54px] absolute"><span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans']">Requirement:</span><span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans']"> </span><span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans']">a pot (to boil water)</span></div>
        //         <div className="w-[504px] left-[261px] top-[82px] absolute text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">Sweet green peas and earthy fenugreek leaves pair  beautifully in a creamy cashew-onion base enriched with milk and spices. A favorite in many a North Indian kitchen!</div>
        //         <div className="left-[261px] top-[158px] absolute"><span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans']">Serving Size:</span><span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans']"> </span><span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans']">190 g cooked quantity</span></div>
        //         <div className="left-[261px] top-[186px] absolute"><span className="text-gray-800 text-sm font-bold font-['Plus Jakarta Sans'] leading-normal">Ingredients:</span><span className="text-gray-800 text-sm font-semibold font-['Plus Jakarta Sans'] leading-normal"> </span><span className="text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">Cashew, onion, green peas, green cardamom, green chilli, black<br />cardamom, cinnamon, bay leaf, garlic, ginger, milk, butter, sugar, salt, ghee,<br />cumin, fenugreek leaves, turmeric, milk cream</span></div>
        //         <div className="w-[30px] h-[30px] left-[742px] top-[20px] absolute">
        //             <div className="w-[30px] h-[30px] left-0 top-0 absolute bg-white rounded-full border border-zinc-300" />
        //             <div className="origin-top-left rotate-[-30.30deg] w-[19.90px] h-3 left-[3px] top-[15px] absolute">
        //             </div>
        //         </div>
        //         <div className="w-[30px] h-[30px] left-[702px] top-[20px] absolute">
        //             <div className="w-[30px] h-[30px] left-0 top-0 absolute bg-white rounded-full border border-zinc-300" />
        //             <img className="w-5 h-5 left-[5px] top-[5px] absolute" src="https://via.placeholder.com/20x20" />
        //         </div>
        //         <div className="w-[802px] h-[50px] left-0 top-[281px] absolute">
        //             <div className="w-[802px] h-[50px] left-0 top-0 absolute bg-white rounded-lg shadow" />
        //             <div className="left-[20px] top-[19px] absolute text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">Dietary Needs</div>
        //         </div>
        //         <div className="w-[802px] h-[330px] left-0 top-[341px] absolute">
        //             <div className="w-[802px] h-[330px] left-0 top-0 absolute bg-white rounded-lg shadow" />
        //             <div className="left-[20px] top-[19px] absolute text-gray-800 text-base font-semibold font-['Plus Jakarta Sans']">How To Prepare</div>
        //             <div className="left-[20px] top-[51px] absolute text-lime-500 text-[15px] font-semibold font-['Urbanist']">Stovetop Instructions:</div>
        //             <div className="left-[20px] top-[76px] absolute text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">Bring 190ml (6.5 oz) of water to boil on a stovetop.<br />Empty the smaller green peas pack into a pot and cook for 6 mins.<br />Turn off the stove, add in the curry pack, stir well, and close the lid for 2 mins.<br />Serve hot with roti/rice and enjoy!</div>
        //             <div className="left-[20px] top-[178px] absolute text-lime-500 text-[15px] font-semibold font-['Urbanist']">Microwave Instructions:</div>
        //             <div className="left-[20px] top-[203px] absolute text-gray-800 text-sm font-medium font-['Plus Jakarta Sans'] leading-normal">Empty the smaller green peas pack into a bowl and add 7.5 oz (220 ml) of water.<br />Microwave for 5 mins with a lid.<br />Remove the bowl from the microwave, add the gravy powder, and stir well.<br />Cover for 5 mins.<br />Stir well, and serve hot with roti/rice and enjoy!</div>
        //         </div>
        //     </div> */}
        // </div>
    )
}

export default ProductDetail

