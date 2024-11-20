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
    
            // Extract the uploaded file URL from the response
            const resourceUrl = data?.resourceUrl; // Update this based on API's actual response structure
            if (!resourceUrl) {
                throw new Error('Failed to retrieve resource URL');
            }
    
            return resourceUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // Rethrow the error for further handling
        }
    };
    

      const [mediaUrl, setMediaUrl] = useState('');
      const [file, setFile] = useState(null);
    
      // Handle file selection and upload
      const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0]; // Get the first selected file
        setFile(selectedFile); // Store the selected file
    
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
            mediaUrl:'',
            rateCard:''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            socialMedia: Yup.string().required('Social media platform is required'),
            otherSocialMedia: Yup.string().when('socialMedia', {
                is: 'Other',
                then: Yup.string().required('Please specify the social media platform'),
            }),
            socialMediaUrl: Yup.string()
                .url('Please enter a valid URL') 
                .required('Social media URL is required'), // Ensure the URL is filled

            contentType: Yup.string().required('Content type is required'),
            otherContentType: Yup.string().when('contentType', {
                is: 'Other', // Only validate if "Other" is selected
                then: Yup.string().required('Please specify the content type'),
            }),
            aboutInfluencer: Yup.string().max(500, 'Description should not exceed 500 characters'),
        }),
        onSubmit: async (values) => {
            setLoading(true);

            const params = {
                fields: [
                    { key: 'name', value: values.name },
                    { key: 'email', value: values.email },
                    { key: 'phone', value: values.phone },
                    { key: 'social_media', value: values.socialMedia },
                    { key: 'other_social_media', value: values.otherSocialMedia }, // Include "Other" social media if specified
                    { key: 'social_media_url', value: values.socialMediaUrl }, // Add URL to the params
                    { key: 'content_type', value: values.contentType },
                    { key: 'other_content_type', value: values.otherContentType },
                ]
            };

            const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/add-influencer`;

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
            <div className="w-full p-[40px] m-10 font-regola-pro bg-[#EADEC1] shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-regola-pro">
                    Get in touch
                </h2>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="name">Your name <span className="text-red-500">*</span></label>
                        <input
                            id="name"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.name}</div>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="email">Email address <span className="text-red-500">*</span></label>
                        <input
                            id="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="phone">Phone number</label>
                        <input
                            id="phone"
                            type="text"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.phone}</div>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="socialMedia">Which social media platform do you have the highest reach on? <span className="text-red-500">*</span></label>
                        <select
                            id="socialMedia"
                            value={formik.values.socialMedia}
                            onChange={(e) => {
                                formik.handleChange(e);
                                setSocialMedia(e.target.value); // Update the socialMedia state
                            }}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.socialMedia && formik.errors.socialMedia ? 'border-red-500' : ''}`}
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

                    {/* Show this field only if "Other" is selected */}
                    {formik.values.socialMedia === 'Other' && (
                        <div>
                            <label htmlFor="otherSocialMedia">Please Specify Other Social Media <span className="text-red-500">*</span></label>
                            <input
                                id="otherSocialMedia"
                                type="text"
                                value={formik.values.otherSocialMedia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.otherSocialMedia && formik.errors.otherSocialMedia ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.otherSocialMedia && formik.errors.otherSocialMedia ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.otherSocialMedia}</div>
                            ) : null}
                        </div>
                    )}

                    <div>
                        <label htmlFor="socialMediaUrl">Social Media URL <span className="text-red-500">*</span></label>
                        <input
                            id="socialMediaUrl"
                            type="url"
                            value={formik.values.socialMediaUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.socialMediaUrl && formik.errors.socialMediaUrl ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.socialMediaUrl && formik.errors.socialMediaUrl ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.socialMediaUrl}</div>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="contentType">Content Type</label>
                        <select
                            id="contentType"
                            value={formik.values.contentType}
                            onChange={(e) => {
                                formik.handleChange(e);
                                setContentType(e.target.value); // Update the contentType state
                            }}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.contentType && formik.errors.contentType ? 'border-red-500' : ''}`}
                        >
                            <option value="">Choose</option>
                            {contentTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {formik.touched.contentType && formik.errors.contentType ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.contentType}</div>
                        ) : null}
                    </div>

                    {/* Show this field only if "Other" is selected */}
                    {formik.values.contentType === 'Other' && (
                        <div>
                            <label htmlFor="otherContentType">Please Specify Other Content Type</label>
                            <input
                                id="otherContentType"
                                type="text"
                                value={formik.values.otherContentType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.otherContentType && formik.errors.otherContentType ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.otherContentType && formik.errors.otherContentType ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.otherContentType}</div>
                            ) : null}
                        </div>
                    )}

                    <div>
                        <label htmlFor="aboutInfluencer">Anything else that you would like us to know?</label>
                        <textarea
                            id="aboutInfluencer"
                            name="aboutInfluencer"
                            value={formik.values.aboutInfluencer}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows="4"
                            className={`border border-[#EFE9DA] font-[400] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.aboutInfluencer && formik.errors.aboutInfluencer ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.aboutInfluencer && formik.errors.aboutInfluencer ? (
                            <div className="text-red-500 text-sm font-regola-pro">{formik.errors.aboutInfluencer}</div>
                        ) : null}
                    </div>

                    <div className="file-upload-container">
  <label htmlFor="mediaFile">Anything you would like to send us?</label>
  <input
    id="mediaFile"
    name="mediaFile"
    type="file"
    onChange={handleFileChange}
  />
</div>


      <div>
                        <label htmlFor="rateCard">Could you provide your rate card? (e.g., INR X for an Instagram story, INR X for a static Instagram post, INR X for a dedicated YouTube video) <span className="text-red-500">*</span></label>
                        <textarea
                            id="rateCard"
                            name="rateCard"
                            value={formik.values.rateCard}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.rateCard && formik.errors.rateCard ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.rateCard && formik.errors.rateCard ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.rateCard}</div>
                            ) : null}
                    </div>

                    <button type="submit" className="bg-[#EFE9DA] text-[#333] rounded-[15px] p-4 mt-4">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
