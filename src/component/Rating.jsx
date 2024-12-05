import React from 'react';
import redChillyImage from "../assets/red-chilly.svg";
import grayChillyImage from "../assets/gray-chilly.svg";

const Rating = ({ rating, text, color = '#EB7E01', emptyColor = '#EB7E01' }) => {
    const reminder = rating % 1;
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.01;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);
    const starElements = [];
    for (let i = 0; i < filledStars; i++) {
        starElements.push(<span key={i} className="w-5 mt-1"><svg width="17" height="17" viewBox="0 0 17 17" fill='none' xmlns="http://www.w3.org/2000/svg">
            <path d="M8.61075 0.843694C8.5195 0.658803 8.3312 0.541748 8.12502 0.541748C7.91883 0.541748 7.73053 0.658803 7.63928 0.843694L5.42183 5.33681L0.46384 6.05679C0.25979 6.08642 0.0902597 6.22933 0.0265345 6.42543C-0.0371906 6.62152 0.0159425 6.83679 0.163592 6.98071L3.75133 10.4779L2.90415 15.4166C2.86929 15.6198 2.95283 15.8252 3.11964 15.9464C3.28644 16.0676 3.50759 16.0835 3.69009 15.9876L8.12502 13.6559L12.5599 15.9876C12.7424 16.0835 12.9636 16.0676 13.1304 15.9464C13.2972 15.8252 13.3807 15.6198 13.3459 15.4166L12.4987 10.4779L16.0864 6.98071C16.2341 6.83679 16.2872 6.62152 16.2235 6.42543C16.1598 6.22933 15.9902 6.08642 15.7862 6.05679L10.8282 5.33681L8.61075 0.843694Z" fill={color} />
        </svg>
        </span>);
    }
    if (halfStar) {
        starElements.push(
            <span
                key="half"
                className='w-5 mt-1'
                style={{
                    position: "relative",
                }}
            >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.87435 13.0437L4.18735 15.508L5.08268 10.2887L1.29102 6.59267L6.53085 5.83176L8.87435 1.08325L11.2178 5.83176L16.4577 6.59267L12.666 10.2887L13.5613 15.508L8.87435 13.0437Z" stroke={emptyColor} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                    className='w-5 inset-0'
                    style={{
                        position: "absolute",
                        overflow: "hidden",
                        width: `${reminder?.toFixed(2) * 100}%`,
                    }}
                >
                    <svg width="17" height="17" viewBox="0 0 17 17" fill='none' xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.61075 0.843694C8.5195 0.658803 8.3312 0.541748 8.12502 0.541748C7.91883 0.541748 7.73053 0.658803 7.63928 0.843694L5.42183 5.33681L0.46384 6.05679C0.25979 6.08642 0.0902597 6.22933 0.0265345 6.42543C-0.0371906 6.62152 0.0159425 6.83679 0.163592 6.98071L3.75133 10.4779L2.90415 15.4166C2.86929 15.6198 2.95283 15.8252 3.11964 15.9464C3.28644 16.0676 3.50759 16.0835 3.69009 15.9876L8.12502 13.6559L12.5599 15.9876C12.7424 16.0835 12.9636 16.0676 13.1304 15.9464C13.2972 15.8252 13.3807 15.6198 13.3459 15.4166L12.4987 10.4779L16.0864 6.98071C16.2341 6.83679 16.2872 6.62152 16.2235 6.42543C16.1598 6.22933 15.9902 6.08642 15.7862 6.05679L10.8282 5.33681L8.61075 0.843694Z" fill={color} />
                    </svg>
                </span>
            </span>
        );
    }
    for (let i = 0; i < emptyStars; i++) {
        starElements.push(<span key={i + filledStars} className="w-5 mt-1"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.87435 13.0437L4.18735 15.508L5.08268 10.2887L1.29102 6.59267L6.53085 5.83176L8.87435 1.08325L11.2178 5.83176L16.4577 6.59267L12.666 10.2887L13.5613 15.508L8.87435 13.0437Z" stroke={emptyColor} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
        </svg></span>);
    }

    return (
        <div className="flex flex-row">
            <div className="flex">{starElements}</div>
            <span className='md:text-[18px] text-[15px] font-[300] font-regola-pro md:pl-2 pl-2 mt-[2px] md:mt-0 text-[#757575]'>
                {text}
            </span>
        </div>

    );
}

export default Rating;
