import React, { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login-animation.json";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
  },
  twoColumnContainer: {
    display: "flex",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    width: "850px",
    maxWidth: "90%",
    minHeight: "500px",
  },
  imagePane: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f0fa",
    padding: "20px",
  },
  formPane: {
    flex: 1,
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "30px",
    fontSize: "28px",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    margin: "12px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    backgroundColor: "#3498db",
    color: "white",
    padding: "16px",
    marginTop: "20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: { color: "#27ae60", marginTop: "15px" },
  error: { color: "#e74c3c", marginTop: "15px" },
  link: {
    color: "#3498db",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "5px",
  },
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    input: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.input || !form.password) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form);

      // Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("roles", JSON.stringify(res.data.roles));

      if (res.data.studentId) {
        localStorage.setItem("studentId", res.data.studentId);
        localStorage.setItem("studentName", res.data.studentName);
      }

      setMessage("Login successful!");

      // 🔥 ROLE BASED REDIRECT
      setTimeout(() => {
        if (res.data.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.twoColumnContainer}>
        <div style={styles.imagePane}>
          <Lottie animationData={loginAnimation} loop />
        </div>

        <div style={styles.formPane}>
          <h2 style={styles.title}>Certificate Verification Login</h2>

          <input
            type="text"
            name="input"
            placeholder="Username or Email"
            value={form.input}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button onClick={handleLogin} style={styles.button} disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>

          <p style={{ marginTop: "15px" }}>
            Don’t have an account?
            <span style={styles.link} onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

          {message && (
            <p style={message.includes("successful") ? styles.success : styles.error}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
