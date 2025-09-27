import { apiEndpoints } from "../config/api";

export const checkProductionEnvironment = async () => {
  const results = {
    environment: process.env.NODE_ENV,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
    frontend: {
      url: window.location.origin,
      protocol: window.location.protocol,
    },
    tests: {},
  };

  // Test 1: Basic API connectivity
  try {
    console.log("Testing API connectivity...");
    const response = await fetch(`${results.apiBaseUrl}/api/test`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    results.tests.apiConnectivity = {
      success: response.ok,
      status: response.status,
      message: response.ok
        ? "API is reachable"
        : `API returned ${response.status}`,
    };
  } catch (error) {
    results.tests.apiConnectivity = {
      success: false,
      error: error.message,
      message: "Cannot reach API",
    };
  }

  // Test 2: CORS configuration
  try {
    console.log("Testing CORS configuration...");
    const response = await fetch(`${results.apiBaseUrl}/api/admin/packages`, {
      method: "OPTIONS",
    });

    results.tests.cors = {
      success: true,
      headers: Object.fromEntries(response.headers.entries()),
      message: "CORS preflight successful",
    };
  } catch (error) {
    results.tests.cors = {
      success: false,
      error: error.message,
      message: "CORS configuration issue",
    };
  }

  // Test 3: Authentication endpoint
  try {
    console.log("Testing authentication endpoint...");
    const response = await fetch(apiEndpoints.admin.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "test" }),
    });

    results.tests.authEndpoint = {
      success: response.status === 400 || response.status === 401, // These are expected for invalid credentials
      status: response.status,
      message: "Authentication endpoint is responding",
    };
  } catch (error) {
    results.tests.authEndpoint = {
      success: false,
      error: error.message,
      message: "Authentication endpoint unreachable",
    };
  }

  console.log("Production Environment Check Results:", results);
  return results;
};

export const diagnoseAuthenticationIssue = () => {
  const token = localStorage.getItem("adminToken");
  const diagnosis = {
    hasToken: !!token,
    issues: [],
    recommendations: [],
  };

  if (!token) {
    diagnosis.issues.push("No authentication token found in localStorage");
    diagnosis.recommendations.push("User needs to log in");
    return diagnosis;
  }

  // Check token format
  const parts = token.split(".");
  if (parts.length !== 3) {
    diagnosis.issues.push("Token is not in valid JWT format");
    diagnosis.recommendations.push("Clear localStorage and re-login");
    return diagnosis;
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      diagnosis.issues.push("Token has expired");
      diagnosis.recommendations.push("Clear expired token and re-login");
    }

    if (!payload.exp) {
      diagnosis.issues.push("Token has no expiration time");
      diagnosis.recommendations.push("This is unusual for JWT tokens");
    }

    // Check token age
    if (payload.iat) {
      const tokenAge = currentTime - payload.iat;
      const maxAge = 24 * 60 * 60; // 24 hours

      if (tokenAge > maxAge) {
        diagnosis.issues.push(
          `Token is ${Math.floor(tokenAge / 3600)} hours old`
        );
        diagnosis.recommendations.push("Consider refreshing the token");
      }
    }
  } catch (error) {
    diagnosis.issues.push("Cannot decode token payload");
    diagnosis.recommendations.push(
      "Token may be corrupted, clear and re-login"
    );
  }

  return diagnosis;
};
