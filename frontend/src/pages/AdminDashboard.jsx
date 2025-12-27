import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { issueCertificate } from "../api/certificateApi";
import { getAllStudents, updateStudent } from "../api/studentApi";

const styles = {
  container: { maxWidth: "1000px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" },
  header: { textAlign: "center", marginBottom: "30px", color: "#2c3e50" },
  tabs: { display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" },
  tabButton: (active) => ({
    padding: "10px 20px", cursor: "pointer", border: "none",
    background: active ? "#3498db" : "transparent",
    color: active ? "white" : "#7f8c8d", borderRadius: "6px", fontWeight: "600"
  }),
  card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600", color: "#34495e" },
  input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "1rem", boxSizing: "border-box" },
  radioGroup: { display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "5px" },
  radioOption: { display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "0.95rem" },
  button: { width: "100%", backgroundColor: "#3498db", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  statusMsg: (isError) => ({
    padding: "12px", borderRadius: "6px", marginTop: "15px", fontSize: "0.9rem",
    backgroundColor: isError ? "#fff5f5" : "#f0fff4", color: isError ? "#c53030" : "#2f855a",
    border: `1px solid ${isError ? "#feb2b2" : "#9ae6b4"}`,
  }),
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  th: { textAlign: "left", padding: "12px", borderBottom: "2px solid #eee", color: "#7f8c8d" },
  td: { padding: "12px", borderBottom: "1px solid #eee" },
  actionBtn: { padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", color: "white", backgroundColor: "#f39c12" }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Form States
  const [student, setStudent] = useState({
    studentId: "", name: "", email: "", courseName: "CSE",
    degreeType: "B.Tech", academicYear: "", dateOfBirth: ""
  });
  const [studentMsg, setStudentMsg] = useState({ text: "", isError: false });

  const [certForm, setCertForm] = useState({ studentId: "", file: null });
  const [certResult, setCertResult] = useState(null);
  const [certMsg, setCertMsg] = useState({ text: "", isError: false });

  useEffect(() => {
    if (activeTab === "records") {
      loadStudents();
    }
  }, [activeTab]);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const handleAddStudent = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateStudent(student.id || student._id, student);
        setStudentMsg({ text: "Student record updated successfully!", isError: false });
        setIsEditing(false);
      } else {
        await api.post("/admin/students", student);
        setStudentMsg({ text: "Student registered successfully!", isError: false });
      }
      setStudent({ studentId: "", name: "", email: "", courseName: "CSE", degreeType: "B.Tech", academicYear: "", dateOfBirth: "" });
    } catch (err) {
      setStudentMsg({ text: "Error saving student record", isError: true });
    } finally { setLoading(false); }
  };

  const handleEditClick = (s) => {
    setStudent(s);
    setIsEditing(true);
    setActiveTab("add");
    setStudentMsg({ text: "", isError: false });
  };

  const handleIssueCert = async () => {
    if (!certForm.file) return setCertMsg({ text: "Please upload a PDF", isError: true });
    setLoading(true);
    try {
      const res = await issueCertificate(certForm.studentId, certForm.file);
      setCertResult(res.data);
      setCertMsg({ text: "Certificate issued successfully!", isError: false });
    } catch (err) {
      setCertMsg({ text: "Issuance failed", isError: true });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.header}>Admin Management</h2>

        <div style={styles.tabs}>
          <button style={styles.tabButton(activeTab === "add")} onClick={() => { setActiveTab("add"); setIsEditing(false); }}>
            {isEditing ? "Edit Record" : "Add Student"}
          </button>
          <button style={styles.tabButton(activeTab === "records")} onClick={() => setActiveTab("records")}>Student Records</button>
          <button style={styles.tabButton(activeTab === "issue")} onClick={() => setActiveTab("issue")}>Issue Certificate</button>
        </div>

        <div style={styles.card}>
          {activeTab === "add" && (
            <section>
              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Student ID</label>
                  <input style={styles.input} placeholder="STU-001" value={student.studentId} onChange={(e) => setStudent({...student, studentId: e.target.value})} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input style={styles.input} placeholder="John Doe" value={student.name} onChange={(e) => setStudent({...student, name: e.target.value})} />
                </div>
              </div>

              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input style={styles.input} type="email" placeholder="john@uni.edu" value={student.email} onChange={(e) => setStudent({...student, email: e.target.value})} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date of Birth</label>
                  <input style={styles.input} type="date" value={student.dateOfBirth} onChange={(e) => setStudent({...student, dateOfBirth: e.target.value})} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Degree Type</label>
                <div style={styles.radioGroup}>
                  {["B.Tech", "M.Tech", "PhD"].map((type) => (
                    <label key={type} style={styles.radioOption}>
                      <input type="radio" name="degree" value={type} checked={student.degreeType === type} onChange={(e) => setStudent({...student, degreeType: e.target.value})} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Course Department</label>
                <div style={styles.radioGroup}>
                  {["CSE", "ECE", "Mechanical", "Civil", "IT"].map((dept) => (
                    <label key={dept} style={styles.radioOption}>
                      <input type="radio" name="course" value={dept} checked={student.courseName === dept} onChange={(e) => setStudent({...student, courseName: e.target.value})} />
                      {dept}
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Academic Year</label>
                <input style={styles.input} placeholder="2021 - 2025" value={student.academicYear} onChange={(e) => setStudent({...student, academicYear: e.target.value})} />
              </div>

              <button style={styles.button} onClick={handleAddStudent} disabled={loading}>
                {loading ? "Processing..." : isEditing ? "Save Changes" : "Register Student"}
              </button>
              {studentMsg.text && <div style={styles.statusMsg(studentMsg.isError)}>{studentMsg.text}</div>}
            </section>
          )}

          {activeTab === "records" && (
            <section>
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "15px" }}>
                * Records cannot be deleted to ensure the integrity of issued certificates. Use 'Edit' to correct errors.
              </p>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id || s._id}>
                      <td style={styles.td}>{s.studentId}</td>
                      <td style={styles.td}>{s.name}</td>
                      <td style={styles.td}>{s.courseName}</td>
                      <td style={styles.td}>
                        <button 
                          style={styles.actionBtn} 
                          onClick={() => handleEditClick(s)}
                        >Edit Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === "issue" && (
            <section>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Student ID</label>
                <input style={styles.input} placeholder="Enter ID to link certificate" value={certForm.studentId} onChange={(e) => setCertForm({...certForm, studentId: e.target.value})} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Certificate PDF</label>
                <div style={{ border: "2px dashed #cbd5e0", padding: "20px", textAlign: "center", borderRadius: "8px", background: "#f8fafc" }}>
                  <input type="file" accept="application/pdf" onChange={(e) => setCertForm({...certForm, file: e.target.files[0]})} />
                  <p style={{ fontSize: "0.8rem", color: "#718096", marginTop: "5px" }}>Upload the official signed PDF certificate</p>
                </div>
              </div>
              <button style={styles.button} onClick={handleIssueCert} disabled={loading}>{loading ? "Issuing..." : "Verify & Issue Certificate"}</button>
              {certMsg.text && <div style={styles.statusMsg(certMsg.isError)}>{certMsg.text}</div>}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}