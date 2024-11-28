import React, { useState } from "react";

const AnnouncementBar = () => {
    const announcements = [
        'Free Products: "Free Dessert on ₹899+ Orders! Code: FREETREAT"',
        'Free Shipping: "Free Shipping on ₹299+ | Code: FREESHIP"',
        'Flat Discount: "10% Off on ₹499+ Orders! | Code: LAUNCH10"',
    ];

    const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

    // Handle next announcement
    const nextAnnouncement = () => {
        setCurrentAnnouncement((prevIndex) =>
            prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Handle previous announcement
    const prevAnnouncement = () => {
        setCurrentAnnouncement((prevIndex) =>
            prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="flex items-center justify-between bg-[#EB7E01] text-white h-[48px] md:h-[43px] px-4">
            {/* Previous Button */}
            <button
                onClick={prevAnnouncement}
                className="text-xl font-bold focus:outline-none hover:text-gray-300"
            >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.8002 1.1333L1.2002 5.7333L5.80019 10.3333" stroke="white" stroke-width="1.53333" stroke-linecap="square" />
                </svg>
            </button>

            {/* Announcement Text */}
            <div className="text-center text-[#FFFFFF] font-[500] md:leading-[21.6px] leading-[16.6px] md:text-[18px] text-[14px] md:px-0 px-2 font-regola-pro">
                {announcements[currentAnnouncement]}
            </div>

            {/* Next Button */}
            <button
                onClick={nextAnnouncement}
                className="text-xl font-bold focus:outline-none hover:text-gray-300"
            >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9668 16.0999L14.5668 11.4999L9.9668 6.8999" stroke="white" stroke-width="1.53333" stroke-linecap="square" />
                </svg>

            </button>
        </div>
    );
};

export default AnnouncementBar;

