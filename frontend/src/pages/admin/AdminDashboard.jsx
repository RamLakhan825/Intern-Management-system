import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  // Fetch resources
  const fetchResources = async () => {
    try {
      const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/admin/resources", config);
      setResources(data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Add resource
  const handleAddResource = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    if (file) formData.append("file", file);

    try {
      await axios.post("https://intern-management-system-1.onrender.com/api/admin/resources", formData, {
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setDescription("");
      setLink("");
      setFile(null);
      fetchResources();
    } catch (err) {
      console.error("Error adding resource:", err);
      alert("Failed to add resource");
    }
  };

  // Delete resource
  const handleDeleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await axios.delete(`https://intern-management-system-1.onrender.com/api/admin/resources/${id}`, config);
      fetchResources();
    } catch (err) {
      console.error("Error deleting resource:", err);
      alert("Failed to delete resource");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-10 text-center border-b border-blue-400 pb-3">
            Admin Panel
          </h2>
          <ul className="space-y-4">
            <li>
              <Link to="/admin/interns" className="block px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200">
                👥 Manage Interns
              </Link>
            </li>
            <li>
              <Link to="/admin/projects" className="block px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200">
                🧩 Manage Projects
              </Link>
            </li>
            <li>
              <Link to="/admin/tasks" className="block px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200">
                ✅ Manage Tasks
              </Link>
            </li>
            <li>
              <Link to="/admin/exams" className="block px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200">
                📝 Conduct Exams
              </Link>
            </li>
            <li>
              <Link to="#resources" className="block px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200">
                📚 Manage Resources
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 hover:bg-red-600 transition-all py-2 px-4 rounded-md font-semibold"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome, Admin 👋</h1>
          <p className="text-gray-600 mb-6">Manage all your interns, projects, tasks, exams, and resources from one place.</p>

          {/* Resources Section */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h2 className="text-3xl font-bold text-pink-700 mb-5 text-center">Resources</h2>

            {/* Add Resource Form */}
            <form onSubmit={handleAddResource} className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="External Link (optional)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                Add Resource
              </button>
            </form>

            {/* Resource List */}
            {resources.length === 0 && <p className="text-gray-600 text-center">No resources assigned</p>}
            <ul className="space-y-4">
              {resources.map((res) => (
                <li key={res._id} className="p-4 border-l-4 border-pink-500 bg-white rounded-xl shadow hover:scale-105 transition transform duration-200 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-pink-800 text-lg">{res.title}</h3>
                    {res.description && <p className="text-gray-700">{res.description}</p>}
                    {res.link && <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">Open Link</a>}
                    {res.fileUrl && <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline mt-2 block">Download File</a>}
                  </div>
                  <button
                    onClick={() => handleDeleteResource(res._id)}
                    className="text-red-600 font-bold hover:text-red-800 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
