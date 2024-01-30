import React, { useState, useEffect, useRef } from "react";
import { createCartMutation, getProductCollectionsQuery, graphQLClient } from "../api/graphql";
import { Footer } from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { selectMealItems } from "../state/mealdata";
import mealThreeImage from "../assets/mealThreeImage.png";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "../component/CartComponent";
import { cartIsOpen, openCart } from "../state/cart";
import { addCartData, clearCartData } from "../state/cartData";
import { FilterDrawer } from "../component/FilterDrawer";

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

  const productEdgesRef = useRef();

  const handleCategorySelect = (title) => {
    setActiveTitle(title);
    const productEdgesElement = document.getElementById(`product-edges-${title}`);

    if (productEdgesElement) {
      productEdgesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (cartCount === mealData.no) {
      addToCart()
      dispatch(openCart())
    }
  }, [cartCount])

  const addToCart = async () => {
    const params = {
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
                  className={`cursor-pointer flex items-center lg:py-1 font-medium lg:px-5 rounded border border-[#333333] ${activeTitle === category.node.title
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
                            <p>{index < _ ? "red" : "white"}</p>
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