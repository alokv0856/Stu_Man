import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({});
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})} />

        <input type="password" placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})} />

        <button>Login</button>
      </form>
    </div>
  );
}