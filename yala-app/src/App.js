import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
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
import TaxiService from "./components/TaxiService";
import BlogContentManager from "./components/BlogContentManager";
import AuthGuard from "./components/AuthGuard";

const initialBlogPosts = [
  {
    id: "1",
    title: "Top 5 Safari Tips for Beginners",
    excerpt:
      "Planning your first safari? Here are the top 5 tips to make your adventure unforgettable...",
    date: "2024-07-01",
    category: "Travel Tips",
    image: "/default-blog.jpg",
    readTime: "4 min read",
  },
  {
    id: "2",
    title: "Wildlife Conservation Efforts in Yala",
    excerpt:
      "Discover how local communities and rangers are working together to protect wildlife in Yala...",
    date: "2024-06-15",
    category: "Conservation",
    image: "/default-blog.jpg",
    readTime: "5 min read",
  },
  {
    id: "3",
    title: "A Photographer's Guide to Yala National Park",
    excerpt:
      "Capture the best moments of your safari with these photography tips and tricks...",
    date: "2024-05-20",
    category: "Photography",
    image: "/default-blog.jpg",
    readTime: "3 min read",
  },
];

function App() {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Home route - exact match */}
            <Route path="/" element={<Home />} />
            
            {/* Public routes */}
            <Route path="/packages" element={<Packages />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog blogPosts={blogPosts} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:roomType" element={<RoomDetails />} />
            <Route path="/taxi-service" element={<TaxiService />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard
                    blogPosts={blogPosts}
                    setBlogPosts={setBlogPosts}
                  />
                </AuthGuard>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
