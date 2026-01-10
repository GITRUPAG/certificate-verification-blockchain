import React, { useEffect, useState } from "react";
import { fetchStudentCertificates } from "../api/certificateApi";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";

const styles = {
  container: { 
    maxWidth: "1200px", 
    margin: "0 auto", 
    padding: "40px 20px", 
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif" 
  },
  header: { 
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "60px 40px", 
    borderRadius: "24px", 
    color: "#ffffff", 
    marginBottom: "50px",
    position: "relative",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", 
    gap: "30px" 
  },
  card: { 
    background: "#ffffff", 
    borderRadius: "24px", 
    padding: "32px", 
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    height: "100%",
    boxSizing: "border-box",
    position: "relative"
  },
  label: { 
    fontSize: "0.7rem", 
    color: "#94a3b8", 
    textTransform: "uppercase", 
    fontWeight: "700",
    letterSpacing: "0.05em",
    marginBottom: "6px"
  },
  idBox: {
    background: "#f8fafc",
    padding: "12px 16px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    marginBottom: "20px"
  },
  credentialId: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "0.8rem",
    color: "#475569",
    fontWeight: "600",
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#1e293b",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "20px"
  },
  qrWrapper: {
    background: "#f1f5f9",
    padding: "24px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px 0 24px 0"
  },
  primaryBtn: { 
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#10b981", 
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.9rem",
    transition: "all 0.2s",
    textAlign: "center"
  },
  secondaryBtn: { 
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    color: "#475569",
    fontSize: "0.9rem",
    transition: "all 0.2s",
    textAlign: "center"
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
        setCertificates(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) loadCertificates();
  }, [studentId]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" }}>
      <Navbar />

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2.8rem", fontWeight: "850", letterSpacing: "-1px" }}>
                {studentName || "Scholar Profile"}
              </h1>
              <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "1.1rem" }}>
                Student ID: <span style={{ color: "#10b981", fontWeight: "700" }}>{studentId}</span>
              </p>
            </div>
            <div style={{ textAlign: "right", background: "rgba(255,255,255,0.05)", padding: "15px 25px", borderRadius: "16px" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "800", lineHeight: 1 }}>{certificates.length}</div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginTop: "5px", fontWeight: "700" }}>Credentials</div>
            </div>
          </div>
        </header>

        <section>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "35px", gap: "12px" }}>
            <div style={{ width: "6px", height: "24px", background: "#10b981", borderRadius: "3px" }}></div>
            <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "800", color: "#0f172a" }}>Verified Achievements</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px", color: "#64748b", fontWeight: "500" }}>
              Syncing with digital ledger...
            </div>
          ) : (
            <div style={styles.grid}>
              {certificates.map((cert) => {
                const directVerifyUrl = `${window.location.origin}/verify/${cert.studentId}/${cert.certificateId}`;
                const publicPortalUrl = `${window.location.origin}/public-verify`;
                
                const formattedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                });
                
                return (
                  <div 
                    key={cert.certificateId} 
                    style={{
                      ...styles.card,
                      ...(hoveredId === cert.certificateId ? { transform: "translateY(-12px)", borderColor: "#10b981", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" } : {})
                    }}
                    onMouseEnter={() => setHoveredId(cert.certificateId)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={{ marginBottom: "20px" }}>
                      <span style={{ background: "#f0fdf4", color: "#15803d", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "800", border: "1px solid #dcfce7" }}>
                        ✓ VERIFIED RECORD
                      </span>
                    </div>

                    <div style={styles.label}>Certificate Name</div>
                    <div style={{ fontSize: "1.4rem", color: "#0f172a", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>
                      {cert.certificateName.replace(/_/g, ' ').replace('.pdf', '')}
                    </div>

                    <div style={styles.label}>Date of Issue</div>
                    <div style={styles.dateRow}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {formattedDate}
                    </div>

                    <div style={styles.label}>Credential ID</div>
                    <div style={styles.idBox}>
                      <span style={styles.credentialId}>{cert.certificateId}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(cert.certificateId);
                          alert("Credential ID copied!");
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                    </div>

                    <div style={styles.qrWrapper}>
                      <QRCodeCanvas value={directVerifyUrl} size={140} qrStyle="dots" eyeRadius={10} fgColor="#0f172a" />
                      <p style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "16px", fontWeight: "700", letterSpacing: "1px" }}>SCAN TO VALIDATE</p>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                      <button 
                        style={styles.secondaryBtn} 
                        onClick={() => window.open(directVerifyUrl, "_blank")}
                      >
                        Verify Record
                      </button>
                      <button 
                        style={styles.primaryBtn}
                        onClick={() => {
                          navigator.clipboard.writeText(publicPortalUrl);
                          alert("Verification portal link copied! Shared parties will need your Roll No and Credential ID.");
                        }}
                      >
                        Share Portal
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