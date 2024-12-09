import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from "framer-motion";
import { checkoutCreate, createCartMutation, getDownloadPdfQuery, getMediaImageQuery, getProductDetailsQuery, getRecipeDetailsQuery, getRecipeStepsDetailsQuery, graphQLClient, updateCartItemMutation, updateCartMutation } from '../api/graphql';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ShareModel from '../component/ShareModel';
import LoadingAnimation from "../component/Loader";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    addCartData,
    cartData,
    selectCartResponse,
    setCartResponse,
} from "../state/cartData";
import { useDispatch, useSelector } from 'react-redux';
import { addCheckoutData, setCheckoutResponse } from '../state/checkoutData';

const Recipes = () => {
    const location = useLocation();
    const recipeId = location.state?.recipeId;
    const [recipe, setRecipe] = useState(null);
    const [scrollYProgress, setScrollYProgress] = useState([]);
    const containerRef = useRef(null)
    const instructionsRef = useRef([])
    const [productDetails, setProductDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    const { scrollY } = useScroll({ container: containerRef })
    const { handle } = useParams();
    const [isMobile, setIsMobile] = useState(false);
    const [shaking, setIsShaking] = useState(null);
    const cartDatas = useSelector(cartData);
    const cartResponse = useSelector(selectCartResponse);
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0)
    const stepsContainerRef = useRef(null)
    const navigate = useNavigate();
    const [buyNowLoading, setBuyNowLoading] = useState(null)
    const handleAddToCheckout = async (variantId) => {
        try {
            setBuyNowLoading(variantId);
            const params = {
                input: {
                    lineItems: [
                        {
                            variantId: variantId,
                            quantity: 1,
                        },
                    ],
                },
            };
            const response = await graphQLClient.request(checkoutCreate, params);
            if (response?.checkoutCreate?.userErrors?.length > 0) {
                console.error('GraphQL user errors:', response.checkoutCreate.userErrors);
                return;
            }
            dispatch(setCheckoutResponse(response?.checkoutCreate));
            dispatch(addCheckoutData(response));
            setBuyNowLoading(null)
            navigate('/cardReview', { state: { isBuyNow: true } });
        } catch (error) {
            console.error('Error adding to checkout:', error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchImageById = async (imageId) => {
        setIsLoading(true);
        try {
            const result = await graphQLClient.request(getMediaImageQuery, { id: imageId });
            setIsLoading(false);
            return result.node?.image?.url || '';
        } catch (error) {
            console.error("Error fetching image:", error);
            setIsLoading(false);
            return '';
        }
    };

    const fetchRecipeSteps = async (stepIds) => {
        setIsLoading(true);
        try {
            const stepPromises = stepIds.map(async (stepId) => {
                const stepData = await graphQLClient.request(getRecipeStepsDetailsQuery, { id: stepId });
                setIsLoading(false);
                return stepData;
            });
            const stepsData = await Promise.all(stepPromises);
            return stepsData;
        } catch (error) {
            console.error("Error fetching steps:", error);
            setIsLoading(false);
            return [];
        }
    };

    const handleProductDetails = async (id) => {
        try {
            const response = await graphQLClient.request(getProductDetailsQuery, { id });
            const product = response?.product;
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                image: product.images.edges.length > 0 ? product.images.edges[0].node.src : null,
                variants: product?.variants
            };
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    };

    useEffect(() => {
        const apiCall = async () => {
            setIsLoading(true);
            try {
                const result = await graphQLClient.request(getRecipeDetailsQuery, { handle });
                const recipeData = result?.metaobject;
                setIsLoading(false);
                const imageField = recipeData?.fields.find(field => field.key === 'image');
                if (imageField && imageField.value) {
                    const recipeImageUrl = await fetchImageById(imageField.value);
                    recipeData.recipeImageUrl = recipeImageUrl;
                }
                const stepsField = recipeData?.fields.find(field => field.key === 'add_steps_of_recipe');
                if (stepsField && stepsField.value) {
                    const stepIds = JSON.parse(stepsField.value);
                    if (Array.isArray(stepIds) && stepIds.length > 0) {
                        const stepsData = await fetchRecipeSteps(stepIds);
                        const parsedSteps = await Promise.all(stepsData?.map(async (step) => {
                            const descriptionField = step.metaobject.fields.find(field => field.key === 'description');
                            const imageField = step.metaobject.fields.find(field => field.key === 'image');
                            const refField = step.metaobject.fields.find(field => field.key === 'reference');
                            const time = step.metaobject.fields.find(field => field.key === 'time');

                            const stepImageUrl = imageField ? await fetchImageById(imageField.value) : '';

                            return {
                                id: step.metaobject.id,
                                description: JSON.parse(descriptionField?.value)?.children[0]?.children[0]?.value || '',
                                img: stepImageUrl,
                                ref: refField ? refField.value : '',
                                time: time ? time.value : ''
                            };
                        }));

                        recipeData.steps = parsedSteps;
                    }
                }
                const ingredientsField = recipeData?.fields.find(field => field.key === 'ingredients');
                if (ingredientsField && ingredientsField.value) {
                    const parsedIngredients = JSON.parse(ingredientsField.value);
                    const ingredientItems = parsedIngredients.children[0]?.children.map(item => item.children[0]?.value);
                    recipeData.ingredients = ingredientItems;
                }
                const productsString = recipeData?.fields.find(field => field.key === 'select_product')?.value;
                const products = productsString ? JSON.parse(productsString) : [];
                console.log(products);
                if (products.length > 0) {
                    const fetchAllProductDetails = async () => {
                        try {
                            const productDetailsPromises = products.map(product => handleProductDetails(product));
                            const allProductDetails = await Promise.all(productDetailsPromises);
                            recipeData.product_details = allProductDetails;
                            setProductDetails(allProductDetails);
                        } catch (error) {
                            console.error('Error fetching all product details:', error);
                        }
                    };

                    fetchAllProductDetails();
                }
                setRecipe(recipeData);
            } catch (error) {
                console.error("Error fetching recipe data:", error);
                setIsLoading(false);
            }
        };

        if (handle) {
            apiCall();
        }
    }, [handle]);


    useEffect(() => {
        if (recipe?.steps) {
            instructionsRef.current = recipe.steps.map(() => React.createRef())
            setScrollYProgress(Array(recipe.steps.length).fill(0));
        }
    }, [recipe])

    useEffect(() => {
        const updateScrollProgress = () => {
            const windowHeight = window.innerHeight;
            const newProgress = instructionsRef.current.map((ref, index) => {
                if (ref.current) {
                    const { top, bottom, height } = ref.current.getBoundingClientRect();
                    const nextRef = instructionsRef.current[index + 1];
                    if (nextRef && nextRef.current) {
                        const nextTop = nextRef.current.getBoundingClientRect().top;
                        if (nextTop < windowHeight) {
                            const progress = Math.max(0, Math.min(1, (windowHeight - nextTop) / height));
                            return progress;
                        }
                    }
                    else if (index === instructionsRef.current.length - 1) {
                        if (top < 0) {
                            const progress = Math.max(0, Math.min(1, -top / (height - 200)));
                            return progress;
                        }
                    }
                    return 0;
                }
                return 0;
            });

            setScrollYProgress(newProgress);
        };

        const unsubscribeScroll = scrollY.onChange(updateScrollProgress);
        return () => unsubscribeScroll();
    }, [scrollY, recipe, scrollYProgress]);


    useEffect(() => {
        const updateActiveStep = () => {
            const windowHeight = window.innerHeight
            const activeIndex = instructionsRef.current.findIndex((ref, index) => {
                if (ref.current) {
                    const { top, bottom } = ref.current.getBoundingClientRect()
                    return top < windowHeight / 2 && bottom > windowHeight / 2
                }
                return false
            })

            if (activeIndex !== -1 && activeIndex !== activeStep) {
                setActiveStep(activeIndex)

                if (stepsContainerRef.current) {
                    const stepElements = stepsContainerRef.current.children
                    if (stepElements[activeIndex]) {
                        stepElements[activeIndex].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        })
                    }
                }
            }
        }

        const handleScroll = () => {
            requestAnimationFrame(updateActiveStep)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [activeStep])


    const InstructionsText = recipe?.steps ? recipe.steps.map((step, index) => ({
        id: index + 1,
        text: step.description,
        img: step.img,
        ref: instructionsRef.current[index],
        time: step.time
    })) : []



    const handleDownloadPDF = async (id) => {
        try {
            const response = await graphQLClient.request(getDownloadPdfQuery, { id });
            const pdfUrl = response?.node?.url;
            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
                const pdfResponse = await fetch(pdfUrl);
                if (!pdfResponse.ok) throw new Error('Network response was not ok');
                const blob = await pdfResponse.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `recipe-${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(downloadUrl);
            } else {
                console.error('PDF URL not found in response:', response);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const [showShareModal, setShowShareModal] = useState(false);
    const handleShareClick = () => {
        setShowShareModal(true);
    };
    const handleCloseModal = () => {
        setShowShareModal(false);
    };

    const contentRef = useRef(null);


    const handleDownload = async () => {
        if (!contentRef.current) return;

        setIsLoading(true);

        try {
            const content = contentRef.current;
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 0; // Margin around the content

            // Dynamically set the PDF name based on recipe name
            const recipeName = recipe?.fields?.find(field => field.key === "name")?.value || 'webpage_fit';
            const fileName = `${recipeName}.pdf`;

            const canvas = await html2canvas(content, {
                scale: 2,
                useCORS: true,
                logging: false,
                ignoreElements: (element) => element.classList.contains('hide-for-pdf')
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
            heightLeft -= pageHeight - 2 * margin;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight - 2 * margin;
            }

            const pdfBlob = pdf.output('blob');
            const blobUrl = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.click();

            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const shareUrl = 'https://dev-prahlad-latest.d30jgbp3exhvrx.amplifyapp.com/recipes';
    const backgroundColor = recipe?.fields?.find(field => field.key === "background_color")?.value || "#C75801";
    const textColor = recipe?.fields?.find(field => field.key === "background_color")?.value || "#C75801";

    const handleAddToCart = (productId, sellingPlanId) => {
        console.log(productDetails)
        setIsShaking(productId);
        if (cartDatas === null) {
            if (sellingPlanId) {
                addToCart({
                    merchandiseId: productId,
                    sellingPlanId: sellingPlanId,
                    quantity: 1,
                });
            } else {
                addToCart({ merchandiseId: productId, quantity: 1 });
            }
        } else {

            const productInCart = cartResponse?.cart?.lines?.edges.find((cartItem) => {
                return cartItem.node.merchandise.id === productId;
            });

            if (productInCart) {
                const quantityInCart = productInCart.node.quantity;
                const cartId = cartDatas?.cartCreate?.cart?.id;
                const id = productInCart?.node?.id;
                if (sellingPlanId) {
                    updateCartItem(productId, cartId, {
                        id: id,
                        sellingPlanId: sellingPlanId,
                        quantity: quantityInCart + 1,
                    });
                } else {
                    updateCartItem(productId, cartId, {
                        id: id,
                        quantity: quantityInCart + 1,
                    });
                }
            } else {
                const cartId = cartDatas?.cartCreate?.cart?.id;
                if (sellingPlanId) {
                    updateCart(cartId, {
                        merchandiseId: productId,
                        sellingPlanId: sellingPlanId,
                        quantity: 1,
                    });
                } else {
                    updateCart(cartId, { merchandiseId: productId, quantity: 1 });
                }
            }
        }
    };

    const addToCart = async (cartItems) => {
        const params = {
            cartInput: {
                lines: [cartItems],
            },
        };
        const response = await graphQLClient.request(createCartMutation, params);
        dispatch(addCartData(response));
        dispatch(setCartResponse(response.cartCreate))
        setIsShaking(null);
    };

    const updateCartItem = async (a, cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: cartItem,
        };
        const response = await graphQLClient.request(
            updateCartItemMutation,
            params
        );
        dispatch(setCartResponse(response.cartLinesUpdate));
        setIsShaking(null);
    };

    const updateCart = async (cartId, cartItem) => {
        const params = {
            cartId: cartId,
            lines: [cartItem],
        };
        const response = await graphQLClient.request(updateCartMutation, params);
        dispatch(setCartResponse(response.cartLinesAdd));
        setIsShaking(null);
    };

    return (
        <div className='relative' ref={contentRef}>
            {!isMobile && <div
                className={`h-[445px] `}
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <div className='grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-3'>
                    <div className=" col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1 pl-[60px]">
                        <p className='text-[#FFFFFF] pt-[30px] font-regola-pro font-[300] text-[16px] leading-[12.73px]'>Recipes {">"} {recipe?.fields?.find(field => field.key === "name")?.value}</p>
                        {/* <img src={BiryaniBurrito} className='pb-[150px] h-auto  pt-8' alt="" /> */}
                        <h1 className='pb-[20px] h-[300px] max-w-[278px] font-skillet font-[400] leading-[62.4px] text-[96px] text-[#F4E8DF] pt-8'>{recipe?.fields?.find(field => field.key === "name")?.value}</h1>
                        <div className='flex gap-5 pb-10 hide-for-pdf'>
                            <button className='px-4 rounded py-3 w-[140px] bg-[#EADEC1] text-base font-regola-pro text-[16px] font-[400] leading-[17.17px]' type='button' onClick={() => handleDownload()} style={{ color: textColor }}>Download PDF</button>
                            <button className='px-4 rounded py-3 w-[140px] bg-[#EADEC1] text-base font-regola-pro text-[16px] font-[400] leading-[17.17px]' type='button' onClick={handleShareClick} style={{ color: textColor }}>Share Recipe </button>
                        </div>
                    </div>
                    <div className='col-span-1 lg:col-span-3 xl:col-span-2 hidden md:flex'>
                        <img
                            src={recipe?.recipeImageUrl}
                            className='h-[445px] w-full object-cover'
                            style={{ objectPosition: '50% 50%' }}
                            alt="Recipe Image"
                        />
                    </div>


                </div>
            </div>}
            <div
                className={`md:hidden relative flex h-[445px] bg-[${backgroundColor}] md:bg-none bg-cover bg-center`}
                style={{
                    backgroundImage: `url(${recipe?.recipeImageUrl})`,
                }}
            >
                <div
                    className="absolute inset-0 w-full md:rounded-l-lg"
                    style={{
                        zIndex: 2,
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.448) 0%, rgba(0, 0, 0, 0.448) 100%)',
                    }}
                ></div>
                <div className=' grid grid-cols-2 lg:grid-cols-3'>
                    <div className=" col-span-2 md:col-span-1 pl-[60px] z-10">
                        <p className='text-[#FFFFFF] pt-[30px] font-regola-pro font-[300] text-[16px] leading-[12.73px]'>Recipes {">"} {recipe?.fields?.find(field => field.key === "name")?.value}</p>
                        <h1 className='pb-[20px] h-[300px] max-w-[278px] font-skillet font-[400] leading-[62.4px] text-[96px] text-[#F4E8DF] pt-8'>{recipe?.fields?.find(field => field.key === "name")?.value}</h1>
                        <div className='col-span-1 md:hidden flex gap-x-16 items-center'>
                            <div className=''>
                                <p className='text-[#FAFAFA] font-regola-pro text-[14px] leading-[15.03px] font-[400] '>Prep Time</p>
                                <p className='text-[#FAFAFA] font-regola-pro text-[16px] leading-[17.17px] font-[400]'>{recipe?.fields?.find(field => field.key === "prep_time")?.value}</p>
                            </div>
                            <div className=''>
                                <p className='text-[#FAFAFA] font-regola-pro text-[14px] leading-[15.03px] font-[400]'>Cook Time</p>
                                <p className='text-[#FAFAFA] font-regola-pro text-[16px] leading-[17.17px] font-[400]'>{recipe?.fields?.find(field => field.key === "cook_time")?.value}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='bg-[#FAFAFA]'>
                <div className='grid grid-cols-3 z-[10] sticky md:top-[110px] top-[100px] h-[61px] items-center bg-[#FAFAFA]'>
                    <div className='col-span-1 pl-[64px] hidden md:flex gap-x-16 items-center'>
                        <div className=''>
                            <p className='text-[#757575] font-regola-pro text-[14px] leading-[15.03px] font-[400] '>Prep Time</p>
                            <p className='text-[#231F20] font-regola-pro text-[16px] leading-[17.17px] font-[400]'>{recipe?.fields?.find(field => field.key === "prep_time")?.value}</p>
                        </div>
                        <div className=''>
                            <p className='text-[#757575] font-regola-pro text-[14px] leading-[15.03px] font-[400]'>Cook Time</p>
                            <p className='text-[#231F20] font-regola-pro text-[16px] leading-[17.17px] font-[400]'>{recipe?.fields?.find(field => field.key === "cook_time")?.value}</p>
                        </div>
                    </div>
                    <div className='col-span-3 md:col-span-2 md:mt-0 mt-[-4px] flex overflow-x-auto bg-[#FFFFFF] flex-1 whitespace-nowrap scrollbar-hide justify-between items-center'>
                        <div className='flex flex-row w-full' ref={stepsContainerRef}>
                            {InstructionsText?.map((progress, index) => (
                                <div key={index} className={`relative h-[61px] flex items-center justify-center w-full px-10   ${index === InstructionsText.length - 1 ? '' : 'border-r-[#C75801] border-r'} `} >
                                    <motion.div className="progress-bar" style={{ scaleX: scrollYProgress[index] }} />
                                    <p className='text-[20px] leading-[21.47px] font-[400] font-regola-pro text-[#231F20]' > Step {progress.id} <span className='text-[#757575] text-[14px] leading-[15.03px] font-[400]'> {"("}{progress.time}{")"}</span> </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className=' grid grid-cols-4 mt-8 '>
                    <div className='col-span-4 pl-5 p-3 md:pl-[64px] md:col-span-2'>
                        <p className='text-[32px] leading-[34.34px] font-[400] text-[#231F20] mb-4 font-skillet'>Ingredients</p>
                        <ol className='lg:pr-28 pb-7'>
                            {recipe?.ingredients?.map((item, index) => (
                                <div key={index} className='flex lg:pr-28 mb-[24px]'>
                                    <p className='text-[16px] leading-[27.2px] font-[400] font-regola-pro text-[#000000] '>{index + 1}. </p>
                                    <p className='text-[16px] leading-[27.2px] font-[400] font-regola-pro pl-[18px] text-[#000000]'>{item}</p>
                                </div>
                            ))}
                        </ol>
                    </div>
                    <div className='col-span-4 md:col-span-2 p-3 md:p-0 md:pr-10 lg:pr-32'>
                        <p className='text-[32px] leading-[34.34px] text-[#231F20] font-[400] p-6 font-skillet'>Instructions</p>
                        {InstructionsText?.map(item => (
                            <div ref={item.ref} className='flex-col mb-5' key={item.id}>
                                <div className='flex mb-5'>
                                    <p className='text-[64px] leading-[64.58px] font-[400] text-[#e9bc9982] font-skillet'>{item.id}</p>
                                    <div className='pl-[30px]'>
                                        <p className='text-[20px] leading-[24px] pb-4 font-regola-pro font-[400] text-[#333333]'>{item.text}</p>
                                    </div>
                                </div>
                                <div className='pb-5'>
                                    <img src={item.img} alt="" className='lg:h-auto xl:h-[400px] h-full w-full lg:max-w-[600px] border-b border-b-[#C6C6C6] pb-5' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='bg-[#FFFFFF] py-10'>
                {productDetails && productDetails.length === 1 ? (
                    <div className=''>
                        <div className='flex md:flex-row flex-col-reverse justify-center items-start'>
                            <div className='flex md:w-1/2 justify-center items-center'>
                                <img
                                    src={productDetails[0]?.image}
                                    alt=""
                                    className='w-auto h-[300px] md:h-[450px]'
                                />
                            </div>
                            <div className='md:w-1/2 pl-6 md:pl-0 md:pr-5'>
                                <h1 className='text-[#C75801] font-skillet text-[36px] font-[400] leading-[36.32px]'>
                                    Make this recipe Instantly Yours
                                </h1>
                                <p className='text-[20px] leading-[24px] font-regola-pro font-[400] my-2 text-[#333333]'>
                                    Made with our
                                </p>
                                <h1 className='text-[#333333] font-skillet text-[48px] font-[400] leading-[48.43px]'>
                                    {productDetails[0]?.title}
                                </h1>
                                <p className='md:pb-[150px] hidden text-[16px] font-regola-pro font-[400] leading-[17.17px] pt-2'>
                                    {productDetails[0]?.description}
                                </p>
                                <div className='hidden md:flex gap-x-2 pb-8'>
                                    <button className={`${shaking === productDetails[0]?.variants?.edges[0]?.node?.id ? '' : ''} flex justify-center items-center cursor-pointer px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf`} onClick={() => {
                                        handleAddToCart(productDetails[0]?.variants?.edges[0]?.node?.id)
                                    }} type='button'>
                                        {shaking === productDetails[0]?.variants?.edges[0]?.node?.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAddToCheckout(productDetails[0]?.variants?.edges[0]?.node?.id)
                                        }
                                        className='px-4 rounded py-2 w-[140px] text-center bg-[#231F20] flex justify-center items-center text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf cursor-pointer' type='button'>
                                        {buyNowLoading === productDetails[0]?.variants?.edges[0]?.node?.id ? <div className="spinner1"></div> : 'BUY NOW'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className='md:pb-[150px] md:hidden flex text-[16px] font-regola-pro font-[400] leading-[17.17px] mt-4 mb-4 mx-4'>
                            {productDetails[0]?.description}
                        </p>
                        <div className='md:hidden flex justify-start items-start gap-10 ml-4'>
                            <button className={`${shaking === productDetails[0]?.variants?.edges[0]?.node?.id ? '' : ''} flex justify-center items-center cursor-pointer px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf`} onClick={() => {
                                handleAddToCart(productDetails[0]?.variants?.edges[0]?.node.id);
                            }} type='button'>
                                {shaking === productDetails[0]?.variants?.edges[0]?.node?.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                            </button>
                            <button
                                onClick={() =>
                                    handleAddToCheckout(productDetails[0]?.variants?.edges[0]?.node?.id)
                                }
                                className='px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf cursor-pointer' type='button'>
                                {buyNowLoading === productDetails[0]?.variants?.edges[0]?.node?.id ? <div className="spinner1"></div> : 'BUY NOW'}

                            </button>
                        </div>
                    </div>
                ) : productDetails && productDetails.length > 1 ? (
                    <div className="py-10 px-10">
                        <div className="mb-8">
                            <h1 className="text-[#C75801] font-skillet text-[36px] font-[400] leading-[36.32px]">
                                Make this recipe Instantly Yours
                            </h1>
                            <p className="text-[20px] leading-[24px] font-regola-pro font-[400] my-2 text-[#333333]">
                                Made with our
                            </p>
                        </div>

                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="flex space-x-4 whitespace-nowrap pb-4">
                                {productDetails.map((product, index) => (
                                    <div key={index} className="flex-none w-full md:w-1/2">
                                        <div className="flex border-r border-gray-300 pr-4">
                                            <div className="hidden lg:flex md:w-1/2 md:h-[450px]">
                                                <img
                                                    src={product?.image}
                                                    alt={product?.title}
                                                    className="w-auto h-[300px] md:h-auto"
                                                />
                                            </div>
                                            <div className="w-full lg:w-1/2 whitespace-normal flex flex-col justify-between md:pl-4">
                                                <div>
                                                    <h1 className="text-[#333333] font-skillet text-[48px] font-[400] leading-[48.43px]">
                                                        {product?.title}
                                                    </h1>
                                                    <div className='lg:hidden py-4 flex'>
                                                        <img
                                                            src={product.image}
                                                            alt=""
                                                            className='w-auto h-[300px] lg:h-[450px]'
                                                        />
                                                    </div>
                                                    <p className="text-[16px] font-regola-pro font-[400] leading-[17.17px] mb-4 md:mb-0 h-[160px] md:h-auto">
                                                        {product?.description}
                                                    </p>

                                                </div>
                                                <div className="flex whitespace-nowrap gap-x-2 pb-8">
                                                    <button className={`${shaking === product?.variants?.edges[0]?.node?.id ? '' : ''} flex justify-center items-center cursor-pointer px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf`} onClick={() => {
                                                        handleAddToCart(product?.variants?.edges[0]?.node?.id);
                                                    }} type='button'>
                                                        {shaking === product?.variants?.edges[0]?.node?.id ? <div className="spinner1"></div> : 'ADD TO CART'}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAddToCheckout(product?.variants?.edges[0]?.node?.id)
                                                        }
                                                        className='px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf cursor-pointer' type='button'>
                                                        {buyNowLoading === product?.variants?.edges[0]?.node?.id ? <div className="spinner1"></div> : 'BUY NOW'}

                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                <div>

                </div>
            </div>
            {showShareModal && <ShareModel handleCloseModal={handleCloseModal} shareUrl={shareUrl} />}
            {isLoading && <LoadingAnimation />}
        </div>
    )
}

export default Recipes
