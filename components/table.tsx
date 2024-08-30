"use client";
import React, { useState } from "react";

// Dropdown component
const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleDropdown} className="px-4 py-2">
        <img src="./images/dropdown.png" alt="dropdown" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 origin-top-right bg-white border border-gray-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-1">
            <button
              onClick={closeDropdown}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Update
            </button>
            <button
              onClick={closeDropdown}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface TableProps {
  headers?: string[];
  data?: Record<string, React.ReactNode>[]; // <-- Explicitly type data as an array of objects with string keys and React nodes as values
}

// Table component
const Table: React.FC<TableProps> = ({ headers = [], data = [] }) => {
  return (
    <main>
      <table className="min-w-full text-[16px]">
        <thead className="bg-white border border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-300">
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {cell}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                <Dropdown />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Table;
