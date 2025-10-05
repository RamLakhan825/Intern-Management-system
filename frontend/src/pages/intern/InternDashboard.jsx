import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const InternDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [resources, setResources] = useState([]);

  const token = localStorage.getItem("internToken");
  const internId = localStorage.getItem("internId");
  const internName = localStorage.getItem("internName");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/intern/login");
  }, [token, navigate]);

  // Fetch functions
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/intern/tasks", config);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/intern/projects", config);
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExams = async () => {
    try {
      const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/intern/exams", config);
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResources = async () => {
    try {
      const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/intern/resources", config);
      setResources(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchExams();
    fetchResources();
  }, []);

  // Mark task complete
  const markTaskComplete = async (taskId) => {
    try {
      await axios.put(`https://intern-management-system-1.onrender.com/api/intern/tasks/${taskId}/complete`, {}, config);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: "completed" } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Error marking task complete");
    }
  };

  const completionPercentage = tasks.length
    ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-pink-700 text-white p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-10 text-center border-b border-purple-400 pb-3">
            Intern Panel
          </h2>
          <ul className="space-y-4">
            <li>
              <Link to="#" className="block px-4 py-2 rounded-md hover:bg-purple-500 transition-all duration-200">
                📋 Tasks
              </Link>
            </li>
            <li>
              <Link to="#" className="block px-4 py-2 rounded-md hover:bg-purple-500 transition-all duration-200">
                🧩 Projects
              </Link>
            </li>
            <li>
              <Link to="#" className="block px-4 py-2 rounded-md hover:bg-purple-500 transition-all duration-200">
                📝 Exams
              </Link>
            </li>
            <li>
              <Link to="#" className="block px-4 py-2 rounded-md hover:bg-purple-500 transition-all duration-200">
                📚 Resources
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={() => { localStorage.removeItem("internToken"); navigate("/intern/login"); }}
          className="mt-8 bg-red-500 hover:bg-red-600 transition-all py-2 px-4 rounded-md font-semibold"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Welcome, {internName || "Intern"} 👋
        </h1>
        <p className="text-center text-lg font-semibold text-gray-700 mb-8">
          Tasks Completed: {completionPercentage}%
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Tasks */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Tasks</h2>
            {tasks.length === 0 && <p className="text-gray-600 text-center">No tasks assigned</p>}
            <ul className="space-y-3">
              {tasks.map(task => (
                <li key={task._id} className="p-3 bg-white rounded-xl shadow flex flex-col">
                  <h3 className="font-semibold text-blue-800">{task.title}</h3>
                  <p className="text-gray-700">{task.description}</p>
                  <span className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white ${task.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                    {task.status}
                  </span>
                  {task.status !== "completed" && (
                    <button onClick={() => markTaskComplete(task._id)} className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                      Mark Complete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Projects</h2>
            {projects.length === 0 && <p className="text-gray-600 text-center">No projects assigned</p>}
            <ul className="space-y-3">
              {projects.map(project => (
                <li key={project._id} className="p-3 bg-white rounded-xl shadow">
                  <h3 className="font-semibold text-purple-800">{project.title}</h3>
                  <p className="text-gray-700">{project.description}</p>
                  <p className="text-gray-600 mt-1 text-sm">Team: {project.interns.map(i => i.name).join(", ")}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Exams */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Exams</h2>
            {exams.length === 0 && <p className="text-gray-600 text-center">No exams assigned</p>}
            <ul className="space-y-3">
              {exams.map(exam => {
                const result = exam.scores?.find(s => s.intern?.toString() === internId);
                console.log("result", exam, internId);
                return (
                  <li key={exam._id} className="p-3 bg-white rounded-xl shadow flex flex-col">
                    <h3 className="font-semibold text-green-800">{exam.title}</h3>
                    <p className="text-gray-700">Topic: {exam.topic}</p>
                    {result ? (
                      <p className="mt-2 font-semibold text-green-700">✅ Score: {result.score} / {exam.questions?.length || 0}</p>
                    ) : (
                      <button onClick={() => navigate(`/intern/exam/${exam._id}`)} className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                        Take Exam
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-pink-700 mb-4 text-center">Resources</h2>
            {resources.length === 0 && <p className="text-gray-600 text-center">No resources assigned</p>}
            <ul className="space-y-3">
              {resources.map(res => (
                <li key={res._id} className="p-3 bg-white rounded-xl shadow flex flex-col">
                  <h3 className="font-semibold text-pink-800">{res.title}</h3>
                  {res.description && <p className="text-gray-700">{res.description}</p>}
                  {res.link && <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-1">Open Link</a>}
                  {res.fileUrl && <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline mt-1">Download File</a>}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
    </div>
  );
};

export default InternDashboard;
