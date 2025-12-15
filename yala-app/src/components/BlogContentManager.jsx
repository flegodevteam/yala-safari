import { useEffect, useState, useRef } from "react";
import { apiEndpoints, authenticatedFetch } from "../config/api";

const availableCategories = [
  "Travel Tips",
  "Wildlife",
  "Conservation",
  "Photography",
  "Family Travel",
  "Birdwatching",
  "Destinations",
];

export default function BlogContentManager() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    categories: [availableCategories[0]],
    tags: "",
    status: "published",
    authorName: "Yala Safari Admin",
    featuredImage: null,
    featuredImageCaption: "",
    featuredImageAlt: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await authenticatedFetch(apiEndpoints.blogs.base);
        if (response.ok) {
          const result = await response.json();
          // Handle new API response structure: { success, data, count }
          if (result.success && Array.isArray(result.data)) {
            setBlogPosts(result.data);
          } else if (Array.isArray(result)) {
            // Fallback for old API structure (direct array)
            setBlogPosts(result);
          } else {
            console.error("Unexpected API response structure:", result);
            setBlogPosts([]);
          }
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogPosts([]);
      }
    };

    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      setForm({ ...form, [name]: files[0] || null });
    } else if (name === "categories") {
      // Handle multi-select for categories
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setForm({ ...form, categories: selectedOptions });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id || post.id);
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      categories: Array.isArray(post.categories) ? post.categories : [post.category || availableCategories[0]],
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      status: post.status || "draft",
      authorName: post.author?.name || "Yala Safari Admin",
      featuredImage: null,
      featuredImageCaption: post.featuredImage?.caption || "",
      featuredImageAlt: post.featuredImage?.alt || "",
    });
    setError("");
    setSuccess(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      categories: [availableCategories[0]],
      tags: "",
      status: "published",
      authorName: "Yala Safari Admin",
      featuredImage: null,
      featuredImageCaption: "",
      featuredImageAlt: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Add text fields
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("status", form.status);
      
      // Add author as JSON string
      formData.append("author", JSON.stringify({ name: form.authorName }));
      
      // Add categories as JSON string array
      formData.append("categories", JSON.stringify(form.categories));
      
      // Add tags as JSON string array - split by comma and trim
      if (form.tags) {
        const tagsArray = form.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
        formData.append("tags", JSON.stringify(tagsArray));
      } else {
        formData.append("tags", JSON.stringify([]));
      }
      
      // Add featured image file if provided (send file directly to blog endpoint)
      if (form.featuredImage) {
        formData.append("featuredImage", form.featuredImage);
      }
      
      // Add image metadata
      if (form.featuredImageCaption) {
        formData.append("featuredImageCaption", form.featuredImageCaption);
      }
      
      if (form.featuredImageAlt) {
        formData.append("featuredImageAlt", form.featuredImageAlt);
      }

      const endpoint = editingId 
        ? apiEndpoints.blogs.byId(editingId)
        : apiEndpoints.blogs.base;
      
      const method = editingId ? "PUT" : "POST";

      const response = await authenticatedFetch(endpoint, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          if (editingId) {
            // Update existing post in list
            setBlogPosts(blogPosts.map(post => 
              (post._id || post.id) === editingId ? result.data : post
            ));
          } else {
            // Add new post
            setBlogPosts([result.data, ...blogPosts]);
          }
          
          handleCancelEdit();
          setSuccess(true);
          setError("");
          setTimeout(() => setSuccess(false), 3000);

          // Trigger events to notify other components about blog updates
          window.dispatchEvent(new CustomEvent("blogUpdated", { detail: result.data }));
          localStorage.setItem("lastBlogUpdate", Date.now().toString());
        } else {
          setError(result.message || `Failed to ${editingId ? 'update' : 'create'} blog post`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'creating'} blog:`, error);
      setError(error.message || `An error occurred while ${editingId ? 'updating' : 'creating'} the blog post`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await authenticatedFetch(apiEndpoints.blogs.byId(id), {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setBlogPosts(
            blogPosts.filter((post) => post.id !== id && post._id !== id)
          );

          // Trigger events to notify other components about blog deletion
          window.dispatchEvent(
            new CustomEvent("blogUpdated", { detail: { deleted: id } })
          );
          localStorage.setItem("lastBlogUpdate", Date.now().toString());
        } else {
          setError(result.message || "Failed to delete blog post");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("An error occurred while deleting the blog post");
    }
  };

  const handlePublish = async (id) => {
    try {
      const response = await authenticatedFetch(
        `${apiEndpoints.blogs.byId(id)}/publish`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          // Update the post in the list
          setBlogPosts(blogPosts.map(post => 
            (post._id || post.id) === id ? { ...post, ...result.data } : post
          ));

          // Trigger events to notify other components
          window.dispatchEvent(new CustomEvent("blogUpdated", { detail: result.data }));
          localStorage.setItem("lastBlogUpdate", Date.now().toString());
          
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(result.message || "Failed to publish blog post");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to publish blog post");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      setError("An error occurred while publishing the blog post");
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
            {editingId ? "Edit Blog Post" : "Add New Blog Post"}
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
                rows={3}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm resize-none"
                placeholder="Short description"
              />
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Content
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm resize-none"
                placeholder="Full blog content..."
              />
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Categories (Hold Ctrl/Cmd to select multiple)
              </label>
              <select
                name="categories"
                value={form.categories}
                onChange={handleChange}
                multiple
                required
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm min-h-[100px]"
                size={4}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[#6b7280]">
                Selected: {form.categories.join(", ") || "None"}
              </p>
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Tags (comma-separated)
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="e.g. wildlife, yala, leopard"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#034123] font-semibold mb-2 text-sm">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-[#034123] font-semibold mb-2 text-sm">
                  Author Name
                </label>
                <input
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                  placeholder="Author name"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#034123] font-semibold mb-2 text-sm">
                Featured Image
              </label>
              <input
                ref={fileInputRef}
                name="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
              />
              {form.featuredImage && (
                <p className="mt-1 text-xs text-[#6b7280]">
                  Selected: {form.featuredImage.name}
                </p>
              )}
            </div>
            {form.featuredImage && (
              <>
                <div>
                  <label className="block text-[#034123] font-semibold mb-2 text-sm">
                    Image Caption
                  </label>
                  <input
                    name="featuredImageCaption"
                    value={form.featuredImageCaption}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="Image caption"
                  />
                </div>
                <div>
                  <label className="block text-[#034123] font-semibold mb-2 text-sm">
                    Image Alt Text
                  </label>
                  <input
                    name="featuredImageAlt"
                    value={form.featuredImageAlt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="Image alt text for accessibility"
                  />
                </div>
              </>
            )}
            <div className="flex gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-3.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`${editingId ? 'flex-1' : 'w-full'} py-3.5 bg-[#034123] hover:bg-[#026042] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {editingId ? "Update Blog Post" : "Add Blog Post"}
              </button>
            </div>
            {success && (
              <div className="bg-[#034123]/10 border border-[#034123]/30 text-[#034123] text-center font-medium py-3 px-4 rounded-xl">
                ✓ Blog post added successfully!
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 text-center font-medium py-3 px-4 rounded-xl">
                ✗ {error}
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
                  <div className="text-sm text-[#6b7280] space-y-1">
                    <div>
                      <span className="font-medium">Categories:</span>{" "}
                      {Array.isArray(post.categories)
                        ? post.categories.join(", ")
                        : post.category || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status || "draft"}
                      </span>
                    </div>
                    {post.publishedAt && (
                      <div>
                        <span className="font-medium">Published:</span>{" "}
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {post.status !== "published" && (
                    <button
                      onClick={() => handlePublish(post._id || post.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold whitespace-nowrap"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 bg-[#034123] hover:bg-[#026042] text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id || post.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
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
