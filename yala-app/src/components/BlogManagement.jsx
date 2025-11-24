import { useState, useEffect } from "react";
import { apiEndpoints, authenticatedFetch } from "../config/api";
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiSave, FiX } from "react-icons/fi";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Wildlife",
    tags: "",
    status: "draft",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Wildlife",
    "Safari Tips",
    "Destinations",
    "Conservation",
    "Travel Guide",
    "News",
    "Other",
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching blogs from:", apiEndpoints.blogs.base);
      
      const response = await authenticatedFetch(apiEndpoints.blogs.base);
      
      console.log("📡 Response status:", response.status);
      console.log("📡 Response OK:", response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Fetched blogs - Full response:", data);
        console.log("📊 Number of blogs:", data.data?.length || data.length || 0);
        
        setBlogs(data.data || data || []);
      } else {
        console.error("❌ Failed to fetch blogs:", response.status);
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
      }
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      console.error("❌ Error stack:", error.stack);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed - ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("🖼️ Image selected:", file);
    
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        console.error("❌ File too large:", file.size, "bytes");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only image files (JPEG, PNG, GIF, WebP) are allowed");
        console.error("❌ Invalid file type:", file.type);
        return;
      }

      console.log("✅ Image validation passed");
      console.log("   - Size:", (file.size / 1024).toFixed(2), "KB");
      console.log("   - Type:", file.type);
      console.log("   - Name:", file.name);

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        console.log("✅ Image preview generated");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("\n" + "=".repeat(60));
    console.log("📤 SUBMITTING BLOG POST");
    console.log("=".repeat(60));

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      console.log("📋 Form data to send:");
      console.log("   - Title:", formData.title);
      console.log("   - Excerpt:", formData.excerpt);
      console.log("   - Content length:", formData.content.length, "characters");
      console.log("   - Category:", formData.category);
      console.log("   - Tags:", formData.tags);
      console.log("   - Status:", formData.status);
      console.log("   - Has image:", !!imageFile);
      
      // Add text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("categories", JSON.stringify([formData.category]));
      
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      
      console.log("   - Processed tags:", tagsArray);
      formDataToSend.append("tags", JSON.stringify(tagsArray));
      formDataToSend.append("status", formData.status);
      formDataToSend.append("author", JSON.stringify({ name: "Yala Safari Admin" }));

      // Add featured image if selected
      if (imageFile) {
        console.log("🖼️ Adding image to FormData:");
        console.log("   - File name:", imageFile.name);
        console.log("   - File size:", (imageFile.size / 1024).toFixed(2), "KB");
        console.log("   - File type:", imageFile.type);
        
        formDataToSend.append("featuredImage", imageFile);
        formDataToSend.append("featuredImageCaption", formData.title);
        formDataToSend.append("featuredImageAlt", formData.title);
      }

      // Log all FormData entries
      console.log("\n📦 FormData contents:");
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`   ${pair[0]}:`, `[File: ${pair[1].name}]`);
        } else {
          console.log(`   ${pair[0]}:`, pair[1]);
        }
      }

      const url = editingBlog
        ? apiEndpoints.blogs.byId(editingBlog._id)
        : apiEndpoints.blogs.base;

      console.log("\n🌐 API Request:");
      console.log("   - URL:", url);
      console.log("   - Method:", editingBlog ? "PUT" : "POST");
      console.log("   - Editing:", !!editingBlog);

      const response = await authenticatedFetch(url, {
        method: editingBlog ? "PUT" : "POST",
        body: formDataToSend,
      });

      console.log("\n📡 Response received:");
      console.log("   - Status:", response.status);
      console.log("   - Status Text:", response.statusText);
      console.log("   - OK:", response.ok);

      const data = await response.json();
      console.log("\n📥 Response data:", data);
      console.log("   - Success:", data.success);
      console.log("   - Message:", data.message);
      
      if (data.error) {
        console.error("❌ Error in response:", data.error);
      }

      if (data.data) {
        console.log("✅ Created/Updated blog:");
        console.log("   - ID:", data.data._id);
        console.log("   - Title:", data.data.title);
        console.log("   - Status:", data.data.status);
      }

      if (data.success || response.ok) {
        console.log("✅ Blog operation successful!");
        alert(
          editingBlog
            ? "✅ Blog updated successfully!"
            : "✅ Blog created successfully!"
        );
        setShowForm(false);
        setEditingBlog(null);
        resetForm();
        fetchBlogs();
      } else {
        console.error("❌ Operation failed:", data.message);
        alert(`❌ ${data.message || "Operation failed"}`);
      }
    } catch (error) {
      console.error("\n❌ ERROR DURING SUBMISSION:");
      console.error("   - Message:", error.message);
      console.error("   - Stack:", error.stack);
      alert("❌ Failed to save blog. Check console for details.");
    } finally {
      setSubmitting(false);
      console.log("=".repeat(60) + "\n");
    }
  };

  const handleEdit = (blog) => {
    console.log("✏️ Editing blog:", blog);
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.categories?.[0] || "Wildlife",
      tags: blog.tags?.join(", ") || "",
      status: blog.status || "draft",
    });
    setImagePreview(blog.featuredImage?.url || "");
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this blog?"))
      return;

    try {
      console.log("🗑️ Deleting blog:", id);
      const response = await authenticatedFetch(apiEndpoints.blogs.byId(id), {
        method: "DELETE",
      });

      console.log("📡 Delete response:", response.status);

      if (response.ok) {
        console.log("✅ Blog deleted successfully");
        alert("✅ Blog deleted successfully!");
        fetchBlogs();
      } else {
        console.error("❌ Failed to delete blog");
        alert("❌ Failed to delete blog");
      }
    } catch (error) {
      console.error("❌ Error deleting blog:", error);
      alert("❌ Failed to delete blog");
    }
  };

  const handlePublish = async (id) => {
    try {
      console.log("📢 Publishing blog:", id);
      const response = await authenticatedFetch(
        apiEndpoints.blogs.publish(id),
        {
          method: "PATCH",
        }
      );

      console.log("📡 Publish response:", response.status);

      if (response.ok) {
        console.log("✅ Blog published successfully");
        alert("✅ Blog published successfully!");
        fetchBlogs();
      } else {
        console.error("❌ Failed to publish blog");
        alert("❌ Failed to publish blog");
      }
    } catch (error) {
      console.error("❌ Error publishing blog:", error);
      alert("❌ Failed to publish blog");
    }
  };

  const resetForm = () => {
    console.log("🔄 Resetting form");
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Wildlife",
      tags: "",
      status: "draft",
    });
    setImageFile(null);
    setImagePreview("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingBlog(null);
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            showForm
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {showForm ? (
            <>
              <FiX /> Cancel
            </>
          ) : (
            <>
              <FiPlus /> New Blog Post
            </>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter blog title"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt * (max 300 characters)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                maxLength={300}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description for the blog card"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/300 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="wildlife, safari, tips"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas (e.g., wildlife, safari, photography)
              </p>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
              </p>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                <FiSave />
                {submitting
                  ? "Saving..."
                  : editingBlog
                  ? "Update Blog"
                  : "Create Blog"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {blog.featuredImage?.url && (
                      <img
                        src={`https://squid-app-qwyej.ondigitalocean.app${blog.featuredImage.url}`}
                        alt={blog.title}
                        className="h-10 w-10 rounded-md mr-3 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {blog.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {blog.categories?.[0] || "Uncategorized"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      blog.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.views || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {blog.status === "draft" && (
                      <button
                        onClick={() => handlePublish(blog._id)}
                        className="text-green-600 hover:text-green-900"
                        title="Publish"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blog posts yet. Create your first post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;