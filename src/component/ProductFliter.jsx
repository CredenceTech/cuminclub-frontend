import React, { useEffect, useState } from 'react';
import { getCategoriesQuery, graphQLClient } from '../api/graphql';
import { addCategoryData, categoryrData } from '../state/selectedCategory';
import { useDispatch, useSelector } from 'react-redux';

const ProductFliter = ({ excludeCategories = [] }) => {
    const [categoryData, setCategoryData] = useState([]);
    const dispatch = useDispatch();
    const selectedCategory = useSelector(categoryrData);

    useEffect(() => {
        const getCategory = async () => {
            try {
                const result = await graphQLClient.request(getCategoriesQuery);
                const fetchedCategories = result?.collections?.edges || [];

                // Exclude specific categories
                const filteredCategories = fetchedCategories.filter(
                    category => !excludeCategories.includes(category.node.title)
                );
                const allCategory = { node: { id: '', title: 'All' } };
                setCategoryData([allCategory, ...filteredCategories]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getCategory();
    }, [excludeCategories]);

    const handleProductChange = (e) => {
        const selectedItem = categoryData.find(item => item.node.title === e.target.value);
        dispatch(addCategoryData(selectedItem));
    };

    return (
        <div className="pl-[20px] md:pl-[60px] mt-4">
            <div className={`relative w-[120px]`}>
                <select
                    id="product-select"
                    className="mt-2 appearance-none bg-[#FAFAFA] text-[#333333] px-4 py-1 md:py-2 font-regola-pro text-[18px] md:text-[22px] leading-[30.21px] rounded-lg font-[300] focus:outline-none w-[130px] md:w-[160px]"
                    onChange={handleProductChange}
                    defaultValue=""
                    value={selectedCategory?.node?.title || ""}
                >
                    <option
                        className="text-[#333333] font-regola-pro text-[18px] md:text-[22px] w-auto leading-[30.21px] font-[300]"
                        value=""
                        disabled
                    >
                        Category
                    </option>
                    {categoryData.map(product => (
                        <option
                            key={product?.node?.id}
                            value={product?.node?.title}
                            className="text-[#333333] font-regola-pro text-[18px] md:text-[22px] leading-[30.21px] font-[300]"
                        >
                            {product?.node?.title}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-[-5px] md:right-[-40px] top-3 flex items-center px-2 pointer-events-none">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999"
                            stroke="#1D1929"
                            strokeWidth="2.4"
                            strokeLinecap="square"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ProductFliter;
