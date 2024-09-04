import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  status?: string;
  id?: number;
  deleteLog?: (id: number) => void;
  updateLog?: (id: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  status,
  deleteLog,
  updateLog,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleDelete = () => {
    if (deleteLog && typeof id === "number") {
      deleteLog(id);
    }
    closeDropdown();
  };

  const handleUpdate = () => {
    if (updateLog && typeof id === "number") {
      updateLog(id);
    }
    closeDropdown();
  };

  const isDisabled = status === "approved" || status === "denied";

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
              disabled={isDisabled}
              className={`block px-4 py-2 text-sm w-full text-left ${
                isDisabled
                  ? "text-gray-400 cursor-not-allowed opacity-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              disabled={isDisabled}
              className={`block px-4 py-2 text-sm w-full text-left ${
                isDisabled
                  ? "text-gray-400 cursor-not-allowed opacity-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
