import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../assets/avatar.jpg';
import Transition from '../../utils/Transition';
import { useDispatch, useSelector } from 'react-redux';
import { clearCustomerAccessToken, userEmails } from '../state/user';
import { clearCartData, clearCartResponse } from '../state/cartData';

function DropdownProfile({
  align
}) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const nagivate = useNavigate();
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const userEmail = useSelector(userEmails);
  const dispatch = useDispatch();
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

  // const logout = () => {
  //   localStorage.clear('user')
  //   toast.success('logout successfully')
  //   nagivate('/login')
  //   setDropdownOpen(!dropdownOpen)
  // }

  const logout = async () => {
    try {
      dispatch(clearCustomerAccessToken());
      dispatch(clearCartData());
      dispatch(clearCartResponse());
      nagivate('/login');
      setDropdownOpen(!dropdownOpen);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const changePassword = () => {
    nagivate('/change-password');
    setDropdownOpen(!dropdownOpen);
  }

  return (
    <div className="relative inline-flex z-20">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
       <div className="w-[45px] h-[45px] rounded-full bg-gray-400 flex items-center justify-center text-white font-medium text-lg">
        {userEmail?.firstName ? userEmail.firstName.charAt(0).toUpperCase() : ''}
      </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white  border border-slate-200  py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pb-2 p-3 mb-1 border-b z-20 border-[#C6C6C6] ">
            <div className="font-[400] text-[18px] leading-[21.6px] text-[#333333] font-regola-pro ">{userEmail?.email}</div>
          </div>
          <ul>
            <li>
              <div
                className="font-[400] text-[18px] leading-[21.6px] text-[#333333] hover:text-[#000] font-regola-pro cursor-pointer  flex items-center py-1 px-3"
                onClick={() => { setDropdownOpen(false); nagivate('/my-profile') }}
              >
                My Profile
              </div>
            </li>
            <li>
              <div
                className="font-[400] text-[18px] leading-[21.6px] text-[#333333] hover:text-[#000] font-regola-pro cursor-pointer  flex items-center py-1 px-3"
                onClick={() => { setDropdownOpen(false); nagivate('/Invoices'); }}
              >
                My Order
              </div>
            </li>
            <li>
              <div
                className="font-[400] text-[18px] leading-[21.6px] text-[#333333] hover:text-[#000] font-regola-pro cursor-pointer  flex items-center py-1 px-3"
                onClick={logout}
              >
                Log Out
              </div>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownProfile;