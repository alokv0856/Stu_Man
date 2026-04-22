import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const nav = useNavigate();

  const [course, setCourse] = useState("");
  const [password, setPassword] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const updateCourse = async () => {
    try {
      await API.put("/update-course", { course });
      alert("Course updated");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  const updatePassword = async () => {
    try {
      await API.put("/update-password", password);
      alert("Password updated");
    } catch (err) {
      alert(err.response?.data?.msg || "Wrong old password");
    }
  };

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Course: {user?.course}</p>

      <hr />

      <h3>Update Course</h3>
      <input placeholder="New Course"
        onChange={(e)=>setCourse(e.target.value)} />
      <button onClick={updateCourse}>Update Course</button>

      <hr />

      <h3>Update Password</h3>
      <input type="password" placeholder="Old Password"
        onChange={(e)=>setPassword({...password,oldPassword:e.target.value})} />

      <input type="password" placeholder="New Password"
        onChange={(e)=>setPassword({...password,newPassword:e.target.value})} />

      <button onClick={updatePassword}>Update Password</button>

      <hr />

      <button onClick={logout}>Logout</button>
    </div>
  );
}