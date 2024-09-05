"use client";
import React from "react";

interface TableProps {
  headers?: string[];
  data?: Record<string, React.ReactNode>[]; // Explicitly type data as an array of objects with string keys and React nodes as values
  onRowClick?: (rowData: Record<string, React.ReactNode>) => void; // Pass row data on row click
  editable?: boolean;
}

// Table component
const Table: React.FC<TableProps> = ({
  headers = [],
  data = [],
  onRowClick,
  editable = false,
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
                {header.charAt(0).toUpperCase() +
                  header.slice(1).replace(/([A-Z])/g, " $1")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-gray-300 hover:bg-gray-100 ${
                editable ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick?.(row)} // Pass the entire row data on click
            >
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap"
                >
                  {row[header] || "-"} {/* Render value if it exists */}
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
