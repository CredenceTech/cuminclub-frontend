import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from "framer-motion";
import { getDownloadPdfQuery, getMediaImageQuery, getProductDetailsQuery, getRecipeDetailsQuery, getRecipeStepsDetailsQuery, graphQLClient } from '../api/graphql';
import { useLocation, useParams } from 'react-router-dom';
import ShareModel from '../component/ShareModel';
import LoadingAnimation from "../component/Loader";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    return (
        <div className='relative' ref={contentRef}>
            <div
                className='h-[445px]'
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <div className='grid grid-cols-2 lg:grid-cols-3'>
                    <div className=" col-span-2 md:col-span-1 pl-[60px]">
                        <p className='text-[#FFFFFF] pt-[30px] font-regola-pro font-[300] text-[16px] leading-[12.73px]'>Recipes {">"} {recipe?.fields?.find(field => field.key === "name")?.value}</p>
                        {/* <img src={BiryaniBurrito} className='pb-[150px] h-auto  pt-8' alt="" /> */}
                        <h1 className='pb-[20px] h-[300px] max-w-[278px] font-skillet font-[400] leading-[62.4px] text-[96px] text-[#F4E8DF] pt-8'>{recipe?.fields?.find(field => field.key === "name")?.value}</h1>
                        <div className='flex gap-5 pb-10 hide-for-pdf'>
                            <button className='px-4 rounded py-3 w-[140px] bg-[#EADEC1] text-base font-regola-pro text-[16px] font-[400] leading-[17.17px]' type='button' onClick={() => handleDownload()} style={{ color: textColor }}>Download PDF</button>
                            <button className='px-4 rounded py-3 w-[140px] bg-[#EADEC1] text-base font-regola-pro text-[16px] font-[400] leading-[17.17px]' type='button' onClick={handleShareClick} style={{ color: textColor }}>Share Recipe </button>
                        </div>
                    </div>
                    <div className='col-span-1 lg:col-span-2 hidden md:flex'>
                        <img
                            src={recipe?.recipeImageUrl}
                            className='h-[445px] w-full object-cover'
                            style={{ objectPosition: '50% 50%' }}
                            alt="Recipe Image"
                        />
                    </div>


                </div>
            </div>
            <div className='bg-[#FAFAFA]'>
                <div className='grid grid-cols-3 z-[10] sticky top-[100px] h-[61px] items-center bg-[#FAFAFA]'>
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
                        <div className='flex flex-row w-full'>
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
                                    <img src={item.img} alt="" className='lg:h-[400px] h-full w-full lg:max-w-[600px] border-b border-b-[#C6C6C6] pb-5' />
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
                            <div className='md:w-1/2 pl-6 md:pl-0'>
                                <h1 className='text-[#C75801] font-skillet text-[36px] font-[400] leading-[36.32px]'>
                                    Make this recipe Instantly Yours
                                </h1>
                                <p className='text-[20px] leading-[24px] font-regola-pro font-[400] my-2 text-[#333333]'>
                                    Made with our
                                </p>
                                <h1 className='text-[#333333] font-skillet text-[48px] font-[400] leading-[48.43px]'>
                                    {productDetails[0]?.title}
                                </h1>
                                <p className='pb-[150px] hidden text-[16px] font-regola-pro font-[400] leading-[17.17px] md:flex pt-2'>
                                    {productDetails[0]?.description}
                                </p>
                                <div className='hidden md:flex gap-x-2 pb-8'>
                                    <button className='px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf' type='button'>
                                        Add to Cart
                                    </button>
                                    <button className='px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf' type='button'>
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='md:hidden flex-row'>
                            <p className='pb-20 font-regola-pro text-[20px] leading-[17.17px] font-[400] pl-8 pt-6'>
                                About the product
                            </p>
                            <div className='gap-5'>
                                <button className='px-4 w-1/2 py-4 bg-[#231F20] font-regola-pro text-[16px] font-[400] leading-[17.17px] text-[#FFFFFF] hide-for-pdf' type='button'>
                                    Add to Cart
                                </button>
                                <button className='px-4 w-1/2 py-4 bg-[#C75801] font-regola-pro text-[16px] font-[400] leading-[17.17px] text-[#FFFFFF] hide-for-pdf' type='button'>
                                    Buy Now
                                </button>
                            </div>
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
                            <div className="flex space-x-4 pb-4">
                                {productDetails.map((product, index) => (
                                    <div key={index} className="flex-none w-full md:w-1/2">
                                        <div className="flex border-r border-gray-300 pr-4">
                                            <div className="w-1/2">
                                                <img
                                                    src={product?.image}
                                                    alt={product?.title}
                                                    className="w-auto h-[300px] md:h-[400px]"
                                                />
                                            </div>
                                            <div className="w-1/2 pl-4">
                                                <h1 className="text-[#333333] font-skillet text-[48px] font-[400] leading-[48.43px]">
                                                    {product?.title}
                                                </h1>
                                                <p className="pb-[150px] hidden text-[16px] font-regola-pro font-[400] leading-[17.17px] md:flex">
                                                    {product?.description}
                                                </p>
                                                <div className="hidden md:flex gap-x-2 pb-8">
                                                    <button
                                                        className="px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf"
                                                        type="button"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        className="px-4 rounded py-2 w-[140px] text-center bg-[#231F20] text-[16px] font-[400] text-[#FFFFFF] hide-for-pdf"
                                                        type="button"
                                                    >
                                                        Buy Now
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
