import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://intern-management-system-1.onrender.com/api/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", data.token);
      alert("Login Successful ✅");
      navigate("/admin/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      alert(error.response?.data?.message || "Error logging in");
    }
  };

  const handleUserLogin = () => {
    navigate("/"); // redirect to user login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔐 Admin Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-200"
          >
            Login as Admin
          </button>
        </form>

        {/* Link to Register */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an admin account?{" "}
          <Link to="/admin/register" className="text-blue-500 font-medium hover:underline">
            Register here
          </Link>
        </p>

        {/* Divider */}
        <div className="my-4 flex items-center justify-center">
          <div className="h-px bg-gray-300 w-1/3"></div>
          <span className="text-gray-500 text-sm mx-2">or</span>
          <div className="h-px bg-gray-300 w-1/3"></div>
        </div>

        {/* User Login Option */}
        <button
          onClick={handleUserLogin}
          className="w-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold py-2 rounded-md transition-all duration-200"
        >
          Login as User (Intern)
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
