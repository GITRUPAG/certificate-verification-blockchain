import React, { useState } from "react";
import { issueCertificate } from "../api/certificateApi";

export default function IssueCertificate() {
    const [studentId, setStudentId] = useState("");
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const handleIssue = async () => {
        if (!file) {
            alert("Please select a PDF file.");
            return;
        }

        try {
            const res = await issueCertificate(studentId, file);
            setResponse(res.data);
        } catch (err) {
            alert("Failed to issue certificate");
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
            <h2>Issue Certificate</h2>

            <input
                type="text"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <button
                onClick={handleIssue}
                style={{ padding: 10, width: "100%" }}
            >
                Upload Certificate
            </button>

            {response && (
                <div style={{ marginTop: 20 }}>
                    <h3>Certificate Issued ✔</h3>
                    <p><strong>Certificate ID:</strong> {response.certificateId}</p>
                    <p><strong>Certificate Key:</strong> {response.certificateKey}</p>
                    <p><strong>Blockchain Hash:</strong> {response.blockchainHash}</p>
                    <p><strong>Transaction Hash:</strong> {response.transactionHash}</p>
                    <p>
                        <strong>PDF:</strong>{" "}
                        <a href={response.pdfUrl} target="_blank" rel="noopener noreferrer">
                            View PDF
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
