import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageInterns = () => {
  const [interns, setInterns] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");

  const token = localStorage.getItem("adminToken");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchInterns = async () => {
    try {
      const { data } = await axios.get("https://intern-management-system-1.onrender.com/api/interns", config);
      setInterns(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const addIntern = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://intern-management-system-1.onrender.com/api/interns",
        { name, email, password, skills: skills.split(",") },
        config
      );
      setInterns([...interns, data]);
      setName(""); setEmail(""); setPassword(""); setSkills("");
    } catch (error) {
      alert(error.response.data.message || "Error");
    }
  };

  const deleteIntern = async (id) => {
    try {
      await axios.delete(`https://intern-management-system-1.onrender.com/api/interns/${id}`, config);
      setInterns(interns.filter(i => i._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Manage Interns</h2>

      <form onSubmit={addIntern} className="flex flex-col gap-2 mb-5">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded"/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded"/>
        <input type="text" placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Intern</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Skills</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {interns.map(intern => (
            <tr key={intern._id} className="border">
              <td className="p-2 border">{intern.name}</td>
              <td className="p-2 border">{intern.email}</td>
              <td className="p-2 border">{intern.skills.join(", ")}</td>
              <td className="p-2 border">
                <button onClick={() => deleteIntern(intern._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageInterns;
