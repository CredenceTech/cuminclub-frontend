import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";

export const Faqs = () => {

    const [openCategoryMeals, setOpenCategoryMeals] = useState(null);

    const toggleCategoryMeals = (id) => {
        setOpenCategoryMeals(openCategoryMeals === id ? null : id);
    };

    const categoryVariants = {
        open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
        closed: {
            borderBottomRightRadius: "0.375rem",
            borderBottomLeftRadius: "0.375rem",
        },
    };


    const shippingPolicyData = [
        {
            id: 31,
            question: "Are all products always available for order?",
            answer: "Product availability may vary. If an item is out of stock at the time of your order, you will be promptly notified. A full refund will be issued to your original payment method without delay."
        },
        {
            id: 32,
            question: "How long does it take to deliver my order?",
            answer: "Delivery typically takes 2-5 business days from the shipping date, depending on your location. Please note that business days are Monday to Friday, excluding public holidays."
        },
        {
            id: 33,
            question: "What happens if my delivery is delayed?",
            answer: "In case of any unforeseen delays, we will notify you via email or SMS. For updates, you can also contact us at customersupport@instantlyyours.in."
        },
        {
            id: 34,
            question: "How are shipping charges calculated?",
            answer: "Shipping charges are based on the weight of the products and the delivery method selected during checkout."
        },
        {
            id: 35,
            question: "What should I do if my delivery is delayed?",
            answer: "We aim to deliver within 2-5 business days. If there are any delays, our team will notify you. For further inquiries, please reach out to customersupport@instantlyyours.in."
        }
    ];

    const returnRefundPolicyData = [
        {
            id: 36,
            question: "Can I return a product if I am unsatisfied?",
            answer: "Unfortunately, we do not accept returns on our products. However, if you receive a damaged or defective product, we offer free replacements."
        },
        {
            id: 37,
            question: "How do I request a refund for a damaged product?",
            answer: "If your product is damaged during transit, contact us within 7 days at customersupport@instantlyyours.in with details and pictures of the damage. Once validated, we will process a replacement or refund."
        },
        {
            id: 38,
            question: "How long does it take to process a refund?",
            answer: "Refunds will be credited to your original mode of payment within 5-10 working days after approval."
        }
    ];

    const orderCancellationPolicyData = [
        {
            id: 39,
            question: "How do I cancel my order?",
            answer: "Cancellations can be made within 12 hours of placing the order by contacting us at customersupport@instantlyyours.in."
        },
        {
            id: 40,
            question: "Will I receive a full refund for cancelled orders?",
            answer: "Yes, a full refund will be processed to your original payment method within 5-10 working days of cancellation."
        },
        {
            id: 41,
            question: "Can I cancel a subscription order?",
            answer: "Subscription orders can be cancelled via your account settings. Make sure to cancel at least 24 hours before the next delivery date to avoid charges."
        }
    ];

    const productInformationData = [
        {
            id: 409,
            question: "What kind of products does Instantly Yours offer?",
            answer: "We offer a range of Ready-to-Eat (RTE) and Ready-to-Cook (RTC) products. Our products are free from preservatives and artificial additives, focusing on convenience and authentic taste."
        },
        {
            id: 43,
            question: "How long do the products stay fresh?",
            answer: "All our products have a shelf life of up to two years due to our innovative retort packaging technology, which keeps them fresh without refrigeration."
        },
        {
            id: 44,
            question: "How are your products preservative-free?",
            answer: "Our products are preservative-free due to the use of retort packaging technology, which naturally extends shelf life without compromising quality."
        },
        {
            id: 45,
            question: "Are there any allergens in your products?",
            answer: "While we strive to make our products allergen-free, some items may contain common allergens like dairy or gluten. Please check individual product labels for detailed allergen information."
        },
        {
            id: 46,
            question: "Can your products be stored at room temperature?",
            answer: "Yes! All our products are designed for ambient storage, requiring no refrigeration until opened. This makes them ideal for travel, offices, and quick meals at home."
        },
        {
            id: 47,
            question: "Are your products Jain friendly?",
            answer: "Yes, we offer a selection of Jain-friendly products that do not contain onions or garlic (marked as NONG). Here’s a list of our Jain-friendly offerings:\n- RTE Paneer Butter Masala (NONG)\n- RTE Pav Bhaji (NONG)\n- RTE Shahi Biryani (NONG)\n- RTE Dal Makhni (NONG)"
        }
    ];

    const giftingBulkOrdersData = [
        {
            id: 48,
            question: "I want to gift Instantly Yours products at my celebration or corporate event. Can you help?",
            answer: "Yes, we offer curated gift hampers and bulk gifting options for special occasions. Let us know your requirements, and we’ll create the perfect package for your event. Reach out to customersupport@instantlyyours.in to explore options."
        },
        {
            id: 49,
            question: "How will my bulk order be delivered?",
            answer: "Bulk orders are carefully packaged and shipped via our trusted delivery partners. Delivery timelines and methods will be coordinated with you to ensure a seamless experience."
        },
        {
            id: 50,
            question: "What’s the minimum advance notice required for bulk orders?",
            answer: "We recommend placing bulk orders at least 7-10 business days in advance to ensure timely delivery. For urgent requests, please contact our team, and we’ll do our best to accommodate your needs."
        }
    ];

    const orderFeedbackData = [
        {
            id: 51,
            question: "I have not received my order yet.",
            answer: "Please allow 2-5 business days for delivery. If your order is delayed, you will be notified. For further assistance, contact customersupport@instantlyyours.in."
        },
        {
            id: 52,
            question: "My order items arrived damaged.",
            answer: "If your items are damaged in transit, please contact us within 7 days at customersupport@instantlyyours.in with photos of the damage. We will arrange a free replacement."
        },
        {
            id: 53,
            question: "There's an item missing from my order.",
            answer: "If an item is missing, please contact us at customersupport@instantlyyours.in within 7 days of delivery. We will validate the issue and arrange a replacement or refund."
        }
    ];

    const subscriptionData = [
        {
            title: "Sign-Up Process",
            questions: [
                {
                    id: 54,
                    question: "How do I sign up for a subscription?",
                    answer: "To sign up for a subscription, visit our 'Subscriptions' page, select the plan that suits you best, and follow the on-screen instructions to complete your sign-up process."
                },
                {
                    id: 55,
                    question: "What are the benefits of subscribing to Instantly Yours?",
                    answer: "Subscribers enjoy exclusive benefits such as discounted rates, priority customer service, early access to new products, and the convenience of regular, hassle-free deliveries."
                },
                {
                    id: 56,
                    question: "Can I choose the products I want in my subscription box?",
                    answer: "Yes, you can customize your subscription box by selecting the products you prefer. Just choose from the available options during the sign-up process or update your preferences later."
                }
            ]
        },
        {
            title: "Subscription Management",
            subtitles: [
                {
                    subtitle: "Changing Subscription Details",
                    questions: [
                        {
                            id: 4,
                            question: "How can I update my subscription preferences?",
                            answer: "You can update your subscription preferences by logging into your account, navigating to the My Subscriptions section, and making the desired changes."
                        },
                        {
                            id: 5,
                            question: "Can I change the products in my subscription box?",
                            answer: "Yes, you can change the products in your subscription box by navigating to the My Subscriptions section at any time before the cut-off time. Just go to your account settings and update your product selections."
                        },
                        {
                            id: 6,
                            question: "How do I update my delivery address for my subscription?",
                            answer: "To update your delivery address, log into your account, go to 'My Subscriptions,' and edit the delivery address details."
                        }
                    ]
                },
                {
                    subtitle: "Subscription Frequency",
                    questions: [
                        {
                            id: 7,
                            question: "Can I change the frequency of my deliveries?",
                            answer: "Yes, you can change the delivery frequency by adjusting your subscription settings in your account under the 'Delivery Frequency' section."
                        },
                        {
                            id: 8,
                            question: "How often can I receive my subscription box?",
                            answer: "You can choose to receive your subscription box weekly, bi-weekly, or monthly, depending on your preference."
                        }
                    ]
                }
            ]
        },
        {
            title: "Payment and Billing",
            subtitles: [
                {
                    subtitle: "Billing Information",
                    questions: [
                        {
                            id: 9,
                            question: "How do I update my payment information?",
                            answer: "To update your payment information, log into your account, go to 'Billing Information,' and enter your new payment details."
                        },
                        {
                            id: 10,
                            question: "When will I be billed for my subscription?",
                            answer: "You will be billed on the same date each billing cycle, which is based on the start date of your subscription. You can view your billing date in your account settings."
                        },
                        {
                            id: 11,
                            question: "Can I use a different payment method for my subscription?",
                            answer: "Yes, you can update your payment method at any time by visiting the 'Billing Information' section in your account settings."
                        }
                    ]
                },
                {
                    subtitle: "Billing Issues",
                    questions: [
                        {
                            id: 12,
                            question: "I was charged incorrectly, how do I get this resolved?",
                            answer: "If you believe you were charged incorrectly, please contact our customer support team at customersupport@instantlyyours.in with your order details, and we will investigate and resolve the issue promptly."
                        },
                        {
                            id: 13,
                            question: "Why was my subscription payment declined?",
                            answer: "A payment may be declined due to insufficient funds, an expired card, or incorrect billing information. Please check your payment details and try again or use a different payment method."
                        }
                    ]
                }
            ]
        },
        {
            title: "Subscription Cancellations",
            subtitles: [
                {
                    subtitle: "Cancelling Subscription",
                    questions: [
                        {
                            id: 14,
                            question: "How do I cancel my subscription?",
                            answer: "You can cancel your subscription by logging into your account, navigating to the 'My Subscriptions' section, and selecting 'Cancel Subscription.' Follow the prompts to complete the cancellation."
                        },
                        {
                            id: 15,
                            question: "Can I get a refund if I cancel my subscription?",
                            answer: "Refunds for cancellations are processed according to our refund policy. Please refer to our refund policy for details or contact customer support for assistance."
                        }
                    ]
                },
                {
                    subtitle: "Cancellation Policy",
                    questions: [
                        {
                            id: 16,
                            question: "What is your cancellation policy?",
                            answer: "Our cancellation policy allows you to cancel your subscription at any time before the cut-off period. If you cancel before the next billing cycle, you will not be charged for the upcoming cycle."
                        },
                        {
                            id: 17,
                            question: "Is there a fee for cancelling my subscription?",
                            answer: "There are no fees for cancelling your subscription. You can cancel at any time without any penalties."
                        }
                    ]
                }
            ]
        },
        {
            title: "Skipping Deliveries",
            subtitles: [
                {
                    subtitle: "Skipping a Delivery",
                    questions: [
                        {
                            id: 18,
                            question: "How can I skip a delivery for my subscription?",
                            answer: "To skip a delivery, log into your account, go to the 'My Subscriptions' section, and select 'Skip Delivery' for the specific date you wish to skip."
                        },
                        {
                            id: 19,
                            question: "Is it possible to skip my next delivery?",
                            answer: "Yes, you can skip your next delivery by selecting the 'Skip Delivery' option in your subscription settings before the scheduled delivery date."
                        }
                    ]
                }
            ]
        },
        {
            title: "Rescheduling Deliveries",
            subtitles: [
                {
                    subtitle: "Rescheduling Delivery Date",
                    questions: [
                        {
                            id: 20,
                            question: "Can I reschedule my subscription delivery date?",
                            answer: "Yes, you can reschedule your delivery date by logging into your account, navigating to 'My Subscriptions,' and selecting 'Reschedule Delivery.'"
                        },
                        {
                            id: 21,
                            question: "Can I request a specific delivery window for my subscription?",
                            answer: "Yes, you can request a specific delivery window by indicating your preferred delivery time in the 'Delivery Preferences' section of your account settings."
                        }
                    ]
                }
            ]
        }
    ];




    return (
        <section>
            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Shipping Policy</h1>
                <div className="accordion-container  text-[#333333]">
                    {shippingPolicyData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                <span>
                                    <motion.svg width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
                                    </motion.svg>
                                </span>
                            </motion.button>
                            <AnimatePresence>
                                {openCategoryMeals === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                    >
                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Returns And Refunds Policy</h1>
                <div className="accordion-container  text-[#333333]">
                    {returnRefundPolicyData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                <span>
                                    <motion.svg width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
                                    </motion.svg>
                                </span>
                            </motion.button>
                            <AnimatePresence>
                                {openCategoryMeals === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                    >
                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Cancellation Policy</h1>
                <div className="accordion-container  text-[#333333]">
                    {orderCancellationPolicyData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                <span>
                                    <motion.svg width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
                                    </motion.svg>
                                </span>
                            </motion.button>
                            <AnimatePresence>
                                {openCategoryMeals === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                    >
                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Product Information</h1>
                <div className="accordion-container  text-[#333333]">
                    {productInformationData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                <span>
                                    <motion.svg width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
                                    </motion.svg>
                                </span>
                            </motion.button>
                            <AnimatePresence>
                                {openCategoryMeals === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                    >
                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Gifting & Bulk Orders </h1>
                <div className="accordion-container  text-[#333333]">
                    {giftingBulkOrdersData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                <span>
                                    <motion.svg width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
                                    </motion.svg>
                                </span>
                            </motion.button>
                            <AnimatePresence>
                                {openCategoryMeals === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                    >
                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Order Feedback </h1>
                <div className="accordion-container  text-[#333333]">
                    {orderFeedbackData.map((item) => (
                        <div key={item.id} className="border-b-2">
                            <motion.button
                                onClick={() => toggleCategoryMeals(item.id)}
                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                variants={categoryVariants}
                                initial="closed"
                                animate={
                                    openCategoryMeals === item.id ? "open" : "closed"
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                <span>
                                    <motion.svg width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" stroke-width="2.4" stroke-linecap="square" />
                                    </motion.svg>
                                </span>
                            </motion.button>
                            <AnimatePresence>
                                {openCategoryMeals === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                    >
                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-[20px] md:px-[30px] lg:px-[112px] pt-[40px] pb-[70px]'>
                <h1 className='text-[20px] md:text-[30px] font-regola-pro leading-[36px] font-[600] mb-6 text-[#333333]'>Subscription</h1>
                <div className="accordion-container text-[#333333]">
                    {subscriptionData.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl font-bold mb-4 mt-4">{section.title}</h2>
                            {section.subtitles ? section.subtitles.map((subtitleSection, subIndex) => (
                                <div key={subIndex}>
                                    <h3 className="text-[18px] font-semibold mb-4 mt-4">{subtitleSection.subtitle}</h3>
                                    {subtitleSection.questions.map((item) => (
                                        <div key={item.id} className="border-b-2">
                                            <motion.button
                                                onClick={() => toggleCategoryMeals(item.id)}
                                                className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                                variants={categoryVariants}
                                                initial="closed"
                                                animate={openCategoryMeals === item.id ? "open" : "closed"}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                                <span>
                                                    <motion.svg width="14"
                                                        height="10"
                                                        viewBox="0 0 14 10"
                                                        fill="none"
                                                        initial={{ rotate: 0 }}
                                                        animate={{
                                                            rotate: openCategoryMeals === item.id ? 180 : 0,
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" strokeWidth="2.4" strokeLinecap="square" />
                                                    </motion.svg>
                                                </span>
                                            </motion.button>
                                            <AnimatePresence>
                                                {openCategoryMeals === item.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                                    >
                                                        <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                                            {item.answer}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )) : section.questions.map((item) => (
                                <div key={item.id} className="border-b-2">
                                    <motion.button
                                        onClick={() => toggleCategoryMeals(item.id)}
                                        className="px-5 py-5 items-center justify-between flex w-full bg-[#F5F5F5] rounded-lg"
                                        variants={categoryVariants}
                                        initial="closed"
                                        animate={openCategoryMeals === item.id ? "open" : "closed"}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="text-[26px] font-[400] leading-[31.2px] font-regola-pro text-[#333333]">{item.question}</span>
                                        <span>
                                            <motion.svg width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                                initial={{ rotate: 0 }}
                                                animate={{
                                                    rotate: openCategoryMeals === item.id ? 180 : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999" stroke="#1D1929" strokeWidth="2.4" strokeLinecap="square" />
                                            </motion.svg>
                                        </span>
                                    </motion.button>
                                    <AnimatePresence>
                                        {openCategoryMeals === item.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-[#F5F5F5] rounded-b-lg overflow-y-scroll px-5 py-2"
                                            >
                                                <p className="pt-2 text-[18px] font-[400] font-regola-pro text-[#393939] text-left items-start">
                                                    {item.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
