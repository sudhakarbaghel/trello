import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import "./App.scss";
import Dashboard from "./pages/dashboard/Dashboard";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
