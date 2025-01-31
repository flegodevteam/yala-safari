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
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/safari-packages" element={<SafariPackages />} />
          <Route path="/blog-and-trips" element={<BlogAndTips />} />
          <Route path="/customer-reviews" element={<CustomerReviews />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
