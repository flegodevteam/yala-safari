import { useEffect, useState } from "react";
import { apiEndpoints, authenticatedFetch } from "../config/api";

const categories = [
  "Travel Tips",
  "Wildlife",
  "Conservation",
  "Photography",
  "Family Travel",
  "Birdwatching",
];

export default function BlogContentManager() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    date: "",
    category: categories[0],
    image: "",
    readTime: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await authenticatedFetch(apiEndpoints.blogs.base);
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch(apiEndpoints.blogs.base, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts([data, ...blogPosts]);
        setForm({
          title: "",
          excerpt: "",
          date: "",
          category: categories[0],
          image: "",
          readTime: "",
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);

        // Trigger events to notify other components about blog updates
        window.dispatchEvent(new CustomEvent("blogUpdated", { detail: data }));
        localStorage.setItem("lastBlogUpdate", Date.now().toString());
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await authenticatedFetch(apiEndpoints.blogs.byId(id), {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogPosts(
          blogPosts.filter((post) => post.id !== id && post._id !== id)
        );

        // Trigger events to notify other components about blog deletion
        window.dispatchEvent(
          new CustomEvent("blogUpdated", { detail: { deleted: id } })
        );
        localStorage.setItem("lastBlogUpdate", Date.now().toString());
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">Blog Content Manager</h2>
        <p className="text-[#6b7280] text-base">Create and manage blog posts</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Add New Blog Post */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
          <h3 className="text-2xl font-bold text-[#034123] mb-6 text-center lg:text-left">
            Add New Blog Post
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="Blog Title"
              />
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm resize-none"
                placeholder="Short description"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#034123] font-semibold mb-2 text-sm">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[#034123] font-semibold mb-2 text-sm">
                  Read Time
                </label>
                <input
                  name="readTime"
                  value={form.readTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                  placeholder="e.g. 4 min read"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Image URL
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="Optional image URL"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#034123] hover:bg-[#026042] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Add Blog Post
            </button>
            {success && (
              <div className="bg-[#034123]/10 border border-[#034123]/30 text-[#034123] text-center font-medium py-3 px-4 rounded-xl">
                ✓ Blog post added successfully!
              </div>
            )}
          </form>
        </div>

        {/* All Blog Posts */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
          <h3 className="text-2xl font-bold text-[#034123] mb-6 text-center lg:text-left">
            All Blog Posts
          </h3>
          <ul className="space-y-3 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {blogPosts.map((post) => (
              <li
                key={post._id ? post._id : post.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#f9fafb]/50 backdrop-blur-sm px-5 py-4 rounded-xl border border-[#e5e7eb]/60 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="font-semibold text-[#034123] mb-1">{post.title}</div>
                  <div className="text-sm text-[#6b7280]">
                    {post.category} | {post.date}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(post._id || post.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold whitespace-nowrap"
                >
                  Delete
                </button>
              </li>
            ))}
            {blogPosts.length === 0 && (
              <li className="text-[#6b7280] text-center py-12 bg-[#f9fafb]/50 rounded-xl border border-[#e5e7eb]/60">
                No blog posts found.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
