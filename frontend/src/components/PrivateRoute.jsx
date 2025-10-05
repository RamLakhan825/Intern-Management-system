// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken"); // Check if admin is logged in
  return token ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
