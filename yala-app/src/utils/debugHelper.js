// Debug helper for production troubleshooting
export const createDebugInfo = () => {
  const token = localStorage.getItem("adminToken");

  return {
    // Environment info
    environment: process.env.NODE_ENV,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
    currentUrl: window.location.href,
    userAgent: navigator.userAgent,

    // Authentication info
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token
      ? `${token.substring(0, 20)}...${token.substring(token.length - 5)}`
      : "none",

    // Token validation
    tokenValid: validateTokenStructure(token),

    // Timestamp
    timestamp: new Date().toISOString(),

    // Local storage info
    localStorageKeys: Object.keys(localStorage),
  };
};

const validateTokenStructure = (token) => {
  if (!token) return { valid: false, reason: "No token" };

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, reason: "Invalid JWT format" };
    }

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      return {
        valid: false,
        reason: "Token expired",
        expiry: new Date(payload.exp * 1000),
      };
    }

    return {
      valid: true,
      expiry: payload.exp ? new Date(payload.exp * 1000) : "No expiry",
    };
  } catch (error) {
    return {
      valid: false,
      reason: "Token parsing error",
      error: error.message,
    };
  }
};

export const logDebugInfo = (context = "General") => {
  const debugInfo = createDebugInfo();
  console.group(`🔍 Debug Info - ${context}`);
  console.table(debugInfo);
  console.groupEnd();
  return debugInfo;
};

export const exportDebugInfo = () => {
  const debugInfo = createDebugInfo();
  const debugString = JSON.stringify(debugInfo, null, 2);

  // Copy to clipboard if possible
  if (navigator.clipboard) {
    navigator.clipboard.writeText(debugString);
    console.log("Debug info copied to clipboard");
  }

  return debugString;
};
