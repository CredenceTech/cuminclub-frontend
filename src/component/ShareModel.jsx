import React, { useEffect, useRef } from 'react'
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from "react-share";
function ShareModel({ handleCloseModal, shareUrl }) {
    const modalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCloseModal();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleCloseModal]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Share With Friends</h2>
                    <button onClick={handleCloseModal} type='button' className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center gap-x-5 my-[50px]">
                    <FacebookShareButton
                        url={shareUrl}
                        className=""
                    >
                        <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={shareUrl}
                        className=""
                    >
                        <XIcon size={40} round />
                    </TwitterShareButton>
                    <WhatsappShareButton
                        url={shareUrl}
                        separator=":: "
                        className=""
                    >
                        <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                    <LinkedinShareButton
                        url={shareUrl}
                        className=""
                    >
                        <LinkedinIcon size={40} round />
                    </LinkedinShareButton>

                </div>
                <div className="bg-gray-100 p-2 rounded flex items-center">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="bg-transparent flex-grow outline-none"
                    />
                    <button
                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                        className="ml-2 text-green-600 hover:text-green-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShareModel