import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [interns, setInterns] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);

  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch interns
  const fetchInterns = async () => {
    const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/interns", config);
    setInterns(data);
  };

  const fetchExams = async () => {
    const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/exams", config);
    setExams(data);
  };

  useEffect(() => {
    fetchInterns();
    fetchExams();
  }, []);

  const createExam = async (e) => {
    e.preventDefault();
    try {
      const internIds = assignedTo.map(i => i.value);
      const { data } = await axios.post(
        "https://intern-management-system-1.onrender.com/api/exams",
        { title, topic, internIds },
        config
      );
      setExams([...exams, data]);
      setTitle(""); setTopic(""); setAssignedTo([]);
    } catch (error) {
      console.log(error);
      alert("Error creating exam");
    }
  };

  const internOptions = interns.map(i => ({ value: i._id, label: i.name }));

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Manage Exams</h2>

      <form onSubmit={createExam} className="flex flex-col gap-2 mb-5">
        <input type="text" placeholder="Exam Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded"/>
        <input type="text" placeholder="Topic for AI Questions" value={topic} onChange={e => setTopic(e.target.value)} className="border p-2 rounded"/>
        <Select
          options={internOptions}
          value={assignedTo}
          onChange={setAssignedTo}
          isMulti
          placeholder="Assign Interns"
        />
        <button type="submit" className="bg-purple-500 text-white p-2 rounded">Create Exam</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Topic</th>
            <th className="p-2 border">Assigned Interns</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam._id} className="border">
              <td className="p-2 border">{exam.title}</td>
              <td className="p-2 border">{exam.topic}</td>
              <td className="p-2 border">{exam.assignedTo.map(i => i.name).join(", ")}</td>
              <td className="p-2 border">{new Date(exam.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageExams;
