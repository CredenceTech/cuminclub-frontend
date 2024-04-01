import { motion } from "framer-motion";
import { MultiSelectAccordion } from "./MultiSelectAccordian";
import { useSelector } from "react-redux";
import { innerFilterData } from "../state/selectedCountry";



export const FilterDrawer = ({ onClose, onSelectedOptionsChange, option, handleClearFilters }) => {
  const filterDatas = useSelector(innerFilterData);
  console.log("filterDatas", filterDatas);
  
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4 }}
      className="fixed top-20 z-50 flex min-w-96 lg:h-5/6 flex-col px-4 text-[#E91D24] inset-0 bg-[#53940F] rounded-r-lg lg:w-2/12"
    >
      <div className="flex w-full justify-end px-5 items-center ml-2 gap-3 h-16">
        <button onClick={() => {
          handleClearFilters()
          onClose()
          }} className="bg-white cursor-pointer px-2 py-0.5 rounded-lg">
          Clear
        </button>
        <button onClick={onClose} className="bg-white cursor-pointer px-3 py-2 rounded-l-lg">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path
              d="M5.99997 12L7.22139 10.8L3.27854 6.85714H17.1428V5.14286H3.27854L7.19997 1.2L5.99997 0L-3.43323e-05 6L5.99997 12Z"
              fill="#243F2F"
            />
          </svg>
        </button>
      </div>

      <MultiSelectAccordion
        options={filterDatas}
        option={option}
        onSelectedOptionsChange={onSelectedOptionsChange}
      />
    </motion.div>
  );
};
