import api from "./axios";

/* ============================
   ADMIN – ISSUE CERTIFICATE
============================ */
export const issueCertificate = (studentId, file) => {
  const formData = new FormData();
  formData.append("studentId", studentId);
  formData.append("file", file);

  return api.post("/certificates/issue", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ============================
   PUBLIC / STUDENT – VERIFY
============================ */
export const verifyCertificate = (studentId, certificateId) => {
  return api.post("/certificates/verify", {
    studentId,
    certificateId,
  });
};

/* ============================
   STUDENT – FETCH CERTIFICATES
============================ */
export const fetchStudentCertificates = (studentId) => {
  return api.get(`/certificates/student/${studentId}`);
};

/* ============================
   OPTIONAL – CERTIFICATE DETAILS
============================ */
export const getCertificate = (certificateId) => {
  return api.get(`/certificates/${certificateId}`);
};
