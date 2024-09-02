import React from "react";

interface RequestProps {
  log: Record<string, React.ReactNode>;
}

const Request: React.FC<RequestProps> = ({ log }) => {
    console.log(log)
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Log Details</h3>
      <div className="space-y-2">
        {Object.entries(log).map(([key, value], index) => (
          <div key={index} className="flex justify-between">
            <span className="font-semibold capitalize">
              {key.replace(/([A-Z])/g, " $1")}:
            </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request;
