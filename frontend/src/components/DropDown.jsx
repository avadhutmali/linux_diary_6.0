import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const Dropdown = ({ label, selectedItem, options, handleItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative bg-white rounded-xl p-4 text-black shadow-md w-full">
            
            {(selectedItem === "Yes" || selectedItem === "No") && (
                <label className="absolute top-0 left-2 p-2 text-sm text-black">
                    {" "}
                    {label}{" "}
                </label>
            )}
            <div
                className="relative bg-transparent border-b border-black cursor-pointer"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIsFocused(true);
                }}
                onBlur={() => {
                    if (selectedItem === "") {
                        setIsFocused(false);
                    }
                }}
            >
                <div className="flex items-center justify-between p-2">
                    <span
                        className={`pt-2 text-base ${
                            selectedItem !== "Yes" && selectedItem !== "No"
                                ? "text-gray-500"
                                : "text-black"
                        }`}
                    >
                        {selectedItem}
                    </span>
                    <BiChevronDown className="text-base" />
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded shadow-lg">
                    <div className="p-2">
                        {options.map((item, index) => (
                            <div
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200 text-black"
                                onClick={() => {
                                    handleItemClick(item);
                                    setIsOpen(false);
                                    setIsFocused(true);
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
