import api from "./axios";

export const addStudent = (student) => {
  return api.post("/admin/students", student);
};

export const getAllStudents = () => {
  return api.get("/admin/students");
};

export const getStudentById = (id) => {
  return api.get(`/admin/students/${id}`);
};

export const updateStudent = (id, student) => {
  return api.put(`/admin/students/${id}`, student);
};

export const deleteStudent = (id) => {
  return api.delete(`/admin/students/${id}`);
};
