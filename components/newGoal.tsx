import React, { useState } from "react";

const NewGoal = () => {
  const [formData, setFormData] = useState({
    clinicalHoursGoal: "",
    supervisionHoursGoal: "",
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
            {/* Direct Hours Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="clinicalHoursGoal">Clinical Hours Goal</label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="clinicalHoursGoal"
                name="clinicalHoursGoal"
                placeholder="Enter Clinical Goal"
                value={formData.clinicalHoursGoal}
                onChange={handleChange}
                required
              />
            </div>

            {/* Indirect Hours Input */}
            <div className="flex flex-col space-y-1 w-[50%]">
              <label htmlFor="supervisionHoursGoal">
                Supervision Hours Goal
              </label>
              <input
                className="rounded-md px-5 py-2"
                type="text"
                id="supervisionHoursGoal"
                name="supervisionHoursGoal"
                placeholder="Enter Supervision Goal"
                value={formData.supervisionHoursGoal}
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

export default NewGoal;
