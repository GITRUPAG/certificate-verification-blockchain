import React, { useEffect, useState } from "react";
import { fetchStudentCertificates } from "../api/certificateApi";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";

const styles = {
  container: { maxWidth: "1100px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" },
  header: { 
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    padding: "40px", 
    borderRadius: "16px", 
    color: "#f8fafc", 
    marginBottom: "40px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
    gap: "25px" 
  },
  card: { 
    background: "#ffffff", 
    border: "1px solid #e2e8f0", 
    borderRadius: "14px", 
    padding: "24px", 
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    cursor: "default",
    height: "100%"
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.07)",
    borderColor: "#10b981" 
  },
  badge: {
    background: "#dcfce7", 
    color: "#065f46",
    padding: "6px 14px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    display: "inline-block",
    marginBottom: "20px"
  },
  idLabel: { fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", fontWeight: "600" },
  infoValue: { fontSize: "1rem", color: "#1e293b", marginBottom: "12px", fontWeight: "500" },
  buttonGroup: { display: "flex", gap: "12px", marginTop: "auto", paddingTop: "24px" },
  secondaryBtn: { 
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
    color: "#475569",
    transition: "all 0.2s"
  },
  primaryBtn: { 
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#10b981", 
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
    transition: "all 0.2s"
  },
  qrWrapper: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10px"
  }
};

export default function StudentDashboard() {
  const studentId = localStorage.getItem("studentId");
  const studentName = localStorage.getItem("studentName");

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const res = await fetchStudentCertificates(studentId);
        
        // ✅ CORRECTED LOGIC: Direct Array Check
        // Based on Postman, res.data IS the array [ {...}, {...} ]
        if (Array.isArray(res.data)) {
          setCertificates(res.data);
        } else {
          setCertificates([]); 
        }
      } catch (err) {
        console.error("Cert fetch error", err);
        setCertificates([]); 
      } finally {
        setLoading(false);
      }
    };
    if (studentId) loadCertificates();
  }, [studentId]);

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", paddingBottom: "60px" }}>
      <Navbar />

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: "800" }}>{studentName || "Welcome"}</h1>
              <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "1.1rem" }}>
                Student ID: <span style={{ color: "#f8fafc" }}>{studentId}</span>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{certificates.length}</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase" }}>Credentials Issued</div>
            </div>
          </div>
        </header>

        <section>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "10px" }}>
             <div style={{ width: "4px", height: "24px", background: "#10b981", borderRadius: "2px" }}></div>
             <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1.4rem" }}>Verified Certificates</h3>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px", color: "#64748b" }}>Loading secure records...</div>
          ) : certificates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "2px dashed #cbd5e1" }}>
              <p style={{ color: "#64748b", fontSize: "1.1rem" }}>No certificates found for this ID.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {certificates.map((cert) => {
                const BASE_URL = "http://192.168.0.103:3000";
                const verifyUrl = `${window.location.origin}/verify/${cert.studentId}/${cert.certificateId}`;
                const isHovered = hoveredId === cert.certificateId;

                return (
                  <div 
                    key={cert.certificateId} 
                    style={{...styles.card, ...(isHovered ? styles.cardHover : {})}}
                    onMouseEnter={() => setHoveredId(cert.certificateId)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div>
                      <span style={styles.badge}>✓ Authenticated</span>
                      
                      <div style={styles.idLabel}>Credential ID</div>
                      <div style={styles.infoValue}>{cert.certificateId}</div>

                      <div style={styles.idLabel}>Certificate Name</div>
                      <div style={{ 
                          fontSize: "1.1rem", 
                          color: "#0f172a", 
                          marginBottom: "12px", 
                          fontWeight: "800",
                          lineHeight: "1.3",
                          textTransform: "capitalize"
                      }}>
                        {/* Cleanup logic for filename strings */}
                        {(cert.certificateName || "Course Certificate")
                          .replace(/_/g, ' ')
                          .replace('.pdf', '')}
                      </div>
                      
                      <div style={styles.idLabel}>Date of Issue</div>
                      <div style={styles.infoValue}>
                        {new Date(cert.issuedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>

                    <div style={styles.qrWrapper}>
                      <QRCodeCanvas value={verifyUrl} size={120} qrStyle="dots" eyeRadius={8} />
                      <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "12px", fontWeight: "500" }}>Secure Verification QR</p>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button 
                        style={styles.secondaryBtn}
                        onClick={() => {
                          navigator.clipboard.writeText(verifyUrl);
                          alert("Link copied to clipboard!");
                        }}
                      >
                        Copy Link
                      </button>
                      <button 
                        style={styles.primaryBtn}
                        onClick={() => window.open(verifyUrl, "_blank")}
                      >
                        Verify Record
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}