import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    maxWidth: "500px",
    margin: "80px auto",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    textAlign: "center",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#64748b",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  },
  verifyBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#10b981",
    color: "white",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.2s, background 0.2s",
  }
};

export default function PublicVerify() {
  const [rollNo, setRollNo] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (!rollNo || !credentialId) {
      alert("Please enter both Student ID and Credential ID");
      return;
    }
    // Redirects to your existing verification route
    navigate(`/verify/${rollNo}/${credentialId}`);
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🛡️</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>
          Verify Credential
        </h1>
        <p style={{ color: "#64748b", marginBottom: "30px", lineHeight: "1.5" }}>
          Enter the official details below to validate the authenticity of the issued certificate.
        </p>

        <form onSubmit={handleVerify}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Student Roll Number / ID</label>
            <input
              style={styles.input}
              placeholder="e.g. STU12345"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#10b981")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Credential ID</label>
            <input
              style={styles.input}
              placeholder="Enter unique certificate ID"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#10b981")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <button 
            type="submit" 
            style={styles.verifyBtn}
            onMouseOver={(e) => e.target.style.background = "#059669"}
            onMouseOut={(e) => e.target.style.background = "#10b981"}
          >
            Verify Authenticity
          </button>
        </form>
        
        <p style={{ marginTop: "24px", fontSize: "0.8rem", color: "#94a3b8" }}>
          Secured by Blockchain Technology
        </p>
      </div>
    </div>
  );
}