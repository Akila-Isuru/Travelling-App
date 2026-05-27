import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getMyDetails } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      localStorage.setItem("ACCESS_TOKEN", res.data.accessToken);
      localStorage.setItem("REFRESH", res.data.refreshToken);

      const userRes = await getMyDetails();
      setUser(userRes.data);
      navigate("/");
    } catch (err) {
      alert("Login Failed!");
    }
  };

 
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };
  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/facebook";
  };

  return (
    <div className="p-10 max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
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
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 w-full"
      >
        Log In
      </button>
     
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white p-2 w-full rounded font-semibold"
      >
        Sign in with Google
      </button>
      <button
        onClick={handleFacebookLogin}
        className="bg-blue-600 text-white p-2 w-full rounded font-semibold"
      >
        Sign in with Facebook
      </button>
      <p
        onClick={() => navigate("/register")}
        className="text-sm cursor-pointer text-blue-600"
      >
        Don't have an account? Register
      </p>
    </div>
  );
};
export default Login;
