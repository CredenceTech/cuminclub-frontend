import React from "react";
import { useSelector } from "react-redux";
import { userEmails } from "../state/user";
import UserAvatar from '../assets/avatar.jpg';
const MyProfile = () => {
    const userEmail = useSelector(userEmails);
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg bg-gray-50 shadow-md">
            {/* Header Section with Profile Picture */}
            <div className="flex items-center gap-4 mb-8">
            <div className="w-[90px] h-[90px] rounded-full bg-gray-400 flex items-center justify-center text-white font-medium text-[36px]">
        {userEmail?.firstName ? userEmail.firstName.charAt(0).toUpperCase() : ''}
      </div>
                <h1 className="text-2xl font-bold text-gray-800">{userEmail?.firstName} {userEmail?.lastName}</h1>
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1 border-gray-300">Personal Information</h2>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Full Name:</span> {userEmail?.firstName} {userEmail?.lastName}</p>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Username:</span> {userEmail?.email}</p>
                {/* <p className="text-gray-600"><span className="font-bold text-gray-800">Birth Date:</span> January 1, 1990</p>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Gender:</span> Male</p> */}
            </div>

            {/* Contact Details Section */}
            {/* <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1 border-gray-300">Contact Details</h2>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Email:</span> johndoe@example.com</p>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Phone:</span> +1 (123) 456-7890</p>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Address:</span> 123 Main Street, City, Country</p>
            </div> */}

            {/* Preferences Section */}
            {/* <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1 border-gray-300">Preferences</h2>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Marketing Emails:</span> Subscribed</p>
                <p className="text-gray-600"><span className="font-bold text-gray-800">Notifications:</span> Enabled</p>
            </div> */}

            {/* Edit Profile Button */}
            {/* <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                Edit Profile
            </button> */}
        </div>
    );
};

export default MyProfile;
