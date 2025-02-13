import { useState } from "react";
import {
  FiPackage,
  FiCalendar,
  FiFileText,
  FiUser,
  FiBell,
  FiLogOut,
  FiImage,
  FiEdit,
  FiTrash,
  FiPlus,
} from "react-icons/fi";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Sidebar = ({ setActivePage }) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setActivePage("packages")}
        >
          <FiPackage /> Manage Packages
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setActivePage("calendar")}
        >
          <FiCalendar /> Availability Calendar
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setActivePage("reports")}
        >
          <FiFileText /> Reports
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setActivePage("images")}
        >
          <FiImage /> Manage Images
        </Button>
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className="flex items-center gap-2">
          <FiLogOut /> Logout
        </Button>
      </div>
    </div>
  );
};

const Topbar = () => {
  return (
    <div className="flex justify-between items-center bg-white shadow-md p-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <FiBell className="text-gray-600 text-xl cursor-pointer" />
        <FiUser className="text-gray-600 text-xl cursor-pointer" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("packages");

  return (
    <div className="flex h-screen">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">
          {activePage === "packages" && <ManagePackages />}
          {activePage === "calendar" && <AvailabilityCalendar />}
          {activePage === "reports" && <Reports />}
          {activePage === "images" && <ManageImages />}
        </div>
      </div>
    </div>
  );
};

const ManagePackages = () => {
  const [packages, setPackages] = useState([
    "Safari Adventure",
    "Beach Retreat",
    "Mountain Hiking",
  ]);

  const addPackage = () => setPackages([...packages, "New Package"]);
  const editPackage = (index) => alert(`Edit package: ${packages[index]}`);
  const deletePackage = (index) =>
    setPackages(packages.filter((_, i) => i !== index));

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Manage Packages</h2>
        <Button onClick={addPackage} className="mb-4 flex items-center gap-2">
          <FiPlus /> Add Package
        </Button>
        <ul className="space-y-2">
          {packages.map((pkg, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
            >
              {pkg}
              <div className="flex gap-2">
                <Button onClick={() => editPackage(index)} variant="ghost">
                  <FiEdit />
                </Button>
                <Button onClick={() => deletePackage(index)} variant="ghost">
                  <FiTrash />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const AvailabilityCalendar = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Availability Calendar</h2>
        <p>Update and manage available booking dates.</p>
      </CardContent>
    </Card>
  );
};

const Reports = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Reports</h2>
        <p>View booking reports and statistics.</p>
      </CardContent>
    </Card>
  );
};

const ManageImages = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Manage Images</h2>
        <p>Add, edit, or remove images related to offers and packages.</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
