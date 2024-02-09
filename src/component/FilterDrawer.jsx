import { motion } from "framer-motion";
import { MultiSelectAccordion } from "./MultiSelectAccordian";

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

export const FilterDrawer = ({ onClose, onSelectedOptionsChange, option, handleClearFilters }) => {

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4 }}
      className="fixed top-20 z-50 flex h-full lg:h-5/6 flex-col px-4 text-[#E91D24] inset-0 bg-[#53940F] rounded-r-lg lg:w-2/12"
    >
      <div className="flex w-full justify-end px-5 items-center ml-2 gap-3 h-16">
        <button onClick={handleClearFilters} className="bg-white cursor-pointer px-2 py-0.5 rounded-lg">
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
        options={filterOptions}
        option={option}
        onSelectedOptionsChange={onSelectedOptionsChange}
      />
    </motion.div>
  );
};
