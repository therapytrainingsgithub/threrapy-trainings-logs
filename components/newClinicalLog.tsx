import React, { useState } from "react";
import { useUserContext } from "@/app/context/userContext";

interface NewClinicalLogProps {
  closePopup: () => void;
}

const NewClinicalLog: React.FC<NewClinicalLogProps> = ({ closePopup }) => {
  const { userID } = useUserContext();

  const [formData, setFormData] = useState({
    week: "",
    direct_Hours: "",
    indirect_Hours: "",
    site: "",
    supervisor: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/clinicalHours/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, user_Id: userID }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Data inserted successfully:", result);
        closePopup();
      } else {
        console.error("Failed to insert data:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <main className="py-5 px-10 font-chesna space-y-10">
      {/* form */}
      <div className="py-8 px-5 rounded-xl flex flex-col items-center space-y-10">
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-6"
          >
            {/* Week Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="week">Week</label>
              <input
                className="rounded-md px-5 py-2"
                type="week"
                id="week"
                name="week"
                value={formData.week}
                onChange={handleChange}
                required
              />
            </div>

            {/* Direct Hours Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="direct_Hours">Direct Hours</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="direct_Hours"
                name="direct_Hours"
                placeholder="Enter direct hours"
                value={formData.direct_Hours}
                onChange={handleChange}
                required
              />
            </div>

            {/* Indirect Hours Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="indirect_Hours">Indirect Hours</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="indirect_Hours"
                name="indirect_Hours"
                placeholder="Enter indirect hours"
                value={formData.indirect_Hours}
                onChange={handleChange}
                required
              />
            </div>

            {/* Site Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="site">Site</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="site"
                name="site"
                placeholder="Enter site"
                value={formData.site}
                onChange={handleChange}
                required
              />
            </div>

            {/* Supervisor Dropdown */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="supervisor">Supervisor</label>
              <select
                id="supervisor"
                name="supervisor"
                className="rounded-md px-5 py-2"
                value={formData.supervisor}
                onChange={handleChange}
                required
              >
                <option value="" hidden>
                  Select Supervisor
                </option>
                <option value="supervisor1">Supervisor 1</option>
                <option value="supervisor2">Supervisor 2</option>
                <option value="supervisor3">Supervisor 3</option>
              </select>
            </div>

            <div className="w-[50%]">
              <button
                type="submit"
                style={{
                  background: "#8cbf68",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="px-5 py-2 rounded-md text-white w-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default NewClinicalLog;
