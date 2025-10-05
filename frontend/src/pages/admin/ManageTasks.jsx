import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch interns
  const fetchInterns = async () => {
    const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/interns", config);
    setInterns(data);
  };

  // Fetch projects
  const fetchProjects = async () => {
    const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/projects", config);
    setProjects(data);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/tasks", config);
    setTasks(data);
  };

  useEffect(() => {
    fetchInterns();
    fetchProjects();
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const internIds = assignedTo.map(i => i.value);
      const { data } = await axios.post(
        "https://intern-management-system-1.onrender.com/api/tasks",
        { title, description, assignedTo: internIds, dueDate, projectId: selectedProject },
        config
      );
      setTasks([...tasks, data]);
      setTitle(""); setDescription(""); setAssignedTo([]); setDueDate(""); setSelectedProject("");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`https://intern-management-system-1.onrender.com/api/tasks/${id}`, config);
    setTasks(tasks.filter(t => t._id !== id));
  };

  const internOptions = interns.map(i => ({ value: i._id, label: `${i.name} (${i.skills.join(", ")})` }));
  const projectOptions = projects.map(p => ({ value: p._id, label: p.title }));

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Manage Tasks</h2>

      <form onSubmit={addTask} className="flex flex-col gap-2 mb-5">
        <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded"/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded"/>
        
        {/* Assign Interns */}
        <Select options={internOptions} value={assignedTo} onChange={setAssignedTo} isMulti placeholder="Assign Interns" />

        {/* Assign Project */}
        <Select options={projectOptions} value={projectOptions.find(p => p.value === selectedProject)} onChange={e => setSelectedProject(e.value)} placeholder="Select Project" />

        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-yellow-500 text-white p-2 rounded">Add Task</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Assigned To</th>
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id} className="border">
              <td className="p-2 border">{task.title}</td>
              <td className="p-2 border">{task.description}</td>
              <td className="p-2 border">{task.assignedTo.map(i => i.name).join(", ")}</td>
              <td className="p-2 border">{projects.find(p => p.tasks?.includes(task._id))?.title || "-"}</td>
              <td className="p-2 border">{new Date(task.dueDate).toLocaleDateString()}</td>
              <td className="p-2 border">{task.status}</td>
              <td className="p-2 border">
                <button onClick={() => deleteTask(task._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTasks;
