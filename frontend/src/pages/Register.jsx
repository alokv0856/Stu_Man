import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: ""
  });

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED"); // 🔥 DEBUG

    try {
      await API.post("/register", form);
      alert("Registered Successfully");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      {/* ✅ IMPORTANT: form onSubmit */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <input
          placeholder="Course"
          value={form.course}
          onChange={(e)=>setForm({...form,course:e.target.value})}
        />

        {/* ✅ IMPORTANT: type="submit" */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}