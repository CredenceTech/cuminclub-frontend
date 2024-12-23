import React from "react";
import ReactDOM from "react-dom";

const BundleProductsModal = ({ data, onClose }) => {
  const modalRef = React.useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  console.log(data?.items)

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[500] flex justify-center items-center">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bundle Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✖
          </button>
        </div>

        {/* Item List */}
        <div className="space-y-4">
          {data?.map((item, index) => (
            <div key={index} className="border-b pb-4 mb-4 flex">
               <div className="w-1/3">
                <img
                  src={item?.image}
                  alt={item?.title || "Item Image"}
                  className="w-[80px] h-[80px] object-cover rounded-md"
                />
              </div>
              <div className="w-[50%]">
                <p className="text-lg font-bold">{item?.title}</p>
              </div>
              <div className="w-[17%]">
                <p className="text-lg font-bold"> x {item?.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {/* <div>
          <button
            onClick={onClose}
            className="w-full bg-[#EB7E01] text-white py-2 rounded-md font-medium hover:bg-[#d76c01] transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>,
    document.body
  );
};

export default BundleProductsModal;
