import React from 'react'

const OrderProduct = ({ item }) => {
    return (
        <div className="p-1 lg:p-2 w-1/2 lg:w-1/3">
            <div className=" py-4 rounded-lg overflow-hidden text-center relative">
                <div className='flex justify-center  items-center'>
                    <img className='w-40 relative h-40 rounded-full' src={item?.dish} alt="dish" />
                    {item?.spacel && <div className='absolute top-5 left-5'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17.5" cy="17.5" r="17.5" fill="#53940F" />
                            <path d="M11.5025 10.1506C10.2385 10.1498 9.01287 10.5647 8.0318 11.3256C7.05074 12.0864 6.37417 13.1467 6.11597 14.328C5.85776 15.5092 6.03369 16.7394 6.61415 17.8113C7.1946 18.8832 8.14413 19.7316 9.30293 20.2135V23.0127H24.6998V20.2135C25.922 19.7043 26.9088 18.7885 27.4765 17.6366C28.0443 16.4847 28.1544 15.175 27.7863 13.9514C27.4182 12.7278 26.597 11.6735 25.4755 10.9848C24.354 10.296 23.0086 10.0197 21.6897 10.2073C21.3571 9.27208 20.7261 8.45983 19.8852 7.88459C19.0443 7.30934 18.0358 7 17.0014 7C15.9669 7 14.9584 7.30934 14.1175 7.88459C13.2766 8.45983 12.6456 9.27208 12.313 10.2073C12.0447 10.1695 11.7738 10.1505 11.5025 10.1506ZM24.6976 24.5876H9.30513C9.31613 26.0544 9.39421 26.8576 9.9474 27.3847C10.5919 28 11.6279 28 13.702 28H20.3007C22.3749 28 23.4109 28 24.0553 27.3847C24.6085 26.8576 24.6866 26.0544 24.6976 24.5876Z" fill="white" />
                        </svg>
                    </div>}
                </div>
                <h1 className="title-font text-xl mt-2 font-medium text-[#53940F]  mb-1">{item?.productTitle}</h1>
                <p className=" text-gray-700  mb-3">x<span className='text-xl'>{item?.productCount}</span> </p>

                <div className="text-center mt-2 leading-none flex justify-center  w-full">
                    <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm py-1">
                        <button>
                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18.0939C6.61305 18.0939 4.32387 17.1466 2.63604 15.4603C0.948211 13.774 0 11.4869 0 9.1021C0 6.71733 0.948211 4.43023 2.63604 2.74394C4.32387 1.05765 6.61305 0.110306 9 0.110306C11.3869 0.110306 13.6761 1.05765 15.364 2.74394C17.0518 4.43023 18 6.71733 18 9.1021C18 11.4869 17.0518 13.774 15.364 15.4603C13.6761 17.1466 11.3869 18.0939 9 18.0939ZM9 16.2955C10.9096 16.2955 12.7409 15.5377 14.0912 14.1886C15.4414 12.8396 16.2 11.0099 16.2 9.1021C16.2 7.19428 15.4414 5.3646 14.0912 4.01557C12.7409 2.66654 10.9096 1.90866 9 1.90866C7.09044 1.90866 5.25909 2.66654 3.90883 4.01557C2.55857 5.3646 1.8 7.19428 1.8 9.1021C1.8 11.0099 2.55857 12.8396 3.90883 14.1886C5.25909 15.5377 7.09044 16.2955 9 16.2955ZM13.5 8.20292V10.0013H4.5V8.20292H13.5Z" fill="#333333" />
                            </svg>
                        </button>
                    </span>
                    <p className='text-gray-400 inline-flex rounded border border-slate-950 px-2  items-center leading-none text-3xl' >{item?.productCount}</p>
                    <span className="text-gray-400 inline-flex items-center pl-3 leading-none ">
                        <button>
                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.110306C4.03754 0.110306 0 4.14416 0 9.1021C0 14.06 4.03754 18.0939 9 18.0939C13.9625 18.0939 18 14.06 18 9.1021C18 4.14416 13.9625 0.110306 9 0.110306ZM9 1.49366C13.2141 1.49366 16.6154 4.89187 16.6154 9.1021C16.6154 13.3123 13.2141 16.7105 9 16.7105C4.78592 16.7105 1.38462 13.3123 1.38462 9.1021C1.38462 4.89187 4.78592 1.49366 9 1.49366ZM8.30769 4.95204V8.41042H4.84615V9.79378H8.30769V13.2522H9.69231V9.79378H13.1538V8.41042H9.69231V4.95204H8.30769Z" fill="#333333" />
                            </svg>
                        </button>
                    </span>
                </div>
            </div>
        </div >
    )
}

export default OrderProduct