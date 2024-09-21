import axios from "../config/axios";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("/auth/login", { email, password });

    const { token } = response.data;

    if (token) {
      localStorage.setItem("authToken", token);
    }

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  try {
    const response = await axios.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Signup failed", error);
    throw error;
  }
};
export const user = async () => {
  try {
    const response = await axios("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Signup failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post("/auth/logout");  
    localStorage.removeItem("authToken"); 
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};
