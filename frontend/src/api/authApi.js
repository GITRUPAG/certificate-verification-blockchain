import api from "./axios";

export const registerUser = (userData) => {
  return api.post("/auth/signup", userData);
};

export const registerAdmin = (adminData) => {
  return api.post("/auth/admin/signup", adminData);
};

export const loginUser = (loginData) => {
  return api.post("/auth/login", loginData);
};
