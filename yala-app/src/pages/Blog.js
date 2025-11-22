import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiEndpoints, publicFetch } from "../config/api";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);

  const fetchBlogs = async () => {
    try {
      console.log("Fetching blogs from API...");
      const response = await publicFetch(apiEndpoints.blogs.base);

      if (response.ok) {
        const data = await response.json();
        console.log("Received blog data:", data);
        setBlogPosts(data);
      } else {
        console.error("Error fetching blogs:", response.status);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Listen for blog updates from admin panel
  useEffect(() => {
    const handleBlogUpdate = () => {
      console.log("Blog update detected, refreshing...");
      fetchBlogs();
    };

    // Listen for custom blog update events
    window.addEventListener("blogUpdated", handleBlogUpdate);

    // Also listen for storage changes (in case admin is in different tab)
    const handleStorageChange = (e) => {
      if (e.key === "lastBlogUpdate") {
        fetchBlogs();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("blogUpdated", handleBlogUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const categories = [
    { name: "All", count: blogPosts.length },
    {
      name: "Travel Tips",
      count: blogPosts.filter((post) => post.category === "Travel Tips").length,
    },
    {
      name: "Wildlife",
      count: blogPosts.filter((post) => post.category === "Wildlife").length,
    },
    {
      name: "Conservation",
      count: blogPosts.filter((post) => post.category === "Conservation")
        .length,
    },
    {
      name: "Photography",
      count: blogPosts.filter((post) => post.category === "Photography").length,
    },
    {
      name: "Family Travel",
      count: blogPosts.filter((post) => post.category === "Family Travel")
        .length,
    },
    {
      name: "Birdwatching",
      count: blogPosts.filter((post) => post.category === "Birdwatching")
        .length,
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-[#e6e6e6] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#034123] sm:text-5xl sm:tracking-tight lg:text-6xl">
            Safari Blog & Tips
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-lg text-[#333333]">
            Expert advice, wildlife insights, and travel tips for your perfect
            safari experience.
          </p>
          <button
            onClick={fetchBlogs}
            className="mt-6 px-8 py-4 bg-[#f26b21] text-white rounded-lg hover:bg-[#034123] transition-all duration-300 font-semibold"
          >
            Refresh Blogs
          </button>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category.name
                    ? "bg-[#f26b21] text-white shadow-lg"
                    : "bg-white text-[#034123] border border-[#034123]/20 hover:border-[#f26b21] hover:text-[#f26b21]"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col rounded-2xl shadow-lg overflow-hidden bg-white border border-[#034123]/10 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.image}
                  alt={post.title}
                />
              </div>
              <div className="flex-1 bg-white p-8 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#f26b21] uppercase tracking-wide mb-3">
                    {post.category}
                  </p>
                  <Link to={`/blog/${post.id}`} className="block mt-2 group">
                    <h3 className="text-xl font-bold text-[#034123] group-hover:text-[#f26b21] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-[#333333] leading-relaxed">{post.excerpt}</p>
                  </Link>
                </div>
                <div className="mt-8 flex items-center pt-6 border-t border-[#e6e6e6]">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-[#034123] flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        YL
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-[#034123]">
                      Yala Safari Team
                    </p>
                    <div className="flex space-x-1 text-sm text-[#333333]/70">
                      <time dateTime={post.date}>{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#034123]/10">
            <h3 className="text-2xl font-bold text-[#034123]">
              No posts found in this category
            </h3>
            <p className="mt-4 text-[#333333]">
              We don't have any posts in the {activeCategory} category yet. Check
              back soon!
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-6 inline-flex items-center px-8 py-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#f26b21] hover:bg-[#034123] transition-all duration-300"
            >
              View All Posts
            </button>
          </div>
        )}

        <div className="mt-16 bg-white rounded-2xl p-10 text-center border border-[#034123]/10 shadow-lg">
          <h3 className="text-3xl font-bold text-[#034123]">
            Want more safari tips?
          </h3>
          <p className="mt-4 text-lg text-[#333333]">
            Subscribe to our newsletter for monthly updates on wildlife sightings,
            conservation news, and exclusive offers.
          </p>
          <form className="mt-8 sm:flex max-w-md mx-auto gap-3">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="flex-1 px-5 py-3 bg-[#e6e6e6] border border-[#034123]/20 rounded-lg text-[#034123] placeholder-[#034123]/50 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-[#f26b21] focus:bg-white transition-all duration-300"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-[#f26b21] hover:bg-[#034123] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f26b21] transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
