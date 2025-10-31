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
      console.log("AuthGuard: Checking authentication for:", location.pathname);
      
      // Define all protected routes (including new package management routes)
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/packages',
        '/dashboard/packages/create',
        '/dashboard/packages/edit',
      ];
      
      const isProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );

      if (!isProtectedRoute) {
        console.log("AuthGuard: Not a protected route, allowing access");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const token = getAuthToken();
      console.log(
        "AuthGuard: Checking token for protected route:",
        token ? "Token exists" : "No token"
      );

      if (!token) {
        // No token found, redirect to admin login
        console.log("AuthGuard: No token, redirecting to /admin");
        navigate("/admin", {
          state: { from: location.pathname },
        });
        setIsLoading(false);
        return;
      }

      // Optional: Validate token with backend
      // validateToken(token).then(valid => {
      //   if (!valid) {
      //     localStorage.removeItem('adminToken');
      //     navigate("/admin");
      //   } else {
      //     setIsAuthenticated(true);
      //     setIsLoading(false);
      //   }
      // });

      // Token exists, assume user is authenticated
      console.log("AuthGuard: Token found, user authenticated");
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuthentication();
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-xl text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
};

export default AuthGuard;