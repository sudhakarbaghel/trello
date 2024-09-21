import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, signup, user, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

interface LoginInput {
  email: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient(); 
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input.email, input.password),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey:["user"]});
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });
};

interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: SignupInput) => signup(input),
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      navigate("/login");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
    },
  });
};

export const useFetchUser = () => {
  return useQuery({ queryKey: ["user"], queryFn: user });
};

export const useLogout = () => {
  const queryClient = useQueryClient(); 

  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("Logout successful");
      queryClient.invalidateQueries({queryKey:["user"]});

      navigate("/login");
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
    },
  });
};
