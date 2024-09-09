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
        className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d]"
      >
        Add User
      </button>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className="p-5 rounded-md shadow-lg w-[90%] bg-white"
          >
            <h2 className="text-2xl mb-4">New User</h2>
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
