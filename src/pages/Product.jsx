import React, { useState, useEffect } from "react";
import { createCartMutation, getProductCollectionsQuery, graphQLClient } from "../api/graphql";
import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { selectMealItems } from "../state/mealdata";
import mealThreeImage from "../assets/mealThreeImage.png";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "../component/CartComponent";
import { cartIsOpen, openCart } from "../state/cart";
import { addCartData, clearCartData } from "../state/cartData";

const filterOptions = [
  {
    id: 1,
    title: "Dietary Need",
    options: [
      { id: "Vegan", label: "Vegan" },
      { id: "Gluten Free", label: "Gluten Free" },
      { id: "No Peanuts", label: "No Peanuts" },
      { id: "No Tree Nuts", label: "No Tree Nuts" },
      { id: "No Soy", label: "No Soy" },
      { id: "High Protein", label: "High Proteins" },
    ],
  },
  {
    id: 2,
    title: "Spice Level",
    options: [
      { id: "Very Mild", label: "Very Mild" },
      { id: "Mild", label: "Mild" },
      { id: "Regular", label: "Regular" },
      { id: "Hot", label: "Hot" },
    ],
  },
  {
    id: 3,
    title: "Equipment",
    options: [
      { id: "Microwavable", label: "Microwavable" },
      {
        id: "Does Not Require Instapot/Cooker",
        label: "Does Not Require Instapot/Cooker",
      },
    ],
  },
  {
    id: 4,
    title: "Place Of Origin",
    options: [
      { id: "Mumbai", label: "Mumbai" },
      { id: "Delhi", label: "Delhi" },
      { id: "Chennai", label: "Chennai" },
      { id: "Gujarat", label: "Gujarat" },
      { id: "Panjab", label: "Punjab" },
      { id: "Bangalore", label: "Bangalore" },
      { id: "Hyderabad", label: "Hyderabad" },
      { id: "Kerala", label: "Kerala" },
      { id: "Kolkata", label: "Kolkata" },
    ],
  },
];

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
  const [cartDrawer, setCartDrawer] = useState(false)
  const dispatch = useDispatch()
  const isCartOpen = useSelector(cartIsOpen)

  useEffect(() => {
    if(cartCount === mealData.no){
      addToCart()
      dispatch(openCart())
    }
  }, [cartCount])

  const addToCart = async() => {
   const params =  {
      "cartInput": {
        "lines": [
          ...cartItems
        ]
      }
    }
    const response = await graphQLClient.request(createCartMutation, params);
    console.log(response, "Response")
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

  // const productsContainerRef = useRef(null);
  // const productSectionsRefs = apiResponse?.collections?.edges.map(() => useRef(null));

  useEffect(() => {
    const apiCall = async () => {
      const result = await graphQLClient.request(getProductCollectionsQuery, {
        first: 15,
        reverse: false,
        query: "",
      });
      setApiResponse(result);
      setRawResponse(result);
    };

    apiCall();
  }, []);

  const [activeTitle, setActiveTitle] = useState(
    apiResponse?.collections?.edges[0]?.node.title || ""
  );

  const handleCategorySelect = (title) => {
    setActiveTitle(title);
    const categoryIndex = apiResponse.collections.edges.findIndex(
      (category) => category.node.title === title
    );
    const yOffset = productSectionsRefs[categoryIndex].current.offsetTop;
    productsContainerRef.current.scrollTo({ top: yOffset, behavior: "smooth" });
  };

  const handleScroll = () => {
    const scrollPosition = productsContainerRef.current.scrollTop;
    const categoryIndex = productSectionsRefs.findIndex(
      (ref) =>
        ref.current.offsetTop <= scrollPosition &&
        ref.current.offsetTop + ref.current.clientHeight > scrollPosition
    );

    if (categoryIndex !== -1) {
      setActiveTitle(apiResponse.collections.edges[categoryIndex].node.title);
    }
  };

  // useEffect(() => {
  //   productsContainerRef.current.addEventListener('scroll', handleScroll);
  //   return () => {
  //     productsContainerRef.current.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

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
          <div onClick={() => navigate('/')} className="px-3 cursor-pointer text-white gap-3  py-1 w-2/5 border text-sm border-white bg-[#53940F] rounded-lg flex items-center justify-center">
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
        <span className="font-bold text-4xl text-[#53940F]">Make Your Meal</span>
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
              {isCartOpen && (
                <CartDrawer/>
              )}
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
                        className="w-40 h-40 mb-1"
                      />
                      <h3 className="text-[#53940F] text-lg font-semibold">
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
                              width="23"
                              height="14"
                              viewBox="0 0 23 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.36928 10.7567L1.53072 10.6793L1.72483 10.5877L1.84794 10.5298C1.86945 10.5194 1.89331 10.5089 1.91483 10.4978L1.97494 10.4629C2.06425 10.4107 2.15394 10.3591 2.244 10.3082C2.33811 10.2559 2.4502 10.188 2.56644 10.1185C2.68282 10.0485 2.80589 9.97695 2.93254 9.8924L3.12731 9.76792L3.2274 9.70386L3.32824 9.63428C3.60013 9.45004 3.88504 9.23999 4.1772 9.01165L4.39744 8.83729C4.47132 8.7785 4.54414 8.71369 4.61855 8.65247C4.69248 8.58956 4.76769 8.5298 4.84153 8.46345L5.0641 8.26486C5.13883 8.19966 5.21249 8.12967 5.28664 8.06013L5.50912 7.85118L5.72927 7.63286C5.76592 7.59638 5.80257 7.5599 5.83923 7.52343L5.94821 7.41046C6.24069 7.11515 6.52276 6.79408 6.80063 6.47708C6.93821 6.31479 7.07486 6.15485 7.20727 5.98867C7.34135 5.82727 7.47123 5.65853 7.6001 5.49602C7.72719 5.32763 7.85331 5.16543 7.97464 4.99744C8.09758 4.83378 8.21643 4.66689 8.33281 4.50434C8.39102 4.4232 8.44778 4.33971 8.50426 4.25901C8.56061 4.17876 8.61612 4.09792 8.67079 4.01651L8.83326 3.77862L8.99036 3.54312C9.09355 3.38889 9.1928 3.23444 9.28877 3.08694C9.38474 2.93683 9.47593 2.79305 9.56779 2.65463C9.7503 2.3811 9.92981 2.13329 10.0991 1.92169C10.1787 1.82134 10.2607 1.72289 10.3449 1.62643C10.4242 1.53488 10.5001 1.454 10.569 1.3811C10.7109 1.23258 10.8292 1.12315 10.9167 1.04696C11.0026 0.97202 11.0525 0.936075 11.0525 0.936075C13.178 -0.594959 16.1423 -0.11302 17.6733 2.01257C18.8817 3.69017 18.8361 5.89018 17.7182 7.49567L17.6936 7.52869C17.6936 7.52869 17.6594 7.57752 17.5879 7.66145C17.5179 7.74419 17.4052 7.86783 17.253 8.0159C17.1746 8.09102 17.0874 8.17398 16.9891 8.26083C16.8808 8.35656 16.7703 8.44983 16.6577 8.5406C16.4129 8.7375 16.1251 8.95057 15.7888 9.17044C15.4537 9.38895 15.0742 9.61529 14.6718 9.85468C14.2705 10.0942 13.8338 10.3383 13.3788 10.5825C12.9229 10.8272 12.4415 11.0686 11.9466 11.3013C11.449 11.533 10.9374 11.7553 10.4164 11.9594C10.2873 12.0114 10.1544 12.0595 10.0242 12.109C9.89368 12.1585 9.76314 12.2065 9.6302 12.2515L9.23569 12.3871L8.83967 12.5133L8.64335 12.5748L8.44516 12.6315L8.05322 12.7418L7.66251 12.8411L7.46995 12.8892C7.40603 12.9049 7.34069 12.918 7.27672 12.9324L6.89607 13.0145C6.77097 13.0417 6.64392 13.0627 6.52064 13.0862C6.39664 13.1087 6.2753 13.1318 6.15352 13.1504L5.79328 13.2034C5.3209 13.2724 4.87012 13.3096 4.45773 13.3357C4.04431 13.3593 3.66795 13.3697 3.33356 13.3605C3.16676 13.3579 3.01479 13.3564 2.86104 13.3487C2.72447 13.3433 2.58796 13.3365 2.45153 13.3283L2.36215 13.323C2.33506 13.3205 2.31142 13.3168 2.28707 13.3139L2.1521 13.2967L1.93922 13.2693L1.76179 13.2453C1.04209 13.1479 0.537622 12.4855 0.635099 11.7658C0.696188 11.3139 0.988088 10.9431 1.36928 10.7567Z"
                                fill="#FF473E"
                              />
                              <path
                                d="M13.1097 3.07402L12.9531 3.16853L12.8706 3.21833C12.8538 3.22807 12.8439 3.23533 12.8321 3.24339L12.7954 3.26831L12.7138 3.32267L12.6689 3.35193L12.6189 3.39027C12.551 3.44436 12.474 3.49691 12.3979 3.56561L12.2786 3.66751C12.2381 3.70302 12.198 3.74246 12.1563 3.78093C12.0724 3.85667 11.9892 3.94383 11.9031 4.03006C11.8601 4.07331 11.8181 4.12037 11.7751 4.16583C11.7322 4.21165 11.689 4.25742 11.6466 4.3059L11.5186 4.44919L11.3918 4.59549L11.143 4.88589C11.0609 4.9819 10.9819 5.07456 10.9032 5.16398C10.8271 5.2526 10.7482 5.33764 10.6778 5.41528C10.6104 5.48698 10.5419 5.55759 10.4723 5.6271C10.4053 5.68961 10.3496 5.74384 10.2993 5.78775L10.1342 5.92338C10.0533 5.99007 9.95026 6.02396 9.84552 6.01833C9.74078 6.0127 9.64197 5.96797 9.56863 5.89299C9.49528 5.81801 9.45274 5.71824 9.44943 5.6134C9.44611 5.50857 9.48226 5.4063 9.55072 5.32684L9.58175 5.29089L9.68099 5.17553C9.71229 5.13711 9.74957 5.08545 9.79264 5.02967C9.84072 4.9619 9.88784 4.89346 9.93398 4.82436C9.98494 4.74454 10.0402 4.66105 10.098 4.56535C10.1558 4.47234 10.2172 4.37004 10.2806 4.26459L10.4802 3.93361L10.5854 3.76145L10.6955 3.5869C10.7316 3.52856 10.7705 3.4703 10.809 3.41218C10.848 3.35415 10.8848 3.29593 10.9252 3.23878C11.0061 3.12457 11.0834 3.01112 11.1677 2.90381C11.2092 2.84998 11.2485 2.79633 11.2902 2.74503L11.4149 2.59536C11.4938 2.49677 11.5812 2.40948 11.6569 2.32612L11.7139 2.2653L11.7764 2.20567L11.8929 2.09584L11.9464 2.046C11.9636 2.03002 11.9814 2.01342 11.9934 2.0035L12.0666 1.94077L12.2054 1.82174C12.5304 1.54308 13.0197 1.58061 13.2983 1.90554C13.5769 2.23046 13.5394 2.71979 13.2145 2.99841C13.1831 3.02539 13.1496 3.04981 13.1142 3.07145L13.1097 3.07402Z"
                                fill="#FF6E83"
                              />
                              <path
                                d="M22.6033 1.47319L22.5908 1.45872L22.3633 1.19546C22.3269 1.15376 22.281 1.11082 22.2341 1.06243C22.1858 1.01489 22.1363 0.961681 22.0781 0.908472L21.8872 0.743221C21.87 0.728967 21.8539 0.713606 21.8353 0.699795L21.7787 0.658139L21.6614 0.572393C21.5003 0.457076 21.3102 0.347293 21.0976 0.250879C21.0718 0.237554 21.0442 0.227019 21.0161 0.216926L20.9317 0.185673L20.8462 0.154464C20.8176 0.143175 20.7883 0.133857 20.7584 0.126576L20.5762 0.0793423C20.5609 0.0755795 20.5456 0.0712854 20.5301 0.0679654L20.4828 0.060263L20.3876 0.0451677C20.3238 0.035119 20.2596 0.024185 20.1943 0.0223257C20.1291 0.0186515 20.0634 0.013782 19.9974 0.0119671L19.7993 0.0183861L19.7495 0.0203338L19.7004 0.0260442L19.6018 0.0378193C19.3394 0.0719495 19.0805 0.136447 18.8395 0.229099C18.598 0.3206 18.3663 0.428347 18.1537 0.55172C18.0377 0.618355 17.9236 0.688192 17.8115 0.76115C17.0102 0.0389261 15.8915 -0.177675 14.896 0.147116C14.8934 0.157873 14.8962 0.166328 14.8926 0.177395C14.7989 0.46469 14.7215 0.763982 15.9642 2.11622C17.2069 3.46846 18.3437 4.64712 18.5455 4.13938C18.879 3.3002 18.8662 2.34247 18.4227 1.53167C18.4938 1.497 18.5654 1.46367 18.6377 1.43167C18.8243 1.34827 19.0148 1.28634 19.1999 1.23915C19.3854 1.19059 19.5658 1.17142 19.7329 1.17084L19.7951 1.17111L19.826 1.17098L19.856 1.17439C19.8959 1.17877 19.9352 1.18258 19.974 1.18576L20.0862 1.20785C20.1234 1.21263 20.1585 1.22529 20.1933 1.23605L20.2452 1.25141L20.2708 1.25867C20.2793 1.26181 20.2874 1.2658 20.2957 1.26925C20.3286 1.28355 20.361 1.29696 20.3931 1.30962C20.401 1.31294 20.4091 1.31551 20.4169 1.31936L20.44 1.33224L20.4857 1.35712L20.5308 1.38081C20.5457 1.38811 20.5606 1.39577 20.5747 1.40648C20.6896 1.48027 20.795 1.55925 20.8883 1.6469L20.9565 1.71153L20.9896 1.7422C21.0005 1.75239 21.0104 1.76518 21.0207 1.7762L21.1362 1.90391C21.1719 1.94544 21.2033 1.9897 21.2334 2.02715C21.263 2.06615 21.2916 2.09847 21.315 2.13313L21.4623 2.34964C21.4777 2.37213 21.4947 2.39453 21.5129 2.4156C21.7731 2.71666 22.2282 2.74978 22.5293 2.48957C22.8305 2.22932 22.8636 1.7743 22.6033 1.47319ZM18.2708 1.28457C18.2752 1.29103 18.2797 1.29745 18.2841 1.30391C18.2797 1.29741 18.2752 1.29099 18.2708 1.28457ZM18.1904 1.17297C18.1969 1.18151 18.2032 1.19015 18.2095 1.19878C18.2032 1.19019 18.1969 1.18151 18.1904 1.17297Z"
                                fill="#00B89C"
                              />
                            </svg>
                          )
                        )}
                      </div>
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

const FilterDrawer = ({ onClose, onSelectedOptionsChange, option }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleToggleOption = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4 }}
      className="fixed top-20 z-50 flex h-full lg:h-5/6 flex-col px-4 text-[#E91D24] inset-0 bg-[#53940F] rounded-r-lg lg:w-2/12"
    >
      <div className="flex w-full justify-end px-5 items-center ml-2 h-16">
        <button onClick={onClose} className="bg-white px-3 py-2 rounded-l-lg">
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 2.00245C4.73478 2.00245 4.48043 2.10781 4.29289 2.29534C4.10536 2.48288 4 2.73723 4 3.00245C4 3.26767 4.10536 3.52202 4.29289 3.70956C4.48043 3.89709 4.73478 4.00245 5 4.00245C5.26522 4.00245 5.51957 3.89709 5.70711 3.70956C5.89464 3.52202 6 3.26767 6 3.00245C6 2.73723 5.89464 2.48288 5.70711 2.29534C5.51957 2.10781 5.26522 2.00245 5 2.00245ZM2.17 2.00245C2.3766 1.41692 2.75974 0.909884 3.2666 0.55124C3.77346 0.192596 4.37909 0 5 0C5.62091 0 6.22654 0.192596 6.7334 0.55124C7.24026 0.909884 7.6234 1.41692 7.83 2.00245H15C15.2652 2.00245 15.5196 2.10781 15.7071 2.29534C15.8946 2.48288 16 2.73723 16 3.00245C16 3.26767 15.8946 3.52202 15.7071 3.70956C15.5196 3.89709 15.2652 4.00245 15 4.00245H7.83C7.6234 4.58798 7.24026 5.09502 6.7334 5.45366C6.22654 5.81231 5.62091 6.0049 5 6.0049C4.37909 6.0049 3.77346 5.81231 3.2666 5.45366C2.75974 5.09502 2.3766 4.58798 2.17 4.00245H1C0.734784 4.00245 0.48043 3.89709 0.292893 3.70956C0.105357 3.52202 0 3.26767 0 3.00245C0 2.73723 0.105357 2.48288 0.292893 2.29534C0.48043 2.10781 0.734784 2.00245 1 2.00245H2.17ZM11 8.00245C10.7348 8.00245 10.4804 8.10781 10.2929 8.29534C10.1054 8.48288 10 8.73723 10 9.00245C10 9.26767 10.1054 9.52202 10.2929 9.70956C10.4804 9.89709 10.7348 10.0025 11 10.0025C11.2652 10.0025 11.5196 9.89709 11.7071 9.70956C11.8946 9.52202 12 9.26767 12 9.00245C12 8.73723 11.8946 8.48288 11.7071 8.29534C11.5196 8.10781 11.2652 8.00245 11 8.00245ZM8.17 8.00245C8.3766 7.41692 8.75974 6.90988 9.2666 6.55124C9.77346 6.1926 10.3791 6 11 6C11.6209 6 12.2265 6.1926 12.7334 6.55124C13.2403 6.90988 13.6234 7.41692 13.83 8.00245H15C15.2652 8.00245 15.5196 8.10781 15.7071 8.29534C15.8946 8.48288 16 8.73723 16 9.00245C16 9.26767 15.8946 9.52202 15.7071 9.70956C15.5196 9.89709 15.2652 10.0025 15 10.0025H13.83C13.6234 10.588 13.2403 11.095 12.7334 11.4537C12.2265 11.8123 11.6209 12.0049 11 12.0049C10.3791 12.0049 9.77346 11.8123 9.2666 11.4537C8.75974 11.095 8.3766 10.588 8.17 10.0025H1C0.734784 10.0025 0.48043 9.89709 0.292893 9.70956C0.105357 9.52202 0 9.26767 0 9.00245C0 8.73723 0.105357 8.48288 0.292893 8.29534C0.48043 8.10781 0.734784 8.00245 1 8.00245H8.17ZM5 14.0025C4.73478 14.0025 4.48043 14.1078 4.29289 14.2953C4.10536 14.4829 4 14.7372 4 15.0025C4 15.2677 4.10536 15.522 4.29289 15.7096C4.48043 15.8971 4.73478 16.0025 5 16.0025C5.26522 16.0025 5.51957 15.8971 5.70711 15.7096C5.89464 15.522 6 15.2677 6 15.0025C6 14.7372 5.89464 14.4829 5.70711 14.2953C5.51957 14.1078 5.26522 14.0025 5 14.0025ZM2.17 14.0025C2.3766 13.4169 2.75974 12.9099 3.2666 12.5512C3.77346 12.1926 4.37909 12 5 12C5.62091 12 6.22654 12.1926 6.7334 12.5512C7.24026 12.9099 7.6234 13.4169 7.83 14.0025H15C15.2652 14.0025 15.5196 14.1078 15.7071 14.2953C15.8946 14.4829 16 14.7372 16 15.0025C16 15.2677 15.8946 15.522 15.7071 15.7096C15.5196 15.8971 15.2652 16.0025 15 16.0025H7.83C7.6234 16.588 7.24026 17.095 6.7334 17.4537C6.22654 17.8123 5.62091 18.0049 5 18.0049C4.37909 18.0049 3.77346 17.8123 3.2666 17.4537C2.75974 17.095 2.3766 16.588 2.17 16.0025H1C0.734784 16.0025 0.48043 15.8971 0.292893 15.7096C0.105357 15.522 0 15.2677 0 15.0025C0 14.7372 0.105357 14.4829 0.292893 14.2953C0.48043 14.1078 0.734784 14.0025 1 14.0025H2.17Z"
              fill="#333333"
            />
          </svg>
        </button>
      </div>

      <MultiSelectAccordion
        options={filterOptions}
        option={option}
        onSelectedOptionsChange={onSelectedOptionsChange}
      />
    </motion.div>
  );
};

const MultiSelectAccordion = ({ options, onSelectedOptionsChange, option }) => {
  const [selectedOptions, setSelectedOptions] = useState(option);
  const [openCategories, setOpenCategories] = useState([]);

  console.log(selectedOptions, "Selcted Option");

  const toggleOption = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);
    if (isSelected) {
      const newSelectedOptions = selectedOptions.filter(
        (id) => id !== optionId
      );
      setSelectedOptions(newSelectedOptions);
      onSelectedOptionsChange(newSelectedOptions);
    } else {
      const newSelectedOptions = [...selectedOptions, optionId];
      setSelectedOptions(newSelectedOptions);
      onSelectedOptionsChange(newSelectedOptions);
    }
  };

  const toggleCategory = (categoryId) => {
    setOpenCategories((prevOpenCategories) =>
      prevOpenCategories.includes(categoryId)
        ? prevOpenCategories.filter((id) => id !== categoryId)
        : [...prevOpenCategories, categoryId]
    );
  };

  const categoryVariants = {
    open: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
    closed: {
      borderBottomRightRadius: "0.375rem",
      borderBottomLeftRadius: "0.375rem",
    },
  };

  const optionVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  return (
    <div className="accordion-container overflow-y-scroll scrollbar-hide mb-2 text-[#333333]">
      {options.map((category, index) => (
        <div key={category.id} className="mb-2 ">
          <motion.button
            onClick={() => toggleCategory(category.id)}
            className="px-5  py-2 items-center justify-between flex w-full bg-white rounded-lg"
            variants={categoryVariants}
            initial="closed"
            animate={openCategories.includes(category.id) ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          >
            <span className="font-bold text-lg">{category.title}</span>
            <span>
              {openCategories.includes(category.id) ? (
                <motion.svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.path
                    d="M6 0L11.1962 9L0.803848 9L6 0Z"
                    fill="#333333"
                  />
                </motion.svg>
              ) : (
                <motion.svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.path
                    d="M6 9L0.803849 9.2855e-07L11.1962 1.83707e-06L6 9Z"
                    fill="#333333"
                  />
                </motion.svg>
              )}
            </span>
          </motion.button>

          <AnimatePresence>
            {openCategories.includes(category.id) && (
              <motion.ul
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white px-5 rounded-b-lg pb-2"
              >
                {category.options.map((option, optionIndex) => (
                  <motion.li
                    key={option.id}
                    variants={optionVariants}
                    initial="closed"
                    animate="open"
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05 + optionIndex * 0.05,
                    }}
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => toggleOption(option.id)}
                        className="w-4 h-4"
                      />
                      <span className="ml-5">{option.label}</span>
                    </label>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
