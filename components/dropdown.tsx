import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  id?: number;
  deleteLog?: (id: number) => void;
  updateLog?: (id: number) => void;
  PopupContent?: React.FC<{ closePopup: () => void }>;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  deleteLog,
  updateLog,
  PopupContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdate = () => {
    if (updateLog && typeof id === "number") {
      updateLog(id);
    }
    setIsPopupOpen(true);
    closeDropdown();
  };

  const handleDelete = () => {
    if (deleteLog && typeof id === "number") {
      deleteLog(id);
    }
    closeDropdown();
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button onClick={toggleDropdown} className="px-4 py-2">
        <img src="./images/dropdown.png" alt="dropdown" />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 transform -translate-x-full top-1/2 -translate-y-1/2 z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          style={{ minWidth: "120px" }}
        >
          <div className="p-1">
            <button
              onClick={handleUpdate}
              className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-100"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className= "block px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && PopupContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%] bg-white"
          >
            <h2 className="text-2xl mb-4 font-bold">
              Update Your Hours
            </h2>
            <PopupContent closePopup={closePopup} />
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
