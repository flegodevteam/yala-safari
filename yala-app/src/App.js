import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/adminLogin";
import Rooms from "./pages/Rooms";
import RoomDetails from "./components/RoomDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:roomType" element={<RoomDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
