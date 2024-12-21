import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";

export const BusinessInquiryForm = () => {
    const [loading, setLoading] = useState(false);
    const reasons = [
        "Customer support",
        "Feedback and suggestions",
        "Business inquiry",
        "Supplier & Vendor inquiries",
        "Carry/Supply Instantly Yours products",
        "Others",
    ];

    const customerSupportReasons = [
        "Order Status and Tracking",
        "Customer Service and Support",
        "Technical Support",
        "Shipping and Delivery Questions",
        "Billing and Payment Inquiries",
        "Account Management",
        "Other",
    ];

    const businessInquiryTypes = [
        "Private labelling",
        "Bulk purchase requests",
        "Business partnership",
        "Develop a recipe",
    ];

    const industryExperienceOptions = [
        "Already in FMCG",
        "New to FMCG",
        "Want to start",
        "Not in FMCG",
    ];

    const businessTypes = [
        "Wholesaler",
        "Retailer",
        "Distributor",
        "Broker",
        "Buyer",
        "Exporter",
        "Importer",
        "Other",
    ];

    const otherReasons = [
        'Order Status and Tracking',
        'Customer Service and Support',
        'Technical Support',
        'Shipping and Delivery Questions',
        'Billing and Payment Inquiries',
        'Account Management',
        'Other'
    ];

    const [selectedReason, setSelectedReason] = useState("");

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        reason: "",
        customerSupportReason: "",
        customerSupportQuery: "",
        feedbackMessage: "",
        businessInquiryCompanyName: "",
        businessInquiryRole: "",
        businessInquiryType: "",
        businessInquiryDescription: "",
        supplierVendorDescription: "",
        carrySupplyCompanyName: "",
        carrySupplyRole: "",
        industryExperience: "",
        businessType: "",
        carrySupplyDescription: "",
        otherReason: '',
        otherInquiryDescription: ''
    };


    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        phone: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be 10 digits")
            .required("Phone number is required"),
        reason: Yup.string().required("Reason is required"),

        customerSupportReason: Yup.lazy((value, context) =>
            context.parent.reason === "Customer support"
                ? Yup.string().required("Please select a Customer Support Reason")
                : Yup.string().notRequired()
        ),

        customerSupportQuery: Yup.lazy((value, context) =>
            context.parent.reason === "Customer support"
                ? Yup.string().required("Please enter a query for Customer Support")
                : Yup.string().notRequired()
        ),

        feedbackMessage: Yup.lazy((value, context) =>
            context.parent.reason === "Feedback and suggestions"
                ? Yup.string().required("Please provide your feedback or suggestion")
                : Yup.string().notRequired()
        ),

        // Business Inquiry Fields
        businessInquiryCompanyName: Yup.lazy((value, context) =>
            context.parent.reason === "Business inquiry"
                ? Yup.string().required("Company Name is required for Business Inquiry")
                : Yup.string().notRequired()
        ),

        businessInquiryRole: Yup.lazy((value, context) =>
            context.parent.reason === "Business inquiry"
                ? Yup.string().required("Role at Company is required for Business Inquiry")
                : Yup.string().notRequired()
        ),

        businessInquiryType: Yup.lazy((value, context) =>
            context.parent.reason === "Business inquiry"
                ? Yup.string().required("Please select a Business Inquiry Type")
                : Yup.string().notRequired()
        ),

        businessInquiryDescription: Yup.lazy((value, context) =>
            context.parent.reason === "Business inquiry"
                ? Yup.string().required("Business Inquiry Description is required")
                : Yup.string().notRequired()
        ),

        // Supplier & Vendor relations
        supplierVendorDescription: Yup.lazy((value, context) =>
            context.parent.reason === "Supplier & Vendor relations"
                ? Yup.string().required("Please provide a description for Supplier & Vendor relations")
                : Yup.string().notRequired()
        ),

        // Carry/Supply Instantly Yours Products
        carrySupplyCompanyName: Yup.lazy((value, context) =>
            context.parent.reason === "Carry/Supply Instantly Yours products"
                ? Yup.string().required("Company Name is required for Carry/Supply")
                : Yup.string().notRequired()
        ),

        carrySupplyRole: Yup.lazy((value, context) =>
            context.parent.reason === "Carry/Supply Instantly Yours products"
                ? Yup.string().required("Role at Company is required for Carry/Supply")
                : Yup.string().notRequired()
        ),

        industryExperience: Yup.lazy((value, context) =>
            context.parent.reason === "Carry/Supply Instantly Yours products"
                ? Yup.string().required("Please select your Industry Experience")
                : Yup.string().notRequired()
        ),

        businessType: Yup.lazy((value, context) =>
            context.parent.reason === "Carry/Supply Instantly Yours products"
                ? Yup.string().required("Please select your Business Type")
                : Yup.string().notRequired()
        ),

        carrySupplyDescription: Yup.lazy((value, context) =>
            context.parent.reason === "Carry/Supply Instantly Yours products"
                ? Yup.string().required("Carry/Supply Description is required")
                : Yup.string().notRequired()
        ),

        // Other Reason Fields
        otherReason: Yup.lazy((value, context) =>
            context.parent.reason === "Others"
                ? Yup.string().required("Other reason is required")
                : Yup.string().notRequired()
        ),

        otherInquiryDescription: Yup.lazy((value, context) =>
            context.parent.reason === "Others"
                ? Yup.string().required("Description for Other Inquiry is required")
                : Yup.string().notRequired()
        )
    });


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const fields = [
                { key: 'name', value: values.name },
                { key: 'customer_name', value: values.name },
                { key: 'customer_email', value: values.email },
                { key: 'customer_phone', value: values.phone },
                { key: 'reason_for_getting_in_touch', value: selectedReason },
            ];
            if (selectedReason === 'Customer support') {
                fields.push(
                    { key: 'customer_support_reason', value: values.customerSupportReason },
                    { key: 'customer_support_query', value: values.customerSupportQuery },
                );
            }

            if (selectedReason === 'Feedback and suggestions') {
                fields.push(
                    { key: 'feedback_and_suggestions_message', value: values.feedbackMessage },
                );
            }

            if (selectedReason === 'Business inquiry') {
                fields.push(
                    { key: 'business_inquiry_company_name', value: values.businessInquiryCompanyName },
                    { key: 'business_inquiry_role_at_company', value: values.businessInquiryRole },
                    { key: 'business_inquiry', value: values.businessInquiryType },
                    { key: 'business_inquiry_description', value: values.businessInquiryDescription },
                );
            }

            if (selectedReason === 'Supplier & Vendor inquiries') {
                fields.push(
                    { key: 'supplier_and_vendor_inquiry_description', value: values.supplierVendorDescription },
                );
            }

            if (selectedReason === 'Carry/Supply Instantly Yours products') {
                fields.push(
                    { key: 'carry_and_supply_company_name', value: values.carrySupplyCompanyName },
                    { key: 'carry_and_supply_role_at_company', value: values.carrySupplyRole },
                    { key: 'carry_and_supply_industry_experience', value: values.industryExperience },
                    { key: 'carry_and_supply_business_type', value: values.businessType },
                    { key: 'carry_and_supply_inquiry_description', value: values.carrySupplyDescription },
                );
            }

            if (selectedReason === 'Others') {
                fields.push(
                    { key: 'other_inquiry_reason', value: values.otherReason },
                    { key: 'other_inquiry_description', value: values.otherInquiryDescription },
                );
            }

            const params = {
                fields
            };

            const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/add-business-form`;

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
                console.log('Inquiry submitted successfully:', data);

                formik.resetForm();
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error submitting inquiry:', error);
            }
        },
    });

    const handleReasonChange = (e) => {
        const value = e.target.value;
        setSelectedReason(value); // Update local state
        formik.setFieldValue('reason', value); // Update Formik's internal state
    };

    return (
        <div className="flex h-full ">
            <div className="w-full p-[40px] md:m-10 font-regola-pro bg-[#EADEC1] shadow">
                <h2 className="text-[40.24px] leading-[37.58px] text-[#2A2A2A] mb-4 font-skillet">
                    Get in touch
                </h2>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                        <div className="w-full lg:w-1/2 relative flex flex-col">
                            <label htmlFor="name" className="text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} // Add onBlur for validation
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''} focus:outline-none`}

                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.name}</div>
                            ) : null}
                        </div>

                        {/* Email */}
                        <div className="w-full lg:w-1/2 relative flex flex-col">
                            <label htmlFor="email" className="text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} // Add onBlur for validation
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''} focus:outline-none`}

                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.email}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                        <div className="w-full lg:w-1/2 relative flex flex-col">
                            <label htmlFor="phone" className="text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ">
                                Phone
                            </label>
                            <input
                                id="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} // Add onBlur for validation
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3`}

                            />
                        </div>
                        <div className="w-full lg:w-1/2 relative flex flex-col">
                            <label htmlFor="reason" className="text-[16px] font-[400] leading-[24px] text-[#2A2A2A] font-regola-pro ">
                                What's the reason for getting in touch? <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="reason"
                                name="reason"
                                value={formik.values.reason}
                                onChange={handleReasonChange}
                                onBlur={formik.handleBlur} // Add onBlur for validation
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.reason && formik.errors.reason ? 'border-red-500' : ''} focus:outline-none`}
                            >
                                <option value="">Choose</option>
                                {reasons.map((reason, index) => (
                                    <option key={index} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.reason && formik.errors.reason ? (
                                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.reason}</div>
                            ) : null}
                        </div>
                    </div>

                    {selectedReason === "Customer support" && (
                        <>
                            <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="customerSupportReason"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Select a reason below <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="customerSupportReason"
                                        value={formik.values.customerSupportReason}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} // Adding onBlur for validation
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.customerSupportReason && formik.errors.customerSupportReason ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Choose</option>
                                        {customerSupportReasons.map((reason, index) => (
                                            <option key={index} value={reason}>
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.customerSupportReason && formik.errors.customerSupportReason ? (
                                        <div className="text-red-500 text-sm">{formik.errors.customerSupportReason}</div>
                                    ) : null}
                                </div>

                                {/* Customer Support Query */}
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="customerSupportQuery"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Please describe your query/concern <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="customerSupportQuery"
                                        value={formik.values.customerSupportQuery}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} // Adding onBlur for validation
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.customerSupportQuery && formik.errors.customerSupportQuery ? 'border-red-500' : ''}`}
                                    />
                                    {formik.touched.customerSupportQuery && formik.errors.customerSupportQuery ? (
                                        <div className="text-red-500 text-sm">{formik.errors.customerSupportQuery}</div>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )}


                    {selectedReason === "Carry/Supply Instantly Yours products" && (
                        <>
                            <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="carrySupplyCompanyName"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Your Company <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="carrySupplyCompanyName"
                                        value={formik.values.carrySupplyCompanyName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.carrySupplyCompanyName && formik.errors.carrySupplyCompanyName ? 'border-red-500' : ''}`}
                                    />
                                    {formik.touched.carrySupplyCompanyName && formik.errors.carrySupplyCompanyName && (
                                        <div className="text-red-500 text-sm">{formik.errors.carrySupplyCompanyName}</div>
                                    )}
                                </div>

                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="carrySupplyRole"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Role at the Company
                                    </label>
                                    <input
                                        type="text"
                                        id="carrySupplyRole"
                                        value={formik.values.carrySupplyRole}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3`}
                                    />
                                </div>
                            </div>

                            <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="industryExperience"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Industry Experience
                                    </label>
                                    <select
                                        id="industryExperience"
                                        value={formik.values.industryExperience}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3`}
                                    >
                                        <option value="">Choose</option>
                                        {industryExperienceOptions.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="businessType"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Please select your type of business <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="businessType"
                                        value={formik.values.businessType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.businessType && formik.errors.businessType ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Choose</option>
                                        {businessTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.businessType && formik.errors.businessType && (
                                        <div className="text-red-500 text-sm">{formik.errors.businessType}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="carrySupplyDescription"
                                    className="block text-gray-700 font-medium mb-1 text-[16px]"
                                >
                                    Describe your interest
                                </label>
                                <input
                                    type="text"
                                    id="carrySupplyDescription"
                                    value={formik.values.carrySupplyDescription}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3`}
                                />
                            </div>
                        </>
                    )}




                    {selectedReason === "Business inquiry" && (
                        <>
                            {/* Company Name */}
                            <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="businessInquiryCompanyName"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Your Company <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="businessInquiryCompanyName"
                                        value={formik.values.businessInquiryCompanyName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.businessInquiryCompanyName && formik.errors.businessInquiryCompanyName ? 'border-red-500' : ''}`}
                                    />
                                    {formik.touched.businessInquiryCompanyName && formik.errors.businessInquiryCompanyName && (
                                        <div className="text-red-500 text-sm">{formik.errors.businessInquiryCompanyName}</div>
                                    )}
                                </div>

                                {/* Role at Company */}
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="businessInquiryRole"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Role at the Company
                                    </label>
                                    <input
                                        type="text"
                                        id="businessInquiryRole"
                                        value={formik.values.businessInquiryRole}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3`}
                                    />
                                </div>
                            </div>

                            {/* Business Inquiry Type */}
                            <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="businessInquiryType"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        What is the inquiry <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="businessInquiryType"
                                        value={formik.values.businessInquiryType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3  ${formik.touched.businessInquiryType && formik.errors.businessInquiryType ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Choose</option>
                                        {businessInquiryTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.businessInquiryType && formik.errors.businessInquiryType && (
                                        <div className="text-red-500 text-sm">{formik.errors.businessInquiryType}</div>
                                    )}
                                </div>

                                {/* Business Inquiry Description */}
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="businessInquiryDescription"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Please describe your inquiry
                                    </label>
                                    <input
                                        type="text"
                                        id="businessInquiryDescription"
                                        value={formik.values.businessInquiryDescription}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3`}
                                    />
                                </div>
                            </div>
                        </>
                    )}


                    {selectedReason === "Feedback and suggestions" && (
                        <div>
                            <label
                                htmlFor="feedbackMessage"
                                className="block text-gray-700 font-medium mb-1 text-[16px]"
                            >
                                We appreciate any feedback or suggestions and would love to hear from you! Please mention your feedback or suggestions below. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="feedbackMessage"
                                value={formik.values.feedbackMessage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.feedbackMessage && formik.errors.feedbackMessage ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.feedbackMessage && formik.errors.feedbackMessage && (
                                <div className="text-red-500 text-sm">{formik.errors.feedbackMessage}</div>
                            )}
                        </div>
                    )}


                    {selectedReason === "Supplier & Vendor inquiries" && (
                        <div>
                            <label
                                htmlFor="supplierVendorDescription"
                                className="block text-gray-700 font-medium mb-1 text-[16px]"
                            >
                                Please mention your business and the products you would be interested in supplying to Instantly Yours <span className="text-red-500">*</span>
                            </label>
                            <input
                                as="text"
                                id="supplierVendorDescription"
                                value={formik.values.supplierVendorDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.supplierVendorDescription && formik.errors.supplierVendorDescription ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.supplierVendorDescription && formik.errors.supplierVendorDescription && (
                                <div className="text-red-500 text-sm">{formik.errors.supplierVendorDescription}</div>
                            )}
                        </div>
                    )}



                    {selectedReason === 'Others' && (
                        <>
                            <div className="relative flex flex-col lg:flex-row gap-2 mb-1">
                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="otherReason"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Select a reason below <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="otherReason"
                                        value={formik.values.otherReason}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.otherReason && formik.errors.otherReason ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Choose</option>
                                        {otherReasons.map((reason, index) => (
                                            <option key={index} value={reason}>
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.otherReason && formik.errors.otherReason && (
                                        <div className="text-red-500 text-sm">{formik.errors.otherReason}</div>
                                    )}
                                </div>

                                <div className="w-full lg:w-1/2 relative flex flex-col">
                                    <label
                                        htmlFor="otherInquiryDescription"
                                        className="block text-gray-700 font-medium mb-1 text-[16px]"
                                    >
                                        Please describe your query/concern <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="otherInquiryDescription"
                                        value={formik.values.otherInquiryDescription}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px]  px-4 py-4 lg:px-5 lg:py-3 ${formik.touched.otherInquiryDescription && formik.errors.otherInquiryDescription ? 'border-red-500' : ''}`}
                                    />
                                    {formik.touched.otherInquiryDescription && formik.errors.otherInquiryDescription && (
                                        <div className="text-red-500 text-sm">{formik.errors.otherInquiryDescription}</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="rounded-lg text-xl lg:text-[20px] mt-[20px] bg-gray-900 text-gray-100  p-3"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}
