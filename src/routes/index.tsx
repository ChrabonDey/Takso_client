import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Dashboard from "@/components/Dashboard/Dashboard";
import SpinningWheel from "@/components/Dashboard/SpinningWheel";

import Homelayout from "@/Layout/Homelayout";
import TaskDetails from "@/components/Dashboard/TaskDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />, // Redirect root to dashboard
  },
  {
    path: "/login",
    element: <Login />, // Public login route
  },
  {
    path: "/register",
    element: <Register />, // Public register route
  },
  {
    path: "/dashboard",
    element: <Homelayout />, // Shared layout for dashboard routes
    children: [
      {
        index: true, // Default route inside /dashboard
        element: <Dashboard />,
      },
      {
        path: "spin", // Navigates to /dashboard/spin
        element: <SpinningWheel />,
      },
      {
        path: "tasks/:id",
        element: (
          <TaskDetails
            taskId="" // Placeholder, will be set via useParams in a wrapper
            onEdit={() => {}} // Provide actual handler
            onShowForm={() => {}} // Provide actual handler
            onClose={() => {}} // Provide actual handler
          />
        ),
      }
    ],
  },
]);

export default router;
