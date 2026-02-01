import React, { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login-animation.json";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    input: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
    },
    twoColumnContainer: {
      display: "flex",
      borderRadius: "30px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      backgroundColor: "#ffffff",
      overflow: "hidden",
      width: "1000px",
      maxWidth: "95%",
      minHeight: "600px",
      animation: "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    imagePane: {
      flex: 1.2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      padding: "40px",
      borderRight: "1px solid #f1f5f9",
      "@media (max-width: 768px)": { display: "none" }, // Hide on mobile
    },
    formPane: {
      flex: 1,
      padding: "60px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "left",
    },
    brandBadge: {
      display: "inline-block",
      padding: "6px 14px",
      background: "#eef2ff",
      color: "#4f46e5",
      borderRadius: "100px",
      fontSize: "12px",
      fontWeight: "800",
      letterSpacing: "0.5px",
      marginBottom: "20px",
      width: "fit-content",
    },
    title: {
      color: "#0f172a",
      fontSize: "32px",
      fontWeight: "900",
      margin: "0 0 10px 0",
      letterSpacing: "-1px",
    },
    subtitle: {
      color: "#64748b",
      marginBottom: "35px",
      fontSize: "16px",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "700",
      color: "#475569",
      marginBottom: "8px",
      paddingLeft: "4px",
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: "15px 18px",
      backgroundColor: "#f1f5f9",
      border: "2px solid transparent",
      borderRadius: "14px",
      fontSize: "16px",
      color: "#1e293b",
      outline: "none",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
    },
    eyeBtn: {
      position: "absolute",
      right: "15px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#94a3b8",
      fontSize: "18px",
    },
    button: {
      width: "100%",
      backgroundColor: "#4f46e5",
      color: "white",
      padding: "18px",
      marginTop: "10px",
      border: "none",
      borderRadius: "14px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)",
    },
    link: {
      color: "#4f46e5",
      cursor: "pointer",
      fontWeight: "700",
      marginLeft: "5px",
    },
  };

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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("roles", JSON.stringify(res.data.roles));
      if (res.data.studentId) {
        localStorage.setItem("studentId", res.data.studentId);
        localStorage.setItem("studentName", res.data.studentName);
      }
      setMessage("Identity confirmed. Accessing Vault...");
      setTimeout(() => {
        if (res.data.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid credentials provided");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: #4f46e5 !important; background-color: #fff !important; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        button:hover { background-color: #4338ca !important; transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.4); }
        button:active { transform: translateY(0); }
      `}</style>

      <div style={styles.twoColumnContainer}>
        <div style={styles.imagePane}>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <Lottie animationData={loginAnimation} loop />
          </div>
          <h3 style={{ color: "#0f172a", marginTop: "30px", fontWeight: "800" }}>Secured by CertiChain</h3>
          <p style={{ color: "#64748b", textAlign: "center", fontSize: "14px" }}>
            Your academic achievements, <br />permanently safe on the ledger.
          </p>
        </div>

        <div style={styles.formPane}>
          <div style={styles.brandBadge}>SECURE ACCESS</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to manage your credentials.</p>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Institutional Email</label>
            <input
              type="text"
              name="input"
              placeholder="Email or Username"
              value={form.input}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Security Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <button onClick={handleLogin} style={styles.button} disabled={loading}>
            {loading ? "Decrypting..." : "Sign In to Vault"}
          </button>

          <p style={{ marginTop: "25px", color: "#64748b", fontSize: "14px", textAlign: "center" }}>
            New to CertiChain?
            <span style={styles.link} onClick={() => navigate("/register")}>
              Create Identity
            </span>
          </p>

          {message && (
            <div style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "600",
              backgroundColor: message.includes("confirmed") ? "#f0fdf4" : "#fef2f2",
              color: message.includes("confirmed") ? "#16a34a" : "#dc2626",
              border: `1px solid ${message.includes("confirmed") ? "#bbf7d0" : "#fecaca"}`
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}