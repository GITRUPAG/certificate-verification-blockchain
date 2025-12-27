import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    backgroundColor: "#1e293b", 
    color: "#f8fafc",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  left: {
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    background: "linear-gradient(to right, #ffffff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userInfo: {
    textAlign: "right",
    paddingRight: "15px",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  },
  username: {
    display: "block",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
  },
  roleBadge: {
    fontSize: "11px",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#10b981", 
    marginTop: "2px",
  },
  logoutButton: {
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  
  logoutHover: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
    color: "white",
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const username = localStorage.getItem("username");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  const roleLabel = roles.includes("ROLE_ADMIN") ? "Administrator" : "Student";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left} onClick={() => navigate("/")}>
        CertiChain<span style={{color: "#10b981"}}>.</span>
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo}>
          <span style={styles.username}>{username}</span>
          <div style={styles.roleBadge}>{roleLabel}</div>
        </div>
        
        <button 
          onClick={logout} 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...styles.logoutButton,
            ...(isHovered ? styles.logoutHover : {})
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}