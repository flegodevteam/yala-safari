import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fi";
import DashboardHome from "../components/DashboardHome";
import PackagesManager from "../components/PackageManager";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
//import BookingsManager from "../components/BookingsManager";
import BlogContentManager from "../components/BlogContentManager";
import MediaGallery from "../components/MediaGallery";
import UserManager from "../components/UserManager";
import SettingsPanel from "../components/SettingsPanel";
import ReportsDashboard from "../components/ReportsDashboard";
import { logout, getAdminInfo } from '../utils/auth';
import AdminBookingManagement from '../components/AdminBookingManagement'
import BookingCalendar from '../components/BookingCalendar';

const AdminDashboard = ({ blogPosts, setBlogPosts }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Get admin info
  const adminInfo = getAdminInfo();
  const adminInitials = adminInfo?.name 
    ? adminInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'AD';

  const handleLogout = () => {
    logout(); // This will clear tokens and redirect to /admin
  };

  // Navigate to package management
  const handlePackagesClick = () => {
    navigate('/dashboard/packages');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-indigo-800 text-white transition-all duration-300 relative`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Yala Safari Admin</h1>
          ) : (
            <h1 className="text-xl font-bold">YS</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-indigo-700"
          >
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        <nav className="mt-8">
          <NavItem
            icon={<FiHome />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiPackage />}
            text="Packages"
            active={activeTab === "packages"}
            onClick={handlePackagesClick}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiCalendar />}
            text="Availability"
            active={activeTab === "availability"}
            onClick={() => setActiveTab("availability")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiBookmark />}
            text="Bookings"
            onClick={() => setActiveTab("bookings")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiFileText />}
            text="Blog Content"
            active={activeTab === "blog"}
            onClick={() => setActiveTab("blog")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiImage />}
            text="Media Gallery"
            active={activeTab === "media"}
            onClick={() => setActiveTab("media")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiUsers />}
            text="Users"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiBarChart2 />}
            text="Reports"
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiSettings />}
            text="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Logout Button - Fixed to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-lg hover:bg-indigo-700 w-full transition-colors"
          >
            <FiLogOut className="text-lg" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            
            {/* Admin Profile */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                {adminInitials}
              </div>
              {adminInfo && sidebarOpen && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{adminInfo.name}</p>
                  <p className="text-xs text-gray-500">{adminInfo.role || 'Admin'}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && <DashboardHome />}
          {activeTab === "packages" && <PackagesManager />}
          {/* {activeTab === "availability" && <AvailabilityCalendar />} */}
          {activeTab === "availability" && <BookingCalendar />}
          {activeTab === "bookings" && <AdminBookingManagement />}
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

const NavItem = ({ icon, text, active, onClick, sidebarOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 transition-colors ${
        active ? "bg-indigo-700" : "hover:bg-indigo-700"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {sidebarOpen && <span className="ml-3">{text}</span>}
    </button>
  );
};

export default AdminDashboard;