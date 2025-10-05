import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const InternLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/intern/auth/login", { email, password });
      localStorage.setItem("internToken", data.token);
      localStorage.setItem("internName", data.intern.name);
      navigate("/intern/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h2 className="text-3xl font-bold">Intern Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-96">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Login</button>
      </form>
      <p>Don't have an account? <Link to="/intern/register" className="text-blue-500">Register</Link></p>
    </div>
  );
};

export default InternLogin;
