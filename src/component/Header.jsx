import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cartIsOpen, openCart } from '../state/cart';
import { useDispatch, useSelector } from 'react-redux';
import { CartDrawer } from './CartComponent';
import { cartData, selectCartResponse, setCartResponse } from '../state/cartData';
import { getCartQuery, graphQLClient } from '../api/graphql';
import { selectMealItems } from '../state/mealdata';
import { useLocation } from 'react-router-dom';
import { totalQuantity } from '../utils';
import { addFilterData, addInnerFilterData } from '../state/selectedCountry';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState(null);
    const isCartOpen = useSelector(cartIsOpen)
    const cartDatas = useSelector(cartData);
    const selectedMealData = useSelector(selectMealItems);
    const dispatch = useDispatch()
    const cartResponse = useSelector(selectCartResponse);
    const location = useLocation();
    const currentUrl = location.pathname;
    const [countryList, setCountryList] = useState(null);

    useEffect(() => {
        if (cartData !== null) {
            getCartData();
        }
    }, [cartDatas]);

    useEffect(() => {
        if (countryList === null)
            fetchCountryFilters();
        else
            console.log("contry List", countryList);
    });

    const getCartData = async () => {
        const params = {
            cartId: cartDatas?.cartCreate?.cart?.id,
        };
        const response = await graphQLClient.request(getCartQuery, params);
        setCartResponse(response);
    };

    const openCountryDrawer = () => {
        setIsCountryDrawerOpen(true);
    };

    const closeCountryDrawer = () => {
        setIsCountryDrawerOpen(false);
    };

    const onSelectCountry = (country) => {
        setSelectedCountry(country);
        dispatch(addFilterData(country));
        setFilterData(country);
        closeCountryDrawer();
    };

    const fetchCountryFilters = async () => {
        try {
            const url = `${import.meta.env.VITE_SHOPIFY_STOREFRONT_STORE_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("Data1", data);
            setCountryList(data.data.countries);
            setSelectedCountry(data.data.countries[0]);
            console.log("data.data.countries[0]", data.data.countries[0]);
            dispatch(addFilterData(data.data.countries[0]));
            setFilterData(data.data.countries[0]);
        } catch (error) {
            console.error('Error fetching Get Store Detail:', error);
        }
    };


    function setFilterData(country) {
        const list = [];
        country.filters.map((data, index) => {
            const filterOption = {};
            filterOption.id = index + 1;
            filterOption.title = data.name;
            filterOption.options = [];
            data.values.map((dataValue) => {
                const option = {
                    id: dataValue,
                    label: dataValue
                };
                filterOption.options.push(option);
            });
            list.push(filterOption);
        });
        console.log("list", list);
        dispatch(addInnerFilterData(list));
    }

    return (
        <div>
            <div className={`flex w-full bg-white justify-between ${currentUrl.includes("products") ? "" : "header-box-shadow"} items-center  fixed z-50 px-5 lg:px-48 h-20`}>
                <div className='flex gap-3'>
                    <Link to="/">
                        <svg width="130" height="50" viewBox="0 0 130 50" fill="none" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
                            <rect width="130" height="50" fill="url(#pattern0)" />
                            <defs>
                                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlinkHref="#image0_1_1467" transform="scale(0.00598802 0.0147059)" />
                                </pattern>
                                <image id="image0_1_1467" width="167" height="68" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABECAYAAADkxiXAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkE1QjZGNjZEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkE1QjZGNjVEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjYyMEYwNDA3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjYyMEYwNDE3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5J8dbAAAART0lEQVR42uxdCZgUxRWu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" />
                            </defs>
                        </svg>
                    </Link>
                    <button onClick={openCountryDrawer}>
                        <img alt={selectedCountry?.name} className='h-8 w-8' src={selectedCountry?.country_flag} />
                    </button>
                    {isCountryDrawerOpen && <CountryDrawer onClose={closeCountryDrawer} onSelectCountry={onSelectCountry} allCountryList={countryList} />}
                </div>
                <div className='flex gap-3'>
                    <button onClick={() => dispatch(openCart())} className='flex bg-[#E91D24] items-center gap-2 py-2 text-white px-3 rounded-xl'>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0.942857C0 0.692796 0.0948277 0.452976 0.263622 0.276156C0.432417 0.0993363 0.661351 0 0.900063 0H1.56971C2.70979 0 3.39384 0.803314 3.78386 1.55006C4.04428 2.04789 4.2327 2.62491 4.38031 3.14789C4.42023 3.14458 4.46026 3.14291 4.50031 3.14286H19.499C20.495 3.14286 21.2151 4.14103 20.9415 5.14549L18.7477 13.2025C18.551 13.9252 18.1349 14.561 17.5624 15.0138C16.9898 15.4666 16.2921 15.7116 15.5747 15.7118H8.43659C7.71353 15.7118 7.01047 15.4631 6.43548 15.0038C5.86049 14.5446 5.44538 13.9002 5.25397 13.1698L4.3419 9.68503L2.8298 4.34469L2.8286 4.33463C2.64138 3.62183 2.46617 2.95429 2.20455 2.45646C1.95374 1.97246 1.75212 1.88571 1.57091 1.88571H0.900063C0.661351 1.88571 0.432417 1.78638 0.263622 1.60956C0.0948277 1.43274 0 1.19292 0 0.942857ZM7.80055 22C8.43711 22 9.0476 21.7351 9.49772 21.2636C9.94784 20.7921 10.2007 20.1525 10.2007 19.4857C10.2007 18.8189 9.94784 18.1794 9.49772 17.7078C9.0476 17.2363 8.43711 16.9714 7.80055 16.9714C7.16398 16.9714 6.55349 17.2363 6.10337 17.7078C5.65325 18.1794 5.40038 18.8189 5.40038 19.4857C5.40038 20.1525 5.65325 20.7921 6.10337 21.2636C6.55349 21.7351 7.16398 22 7.80055 22ZM16.2011 22C16.8377 22 17.4482 21.7351 17.8983 21.2636C18.3484 20.7921 18.6013 20.1525 18.6013 19.4857C18.6013 18.8189 18.3484 18.1794 17.8983 17.7078C17.4482 17.2363 16.8377 16.9714 16.2011 16.9714C15.5646 16.9714 14.9541 17.2363 14.504 17.7078C14.0538 18.1794 13.801 18.8189 13.801 19.4857C13.801 20.1525 14.0538 20.7921 14.504 21.2636C14.9541 21.7351 15.5646 22 16.2011 22Z" fill="white" />
                        </svg>
                        <span className='font-medium'>{cartDatas !== null ? totalQuantity(cartResponse) : 0}/{selectedMealData.no}</span>
                    </button>
                    <button onClick={() => setIsMenuOpen(true)} >
                        <svg width="37" height="31" viewBox="0 0 37 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.800781 2.58333C0.800781 1.89819 1.0717 1.24111 1.55394 0.756641C2.03617 0.272172 2.69022 0 3.37221 0H34.2294C34.9113 0 35.5654 0.272172 36.0476 0.756641C36.5299 1.24111 36.8008 1.89819 36.8008 2.58333C36.8008 3.26848 36.5299 3.92556 36.0476 4.41003C35.5654 4.89449 34.9113 5.16667 34.2294 5.16667H3.37221C2.69022 5.16667 2.03617 4.89449 1.55394 4.41003C1.0717 3.92556 0.800781 3.26848 0.800781 2.58333ZM0.800781 15.5C0.800781 14.8149 1.0717 14.1578 1.55394 13.6733C2.03617 13.1888 2.69022 12.9167 3.37221 12.9167H34.2294C34.9113 12.9167 35.5654 13.1888 36.0476 13.6733C36.5299 14.1578 36.8008 14.8149 36.8008 15.5C36.8008 16.1851 36.5299 16.8422 36.0476 17.3267C35.5654 17.8112 34.9113 18.0833 34.2294 18.0833H3.37221C2.69022 18.0833 2.03617 17.8112 1.55394 17.3267C1.0717 16.8422 0.800781 16.1851 0.800781 15.5ZM0.800781 28.4167C0.800781 27.7315 1.0717 27.0744 1.55394 26.59C2.03617 26.1055 2.69022 25.8333 3.37221 25.8333H34.2294C34.9113 25.8333 35.5654 26.1055 36.0476 26.59C36.5299 27.0744 36.8008 27.7315 36.8008 28.4167C36.8008 29.1018 36.5299 29.7589 36.0476 30.2434C35.5654 30.7278 34.9113 31 34.2294 31H3.37221C2.69022 31 2.03617 30.7278 1.55394 30.2434C1.0717 29.7589 0.800781 29.1018 0.800781 28.4167Z" fill="#E91D24" />
                        </svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 bg-[#610B15] z-50">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className='h-screen'
                    >
                        <div className='flex w-full to-gray-300 justify-between items-center px-8 pt-3 h-24 font-custom-font'>
                            <div>
                                <svg width="130" height="50" viewBox="0 0 130 50" fill="none" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
                                    <rect width="130" height="50" fill="url(#pattern0)" />
                                    <defs>
                                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlinkHref="#image0_1_1467" transform="scale(0.00598802 0.0147059)" />
                                        </pattern>
                                        <image id="image0_1_1467" width="167" height="68" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABECAYAAADkxiXAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkE1QjZGNjZEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkE1QjZGNjVEOTlEMTFFQUIzOTM5NjMyNDk0NThCRDMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjYyMEYwNDA3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjYyMEYwNDE3MTRCMTFFOUE1OTNFQjc0MUIzNEUwQTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5J8dbAAAART0lEQVR42uxdCZgUxRWu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" />
                                    </defs>
                                </svg>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <img src="src/assets/close.svg" className='h-9 w-9' alt="" />
                            </button>
                        </div>
                        <div className='grid grid-rows-6 justify-items-center place-items-center lg:grid-cols-2 text-5xl font-bold text-[#F7C144] gap-5 lg:gap-20 h-screen w-full '>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/registration" onClick={() => setIsMenuOpen(false)}>Register</Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {isCartOpen && (
                <CartDrawer />
            )}
        </div>
    )
}

export default Header


const CountryDrawer = ({ onClose, onSelectCountry, allCountryList }) => {
    const handleCountrySelect = (country) => {
        console.log("country", country);
        onSelectCountry(country);
    };

    return (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4 }}
            className="fixed z-50 flex flex-col px-7 text-[#E91D24] inset-0 bg-[#FFF] md:w-[350px]">
            <div className="flex justify-between items-center w-full  text-red-700 h-16">
                <img src="src/assets/icon.svg" className='h-24 w-24' alt="Icon Image" />
                <span onClick={onClose} className='cursor-pointer'>
                    <svg fill='red' viewBox="0 0 24 24" width="24px" height="24px"><path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" /></svg>
                </span>
            </div>

            <div className='flex mt-5 flex-col gap-7'>
                {allCountryList?.map((countryItem) => (
                    <button onClick={() => handleCountrySelect(countryItem)} className='flex  items-center px-3 lg:px-7'>
                        <img alt={countryItem?.name} className='h-10 w-10' src={countryItem?.country_flag} />
                        <span className='ml-10'>{countryItem?.name}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};