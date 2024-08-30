import React, { useState } from "react";

const NewClinicalLog = () => {
  const [formData, setFormData] = useState({
    week: "",
    directHours: "",
    indirectHours: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle the form submission logic here
  };

  return (
    <main className="py-5 px-10 font-chesna space-y-10">
      {/* form */}
      <div
        className="py-8 px-5 rounded-xl flex flex-col items-center space-y-10"
      >

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
              <label htmlFor="directHours">Direct Hours</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="directHours"
                name="directHours"
                placeholder="Enter direct hours"
                value={formData.directHours}
                onChange={handleChange}
                required
              />
            </div>

            {/* Indirect Hours Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="indirectHours">Indirect Hours</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="indirectHours"
                name="indirectHours"
                placeholder="Enter indirect hours"
                value={formData.indirectHours}
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
