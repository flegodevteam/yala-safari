import { useState, useEffect, useCallback } from "react";
import { apiEndpoints, publicFetch, API_BASE_URL } from "../config/api";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to calculate read time from content
const calculateReadTime = (content) => {
  if (!content) return "5 min read";
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/default-blog.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

// Transform API response to component format
const transformBlogPost = (post) => {
  const publishedDate = post.publishedAt || post.createdAt;
  return {
    id: post._id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content || post.excerpt, // Store full content for modal
    image: getImageUrl(post.featuredImage?.url),
    category: post.categories && post.categories.length > 0 ? post.categories[0] : "Uncategorized",
    date: formatDate(publishedDate),
    dateTime: publishedDate, // Original ISO date for dateTime attribute
    readTime: calculateReadTime(post.content),
    author: post.author?.name || "Yala Safari Team",
    tags: post.tags || [],
  };
};

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      console.log("Fetching blogs from API...");
      const response = await publicFetch(apiEndpoints.blogs.base);

      if (response.ok) {
        const result = await response.json();
        console.log("Received blog data:", result);
        
        // Handle new API response structure: { success, data, count }
        if (result.success && Array.isArray(result.data)) {
          const transformedPosts = result.data
            .filter((post) => post.status === "published" && post.isActive)
            .map(transformBlogPost);
          setBlogPosts(transformedPosts);
        } else if (Array.isArray(result)) {
          // Fallback for old API structure (direct array)
          const transformedPosts = result.map(transformBlogPost);
          setBlogPosts(transformedPosts);
        } else {
          console.error("Unexpected API response structure:", result);
          setBlogPosts([]);
        }
      } else {
        console.error("Error fetching blogs:", response.status);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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
  }, [fetchBlogs]);

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

  // Modal handlers
  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  // Close modal on ESC key
  useEffect(() => {
    if (!isModalOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

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
              onClick={() => openModal(post)}
              className="flex flex-col rounded-2xl shadow-lg overflow-hidden bg-white border border-[#034123]/10 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                  <div className="block mt-2 group">
                    <h3 className="text-xl font-bold text-[#034123] group-hover:text-[#f26b21] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-[#333333] leading-relaxed">{post.excerpt}</p>
                  </div>
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
                      {post.author}
                    </p>
                    <div className="flex space-x-1 text-sm text-[#333333]/70">
                      <time dateTime={post.dateTime}>{post.date}</time>
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

      {/* Blog Post Modal */}
      {isModalOpen && selectedPost && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-[#034123] shadow-lg hover:bg-[#e6e6e6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f26b21]"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="bg-white">
                {/* Featured Image */}
                <div className="relative h-64 sm:h-96 w-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={selectedPost.image}
                    alt={selectedPost.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-sm font-semibold text-white uppercase tracking-wide mb-2">
                      {selectedPost.category}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-6 sm:px-8 py-8">
                  {/* Author and Meta Info */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e6e6e6]">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-full bg-[#034123] flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          YL
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#034123]">
                          {selectedPost.author}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-[#333333]/70 mt-1">
                          <time dateTime={selectedPost.dateTime}>
                            {selectedPost.date}
                          </time>
                          <span aria-hidden="true">&middot;</span>
                          <span>{selectedPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="prose prose-lg max-w-none">
                    <div
                      className="text-[#333333] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: selectedPost.content
                          ? (selectedPost.content.includes("<") && selectedPost.content.includes(">")
                              ? selectedPost.content
                              : selectedPost.content.replace(/\n/g, "<br />"))
                          : selectedPost.excerpt,
                      }}
                    ></div>
                  </div>

                  {/* Tags (if available) */}
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-[#e6e6e6]">
                      <p className="text-sm font-semibold text-[#034123] mb-3">
                        Tags:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#e6e6e6] text-[#034123] rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
