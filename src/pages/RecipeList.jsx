import React, { Profiler, useEffect, useState } from 'react'
import { getMediaImageQuery, getProductCollectionsQuery, getproductListQuery, getRecipeListQuery, graphQLClient } from '../api/graphql';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from "../component/Loader";


const RecipeList = () => {
    const [recipeList, setRecipeList] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchProducts = async () => {
            try {
                const { products } = await graphQLClient.request(getproductListQuery, {
                    first: 250,
                    sortKey: 'TITLE',
                    reverse: false
                });
                const productData = products.edges.map(edge => edge.node);
                setIsLoading(false);
                setProductList(productData);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching product list:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const apiCall = async () => {
            setIsLoading(true);
            try {
                const result = await graphQLClient.request(getProductCollectionsQuery, {
                    first: 1,
                    reverse: false,
                    query: "",
                });
                setIsLoading(false)

                const collections = result;
                console.log(collections)

            } catch (error) {
                // Handle errors here
                setIsLoading(false)
                console.error("Error fetching data:", error);
            }
        };
        apiCall();
    }, []);

    const fetchImageById = async (imageId) => {
        setIsLoading(true);
        try {
            const result = await graphQLClient.request(getMediaImageQuery, { id: imageId });
            setIsLoading(false);
            return result.node?.image?.url || '';
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching image:", error);
            return '';
        }
    };

    useEffect(() => {
        const apiCall = async () => {
            setIsLoading(true);
            try {
                const result = await graphQLClient.request(getRecipeListQuery);
                const collections = result.metaobjects.edges;
                setIsLoading(false)
                const recipesWithImages = await Promise.all(
                    collections.map(async (recipe) => {
                        const imageId = recipe.node.fields.find(field => field.key === 'image')?.value;
                        const productsString = recipe.node.fields.find(field => field.key === 'select_product')?.value;
                        const imageUrl = imageId ? await fetchImageById(imageId) : '';
                        const products = productsString ? JSON.parse(productsString) : [];
                        return {
                            ...recipe.node,
                            imageUrl,
                            products
                        };
                    })
                );

                setRecipeList(recipesWithImages);
                setFilteredRecipes(recipesWithImages);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false)
            }
        };

        apiCall();
    }, []);


    const filterRecipes = () => {
        const filtered = recipeList.filter(recipe => {
            const matchesProduct = selectedProduct ? recipe.products.includes(selectedProduct) : true;
            return matchesProduct;
        });
        setFilteredRecipes(filtered);
    };

    useEffect(() => {
        filterRecipes(); // Apply filtering when state changes
    }, [selectedProduct, recipeList]);

    const handleProductChange = (e) => {
        setSelectedProduct(e.target.value);
    };


    console.log(recipeList);
    
    return (
        <div className='relative'>
            <div className="bg-[#FAFAFA]">
                <div className="px-[60px] grid pt-2 grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-1">
                        <p className="text-[#2B2B2B] pt-4 font-regola-pro text-[12px] leading-[9.55px] font-[300]">{"Home > Recipes"}</p>
                    </div>
                    <div className="col-span-1 lg:col-span-2"></div>
                    <div className="col-span-2 lg:col-span-3  pt-4">
                        <div className="flex items-center gap-x-10 ">
                            <div>
                                <label htmlFor="type-select" className="block">
                                    <h2 className="text-[#757575] font-regola-pro text-[24px] leading-[30.91px] font-[300]">Type</h2>
                                </label>
                                <select
                                    id="type-select"
                                    className="mt-2  bg-[#FAFAFA] text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]" >
                                    <option className='text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]' value="" disabled selected>
                                        Select
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="product-select" className="block">
                                    <h2 className="text-[#757575] font-regola-pro text-[24px] leading-[30.91px] font-[300]">Products</h2>
                                </label>
                                <select
                                    id="product-select"
                                    className="mt-2 bg-[#FAFAFA] text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]"
                                    onChange={handleProductChange}
                                    defaultValue=""
                                >
                                    <option className='text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300]' value="" disabled>
                                        Select
                                    </option>
                                    {productList.map(product => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                            className='text-[#333333] font-regola-pro text-[32px] leading-[41.21px] font-[300] '
                                        >
                                            {product.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#FAFAFA]">
                <div className="pl-[60px] pt-[60px] pr-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredRecipes && filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <div key={recipe?.id} className="bg-[#FFFFFF] cursor-pointer" onClick={() => { navigate('/recipes', { state: { recipeId: recipe?.id } }) }}>
                                <img
                                    src={recipe?.imageUrl}
                                    alt={recipe?.fields?.find(field => field.key === "name")?.value}
                                    className="w-full h-50 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-[#333333] font-skillet text-[40px] leading-[26px] font-[400]">
                                        {recipe?.fields?.find(field => field.key === "name")?.value}
                                    </h3>
                                    <div className='flex justify-between'>
                                        <div className="flex items-center mt-6 text-gray-600">
                                            <svg
                                                width="21"
                                                height="21"
                                                viewBox="0 0 21 21"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M10.5016 6.99971V11.8997H14.0016M8.40156 0.699707H12.6016M10.5016 3.49971C5.86237 3.49971 2.10156 7.26052 2.10156 11.8997C2.10156 16.5389 5.86237 20.2997 10.5016 20.2997C15.1408 20.2997 18.9016 16.5389 18.9016 11.8997C18.9016 7.26052 15.1408 3.49971 10.5016 3.49971Z"
                                                    stroke="#1D1929"
                                                    strokeWidth="1.4"
                                                />
                                            </svg>
                                            <span className="text-[#393939] font-regola-pro text-[24px] leading-[15.6px] font-[300] pl-3">
                                                {recipe?.fields?.find(field => field.key === "cook_time")?.value}
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-6 text-gray-600">
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.4992 20.3002L0.699219 10.5002L10.4992 0.700195H18.8992C19.6724 0.700195 20.2992 1.327 20.2992 2.1002V10.5002L10.4992 20.3002Z" stroke="#1D1929" strokeWidth="1.4" strokeLinejoin="round" />
                                                <path d="M13.2992 6.3002C13.2992 7.07339 13.926 7.7002 14.6992 7.7002C15.4724 7.7002 16.0992 7.07339 16.0992 6.3002C16.0992 5.527 15.4724 4.9002 14.6992 4.9002C13.926 4.9002 13.2992 5.527 13.2992 6.3002Z" stroke="#1D1929" strokeWidth="1.4" strokeLinejoin="round" />
                                            </svg>
                                            <span className="text-[#393939] font-regola-pro text-[24px] leading-[15.6px] font-[300] pl-3">
                                                {recipe?.handle}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-4 md:w-[600px] h-[400px]">
                            <p className="text-[#333333] font-regola-pro text-[30px] leading-[24px] font-[600]">
                                No recipes available at this time.
                            </p>
                        </div>
                    )}

                </div>
            </div>
            {isLoading && <LoadingAnimation />}
        </div>
    )
}

export default RecipeList