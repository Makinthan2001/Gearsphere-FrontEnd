import React, { useEffect, useState } from "react";
import AdminNavbar from "../pageNavbars/AdminNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardFooter from "../pagefooter/DashboardFooter";
import LoadingScreen from "../../components/loading/LoadingScreen";
import axios from "axios";

function AdminLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check if we have user_type in sessionStorage
        const userType = sessionStorage.getItem("user_type");

        if (!userType) {
          navigate("/", { replace: true });
          return;
        }

        if (userType.toLowerCase() !== "admin") {
          navigate("/", { replace: true });
          return;
        }

        // If we have admin in sessionStorage, verify with backend
        const response = await axios.get(
          "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
          {
            withCredentials: true,
            timeout: 5000, // 5 second timeout
          }
        );

        if (
          response.data.success &&
          response.data.user_type?.toLowerCase() === "admin"
        ) {
          setIsLoading(false);
        } else {
          sessionStorage.removeItem("user_type");
          navigate("/", { replace: true });
        }
      } catch (error) {
        // If it's a 401 error, the session is invalid
        if (error.response && error.response.status === 401) {
          sessionStorage.removeItem("user_type");
        }

        navigate("/", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Admin Authentication"
        submessage="Verifying administrative access"
      />
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AdminNavbar fixed="top" />
      <div style={{ flex: "1 0 auto", marginTop: 80 }}>
        <Outlet />
      </div>
      <DashboardFooter />
    </div>
  );
}

export default AdminLayout;
