import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyCertificate } from "../api/certificateApi";

export default function VerifyCertificate() {
  const params = useParams();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(params.studentId || "");
  const [certificateId, setCertificateId] = useState(params.certificateId || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.studentId && params.certificateId) {
      handleVerify();
    }
  }, []);

  const handleVerify = async () => {
    if (!studentId || !certificateId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await verifyCertificate(studentId, certificateId);
      setResult(res.data);
    } catch (err) {
      setResult({ verified: false });
    } finally {
      setLoading(false);
    }
  };

  // Shared Styles
  const cardStyle = {
    backgroundColor: "#f8fafc",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "16px"
  };

  const labelStyle = {
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#64748b",
    fontWeight: "bold",
    display: "block",
    marginBottom: "2px"
  };

  return (
    <div style={{
      padding: "40px 20px",
      maxWidth: "700px",
      margin: "40px auto",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#1e293b"
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        padding: "40px",
        border: "1px solid #f1f5f9"
      }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🛡️</div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0, color: "#0f172a" }}>
            Verify Authenticity
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px" }}>Secure Blockchain Certificate Verification</p>
        </div>

        {/* INPUT SECTION */}
        {!params.studentId && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Student ID (e.g. STU-123)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outlineColor: "#3b82f6" }}
              />
              <input
                type="text"
                placeholder="Certificate ID"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outlineColor: "#3b82f6" }}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#94a3b8" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              {loading ? "Processing..." : "Verify Now"}
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #3b82f6", borderRadius: "50%", width: "40px", height: "40px", margin: "0 auto", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: "16px", color: "#64748b" }}>Querying Distributed Ledger...</p>
          </div>
        )}

        {/* RESULT SECTION */}
        {result && (
          <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
            {result.verified ? (
              <>
                <div style={{ 
                  backgroundColor: "#f0fdf4", 
                  border: "1px solid #bbf7d0", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  textAlign: "center", 
                  marginBottom: "24px" 
                }}>
                  <h3 style={{ color: "#166534", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span>✅</span> Verified Record Found
                  </h3>
                </div>

                {/* DATA GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  <div style={cardStyle}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "14px" }}>🎓 STUDENT INFORMATION</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                      <div><span style={labelStyle}>Name</span><b>{result.studentName}</b></div>
                      <div><span style={labelStyle}>Course</span><b>{result.courseName}</b></div>
                      <div><span style={labelStyle}>Degree</span><b>{result.degreeType}</b></div>
                      <div><span style={labelStyle}>Academic Year</span><b>{result.academicYear}</b></div>
                    </div>
                  </div>

                  <div style={cardStyle}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "14px" }}>🔐 BLOCKCHAIN PROOF</h4>
                    <div style={{ marginBottom: "10px" }}>
                      <span style={labelStyle}>Transaction Hash</span>
                      <code style={{ fontSize: "11px", wordBreak: "break-all", color: "#2563eb" }}>{result.transactionHash}</code>
                    </div>
                    <div>
                      <span style={labelStyle}>Certificate Hash (SHA-256)</span>
                      <code style={{ fontSize: "11px", wordBreak: "break-all", color: "#2563eb" }}>{result.certificateHash}</code>
                    </div>
                  </div>
                </div>

                <a
                  href={result.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    marginTop: "10px"
                  }}
                >
                  📄 Download Official PDF
                </a>
              </>
            ) : (
              <div style={{ 
                backgroundColor: "#fef2f2", 
                border: "1px solid #fecaca", 
                padding: "24px", 
                borderRadius: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ fontSize: "32px" }}>❌</span>
                <h3 style={{ color: "#991b1b", margin: "10px 0 0 0" }}>Invalid Certificate</h3>
                <p style={{ color: "#b91c1c", fontSize: "14px" }}>This record could not be verified against our blockchain ledger.</p>
              </div>
            )}
            
            <button 
              onClick={() => navigate("/student")}
              style={{ width: "100%", background: "none", border: "none", color: "#64748b", marginTop: "20px", cursor: "pointer", textDecoration: "underline", fontSize: "13px" }}
            >
              Verify another certificate
            </button>
          </div>
        )}

        <div style={{ 
          marginTop: "40px", 
          paddingTop: "20px", 
          borderTop: "1px solid #f1f5f9", 
          fontSize: "12px", 
          color: "#94a3b8", 
          textAlign: "center",
          lineHeight: "1.6"
        }}>
          This is a decentralized verification service. Cryptographic hashes ensure that the 
          certificate data has not been tampered with since issuance.
        </div>
      </div>
    </div>
  );
}