import React from 'react';
import redChillyImage from "../assets/red-chilly.svg";
import grayChillyImage from "../assets/gray-chilly.svg";

const SpiceLevel = ({ rating }) => {
    const filledStars = Math.min(Math.max(0, Math.round(rating)), 5);
    const emptyStars = Math.max(0, 5 - filledStars);

    const starElements = [];
    for (let i = 0; i < filledStars; i++) {
        starElements.push(<span key={i} className="w-7"><img
            className="w-7"
            src={redChillyImage}
            alt="chilly"
        /></span>);
    }
    for (let i = 0; i < emptyStars; i++) {
        starElements.push(<span key={i + filledStars} className=""><img
            className="w-7"
            src={grayChillyImage}
            alt="chilly"
        /></span>);
    }

    return (
        <div className="flex flex-row">
            {starElements}
        </div>
    );
}

export default SpiceLevel;