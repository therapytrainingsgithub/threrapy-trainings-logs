import React, { useState, useEffect } from "react";

interface RequestProps {
  user: Record<string, React.ReactNode>;
  closePopup: () => void;
  refresh: () => void;
}

const AdminRequest: React.FC<RequestProps> = ({
  user,
  closePopup,
  refresh,
}) => {
  const [currentUser, setCurrentUser] = useState<Record<string, any> | null>(
    null
  );
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      if (user.role) {
        setRole(user.role as string);
      }
    }
  }, [user]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    setRole(newRole);
  };

  const handleSubmit = async () => {
    if (currentUser) {
      try {
        const response = await fetch(
          `/api/userProfile/update/${currentUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role }),
          }
        );
        const result = await response.json();
        console.log("Update result:", result); // Debugging log
        if (response.ok) {
          refresh();
          closePopup();
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">User Details</h3>
      <div className="space-y-2">
        {currentUser && (
          <>
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{currentUser?.Name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <select
                value={role}
                onChange={handleStatusChange}
                className="border p-1 rounded"
              >
                <option value="" disabled>
                  Select a status
                </option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
            <div className="w-full">
              <button
                onClick={handleSubmit}
                style={{
                  background: "#8cbf68",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="px-4 py-2 rounded-md text-white w-full"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRequest;
