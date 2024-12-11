import React, { useState, useRef, useEffect } from 'react';
import Transition from '../../utils/Transition';

function FrequencyDropDown({
    align,
    dropdownOpen,
    setDropdownOpen
}) {

    const trigger = useRef(null);
    const dropdown = useRef(null);
    const [selectedFreqently, setSelectedFreqently] = useState({
        id: 1,
        title: "Weekly",
        price: "510",
        discountPrice: "2510.12/meal",
        no: 6,
    })
    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    const data = [
        {
            id: 1,
            title: "Weekly",
            price: "510",
            discountPrice: "2510.12/meal",
            no: 6,
        },
        {
            id: 2,
            title: "Bi-Weekly",
            price: "1020",
            discountPrice: "1110.12/meal",
            no: 12,
        },
        {
            id: 3,
            title: "Monthly",
            price: "1530",
            discountPrice: "1110.12/meal",
            no: 18,
        },
    ]


    return (
        <div className="relative inline-flex">
            <button
                ref={trigger}
                className="px-4 py-1 text-[#231F20] flex items-center gap-x-4 font-skillet  rounded-lg active:border-none bg-[#EADEC1]"
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
            >
                <p className='text-[#231F20] text-[26px] font-[400] leading-[26.23px] mr-14 font-skillet '>{selectedFreqently?.title}</p>
                <div className={`${!dropdownOpen ? 'rotate-0' : 'rotate-180'} `}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" strokeWidth="2.4" strokeLinecap="square" />
                    </svg>
                </div>
            </button>
            <Transition
                show={dropdownOpen}
                tag="div"
                className={`origin-top-right z-[100] absolute top-full  w-full bg-[#EADEC1]  rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'md:left-auto right-0' : 'md:left-0 md:right-auto'
                    }`}
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div ref={dropdown}>
                    <ul className="m-2">
                        {data?.map((item) => (
                            <li onClick={() => { setSelectedFreqently(item) }} key={item?.id} className={`py-1 px-3 cursor-pointer ${selectedFreqently?.id === item?.id ? 'opacity-50' : ''} `}>
                                <p className='text-[#231F20] text-xl font-skillet '>{item?.title} </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Transition>
        </div>
    );
}

export default FrequencyDropDown;
