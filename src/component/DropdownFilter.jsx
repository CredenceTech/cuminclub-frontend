import React, { useState, useRef, useEffect } from 'react';
import Transition from '../../utils/Transition';
import { useDispatch, useSelector } from 'react-redux';
import { addMeal, selectMealItems } from '../state/mealdata';
import { clearDraftOrderData, clearDraftOrderResponse, selectDraftOrderResponse } from '../state/draftOrder';
import { clearBundleData, clearBundleResponse } from '../state/bundleData';

function DropdownFilter({
  align,
  dropdownOpen,
  setDropdownOpen
}) {

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const dispatch = useDispatch();
  const selectedMealData = useSelector(selectMealItems);
  const draftOrderResponse = useSelector(selectDraftOrderResponse);

  const handleClearData = (item) => {


    let currentTotalQuantity =
      draftOrderResponse?.draftOrder?.lineItems?.edges.reduce(
        (total, edge) => total + edge.node.quantity,
        0
      ) || 0;
    if ((currentTotalQuantity === selectedMealData?.no) && currentTotalQuantity < item) {
      dispatch(clearDraftOrderData());
      dispatch(clearDraftOrderResponse());
      dispatch(clearBundleData());
      dispatch(clearBundleResponse());
    } else {
      console.log("Condition Not Met: No Action Taken");
    }
  }
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
      noMeal: "6 Meals",
      price: "510",
      discountPrice: "2510.12/meal",
      no: 6,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "2110.12/meal",
          discountPrice: "2510.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "2110.12/meal",
          discountPrice: "2000.12/meal",
        }
      ]
    },
    {
      id: 2,
      noMeal: "12 Meals",
      price: "1020",
      discountPrice: "1110.12/meal",
      no: 12,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "1210.12/meal",
          discountPrice: "1110.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "1210.12/meal",
          discountPrice: "1000.12/meal",
        }
      ]
    },
    {
      id: 3,
      noMeal: "18 Meals",
      price: "1530",
      discountPrice: "1110.12/meal",
      no: 18,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "1210.12/meal",
          discountPrice: "1110.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "1210.12/meal",
          discountPrice: "1000.12/meal",
        }
      ]
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
        <p className='text-[#231F20] text-[26px] font-[400] leading-[26.23px] font-skillet '>{selectedMealData?.noMeal}<span className='font-regola-pro font-[700] text-[16px] leading-[21.6px] text-[#279C66]'> @ ₹</span><span className='text-[#279C66] text-[26px] font-[400] leading-[26.23px] font-skillet'>{selectedMealData?.price}</span></p>
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
              <li onClick={() => {
                handleClearData(item?.no)
                dispatch(addMeal(item));
              }} key={item?.id} className={`py-1 px-3 cursor-pointer ${selectedMealData?.id === item?.id ? 'opacity-50' : ''} `}>
                <p className='text-[#231F20] text-xl font-skillet '>{item?.noMeal} <span className='font-regola-pro font-[700] text-[16px] leading-[21.6px] text-[#279C66]'> @ ₹</span><span className='text-[#279C66]'>{item?.price}</span></p>
              </li>
            ))}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownFilter;
