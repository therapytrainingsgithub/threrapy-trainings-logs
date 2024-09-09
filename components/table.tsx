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
            {headers.map((header, index) => {
              // Check if any row has data for this header
              const hasData = data.some((row) => row[header]);
              return (
                <th
                  key={index}
                  className={`px-4 py-2 sm:px-6 sm:py-3 font-bold text-center ${
                    hasData ? "" : "text-white" // Hide if no data
                  }`}
                >
                  {/* Display the header text or keep the space hidden */}
                  {header.charAt(0).toUpperCase() +
                    header.slice(1).replace(/([A-Z])/g, " $1")}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-gray-300 hover:bg-gray-100 ${
                  editable ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)} // Pass the entire row data on click
              >
                {headers.map((header, cellIndex) => {
                  const cellData = row[header] || "-";
                  return (
                    <td
                      key={cellIndex}
                      className={`px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-center ${
                        cellData === "-" ? "text-white" : "" // Hide if data is "-"
                      }`}
                    >
                      {cellData}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            // Render this row when there is no data
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Table;
