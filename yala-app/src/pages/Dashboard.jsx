import { useState, useEffect } from "react";
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
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiList,
  FiDollarSign,
  FiChevronLeft,
} from "react-icons/fi";
import DashboardHome from "../components/DashboardHome";
import PackagesManager from "../components/PackageManager";
import PackageList from "../pages/PackageList";
//import AvailabilityCalendar from "../components/AvailabilityCalendar";
//import BookingsManager from "../components/BookingsManager";
import BlogContentManager from "../components/BlogContentManager";
import MediaGallery from "../components/MediaGallery";
import UserManager from "../components/UserManager";
import SettingsPanel from "../components/SettingsPanel";
import ReportsDashboard from "../components/ReportsDashboard";
import { logout, getAdminInfo } from "../utils/auth";
import AdminBookingManagement from "../components/AdminBookingManagement";
import BookingCalendar from "../components/BookingCalendar";
import TaxiBookingManagement from "../components/TaxiBookingManagement";
import ManageRooms from "../components/ManageRooms";
import logo from "../assets/logo.png";

const AdminDashboard = ({ blogPosts, setBlogPosts }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [packagesExpanded, setPackagesExpanded] = useState(false);
  const [packagesSubTab, setPackagesSubTab] = useState("list"); // "list" or "pricing"
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get admin info
  const adminInfo = getAdminInfo();
  const adminInitials = adminInfo?.name
    ? adminInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle ESC key to close logout confirmation
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutConfirm]);

  const handleLogout = () => {
    logout(); // This will clear tokens and redirect to /admin
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Toggle packages submenu
  const handlePackagesToggle = () => {
    setPackagesExpanded(!packagesExpanded);
    if (!packagesExpanded) {
      setActiveTab("packages");
    }
  };

  // Handle package list submenu click
  const handlePackageListClick = () => {
    setActiveTab("packages");
    setPackagesSubTab("list");
    setPackagesExpanded(false);
    setMobileMenuOpen(false);
  };

  // Handle package pricing submenu click
  const handlePackagePricingClick = () => {
    setActiveTab("packages");
    setPackagesSubTab("pricing");
    setPackagesExpanded(false);
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] overflow-hidden">
      {/* Sidebar - Desktop */}
      <div
        className={`hidden lg:flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-[#034123] via-[#026042] to-[#034123] text-white transition-all duration-300 relative shadow-2xl border-r border-[#034123]/20`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="h-8 w-8" />
              <span className="text-lg font-bold text-white">Yala Safari </span>
            </div>
          ) : null}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white/80 hover:text-white"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <NavItem
            icon={<FiHome />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => handleTabClick("dashboard")}
            sidebarOpen={sidebarOpen}
          />
          {/* <ExpandableNavItem
            icon={<FiPackage />}
            text="Packages"
            active={activeTab === "packages"}
            expanded={packagesExpanded}
            onToggle={handlePackagesToggle}
            sidebarOpen={sidebarOpen}
            subItems={[
              {
                icon: <FiList />,
                text: "Package List",
                onClick: handlePackageListClick,
                active: activeTab === "packages" && packagesSubTab === "list",
              }
             
            ]}
          /> */}
            <NavItem
            icon={<FiList />}
            text="Package"
            active={activeTab === "packages" && packagesSubTab === "list"}
            onClick={() => handlePackageListClick()}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiCalendar />}
            text="Availability"
            active={activeTab === "availability"}
            onClick={() => handleTabClick("availability")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiBookmark />}
            text="Bookings"
            active={activeTab === "bookings"}
            onClick={() => handleTabClick("bookings")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiBookmark />}
            text="Taxi Bookings"
            active={activeTab === "taxi-bookings"}
            onClick={() => handleTabClick("taxi-bookings")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiFileText />}
            text="Blog Content"
            active={activeTab === "blog"}
            onClick={() => handleTabClick("blog")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiFileText />}
            text="Manage Rooms"
            active={activeTab === "rooms"}
            onClick={() => handleTabClick("rooms")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiImage />}
            text="Media Gallery"
            active={activeTab === "media"}
            onClick={() => handleTabClick("media")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiUsers />}
            text="Users"
            active={activeTab === "users"}
            onClick={() => handleTabClick("users")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiBarChart2 />}
            text="Reports"
            active={activeTab === "reports"}
            onClick={() => handleTabClick("reports")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<FiSettings />}
            text="Settings"
            active={activeTab === "settings"}
            onClick={() => handleTabClick("settings")}
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Logout Button - Fixed to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#034123]/50 backdrop-blur-sm ">
          <button
            onClick={handleLogoutClick}
            className="flex items-center justify-center p-3 rounded-xl hover:bg-[#f26b21] w-full transition-all duration-300 text-white font-semibold group"
          >
            <FiLogOut className="text-lg" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed lg:hidden top-0 left-0 h-full z-50 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gradient-to-b from-[#034123] via-[#026042] to-[#034123] text-white transition-transform duration-300 shadow-2xl`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8" />
            <span className="text-lg font-bold text-white">Yala Safari </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            aria-label="Close menu"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <NavItem
            icon={<FiHome />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => handleTabClick("dashboard")}
            sidebarOpen={true}
          />
          <ExpandableNavItem
            icon={<FiPackage />}
            text="Packages"
            active={activeTab === "packages"}
            expanded={packagesExpanded}
            onToggle={handlePackagesToggle}
            sidebarOpen={true}
            subItems={[
              {
                icon: <FiList />,
                text: "Package List",
                onClick: handlePackageListClick,
                active: activeTab === "packages" && packagesSubTab === "list",
              },
              {
                icon: <FiDollarSign />,
                text: "Package Pricing",
                onClick: handlePackagePricingClick,
                active:
                  activeTab === "packages" && packagesSubTab === "pricing",
              },
            ]}
          />
          <NavItem
            icon={<FiCalendar />}
            text="Availability"
            active={activeTab === "availability"}
            onClick={() => handleTabClick("availability")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiBookmark />}
            text="Bookings"
            active={activeTab === "bookings"}
            onClick={() => handleTabClick("bookings")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiFileText />}
            text="Blog Content"
            active={activeTab === "blog"}
            onClick={() => handleTabClick("blog")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiFileText />}
            text="Manage Rooms"
            active={activeTab === "rooms"}
            onClick={() => handleTabClick("rooms")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiImage />}
            text="Media Gallery"
            active={activeTab === "media"}
            onClick={() => handleTabClick("media")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiBookmark/>}
            text="Taxi Bookings"
            active={activeTab === "taxi-bookings"}
            onClick={() => handleTabClick("taxi-bookings")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiUsers />}
            text="Users"
            active={activeTab === "users"}
            onClick={() => handleTabClick("users")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiBarChart2 />}
            text="Reports"
            active={activeTab === "reports"}
            onClick={() => handleTabClick("reports")}
            sidebarOpen={true}
          />
          <NavItem
            icon={<FiSettings />}
            text="Settings"
            active={activeTab === "settings"}
            onClick={() => handleTabClick("settings")}
            sidebarOpen={true}
          />
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-white/10 bg-[#034123]/50 backdrop-blur-sm">
          <button
            onClick={handleLogoutClick}
            className="flex items-center justify-center p-3 rounded-xl hover:bg-[#f26b21] w-full transition-all duration-300 text-white font-semibold"
          >
            <FiLogOut className="text-lg mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-[#034123]/10 p-4 lg:p-6 z-30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-[#034123]/10 text-[#034123] transition-all duration-300"
                aria-label="Open menu"
              >
                <FiMenu className="text-xl" />
              </button>

              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] capitalize">
                  {activeTab.replace("-", " ")}
                </h2>
                <p className="text-sm text-[#6b7280] mt-1">
                  Manage your safari operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-initial">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                />
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 bg-[#f9fafb]/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-[#e5e7eb]/60">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#034123] to-[#026042] flex items-center justify-center text-white font-bold shadow-lg">
                  {adminInitials}
                </div>
                {adminInfo && (
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-[#034123]">
                      {adminInfo.name}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {adminInfo.role || "Admin"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-[#f9fafb] to-white">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && <DashboardHome />}
            {activeTab === "packages" && packagesSubTab === "list" && (
              <PackageList />
            )}
            {activeTab === "packages" && packagesSubTab === "pricing" && (
              <PackagesManager />
            )}
            {/* {activeTab === "availability" && <AvailabilityCalendar />} */}
            {activeTab === "availability" && <BookingCalendar />}
            {activeTab === "bookings" && <AdminBookingManagement />}
            {activeTab === "taxi-bookings" && <TaxiBookingManagement />}
            {activeTab === "blog" && (
              <BlogContentManager
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
              />
            )}
            {activeTab === "media" && <MediaGallery />}
            {activeTab === "rooms" && <ManageRooms />}
            {activeTab === "users" && <UserManager />}
            {activeTab === "reports" && <ReportsDashboard />}
            {activeTab === "settings" && <SettingsPanel />}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancelLogout}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          aria-describedby="logout-modal-description"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: 'rgba(3, 65, 35, 0.1)' }}
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fee000' }}>
                <FiLogOut className="text-2xl" style={{ color: '#034123' }} />
              </div>
              <h3
                id="logout-modal-title"
                className="ml-4 text-2xl font-bold"
                style={{ color: '#034123' }}
              >
                Confirm Logout
              </h3>
            </div>
            <p
              id="logout-modal-description"
              className="mb-6 text-base"
              style={{ color: '#333333' }}
            >
              Are you sure you want to logout? You will need to login again to access the dashboard.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-6 py-3 border text-base font-medium rounded-lg transition-colors duration-200"
                style={{
                  borderColor: '#034123',
                  color: '#034123',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#034123';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#034123';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors duration-200"
                style={{ backgroundColor: '#f26b21' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#034123'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f26b21'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick, sidebarOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3.5 mx-2 my-1 rounded-xl transition-all duration-300 ${
        active
          ? "bg-[#f26b21] text-white shadow-lg scale-105"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      {sidebarOpen && (
        <span className={`ml-3 font-medium ${active ? "font-semibold" : ""}`}>
          {text}
        </span>
      )}
    </button>
  );
};

const ExpandableNavItem = ({
  icon,
  text,
  active,
  expanded,
  onToggle,
  sidebarOpen,
  subItems,
}) => {
  return (
    <div className="mx-2 my-1">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-300 ${
          active
            ? "bg-[#f26b21] text-white shadow-lg scale-105"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        <div className="flex items-center flex-1">
          <span className="text-lg flex-shrink-0">{icon}</span>
          {sidebarOpen && (
            <span
              className={`ml-3 font-medium ${active ? "font-semibold" : ""}`}
            >
              {text}
            </span>
          )}
        </div>
        {sidebarOpen && (
          <span className="text-sm ml-2 transition-transform duration-300">
            {expanded ? <FiChevronDown /> : <FiChevronRight />}
          </span>
        )}
      </button>
      {sidebarOpen && expanded && subItems && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
          {subItems.map((subItem, index) => (
            <button
              key={index}
              onClick={subItem.onClick}
              className={`flex items-center w-full p-2.5 rounded-lg transition-all duration-300 text-sm ${
                subItem.active
                  ? "bg-[#f26b21]/80 text-white shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base flex-shrink-0">{subItem.icon}</span>
              <span
                className={`ml-3 font-medium ${
                  subItem.active ? "font-semibold" : ""
                }`}
              >
                {subItem.text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
