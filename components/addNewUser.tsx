import React, { useState } from "react";
import NewUserForm from "./newUserForm";

const AddNewUser = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => {
        setIsPopupOpen(true);
      };
    
      const closePopup = () => {
        setIsPopupOpen(false);
      };
    
  return (
    <div className="flex justify-center">
      <button
        onClick={openPopup}
        style={{
          background: "#8cbf68",
          border: "1px solid #dcdcdc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        className="px-4 py-2 rounded-md text-white"
      >
        Add User
      </button>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%]"
            style={{
              background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-2xl mb-4 text-[#709D50]">New User</h2>
                <NewUserForm closePopup={closePopup} />
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

export default AddNewUser;
