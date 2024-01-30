import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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

export const FilterDrawer = ({ onClose, onSelectedOptionsChange, option }) => {
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