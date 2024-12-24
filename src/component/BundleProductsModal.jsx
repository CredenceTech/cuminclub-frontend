import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { getBundleProductDetails, getProductDetailQuery, graphQLClient } from "../api/graphql";

const BundleProductsModal = ({ data, onClose }) => {
  const modalRef = useRef();
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBundleProductDetails = async (bundleProductIds) => {
    try {
      const response = await graphQLClient.request(getBundleProductDetails, { id: bundleProductIds });
      return response?.metaobject;
    } catch (err) {
      console.error("Error fetching bundle product details:", err);
      throw err;
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await graphQLClient.request(getProductDetailQuery, { productId: productId });
      return response.product;
    } catch (err) {
      console.error("Error fetching product details:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return;

      setLoading(true);
      setError(null);

      try {
        const parsedData = JSON.parse(data);
        const relatedProducts = await Promise.all(
          parsedData.map(async (metaobjectId) => {
            try {
              const bundleMetaObject = await fetchBundleProductDetails(metaobjectId);
              const productField = bundleMetaObject.fields.find((field) => field.key === "product");
              const quantityField = bundleMetaObject.fields.find((field) => field.key === "quantity");

              if (productField) {
                const productDetails = await fetchProductDetails(productField.value);
                return {
                  quantity: parseInt(quantityField?.value) || 1,
                  title: productDetails.title,
                  image: productDetails?.metafields?.find(
                    (metafield) => metafield && metafield.key === "image_for_home"
                  )?.reference?.image?.originalSrc,
                };
              }
              return null;
            } catch (err) {
              console.warn("Error processing product details:", err);
              return null;
            }
          })
        );

        setBundleData(relatedProducts.filter((product) => product !== null));
      } catch (err) {
        console.error("Error fetching bundle products:", err);
        setError("Failed to load bundle products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[500] flex justify-center items-center"
      role="dialog"
      aria-modal="true"
    >
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bundle Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close Modal"
          >
            ✖
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {bundleData?.map((item, index) => (
              <div key={index} className="border-b pb-4 mb-4 flex">
                <div className="w-1/3">
                  <img
                    src={item?.image || "/placeholder.png"}
                    alt={item?.title || "Item Image"}
                    className="w-[80px] h-[80px] object-cover rounded-md"
                  />
                </div>
                <div className="w-[50%]">
                  <p className="text-lg font-bold">{item?.title || "Unknown Product"}</p>
                </div>
                <div className="w-[17%]">
                  <p className="text-lg font-bold">x {item?.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BundleProductsModal;
