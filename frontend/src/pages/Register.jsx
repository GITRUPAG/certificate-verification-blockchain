import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
  },
  box: {
    width: "450px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  button: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
    cursor: "pointer",
  },
  success: { color: "#27ae60", marginTop: "15px" },
  error: { color: "#e74c3c", marginTop: "15px" },
  link: {
    color: "#3498db",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setMessage("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Student Registration</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Student Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={handleRegister} style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

        {message && (
          <p style={message.includes("successful") ? styles.success : styles.error}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
