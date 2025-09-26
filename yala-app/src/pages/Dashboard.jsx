import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../config/api";
import { logDebugInfo } from "../utils/debugHelper";
import {
  checkProductionEnvironment,
  diagnoseAuthenticationIssue,
} from "../utils/productionDiagnostics";
import {
  FiHome,
  FiPackage,
  FiCalendar,
  FiBookmark,
  FiUsers,
  FiSettings,
  FiFileText,
  FiBarChart2,
  FiImage,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import DashboardHome from "../components/DashboardHome";
import PackagesManager from "../components/PackageManager";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import BookingsManager from "../components/BookingsManager";
import BlogContentManager from "../components/BlogContentManager";
import MediaGallery from "../components/MediaGallery";
import UserManager from "../components/UserManager";
import SettingsPanel from "../components/SettingsPanel";
import ReportsDashboard from "../components/ReportsDashboard";

const AdminDashboard = ({ blogPosts, setBlogPosts }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    // Comprehensive debug and diagnostic info for production
    logDebugInfo("Dashboard Load");

    // Run production diagnostics if in production
    if (process.env.NODE_ENV === "production") {
      checkProductionEnvironment().then((results) => {
        console.log("🔧 Production Environment Check:", results);
      });

      const authDiagnosis = diagnoseAuthenticationIssue();
      console.log("🔐 Authentication Diagnosis:", authDiagnosis);

      if (authDiagnosis.issues.length > 0) {
        console.warn("⚠️  Authentication Issues Found:", authDiagnosis.issues);
        console.info("💡 Recommendations:", authDiagnosis.recommendations);
      }
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth < 1024) {
        setSidebarOpen(false); // Close sidebar on mobile by default
      } else {
        setSidebarOpen(true); // Keep sidebar open on desktop
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    console.log("Logout initiated");
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // Debug function for production troubleshooting
  const handleDebugInfo = () => {
    const debugInfo = logDebugInfo("Manual Debug Check");
    alert(
      `Debug info logged to console. Environment: ${
        process.env.NODE_ENV
      }, API: ${process.env.REACT_APP_API_BASE_URL || "localhost:5000"}`
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Navigation handler for child components
  const handleInternalNavigation = (tabName) => {
    handleTabChange(tabName);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen
            ? isMobile
              ? "w-64 translate-x-0"
              : "w-64"
            : isMobile
            ? "w-64 -translate-x-full"
            : "w-20"
        } bg-indigo-800 text-white transition-all duration-300 fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen || !isMobile ? (
            <h1
              className={`text-xl font-bold ${
                !sidebarOpen && !isMobile ? "hidden" : ""
              }`}
            >
              Yala Safari Admin
            </h1>
          ) : (
            <h1 className="text-xl font-bold">YS</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-indigo-700 lg:block"
          >
            {isMobile ? (
              sidebarOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )
            ) : sidebarOpen ? (
              "«"
            ) : (
              "»"
            )}
          </button>
        </div>

        <nav className="mt-8">
          <NavItem
            icon={<FiHome />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => handleTabChange("dashboard")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiPackage />}
            text="Packages"
            active={activeTab === "packages"}
            onClick={() => handleTabChange("packages")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiCalendar />}
            text="Availability"
            active={activeTab === "availability"}
            onClick={() => handleTabChange("availability")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiBookmark />}
            text="Bookings"
            active={activeTab === "bookings"}
            onClick={() => handleTabChange("bookings")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiFileText />}
            text="Blog Content"
            active={activeTab === "blog"}
            onClick={() => handleTabChange("blog")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiImage />}
            text="Media Gallery"
            active={activeTab === "media"}
            onClick={() => handleTabChange("media")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiUsers />}
            text="Users"
            active={activeTab === "users"}
            onClick={() => handleTabChange("users")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiBarChart2 />}
            text="Reports"
            active={activeTab === "reports"}
            onClick={() => handleTabChange("reports")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <NavItem
            icon={<FiSettings />}
            text="Settings"
            active={activeTab === "settings"}
            onClick={() => handleTabChange("settings")}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-lg hover:bg-indigo-700 w-full"
          >
            <FiLogOut className="text-lg" />
            {(sidebarOpen || !isMobile) && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isMobile ? "w-full" : ""}`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <FiMenu className="text-xl text-gray-600" />
              </button>
            )}
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 capitalize">
              {activeTab.replace("-", " ")}
            </h2>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold text-sm lg:text-base">
              AD
            </div>
          </div>
        </header>

        <main className="p-3 lg:p-6 min-h-0 overflow-auto">
          {activeTab === "dashboard" && (
            <DashboardHome onNavigate={handleInternalNavigation} />
          )}
          {activeTab === "packages" && <PackagesManager />}
          {activeTab === "availability" && <AvailabilityCalendar />}
          {activeTab === "bookings" && <BookingsManager />}
          {activeTab === "blog" && (
            <BlogContentManager
              blogPosts={blogPosts}
              setBlogPosts={setBlogPosts}
            />
          )}
          {activeTab === "media" && <MediaGallery />}
          {activeTab === "users" && <UserManager />}
          {activeTab === "reports" && <ReportsDashboard />}
          {activeTab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick, sidebarOpen, isMobile }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 text-left transition-colors duration-200 ${
        active
          ? "bg-indigo-700 text-white"
          : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
      }`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      {(sidebarOpen || !isMobile) && (
        <span className="ml-3 text-sm lg:text-base font-medium">{text}</span>
      )}
    </button>
  );
};

export default AdminDashboard;
