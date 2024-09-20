import { useMutation } from '@tanstack/react-query';
import { login ,signup} from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface LoginInput {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate(); 

  return useMutation({
    mutationFn: (input: LoginInput) => login(input.email, input.password),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      navigate('/'); 
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
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
        console.log('Signup successful:', data);
        navigate('/');  
      },
      onError: (error: any) => {
        console.error('Signup failed:', error);
      },
    });
  };
