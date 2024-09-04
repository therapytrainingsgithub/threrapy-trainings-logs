import React, { useEffect, useState } from "react";
import { useUserContext } from "@/app/context/userContext";
import { useUserProfileContext } from "@/app/context/userProfileContext";

interface NewClinicalLogProps {
  closePopup: () => void;
  refreshLogs: () => void;
}

interface User {
  id: string;
  name: string;
  role: string;
}

const NewClinicalLog: React.FC<NewClinicalLogProps> = ({
  closePopup,
  refreshLogs,
}) => {
  const { userID } = useUserContext();
  const { allUsers } = useUserProfileContext();
  const [supervisors, setSupervisors] = useState<User[]>([]);

  useEffect(() => {
    if (allUsers) {
      const filteredSupervisors = allUsers.filter(
        (user) => user.role === "supervisor" && user.id !== userID
      );
      setSupervisors(filteredSupervisors);
    }
  }, [allUsers]);

  const [formData, setFormData] = useState({
    week: "",
    direct_Hours: "",
    indirect_Hours: "",
    site: "",
    supervisor: "",
    supervisor_Id: "",
    status: "pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "supervisor") {
      const [supervisorName, supervisorId] = value.split(",");
      setFormData((prevFormData) => ({
        ...prevFormData,
        supervisor: supervisorName,
        supervisor_Id: supervisorId,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
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
        refreshLogs();
        closePopup();
      } else {
        console.error("Failed to insert data:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <main className="py-5 px-4 sm:px-6 md:px-10 font-chesna space-y-8">
      <div className="py-6 sm:py-8 px-4 sm:px-5 rounded-xl flex flex-col items-center space-y-8 sm:space-y-10">
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-4 sm:space-y-6"
          >
            {/* Week Input */}
            <div className="flex flex-col space-y-1 w-full sm:w-[75%] md:w-[50%]">
              <label htmlFor="week">Week</label>
              <input
                className="rounded-md px-4 py-2"
                type="week"
                id="week"
                name="week"
                value={formData.week}
                onChange={handleChange}
                required
              />
            </div>

            {/* Direct Hours Input */}
            <div className="flex flex-col space-y-1 w-full sm:w-[75%] md:w-[50%]">
              <label htmlFor="direct_Hours">Direct Hours</label>
              <input
                className="rounded-md px-4 py-2"
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
            <div className="flex flex-col space-y-1 w-full sm:w-[75%] md:w-[50%]">
              <label htmlFor="indirect_Hours">Indirect Hours</label>
              <input
                className="rounded-md px-4 py-2"
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
            <div className="flex flex-col space-y-1 w-full sm:w-[75%] md:w-[50%]">
              <label htmlFor="site">Site</label>
              <input
                className="rounded-md px-4 py-2"
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
            <div className="flex flex-col space-y-1 w-full sm:w-[75%] md:w-[50%]">
              <label htmlFor="supervisor">Supervisor</label>
              <select
                id="supervisor"
                name="supervisor"
                className="rounded-md px-4 py-2"
                value={formData.supervisor + "," + formData.supervisor_Id}
                onChange={handleChange}
                required
              >
                <option value="" hidden>
                  Select Supervisor
                </option>
                {supervisors.map((supervisor) => (
                  <option
                    key={supervisor.id}
                    value={`${supervisor.name},${supervisor.id}`}
                  >
                    {supervisor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-[75%] md:w-[50%]">
              <button
                type="submit"
                style={{
                  background: "#8cbf68",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="px-4 py-2 rounded-md text-white w-full"
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
