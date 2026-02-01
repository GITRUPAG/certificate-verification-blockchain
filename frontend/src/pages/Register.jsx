import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle State

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: "20px",
    },
    box: {
      width: "100%",
      maxWidth: "440px",
      padding: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "28px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      textAlign: "center",
      animation: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    brandBadge: {
      display: "inline-block",
      padding: "8px 16px",
      background: "#eef2ff",
      color: "#4f46e5",
      borderRadius: "100px",
      fontSize: "12px",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "16px",
    },
    title: {
      fontSize: "30px",
      fontWeight: "900",
      color: "#0f172a",
      margin: "0 0 8px 0",
      letterSpacing: "-0.8px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "15px",
      marginBottom: "32px",
      lineHeight: "1.5",
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "18px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "700",
      color: "#334155",
      marginBottom: "8px",
      display: "block",
      paddingLeft: "4px",
    },
    inputContainer: {
      position: "relative", // Needed to absolute position the eye icon
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: "15px 18px",
      paddingRight: "50px", // Extra space for the eye icon
      backgroundColor: "#f1f5f9",
      border: "2px solid transparent",
      borderRadius: "14px",
      fontSize: "15px",
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
      fontSize: "18px",
      color: "#64748b",
      padding: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
    },
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#4f46e5",
      color: "#fff",
      border: "none",
      borderRadius: "14px",
      fontSize: "16px",
      fontWeight: "700",
      marginTop: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)",
    },
    linkContainer: {
      marginTop: "24px",
      fontSize: "14px",
      color: "#64748b",
    },
    link: {
      color: "#4f46e5",
      cursor: "pointer",
      fontWeight: "700",
      textDecoration: "none",
      marginLeft: "5px",
    },
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setMessage("Please fill in all security fields");
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      setMessage("Account secured! Redirecting to CertiChain Vault...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: #4f46e5 !important; background-color: #fff !important; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        button:hover { background-color: #4338ca !important; transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.4); }
        .eye-btn:hover { color: #4f46e5 !important; }
      `}</style>

      <div style={styles.box}>
        <div style={styles.brandBadge}>CertiChain v1.0</div>
        <h2 style={styles.title}>Create Identity</h2>
        <p style={styles.subtitle}>Secure your academic credentials on the blockchain.</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            name="username"
            placeholder="John Doe"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Institutional Email</label>
          <input
            name="email"
            type="email"
            placeholder="name@university.edu"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Security Password</label>
          <div style={styles.inputContainer}>
            <input
              name="password"
              type={showPassword ? "text" : "password"} // Logic to toggle visibility
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
            <button
              type="button"
              className="eye-btn"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"} {/* Change icon based on state */}
            </button>
          </div>
        </div>

        <button onClick={handleRegister} style={styles.button} disabled={loading}>
          {loading ? "Securing Data..." : "Register Account"}
        </button>

        <div style={styles.linkContainer}>
          Already have an account?
          <span style={styles.link} onClick={() => navigate("/login")}>
            Sign In
          </span>
        </div>

        {message && (
          <p style={{
            marginTop: "20px",
            fontSize: "14px",
            fontWeight: "600",
            color: message.includes("secured") ? "#059669" : "#e11d48",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: message.includes("secured") ? "#ecfdf5" : "#fff1f2"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}