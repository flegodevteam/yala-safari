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
      try {
        const token = getAuthToken();
        console.log(
          "AuthGuard: Checking token:",
          token ? "Token exists" : "No token"
        );

        if (!token) {
          // No token found, redirect to admin login
          console.log("AuthGuard: No token, redirecting to /admin-login");
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate("/admin-login", {
            state: { from: location.pathname },
            replace: true, // Use replace to avoid back button issues
          });
          return;
        }

        // Basic token format validation
        try {
          // Check if token is a valid JWT (has 3 parts separated by dots)
          const tokenParts = token.split(".");
          if (tokenParts.length !== 3) {
            throw new Error("Invalid token format");
          }

          // Decode the payload to check expiration
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp < currentTime) {
            throw new Error("Token expired");
          }

          // Token is valid
          console.log("AuthGuard: Token is valid, user authenticated");
          setIsAuthenticated(true);
          setIsLoading(false);
        } catch (tokenError) {
          console.log(
            "AuthGuard: Token validation failed:",
            tokenError.message
          );
          // Remove invalid token
          localStorage.removeItem("adminToken");
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate("/admin-login", {
            state: { from: location.pathname, error: "Session expired" },
            replace: true,
          });
        }
      } catch (error) {
        console.error("AuthGuard: Authentication check failed:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate("/admin-login", {
          state: { from: location.pathname, error: "Authentication error" },
          replace: true,
        });
      }
    };

    checkAuthentication();

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "adminToken" && !e.newValue) {
        // Token was removed in another tab
        console.log("AuthGuard: Token removed in another tab");
        setIsAuthenticated(false);
        navigate("/admin-login", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
