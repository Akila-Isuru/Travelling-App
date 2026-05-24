import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      alert("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed!");
    }
  };

  return (
    <div className="p-10 max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>
      <input
        type="text"
        placeholder="Name"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="bg-green-500 text-white p-2 w-full"
      >
        Sign Up
      </button>
      <p
        onClick={() => navigate("/login")}
        className="text-sm cursor-pointer text-blue-600"
      >
        Already have an account? Login
      </p>
    </div>
  );
};
export default Register;
