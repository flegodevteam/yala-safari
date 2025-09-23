import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../config/api";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = getAuthToken();
      console.log(
        "AuthGuard: Checking token:",
        token ? "Token exists" : "No token"
      );

      if (!token) {
        // No token found, redirect to admin login
        console.log("AuthGuard: No token, redirecting to /admin");
        navigate("/admin", {
          state: { from: location.pathname },
        });
        return;
      }

      // Token exists, assume user is authenticated
      // In a production app, you might want to validate the token with the backend
      console.log("AuthGuard: Token found, user authenticated");
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuthentication();
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
};

export default AuthGuard;
