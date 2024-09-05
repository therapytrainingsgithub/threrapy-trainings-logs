import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUserProfileContext } from "@/app/context/userProfileContext";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { userName } = useUserProfileContext();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
    } else {
      router.push("/login"); // Redirect the user to the login page after logout
    }
  };

  return (
    <main>
      <div className="flex justify-between items-center">
        <div>
          <img src="./images/logo.png" alt="logo" />
        </div>
        <div className="relative">
          <img
            src="./images/profile.png"
            alt="profile"
            className="cursor-pointer w-8 h-8"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="relative py-8 px-5 rounded-xl mt-10"
        style={{
          background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
          border: "1px solid #dcdcdc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-0">
          <img
            src="./images/bg.png"
            alt="wave background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-[#709D50] text-[41px] font-bold">
            {`Welcome ${userName ? userName : "Guest"}!`}
          </h1>
          <p className="text-[24px] font-regular">
            Your Therapy Tracking portal.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Header;
