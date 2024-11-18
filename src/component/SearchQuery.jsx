import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { graphQLClient, queryProductWithKeyword } from '../api/graphql';
import debounce from 'lodash.debounce';

const SearchQuery = ({ isSticky }) => {
    const location = useLocation();
    const { pathname } = location;
    const modalRef = useRef(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [combinedData, setCombinedData] = useState([]);
    const navigate = useNavigate();

    const debouncedFetchData = useCallback(
        debounce(async (searchTerm) => {
            if (!searchTerm) return;
            setLoading(true);
            setError(null);

            try {
                const data = await graphQLClient.request(queryProductWithKeyword, { keyword: searchTerm });

                const products = (data?.products?.edges || []).map(edge => ({
                    id: edge?.node?.id || '',
                    title: edge?.node?.title || 'No Title',
                    handle: edge?.node?.handle || '',
                    price: edge?.node?.priceRange?.minVariantPrice?.amount || 'N/A',
                    image: edge?.node?.images?.edges?.[0]?.node?.src || '',
                    collectionName: 'in products',
                    nagivatiLink: `/product-details/${edge?.node?.handle}`
                }));


                const filteredRecipes = (data?.metaobjects?.edges || [])
                    .filter(edge => edge?.node?.fields.some(field => field?.key === "name" && field?.value?.toLowerCase().includes(searchTerm.toLowerCase())))
                    .map(edge => ({
                        id: edge?.node?.id || '',
                        title: edge?.node?.fields.find(field => field?.key === "name")?.value || 'No Title',
                        handle: edge?.node?.handle || '',
                        image: edge?.node?.fields.find(field => field?.key === "image")?.reference?.image?.url || '',
                        collectionName: 'in recipes',
                        nagivatiLink: `/recipes/${edge?.node?.handle}`
                    }));

                const combined = [...products, ...filteredRecipes];
                setCombinedData(combined);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        setLoading(true)
        debouncedFetchData(keyword);
    }, [keyword, debouncedFetchData]);

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        setKeyword('');
        setCombinedData([])
    };
    const clearQuery = () => {
        setKeyword('')
        setCombinedData([])
    }

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setKeyword(query);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            toggleSearch(false);
            setCombinedData([]);
        }
    };

    useEffect(() => {
        if (searchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchOpen]);

    return (
        <div className={`relative z-[9999] justify-center items-center ${pathname?.includes('/login') || pathname?.includes('/registration') || pathname?.includes('/forgot-password') ? 'hidden' : "flex"}`}>
            <button onClick={toggleSearch} className="focus:outline-none">
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.6 31.6L23.1429 23.1429M14.6857 27.3714C7.67959 27.3714 2 21.6918 2 14.6857C2 7.67959 7.67959 2 14.6857 2C21.6918 2 27.3714 7.67959 27.3714 14.6857C27.3714 21.6918 21.6918 27.3714 14.6857 27.3714Z" stroke={(pathname === '/' || pathname.includes('/ready-to-cook')) && !isSticky ? '#FFFFFF' : '#333333'} strokeWidth="3.02041" />
                </svg>
            </button>

            {searchOpen && (
                <div ref={modalRef} className="absolute top-0 md:right-0 -right-20 w-[450px]  h-auto  bg-[#FAFAFAE5] p-8 flex flex-col">
                    <div className="flex justify-between items-center">
                        <input
                            type="text"
                            className="pl-4 text-2xl w-[250px] font-bold border-b border-black focus:outline-none text-[#333333] bg-[#FAFAFAE5] font-regola-pro"
                            placeholder="Search..."
                            value={keyword}
                            onChange={handleSearchChange}
                        />
                        <button onClick={clearQuery} className="ml-4 text-gray-700 focus:outline-none font-regola-pro">
                            Clear
                        </button>
                        <button onClick={toggleSearch} className="ml-4 focus:outline-none font-regola-pro">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                        </button>
                    </div>

                    {keyword && <div className="mt-6">
                        <div className="mt-4 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
                            {combinedData?.length > 0 > 0 ? (
                                combinedData?.map(product => (
                                    <div key={product?.id} onClick={() => { navigate(product?.nagivatiLink); setSearchOpen(false) }} className="flex items-center gap-4 cursor-pointer">
                                        <img src={product?.image} alt={''} className="w-16 h-16 rounded" />
                                        <div>
                                            <p className="font-medium text-lg text-[#333333] font-regola-pro">{product?.title}</p>
                                            {product?.price && <p className="text-sm text-[#333333] font-regola-pro">Rs. {product?.price}
                                                {/* <span className="line-through">Rs. {product?.price}</span> */}
                                            </p>}
                                            {!product?.price && <p className="text-sm text-[#2828e6] font-regola-pro">{product?.collectionName}
                                                {/* <span className="line-through">Rs. {product?.price}</span> */}
                                            </p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    {!loading && <p className='text-[#333333]'>No products found</p>}
                                </>

                            )}
                        </div>
                    </div>}
                </div>
            )}
        </div>
    )
}

export default SearchQuery
