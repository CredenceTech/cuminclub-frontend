import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { graphQLClient, stagedUploadsCreateMutation } from '../api/graphql';

export const AddInfluencersForm = () => {
    const [socialMedia, setSocialMedia] = useState(''); // State to track selected social media
    const [contentType, setContentType] = useState('');
    const [loading, setLoading] = useState(false);


    const uploadFile = async (file) => {
        try {
            // Prepare the input object
            const fileInput = {
                filename: file.name,
                mimeType: file.type,
                httpMethod: "POST",
                resource: file.type.startsWith('image') ? 'IMAGE' :
                    file.type.startsWith('video') ? 'VIDEO' :
                        file.type === 'model/gltf-binary' ? 'MODEL_3D' : 'OTHER', // Adjust resource type
            };

            // Define the API endpoint
            const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/upload-file`;

            // Send the request using fetch
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([fileInput]),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const resourceUrl = data?.data[0]?.resourceUrl;
            if (!resourceUrl) {
                throw new Error('Failed to retrieve resource URL');
            }

            return resourceUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };


    const [mediaUrl, setMediaUrl] = useState('');
    const [file, setFile] = useState(null);
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setLoading(true);

            try {
                // Call the uploadFile function to upload the selected file
                const uploadedResourceUrl = await uploadFile(selectedFile);

                // Set the resource URL in the state
                setMediaUrl(uploadedResourceUrl);

                setLoading(false); // Stop loading after upload
            } catch (error) {
                setLoading(false);
                console.error('Error uploading file:', error);
            }
        }
    };
    // Social media platforms array
    const socialMediaOptions = [
        { value: 'Instagram', label: 'Instagram' },
        { value: 'Facebook', label: 'Facebook' },
        { value: 'Youtube', label: 'Youtube' },
        { value: 'Other', label: 'Other' }
    ];

    const contentTypeOptions = [
        { value: 'Food', label: 'Food' },
        { value: 'Health & fitness', label: 'Health & fitness' },
        { value: 'Travel', label: 'Travel' },
        { value: 'Lifestyle', label: 'Lifestyle' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Other', label: 'Other' }
    ];

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            socialMedia: '',
            otherSocialMedia: '',
            socialMediaUrl: '',
            contentType: '',
            otherContentType: '',
            aboutInfluencer: '',
            mediaUrl: '',
            rateCard: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            socialMedia: Yup.string().required('Social media platform is required'),
            otherSocialMedia: Yup.string().when('socialMedia', {
                is: 'Other',
                then: Yup.string().required('Please specify the social media platform'),
            }),
            socialMediaUrl: Yup.string()
                .required('Social media URL is required'),
            otherContentType: Yup.string().when('contentType', {
                is: 'Other', // Only validate if "Other" is selected
                then: Yup.string().required('Please specify the content type'),
            }),
            rateCard: Yup.string().required('Rate card is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);


            const fields = [
                { key: 'name', value: values.name },
                { key: 'email', value: values.email },
                { key: 'phone_number', value: values.phone },
                { key: 'social_media_url', value: values.socialMediaUrl },
                { key: 'about_influencer', value: values.aboutInfluencer },
                { key: 'any_media_url', value: mediaUrl },
                { key: 'rate_card', value: values.rateCard },

            ]

            if (values.socialMedia === "Other") {
                fields.push(
                    { key: 'social_media_platform_name', value: values.otherSocialMedia },
                )
            }
            else {
                fields.push(
                    { key: 'social_media_platform_name', value: values.socialMedia },
                )
            }

            if (values.contentType === "Other") {
                fields.push(
                    { key: 'content_type', value: values.otherContentType },
                )
            }
            else {
                fields.push(
                    { key: 'content_type', value: values.contentType },
                )
            }

            const params = {
                fields
            };

            const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/add-influencer-form`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Influencer added successfully:', data);

                formik.resetForm();
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error adding influencer:', error);
            }
        },
    });

    return (
        <div className="flex h-full ">
            <div className="w-full p-[40px] md:m-10 font-regola-pro bg-[#EADEC1] shadow">
                <h2 className="text-[40.24px] leading-[37.58px] text-[#2A2A2A] mb-4 font-skillet">
                    Influencers
                </h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col lg:flex-row gap-x-6'>
                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="name">Your name <span className="text-red-500">*</span></label>
                            <input
                                id="name"
                                type="text"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] px-5 py-3 ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.name}</div>
                            ) : null}
                        </div>

                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="email">Email address <span className="text-red-500">*</span></label>
                            <input
                                id="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.email}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row gap-x-6'>
                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="phone">Phone number</label>
                            <input
                                id="phone"
                                type="text"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                            />

                        </div>

                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="socialMedia">Which social media platform do you have the highest reach on? <span className="text-red-500">*</span></label>
                            <select
                                id="socialMedia"
                                value={formik.values.socialMedia}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setSocialMedia(e.target.value); // Update the socialMedia state
                                }}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.socialMedia && formik.errors.socialMedia ? 'border-red-500' : ''}`}
                            >
                                <option value="">Choose</option>
                                {socialMediaOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.socialMedia && formik.errors.socialMedia ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.socialMedia}</div>
                            ) : null}
                        </div>

                    </div>

                    {/* Show this field only if "Other" is selected */}
                    {formik.values.socialMedia === 'Other' && (
                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="otherSocialMedia">Please Specify Other Social Media <span className="text-red-500">*</span></label>
                            <input
                                id="otherSocialMedia"
                                type="text"
                                value={formik.values.otherSocialMedia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.otherSocialMedia && formik.errors.otherSocialMedia ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.otherSocialMedia && formik.errors.otherSocialMedia ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.otherSocialMedia}</div>
                            ) : null}
                        </div>
                    )}
                    <div className='flex flex-col lg:flex-row gap-x-6'>
                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="socialMediaUrl">Social Media URL <span className="text-red-500">*</span></label>
                            <input
                                id="socialMediaUrl"
                                type="url"
                                value={formik.values.socialMediaUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.socialMediaUrl && formik.errors.socialMediaUrl ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.socialMediaUrl && formik.errors.socialMediaUrl ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.socialMediaUrl}</div>
                            ) : null}
                        </div>

                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="contentType">Content Type</label>
                            <select
                                id="contentType"
                                value={formik.values.contentType}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setContentType(e.target.value); // Update the contentType state
                                }}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.contentType && formik.errors.contentType ? 'border-red-500' : ''}`}
                            >
                                <option value="">Choose</option>
                                {contentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>

                    {/* Show this field only if "Other" is selected */}
                    {formik.values.contentType === 'Other' && (
                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="otherContentType">Please Specify Other Content Type</label>
                            <input
                                id="otherContentType"
                                type="text"
                                value={formik.values.otherContentType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.otherContentType && formik.errors.otherContentType ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.otherContentType && formik.errors.otherContentType ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.otherContentType}</div>
                            ) : null}
                        </div>
                    )}
                    <div className='flex flex-col lg:flex-row gap-x-6'>
                        <div className='w-full lg:w-1/2  pt-4'>
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="aboutInfluencer">Anything else that you would like us to know?</label>
                            <textarea
                                id="aboutInfluencer"
                                name="aboutInfluencer"
                                value={formik.values.aboutInfluencer}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows="4"
                                className={`border border-[#EFE9DA] font-[400] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-5 py-3 ${formik.touched.aboutInfluencer && formik.errors.aboutInfluencer ? 'border-red-500' : ''}`}
                            />

                        </div>

                        <div className="file-upload-container pt-4 w-full lg:w-1/2">
                            <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="mediaFile">Anything you would like to send us?</label>
                            <input
                                id="mediaFile"
                                name="mediaFile"
                                type="file"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className='w-full lg:w-1/2  pt-4'>
                        <label className='text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ' htmlFor="rateCard">Could you provide your rate card? (e.g., INR X for an Instagram story, INR X for a static Instagram post, INR X for a dedicated YouTube video) <span className="text-red-500">*</span></label>
                        <textarea
                            id="rateCard"
                            name="rateCard"
                            value={formik.values.rateCard}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] px-5 py-3 ${formik.touched.rateCard && formik.errors.rateCard ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.rateCard && formik.errors.rateCard ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.rateCard}</div>
                        ) : null}
                    </div>

                    <button type="submit" className="rounded-lg text-xl lg:text-[20px] mt-[20px] bg-gray-900 text-gray-100 p-3">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
