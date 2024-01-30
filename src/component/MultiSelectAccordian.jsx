import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const MultiSelectAccordion = ({ options, onSelectedOptionsChange, option }) => {
    const [selectedOptions, setSelectedOptions] = useState(option);
    const [openCategories, setOpenCategories] = useState([]);
  
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