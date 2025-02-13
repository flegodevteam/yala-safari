import React from "react";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Destinations from "./pages/Destinations";
import SafariPackages from "./pages/SafariPackages";
import CustomerReviews from "./pages/CustomerReviews";
import Gallery from "./pages/Gallery";
import BlogAndTips from "./pages/BlogTips";
import Footer from "./components/Footer";
import BookingSystem from "./pages/OnlineBooking";
import OnlineBooking from "./pages/OnlineBooking";
import SafariReservation from "./components/SafariReservation";
import Dashboard from "./pages/Dasboard";
import "./index.css";
import ServicesList from "./components/Services";


function App() {
  // const backgroundImageStyle = {
  //   backgroundImage: `url(${yala})`,
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  //   height: "100vh",
  // };
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About-Us" element={<AboutUs />} />
          <Route path="/Destinations" element={<Destinations />} />
          <Route path="/safari-packages" element={<SafariPackages />} />
          <Route path="/blog-and-trips" element={<BlogAndTips />} />
          <Route path="/customer-reviews" element={<CustomerReviews />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/online-booking" element={<BookingSystem />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
