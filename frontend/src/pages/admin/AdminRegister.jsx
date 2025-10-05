import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://intern-management-system-1.onrender.com/api/admin/register", { name, email, password });
      alert("Admin Registered Successfully");
      navigate("/admin/login"); // Redirect to login after successful registration
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-5 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
      <p className="mt-3 text-sm">
        Already have an account?{" "}
        <Link to="/admin/login" className="text-green-500 underline">Login</Link>
      </p>
    </div>
  );
};

export default AdminRegister;
