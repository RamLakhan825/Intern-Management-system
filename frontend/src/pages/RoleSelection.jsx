import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleAdmin = () => {
    navigate("/admin/login");
  };

  const handleIntern = () => {
    navigate("/intern/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <h1 className="text-4xl font-bold">Welcome to Internship Portal</h1>
      <p className="text-lg text-gray-600">Please select your role to continue</p>
      
      <div className="flex gap-10">
        <button onClick={handleAdmin} className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600">
          Admin
        </button>
        <button onClick={handleIntern} className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600">
          Intern
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
