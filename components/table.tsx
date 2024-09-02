"use client";
import React from "react";

interface TableProps {
  headers?: string[];
  data?: Record<string, React.ReactNode>[]; // Explicitly type data as an array of objects with string keys and React nodes as values
  onRowClick?: (rowData: Record<string, React.ReactNode>) => void; // Pass row data on row click
}

// Table component
const Table: React.FC<TableProps> = ({
  headers = [],
  data = [],
  onRowClick,
}) => {
  return (
    <main className="overflow-x-auto">
      <table className="min-w-full text-[14px] sm:text-[16px]">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 sm:px-6 sm:py-3 text-left font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-300 cursor-pointer hover:bg-gray-100"
              onClick={() => onRowClick?.(row)} // Pass the entire row data on click
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
              <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                {/* Placeholder for any additional actions like Dropdown */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Table;
