import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [interns, setInterns] = useState([]);
  const [selectedInterns, setSelectedInterns] = useState([]);

  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch interns
  const fetchInterns = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/interns", config);
      setInterns(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/projects", config);
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInterns();
    fetchProjects();
  }, []);

  const addProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/projects",
        { title, description, internIds: selectedInterns },
        config
      );
      setProjects([...projects, data]);
      setTitle(""); setDescription(""); setSelectedInterns([]);
    } catch (error) {
      alert(error.response.data.message || "Error");
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, config);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Manage Projects</h2>

      <form onSubmit={addProject} className="flex flex-col gap-2 mb-5">
        <input type="text" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded"/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded"/>
        <select multiple value={selectedInterns} onChange={e => setSelectedInterns(Array.from(e.target.selectedOptions, option => option.value))} className="border p-2 rounded">
          {interns.map(i => (
            <option key={i._id} value={i._id}>{i.name} ({i.skills.join(", ")})</option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Project</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Interns</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id} className="border">
              <td className="p-2 border">{project.title}</td>
              <td className="p-2 border">{project.description}</td>
              <td className="p-2 border">{project.interns.map(i => i.name).join(", ")}</td>
              <td className="p-2 border">
                <button onClick={() => deleteProject(project._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProjects;
