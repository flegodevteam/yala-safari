import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiEndpoints, publicFetch, API_BASE_URL } from "../config/api";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log("Fetching blogs from API...");
      const response = await publicFetch(apiEndpoints.blogs.base);

      if (response.ok) {
        const data = await response.json();
        console.log("Received blog data:", data);
        // Handle both array and object responses
        const blogs = Array.isArray(data) ? data : (data.data || []);
        // Filter only published blogs for public view
        const publishedBlogs = blogs.filter(blog => blog.status === 'published');
        console.log("Published blogs:", publishedBlogs);
        setBlogPosts(publishedBlogs);
      } else {
        console.error("Error fetching blogs:", response.status);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Generate categories dynamically from blogs
  const categories = [
    { name: "All", count: blogPosts.length },
    ...Array.from(new Set(blogPosts.flatMap(post => post.categories || [])))
      .map(cat => ({
        name: cat,
        count: blogPosts.filter(post => post.categories?.includes(cat)).length
      }))
  ];

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.categories?.includes(activeCategory));

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/default-blog.jpg";
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the backend URL
    return `${API_BASE_URL}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Safari Blog & Tips
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Expert advice, wildlife insights, and travel tips for your perfect
          safari experience.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                activeCategory === category.name
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            key={post._id}
            className="flex flex-col rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <div className="flex-shrink-0">
              <img
                className="h-48 w-full object-cover"
                src={getImageUrl(post.featuredImage?.url)}
                alt={post.title}
                onError={(e) => {
                  console.error("Image failed to load:", post.featuredImage?.url);
                  e.target.src = "/default-blog.jpg";
                }}
              />
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600">
                  {post.categories?.[0] || "General"}
                </p>
                <Link to={`/blog/${post._id}`} className="block mt-2">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                </Link>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">
                      YS
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {post.author?.name || "Yala Safari Team"}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No posts found
          </h3>
          <p className="mt-2 text-gray-600">
            {activeCategory === "All" 
              ? "No blog posts available yet. Check back soon!"
              : `No posts in the ${activeCategory} category yet.`}
          </p>
          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              View All Posts
            </button>
          )}
        </div>
      )}

      <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900">
          Want more safari tips?
        </h3>
        <p className="mt-4 text-gray-600">
          Subscribe to our newsletter for monthly updates on wildlife sightings,
          conservation news, and exclusive offers.
        </p>
        <form className="mt-6 sm:flex max-w-md mx-auto">
          <input
            id="email-address"
            name="email"
            type="email"
            required
            className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:max-w-xs rounded-md"
            placeholder="Enter your email"
          />
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}