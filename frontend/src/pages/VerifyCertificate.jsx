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
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (params.studentId && params.certificateId) {
      handleVerify();
    }
  }, []);

  const handleVerify = async () => {
    if (!studentId || !certificateId) return;
    
    setLoading(true);
    setResult(null);
    setStage(1);

    try {
      const res = await verifyCertificate(studentId, certificateId);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStage(2);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStage(3);
      await new Promise(resolve => setTimeout(resolve, 800));
      setResult(res.data);
      setStage(4);
    } catch (err) {
      setResult({ verified: false });
      setStage(4);
    } finally {
      setLoading(false);
    }
  };

  // --- ENHANCED STYLES ---
  const containerStyle = {
    padding: "60px 20px",
    maxWidth: "750px",
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#0f172a",
    minHeight: "100vh",
    background: "radial-gradient(at top left, #f8fafc, #f1f5f9)"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #f1f5f9",
    marginBottom: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease"
  };

  const labelStyle = {
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#94a3b8",
    fontWeight: "800",
    display: "block",
    marginBottom: "6px",
    letterSpacing: "0.05em"
  };

  const statusRowStyle = (active, completed) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
    color: active ? "#2563eb" : completed ? "#10b981" : "#94a3b8",
    fontWeight: active || completed ? "600" : "400",
    padding: "12px 20px",
    borderRadius: "12px",
    background: active ? "#eff6ff" : "transparent",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
  });

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes subtleScale { from { transform: scale(0.98); } to { transform: scale(1); } }
        .btn-hover:hover { background-color: #1e293b !important; transform: translateY(-1px); }
        .input-focus:focus { border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
      `}</style>

      <div style={{ 
        backgroundColor: "#fff", 
        borderRadius: "32px", 
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)", 
        padding: "50px", 
        border: "1px solid rgba(255,255,255,0.7)",
        animation: "fadeIn 0.6s ease-out"
      }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ 
            fontSize: "56px", 
            marginBottom: "16px", 
            display: "inline-block",
            filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.1))" 
          }}>🛡️</div>
          <h2 style={{ fontSize: "32px", fontWeight: "900", margin: 0, color: "#0f172a", letterSpacing: "-0.025em" }}>
            Credential Vault
          </h2>
          <p style={{ color: "#64748b", marginTop: "10px", fontSize: "16px", fontWeight: "500" }}>
            Decentralized Validation Protocol <span style={{ color: "#2563eb" }}>v2.0</span>
          </p>
        </div>

        {/* INPUT SECTION */}
        {!params.studentId && stage === 0 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ position: "relative" }}>
                <span style={{...labelStyle, marginLeft: "4px"}}>Identification</span>
                <input
                  type="text"
                  className="input-focus"
                  placeholder="Roll Number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", boxSizing: "border-box", fontSize: "15px", outline: "none", transition: "all 0.2s" }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <span style={{...labelStyle, marginLeft: "4px"}}>Key Index</span>
                <input
                  type="text"
                  className="input-focus"
                  placeholder="Credential ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", boxSizing: "border-box", fontSize: "15px", outline: "none", transition: "all 0.2s" }}
                />
              </div>
            </div>
            <button
              onClick={handleVerify}
              className="btn-hover"
              style={{ width: "100%", padding: "18px", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "14px", fontWeight: "700", cursor: "pointer", fontSize: "16px", transition: "all 0.2s" }}
            >
              Initialize Verification
            </button>
          </div>
        )}

        {/* LOADING PROGRESSION */}
        {loading && (
          <div style={{ padding: "10px 0", animation: "fadeIn 0.3s ease" }}>
            <div style={{ maxWidth: "400px", margin: "0 auto", background: "#f8fafc", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
              <div style={statusRowStyle(stage === 1, stage > 1)}>
                {stage > 1 ? "✨" : stage === 1 ? <div style={{ border: "2px solid #2563eb", borderTop: "2px solid transparent", borderRadius: "50%", width: "16px", height: "16px", animation: "spin 0.8s linear infinite" }} /> : "○"} 
                Getting certificate metadata...
              </div>
              <div style={statusRowStyle(stage === 2, stage > 2)}>
                {stage > 2 ? "✨" : stage === 2 ? <div style={{ border: "2px solid #2563eb", borderTop: "2px solid transparent", borderRadius: "50%", width: "16px", height: "16px", animation: "spin 0.8s linear infinite" }} /> : "○"} 
                Recalculating SHA-256 hash...
              </div>
              <div style={statusRowStyle(stage === 3, stage > 3)}>
                {stage > 3 ? "✨" : stage === 3 ? <div style={{ border: "2px solid #2563eb", borderTop: "2px solid transparent", borderRadius: "50%", width: "16px", height: "16px", animation: "spin 0.8s linear infinite" }} /> : "○"} 
                Matching blockchain consensus...
              </div>
            </div>
          </div>
        )}

        {/* RESULT SECTION */}
        {stage === 4 && result && (
          <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            {result.verified ? (
              <>
                <div style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", padding: "24px", borderRadius: "20px", textAlign: "center", marginBottom: "32px", color: "#fff", boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.3)" }}>
                  <h3 style={{ margin: 0, fontWeight: "900", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>✓</span>
                    Authenticity Confirmed
                  </h3>
                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.9, fontWeight: "500" }}>Immutable Record Matched Successfully</p>
                </div>

                <div style={cardStyle}>
                  <h4 style={labelStyle}>🎓 Recipient Identity</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div><span style={labelStyle}>Full Name</span><b style={{fontSize: "17px", color: "#1e293b"}}>{result.studentName}</b></div>
                    <div><span style={labelStyle}>Roll Number</span><b style={{fontSize: "17px", color: "#1e293b"}}>{studentId}</b></div>
                    <div style={{gridColumn: "span 2"}}><span style={labelStyle}>Course of Study</span><b style={{fontSize: "17px", color: "#1e293b"}}>{result.courseName}</b></div>
                  </div>
                </div>

                <div style={{...cardStyle, backgroundColor: "#1e293b", border: "none"}}>
                  <h4 style={{...labelStyle, color: "#64748b"}}>🔐 Cryptographic Evidence</h4>
                  <div style={{ marginBottom: "20px" }}>
                    <span style={{...labelStyle, color: "#10b981"}}>Recalculated SHA-256</span>
                    <code style={{ fontSize: "12px", wordBreak: "break-all", color: "#d1d5db", background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "10px", display: "block", marginTop: "8px", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace" }}>
                      {result.certificateHash}
                    </code>
                  </div>
                  <div>
                    <span style={{...labelStyle, color: "#2563eb"}}>Blockchain Proof</span>
                    <code style={{ fontSize: "12px", wordBreak: "break-all", color: "#94a3b8", display: "block", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{result.transactionHash}</code>
                  </div>
                </div>

                <a
                  href={result.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-hover"
                  style={{ display: "block", textAlign: "center", padding: "18px", backgroundColor: "#0f172a", color: "#fff", textDecoration: "none", borderRadius: "16px", fontWeight: "700", marginTop: "12px", fontSize: "16px", transition: "all 0.2s" }}
                >
                  📄 Access Official Certificate
                </a>
              </>
            ) : (
              <div style={{ backgroundColor: "#fff1f2", border: "1px solid #ffe4e6", padding: "40px", borderRadius: "24px", textAlign: "center", animation: "subtleScale 0.3s ease" }}>
                <div style={{ fontSize: "50px", marginBottom: "16px" }}>🚫</div>
                <h3 style={{ color: "#9f1239", margin: "0", fontSize: "22px", fontWeight: "800" }}>Validation Failed</h3>
                <p style={{ color: "#be123c", fontSize: "15px", marginTop: "10px", lineHeight: "1.5" }}>
                  The provided cryptographic keys do not match our secure ledger. This record may be unofficial or tampered with.
                </p>
              </div>
            )}
            
            <button 
              onClick={() => { setStage(0); setStudentId(""); setCertificateId(""); navigate("/public-verify"); }}
              style={{ width: "100%", background: "none", border: "none", color: "#64748b", marginTop: "32px", cursor: "pointer", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}
            >
              ← Verify New Credential
            </button>
          </div>
        )}

        <div style={{ marginTop: "50px", paddingTop: "30px", borderTop: "1.5px solid #f1f5f9", fontSize: "12px", color: "#94a3b8", textAlign: "center", lineHeight: "1.8", maxWidth: "500px", margin: "50px auto 0 auto" }}>
          Powered by <b>Distributed Ledger Technology</b>. Cryptographic verification ensures that digital assets remain exactly as they were at the moment of issuance.
        </div>
      </div>
    </div>
  );
}