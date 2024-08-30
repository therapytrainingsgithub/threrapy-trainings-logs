import { useUserContext } from "@/app/context/userContext";
import React, { useState } from "react";

interface NewSupervisionLogProps {
  closePopup: () => void;
}

const NewSupervisionLog: React.FC<NewSupervisionLogProps> = ({ closePopup }) => {
    const { userID } = useUserContext();
  const [formData, setFormData] = useState({
    week: "",
    supervision_Hours: ""
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
    e.preventDefault()
    try {
        const response = await fetch("/api/supervisionHours/post", {
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
              <label htmlFor="supervision_Hours">Supervision Hours</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="supervision_Hours"
                name="supervision_Hours"
                placeholder="Enter supervision hours"
                value={formData.supervision_Hours}
                onChange={handleChange}
                required
              />
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

export default NewSupervisionLog;
