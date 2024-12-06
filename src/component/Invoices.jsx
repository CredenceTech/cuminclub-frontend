import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { customerAccessTokenData, userEmails } from "../state/user";
import LoadingAnimation from "./Loader";
import DataNotFound from "./DataNotFound";
import { getCustomerOrders, graphQLClient } from "../api/graphql";
import ProductsModal from "./ProductsModal";
import AddOrderConcernForm from "./AddOrderConcernForm";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const loginUserCustomerId = useSelector(customerAccessTokenData);
  const [orders, setOrders] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isAddConcernOpen, setIsAddConcernOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();
  
  useEffect(()=>{
       if(!loginUserCustomerId){
           navigate("/login");
       }
  },[loginUserCustomerId])


  const openAddConcern = (id) => {
    setOrderId(id);
    setIsAddConcernOpen(true);
  };

  const closeAddConcern = () => {
    setOrderId(null);
    setIsAddConcernOpen(false);
  };

  const openModal = (item, status) => {
    const data = {
      "status": status,
      "items": item
    }
    setModalData(data);
  };

  const closeModal = () => {
    setModalData(null);
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await graphQLClient.request(getCustomerOrders, { customerAccessToken: loginUserCustomerId });
        const filteredOrders = result?.customer?.orders?.edges;
        console.log(result)
        setOrders(filteredOrders)
        console.log(orders)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getOrders();
  }, [loginUserCustomerId]);


  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${timeString}`;
  }
  function formatAmountWithCurrency(currency, amount) {
    let currencySymbol;
    switch (currency) {
      case 'usd':
        currencySymbol = '$';
        break;
      case 'INR':
        currencySymbol = '₹';
        break;
      // Add more cases for other currencies as needed
      default:
        currencySymbol = '';
        break;
    }
    return `${currencySymbol} ${amount}`;
  }

  function calculateTotalQuantity(data) {
    let totalQuantity = 0;


    data?.edges?.forEach((lineItem) => {
      totalQuantity += lineItem.node.quantity;
    });


    return totalQuantity;
  }

  return (
    <div>
      {orders !== null && orders !== undefined ? (
        orders.length === 0 ? ( // Safely check if the orders array is empty
          <DataNotFound />
        ) : (
          <section className="body-font relative">
            <div className="container p-5 mx-auto">
              <h2 className="font-[400] mt-5 mb-5 text-[37.24px] font-skillet text-[#333333] leading-[37.58px]">My Orders</h2>
              <div className="relative overflow-x-auto sm:rounded-lg">
                <div className="hidden sm:block"> {/* Table for larger screens */}
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 font-regola-pro">
                      <tr>
                        <th scope="col" className="px-6 py-3">Order Number</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Amount Paid</th>
                        <th scope="col" className="px-6 py-3">Payment Status</th>
                        <th scope="col" className="px-6 py-3">Fulfillment Status</th>
                        <th scope="col" className="px-6 py-3">Items</th>
                        <th scope="col" className="px-6 py-3"></th>

                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr className="odd:bg-white even:bg-gray-50 border-b font-regola-pro" key={i}>
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            #{order?.node?.orderNumber}
                          </th>
                          <td className="px-6 py-4">{formatDate(order?.node?.processedAt)}</td>
                          <td className="px-6 py-4">
                            {formatAmountWithCurrency(order?.node?.totalPrice?.currencyCode, order?.node?.totalPrice?.amount)}
                          </td>
                          <td className="px-6 py-4">{order?.node?.financialStatus}</td>
                          <td className="px-6 py-4">{order?.node?.fulfillmentStatus}</td>
                          <td
                            className="px-6 py-4 group cursor-pointer relative"
                            onClick={() => openModal(order?.node?.lineItems, order?.node?.fulfillmentStatus)}
                          >
                            <span className="mr-2">{`${calculateTotalQuantity(order?.node?.lineItems)} items`}</span>
                            <svg
                              className="absolute right-[40px] top-[55%] transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999"
                                stroke="#1D1929"
                                strokeWidth="2.4"
                                strokeLinecap="square"
                              />
                            </svg>
                          </td>
                          <td
                            className="px-6 py-4 cursor-pointer text-black underline hover:text-gray-700"
                            onClick={() => openAddConcern(order?.node?.orderNumber)}
                          >
                            <span className="hover:underline">Have any concern?</span>
                          </td>


                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards for mobile screens */}
                <div className="sm:hidden"> {/* Cards for mobile screens */}
                  {orders.map((order, i) => (
                    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 font-regola-pro" key={i}>
                      <div className="flex justify-between mb-4">
                        <h3 className="font-medium text-lg text-gray-900">#{order?.node?.orderNumber}</h3>
                        <p className="text-sm text-gray-500">{formatDate(order?.node?.processedAt)}</p>
                      </div>
                      <p className="text-sm text-gray-500">{`Amount Paid: ${formatAmountWithCurrency(order?.node?.totalPrice?.currencyCode, order?.node?.totalPrice?.amount)}`}</p>
                      <p className="text-sm text-gray-500">{`Payment Status: ${order?.node?.financialStatus}`}</p>
                      <p className="text-sm text-gray-500">{`Fulfillment Status: ${order?.node?.fulfillmentStatus}`}</p>
                      <div
                        className="flex justify-between items-center mt-4 cursor-pointer"
                        onClick={() => openModal(order?.node?.lineItems, order?.node?.fulfillmentStatus)}
                      >
                        <span className="text-sm">{`${calculateTotalQuantity(order?.node?.lineItems)} items`}</span>
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.99961 2.5999L6.79961 7.3999L11.5996 2.5999"
                            stroke="#1D1929"
                            strokeWidth="2.4"
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                      <div
                            className="py-4 cursor-pointer text-black underline hover:text-gray-700"
                            onClick={() => openAddConcern(order?.node?.orderNumber)}
                          >
                            <span className="hover:underline">Have any concern?</span>
                          </div>
                    </div>
                  ))}
                </div>
              </div>
              {modalData && <ProductsModal data={modalData} onClose={closeModal} />}
              {isAddConcernOpen && (
                <AddOrderConcernForm
                  orderId={orderId.toString()}
                  onClose={closeAddConcern}
                />
              )}
            </div>
          </section>
        )
      ) : (
        <div
          className="flex justify-center items-center"
          style={{
            height: "90vh",
          }}
        >
          {/* <LoadingAnimation /> */}
        </div>
      )}
    </div>
  );



};

export default Invoices;
