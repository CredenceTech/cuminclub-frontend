import React, { useState, useEffect, useRef } from "react";
import { createCartMutation, getProductCollectionsQuery, graphQLClient } from "../api/graphql";
import { Footer } from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { selectMealItems } from "../state/mealdata";
import mealThreeImage from "../assets/mealThreeImage.png";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "../component/CartComponent";
import { cartIsOpen, openCart } from "../state/cart";
import { addCartData, cartData, clearCartData } from "../state/cartData";
import { FilterDrawer } from "../component/FilterDrawer";
import { addProduct } from "../state/product";

const Product = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [rawResonse, setRawResponse] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const mealData = useSelector(selectMealItems);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isCartOpen = useSelector(cartIsOpen)
  const [activeTitle, setActiveTitle] = useState();
  const cartDatas = useSelector(cartData);

  const productEdgesRef = useRef();

  const handleCategorySelect = (title) => {
    setActiveTitle(title);
    const productEdgesElement = document.getElementById(`product-edges-${title}`);

    if (productEdgesElement) {
      productEdgesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // useEffect(() => {
  //   if(cartCount === mealData.no){
  //     addToCart()
  //     dispatch(openCart())
  //   }
  // }, [cartCount])

  const addToCart = async() => {
   const params =  {
      "cartInput": {
        "lines": [
          ...cartItems
        ]
      }
    }
    const response = await graphQLClient.request(createCartMutation, params);
    dispatch(clearCartData())
    setTimeout(() => {
      dispatch(addCartData(response))
    }, 500); 
  }

  useEffect(() => {
    const handleSelectedOptionsChange = (selectedOptions) => {
      const filteredData = apiResponse?.collections?.edges?.filter((order) => {
        return order.node.products.edges.some((product) => {
          const productTags = product.node.tags;
          return selectedOptions.every((selectedOption) =>
            productTags.includes(selectedOption)
          );
        });
      });
      const newData = {
        collections: {
          edges: filteredData,
        },
      };
      setFilteredOptions(newData);
      setRawResponse(newData);
    };

    handleSelectedOptionsChange(selectedOptions);
  }, [selectedOptions]);

  const handleSelectedOptionsChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

  useEffect(() => {
    const apiCall = async () => {
      try {
        const result = await graphQLClient.request(getProductCollectionsQuery, {
          first: 15,
          reverse: false,
          query: "",
        });
  
        const collections = result;;

        const bundleIndex = collections.collections.edges.findIndex(item => item.node.title === "Bundles");
  
        if (bundleIndex !== -1) {
          const bundleItem = collections.collections.edges.splice(bundleIndex, 1)[0];
          collections.collections.edges.push(bundleItem);
        }

        setApiResponse(collections);
        setRawResponse(collections);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };
  
    apiCall();
  }, []);
  

  const handleAddToCart = (productId) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.merchandiseId === productId
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
      };
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { merchandiseId: productId, quantity: 1 }]);
    }

    setCartCount((prevCount) => prevCount + 1);
    // dispatch(addProduct({ merchandiseId: productId, quantity: 1 }));
  };

  const handleRemoveFromCart = (productId) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.merchandiseId === productId
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: Math.max(0, updatedCart[existingItemIndex].quantity - 1),
      };

      setCartCount((prevCount) => Math.max(0, prevCount - 1));
      if (updatedCart[existingItemIndex].quantity === 0) {
        updatedCart.splice(existingItemIndex, 1);
      }

      setCartItems(updatedCart);
    }
  };

  const getProductQuantityInCart = (productId) => {
    const cartItem = cartItems.find((item) => item.merchandiseId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const openCountryDrawer = () => {
    setIsCountryDrawerOpen(true);
  };

  const closeCountryDrawer = () => {
    setIsCountryDrawerOpen(false);
  };

  return (
    <div
      className="overflow-y-scroll w-full"
      style={{
        height: "90vh",
      }}
    >
      <div className="h-36 overflow-x-hidden w-full flex lg:justify-center gap-10 items-center bg-red-700">
        <div className="hidden lg:block">
          <img src={mealThreeImage} alt="" className="h-28 w-64" />
        </div>
        <div className="flex flex-col gap-3 lg:px-10 px-2">
          <div className="flex lg:h-16 gap-5">
            <div
              className="px-3 text-base gap-5 text-[#53940F] bg-white border-[#53940F] rounded-lg flex items-center justify-center"
              style={{ borderWidth: "3px" }}
            >
              <div className="flex flex-col items-center font-bold text-xl">
                <span>{mealData.no}</span>
                <span>Meals</span>
              </div>
              <div className="flex flex-col">
                <span> {mealData.discountPrice}</span>
                <strike className="text-gray-300">{mealData.price}</strike>
              </div>
            </div>
            <span
              className="lg:px-10 text-2xl font-bold text-[#53940F] bg-white border-[#53940F] rounded-lg flex items-center justify-center"
              style={{ borderWidth: "3px" }}
            >
              Subscription
            </span>
          </div>
          <div
            onClick={() => navigate("/")}
            className="px-3 cursor-pointer text-white gap-3  py-1 w-2/5 border text-sm border-white bg-[#53940F] rounded-lg flex items-center justify-center"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.2207 11.7711L6.77365 11.759L14.5285 4.03297C14.8328 3.72684 15.0003 3.3203 15.0003 2.88783C15.0003 2.45537 14.8328 2.04883 14.5285 1.7427L13.2516 0.458276C12.6429 -0.153973 11.581 -0.150734 10.9771 0.455846L3.2207 8.18346V11.7711ZM12.1131 1.60341L13.3925 2.8854L12.1067 4.16659L10.8298 2.88298L12.1131 1.60341ZM4.83092 8.85888L9.68573 4.02163L10.9626 5.30606L6.10863 10.1417L4.83092 10.1457V8.85888Z"
                fill="white"
              />
              <path
                d="M1.61022 15H12.8818C13.7698 15 14.492 14.2735 14.492 13.3803V6.36045L12.8818 7.98015V13.3803H4.15276C4.13182 13.3803 4.11009 13.3884 4.08915 13.3884C4.06258 13.3884 4.03602 13.3811 4.00864 13.3803H1.61022V2.04231H7.12281L8.73303 0.422607H1.61022C0.722183 0.422607 0 1.14905 0 2.04231V13.3803C0 14.2735 0.722183 15 1.61022 15Z"
                fill="white"
              />
            </svg>
            <span>Update Your Plan</span>
          </div>
        </div>
      </div>

      <div className="flex py-8 justify-center">
        <span className="font-bold text-4xl text-[#53940F]">
          Make Your Meal
        </span>
      </div>
      {apiResponse ? (
        <>
          <div className="flex bg-white justify-start sticky top-0">
            <div className="flex items-center bg-white gap-2">
              <button
                onClick={openCountryDrawer}
                className="bg-[#333333] px-3 py-2 rounded-r-lg"
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 2.00245C4.73478 2.00245 4.48043 2.10781 4.29289 2.29534C4.10536 2.48288 4 2.73723 4 3.00245C4 3.26767 4.10536 3.52202 4.29289 3.70956C4.48043 3.89709 4.73478 4.00245 5 4.00245C5.26522 4.00245 5.51957 3.89709 5.70711 3.70956C5.89464 3.52202 6 3.26767 6 3.00245C6 2.73723 5.89464 2.48288 5.70711 2.29534C5.51957 2.10781 5.26522 2.00245 5 2.00245ZM2.17 2.00245C2.3766 1.41692 2.75974 0.909884 3.2666 0.55124C3.77346 0.192596 4.37909 0 5 0C5.62091 0 6.22654 0.192596 6.7334 0.55124C7.24026 0.909884 7.6234 1.41692 7.83 2.00245H15C15.2652 2.00245 15.5196 2.10781 15.7071 2.29534C15.8946 2.48288 16 2.73723 16 3.00245C16 3.26767 15.8946 3.52202 15.7071 3.70956C15.5196 3.89709 15.2652 4.00245 15 4.00245H7.83C7.6234 4.58798 7.24026 5.09502 6.7334 5.45366C6.22654 5.81231 5.62091 6.0049 5 6.0049C4.37909 6.0049 3.77346 5.81231 3.2666 5.45366C2.75974 5.09502 2.3766 4.58798 2.17 4.00245H1C0.734784 4.00245 0.48043 3.89709 0.292893 3.70956C0.105357 3.52202 0 3.26767 0 3.00245C0 2.73723 0.105357 2.48288 0.292893 2.29534C0.48043 2.10781 0.734784 2.00245 1 2.00245H2.17ZM11 8.00245C10.7348 8.00245 10.4804 8.10781 10.2929 8.29534C10.1054 8.48288 10 8.73723 10 9.00245C10 9.26767 10.1054 9.52202 10.2929 9.70956C10.4804 9.89709 10.7348 10.0025 11 10.0025C11.2652 10.0025 11.5196 9.89709 11.7071 9.70956C11.8946 9.52202 12 9.26767 12 9.00245C12 8.73723 11.8946 8.48288 11.7071 8.29534C11.5196 8.10781 11.2652 8.00245 11 8.00245ZM8.17 8.00245C8.3766 7.41692 8.75974 6.90988 9.2666 6.55124C9.77346 6.1926 10.3791 6 11 6C11.6209 6 12.2265 6.1926 12.7334 6.55124C13.2403 6.90988 13.6234 7.41692 13.83 8.00245H15C15.2652 8.00245 15.5196 8.10781 15.7071 8.29534C15.8946 8.48288 16 8.73723 16 9.00245C16 9.26767 15.8946 9.52202 15.7071 9.70956C15.5196 9.89709 15.2652 10.0025 15 10.0025H13.83C13.6234 10.588 13.2403 11.095 12.7334 11.4537C12.2265 11.8123 11.6209 12.0049 11 12.0049C10.3791 12.0049 9.77346 11.8123 9.2666 11.4537C8.75974 11.095 8.3766 10.588 8.17 10.0025H1C0.734784 10.0025 0.48043 9.89709 0.292893 9.70956C0.105357 9.52202 0 9.26767 0 9.00245C0 8.73723 0.105357 8.48288 0.292893 8.29534C0.48043 8.10781 0.734784 8.00245 1 8.00245H8.17ZM5 14.0025C4.73478 14.0025 4.48043 14.1078 4.29289 14.2953C4.10536 14.4829 4 14.7372 4 15.0025C4 15.2677 4.10536 15.522 4.29289 15.7096C4.48043 15.8971 4.73478 16.0025 5 16.0025C5.26522 16.0025 5.51957 15.8971 5.70711 15.7096C5.89464 15.522 6 15.2677 6 15.0025C6 14.7372 5.89464 14.4829 5.70711 14.2953C5.51957 14.1078 5.26522 14.0025 5 14.0025ZM2.17 14.0025C2.3766 13.4169 2.75974 12.9099 3.2666 12.5512C3.77346 12.1926 4.37909 12 5 12C5.62091 12 6.22654 12.1926 6.7334 12.5512C7.24026 12.9099 7.6234 13.4169 7.83 14.0025H15C15.2652 14.0025 15.5196 14.1078 15.7071 14.2953C15.8946 14.4829 16 14.7372 16 15.0025C16 15.2677 15.8946 15.522 15.7071 15.7096C15.5196 15.8971 15.2652 16.0025 15 16.0025H7.83C7.6234 16.588 7.24026 17.095 6.7334 17.4537C6.22654 17.8123 5.62091 18.0049 5 18.0049C4.37909 18.0049 3.77346 17.8123 3.2666 17.4537C2.75974 17.095 2.3766 16.588 2.17 16.0025H1C0.734784 16.0025 0.48043 15.8971 0.292893 15.7096C0.105357 15.522 0 15.2677 0 15.0025C0 14.7372 0.105357 14.4829 0.292893 14.2953C0.48043 14.1078 0.734784 14.0025 1 14.0025H2.17Z"
                    fill="white"
                  />
                </svg>
              </button>
              {isCountryDrawerOpen && (
                <FilterDrawer
                  option={selectedOptions}
                  onClose={closeCountryDrawer}
                  onSelectedOptionsChange={handleSelectedOptionsChange}
                />
              )}
              {isCartOpen && <CartDrawer />}
              <span className="text-xl font-bold hidden lg:visible">
                Filter
              </span>
            </div>
            <div className="flex bg-white overflow-x-auto flex-1 justify-around">
              {apiResponse.collections.edges.map((category) => (
                <div
                  key={category.node.title}
                  onClick={() => handleCategorySelect(category.node.title)}
                  className={`cursor-pointer flex items-center lg:py-1 font-medium lg:px-5 rounded border border-[#333333] ${
                    activeTitle === category.node.title
                      ? "bg-[#53940F] text-white border-none"
                      : ""
                  }`}
                >
                  {category.node.title}
                </div>
              ))}
            </div>
          </div>

          {/* <div className="mt-4 overflow-y-auto" style={{ height: '79vh' }} ref={productsContainerRef}> */}
          <div
            className="mt-4 bg-white"
            // style={{
            //   height: "62vh",
            // }}
          >
            {rawResonse.collections.edges.map((category, index) => (
              // <div key={category.node.title} ref={productSectionsRefs[index]}>
              <div className="bg-white">
                <div className="flex justify-center text-[#53940F] text-2xl font-bold">
                  {category.node.title}
                </div>
                <div
                  key={category.node.title}
                  ref={productEdgesRef}
                  id={`product-edges-${category.node.title}`}
                  className="flex bg-white justify-center flex-wrap"
                >
                  {category.node.products.edges.map((product) => (
                    <div
                      key={product.node.id}
                      className="m-4 w-56 border rounded-2xl border-[#CFCFCF] flex flex-col items-center h-80 p-4"
                    >
                      <img
                        src={product.node.featuredImage.url}
                        alt={product.node.featuredImage.altText}
                        className="w-40 h-40 mb-1 cursor-pointer"
                        onClick={() => {
                          navigate(`/productDetail`, {
                            state: { id: product.node.id },
                          });
                        }}
                      />
                      <h3
                        className="text-[#53940F] text-lg font-semibold cursor-pointer"
                        onClick={() => {
                          navigate(`/productDetail`, {
                            state: { id: product.node.id },
                          });
                        }}
                      >
                        {product.node.title}
                      </h3>
                      <p className="mb-1">
                        {(product?.node?.metafields &&
                          product?.node?.metafields.find(
                            (metafield) =>
                              metafield?.key === "small_descriptions"
                          )?.value) ||
                          ""}
                      </p>
                      <div className="flex gap-1 mb-4">
                        {Array.from(
                          {
                            length:
                              product?.node?.metafields?.find(
                                (metafield) => metafield?.key === "spice_level"
                              )?.value || 0,
                          },
                          (_, index) => (
                            <svg
                              width="24"
                              height="14"
                              viewBox="0 0 24 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.61537 10.7567L1.77681 10.6793L1.97093 10.5877L2.09403 10.5298C2.11555 10.5194 2.13941 10.5089 2.16092 10.4978L2.22104 10.4629C2.31034 10.4107 2.40003 10.3591 2.49009 10.3082C2.58421 10.2559 2.69629 10.188 2.81254 10.1185C2.92892 10.0485 3.05198 9.97695 3.17863 9.8924L3.37341 9.76792L3.4735 9.70386L3.57434 9.63428C3.84623 9.45004 4.13113 9.23999 4.4233 9.01165L4.64353 8.83729C4.71741 8.7785 4.79023 8.71369 4.86464 8.65247C4.93857 8.58956 5.01378 8.5298 5.08762 8.46345L5.3102 8.26486C5.38492 8.19966 5.45858 8.12967 5.53273 8.06013L5.75522 7.85118L5.97536 7.63286C6.01201 7.59638 6.04867 7.5599 6.08532 7.52343L6.19431 7.41046C6.48678 7.11515 6.76885 6.79408 7.04672 6.47708C7.1843 6.31479 7.32096 6.15485 7.45336 5.98867C7.58745 5.82727 7.71733 5.65853 7.84619 5.49602C7.97328 5.32763 8.0994 5.16543 8.22074 4.99744C8.34367 4.83378 8.46253 4.66689 8.57891 4.50434C8.63712 4.4232 8.69387 4.33971 8.75035 4.25901C8.8067 4.17876 8.86221 4.09792 8.91689 4.01651L9.07935 3.77862L9.23645 3.54312C9.33964 3.38889 9.43889 3.23444 9.53486 3.08694C9.63083 2.93683 9.72202 2.79305 9.81388 2.65463C9.99639 2.3811 10.1759 2.13329 10.3452 1.92169C10.4248 1.82134 10.5068 1.72289 10.591 1.62643C10.6703 1.53488 10.7462 1.454 10.8151 1.3811C10.957 1.23258 11.0753 1.12315 11.1628 1.04696C11.2487 0.97202 11.2986 0.936075 11.2986 0.936075C13.4241 -0.594959 16.3884 -0.11302 17.9194 2.01257C19.1278 3.69017 19.0822 5.89018 17.9643 7.49567L17.9397 7.52869C17.9397 7.52869 17.9055 7.57752 17.8339 7.66145C17.764 7.74419 17.6513 7.86783 17.4991 8.0159C17.4207 8.09102 17.3335 8.17398 17.2352 8.26083C17.1269 8.35656 17.0164 8.44983 16.9038 8.5406C16.659 8.7375 16.3712 8.95057 16.0349 9.17044C15.6998 9.38895 15.3203 9.61529 14.9179 9.85468C14.5165 10.0942 14.0799 10.3383 13.6249 10.5825C13.169 10.8272 12.6876 11.0686 12.1927 11.3013C11.6951 11.533 11.1835 11.7553 10.6625 11.9594C10.5334 12.0114 10.4005 12.0595 10.2703 12.109C10.1398 12.1585 10.0092 12.2065 9.8763 12.2515L9.48178 12.3871L9.08577 12.5133L8.88944 12.5748L8.69126 12.6315L8.29931 12.7418L7.90861 12.8411L7.71604 12.8892C7.65212 12.9049 7.58678 12.918 7.52282 12.9324L7.14216 13.0145C7.01706 13.0417 6.89001 13.0627 6.76673 13.0862C6.64274 13.1087 6.5214 13.1318 6.39962 13.1504L6.03937 13.2034C5.56699 13.2724 5.11622 13.3096 4.70382 13.3357C4.29041 13.3593 3.91405 13.3697 3.57965 13.3605C3.41285 13.3579 3.26088 13.3564 3.10714 13.3487C2.97056 13.3433 2.83405 13.3365 2.69762 13.3283L2.60824 13.323C2.58115 13.3205 2.55751 13.3168 2.53317 13.3139L2.39819 13.2967L2.18531 13.2693L2.00789 13.2453C1.28819 13.1479 0.783716 12.4855 0.881193 11.7658C0.942282 11.3139 1.23418 10.9431 1.61537 10.7567Z"
                                fill="#FF473E"
                              />
                              <path
                                d="M13.3558 3.07414L13.1992 3.16865L13.1167 3.21845C13.0999 3.22819 13.09 3.23545 13.0782 3.24351L13.0415 3.26843L12.9599 3.32279L12.915 3.35205L12.865 3.39039C12.7971 3.44448 12.7201 3.49703 12.644 3.56573L12.5247 3.66764C12.4842 3.70314 12.4441 3.74258 12.4024 3.78105C12.3185 3.85679 12.2353 3.94395 12.1492 4.03019C12.1062 4.07344 12.0642 4.12049 12.0212 4.16596C11.9783 4.21177 11.9351 4.25754 11.8927 4.30602L11.7647 4.44931L11.6378 4.59562L11.3891 4.88601C11.307 4.98203 11.228 5.07468 11.1493 5.1641C11.0732 5.25272 10.9943 5.33776 10.9239 5.4154C10.8565 5.4871 10.788 5.55772 10.7184 5.62722C10.6514 5.68973 10.5957 5.74396 10.5454 5.78787L10.3803 5.92351C10.2994 5.9902 10.1964 6.02408 10.0916 6.01845C9.98688 6.01282 9.88807 5.96809 9.81472 5.89311C9.74138 5.81813 9.69884 5.71836 9.69552 5.61352C9.69221 5.50869 9.72835 5.40642 9.79681 5.32696L9.82784 5.29101L9.92709 5.17565C9.95839 5.13723 9.99566 5.08557 10.0387 5.02979C10.0868 4.96202 10.1339 4.89358 10.1801 4.82448C10.231 4.74466 10.2863 4.66118 10.3441 4.56547C10.4019 4.47246 10.4633 4.37016 10.5267 4.26472L10.7263 3.93373L10.8315 3.76157L10.9416 3.58703C10.9777 3.52868 11.0166 3.47043 11.0551 3.4123C11.0941 3.35427 11.1309 3.29606 11.1713 3.23891C11.2522 3.1247 11.3295 3.01124 11.4138 2.90393C11.4553 2.8501 11.4946 2.79645 11.5363 2.74515L11.661 2.59548C11.7399 2.4969 11.8273 2.4096 11.903 2.32624L11.96 2.26542L12.0224 2.20579L12.139 2.09596L12.1925 2.04612C12.2097 2.03014 12.2274 2.01354 12.2395 2.00362L12.3127 1.9409L12.4515 1.82186C12.7765 1.5432 13.2658 1.58074 13.5444 1.90566C13.823 2.23058 13.7855 2.71991 13.4606 2.99853C13.4292 3.02551 13.3957 3.04994 13.3603 3.07158L13.3558 3.07414Z"
                                fill="#FF6E83"
                              />
                              <path
                                d="M22.8494 1.47319L22.8369 1.45872L22.6094 1.19546C22.573 1.15376 22.5271 1.11082 22.4802 1.06243C22.4319 1.01489 22.3824 0.961681 22.3242 0.908472L22.1333 0.743221C22.1161 0.728967 22.1 0.713606 22.0814 0.699795L22.0248 0.658139L21.9075 0.572393C21.7464 0.457076 21.5563 0.347293 21.3437 0.250879C21.3179 0.237554 21.2903 0.227019 21.2622 0.216926L21.1778 0.185673L21.0923 0.154464C21.0637 0.143175 21.0343 0.133857 21.0045 0.126576L20.8223 0.0793423C20.807 0.0755795 20.7917 0.0712854 20.7762 0.0679654L20.7289 0.060263L20.6337 0.0451677C20.5699 0.035119 20.5057 0.024185 20.4404 0.0223257C20.3752 0.0186515 20.3095 0.013782 20.2435 0.0119671L20.0454 0.0183861L19.9956 0.0203338L19.9465 0.0260442L19.8479 0.0378193C19.5855 0.0719495 19.3266 0.136447 19.0856 0.229099C18.8441 0.3206 18.6124 0.428347 18.3998 0.55172C18.2838 0.618355 18.1697 0.688192 18.0576 0.76115C17.2563 0.0389261 16.1376 -0.177675 15.1421 0.147116C15.1395 0.157873 15.1423 0.166328 15.1387 0.177395C15.0449 0.46469 14.9676 0.763982 16.2103 2.11622C17.453 3.46846 18.5898 4.64712 18.7916 4.13938C19.1251 3.3002 19.1123 2.34247 18.6688 1.53167C18.7399 1.497 18.8115 1.46367 18.8838 1.43167C19.0704 1.34827 19.2608 1.28634 19.446 1.23915C19.6315 1.19059 19.8119 1.17142 19.979 1.17084L20.0412 1.17111L20.072 1.17098L20.1021 1.17439C20.142 1.17877 20.1813 1.18258 20.2201 1.18576L20.3323 1.20785C20.3695 1.21263 20.4046 1.22529 20.4394 1.23605L20.4913 1.25141L20.5169 1.25867C20.5253 1.26181 20.5335 1.2658 20.5418 1.26925C20.5747 1.28355 20.6071 1.29696 20.6392 1.30962C20.6471 1.31294 20.6552 1.31551 20.663 1.31936L20.6861 1.33224L20.7318 1.35712L20.7769 1.38081C20.7918 1.38811 20.8067 1.39577 20.8208 1.40648C20.9357 1.48027 21.0411 1.55925 21.1344 1.6469L21.2026 1.71153L21.2357 1.7422C21.2466 1.75239 21.2565 1.76518 21.2668 1.7762L21.3823 1.90391C21.418 1.94544 21.4494 1.9897 21.4795 2.02715C21.5091 2.06615 21.5377 2.09847 21.5611 2.13313L21.7084 2.34964C21.7238 2.37213 21.7408 2.39453 21.759 2.4156C22.0192 2.71666 22.4743 2.74978 22.7754 2.48957C23.0766 2.22932 23.1097 1.7743 22.8494 1.47319ZM18.5169 1.28457C18.5213 1.29103 18.5258 1.29745 18.5302 1.30391C18.5258 1.29741 18.5213 1.29099 18.5169 1.28457ZM18.4365 1.17297C18.443 1.18151 18.4493 1.19015 18.4556 1.19878C18.4492 1.19019 18.443 1.18151 18.4365 1.17297Z"
                                fill="#00B89C"
                              />
                            </svg>
                          )
                        )}
                      </div>
                      {product.node.title === "Best Seller Bundle" ? (
                        <div>
                          <button className="bg-[#53940F] px-10 py-1.5 rounded-lg text-xl font-bold text-white">
                            Add to cart
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() =>
                              handleRemoveFromCart(
                                product.node.variants.edges[0].node.id
                              )
                            }
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z"
                                fill="#333333"
                              />
                            </svg>
                          </button>
                          <span className="border-2 rounded-lg border-[#333333] px-3 py-0.5">
                            {getProductQuantityInCart(
                              product.node.variants.edges[0].node.id
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleAddToCart(
                                product.node.variants.edges[0].node.id
                              )
                            }
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.84615V8.30769H4.84615V9.69231H8.30769V13.1538H9.69231V9.69231H13.1538V8.30769H9.69231V4.84615H8.30769Z"
                                fill="#333333"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Footer />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Product;