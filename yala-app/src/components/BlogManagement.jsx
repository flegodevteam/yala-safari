import { useState, useEffect } from "react";
import { apiEndpoints, authenticatedFetch, publicFetch } from "../config/api";
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiSave } from "react-icons/fi";

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
    author: { name: "Yala Safari Admin" },
    featuredImage: { url: "", caption: "", alt: "" },
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
      const response = await authenticatedFetch(apiEndpoints.blogs.base);
      const data = await response.json();
      setBlogs(data.data || data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("excerpt", formData.excerpt);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("categories", JSON.stringify([formData.category]));
    formDataToSend.append(
      "tags",
      JSON.stringify(formData.tags.split(",").map((t) => t.trim()))
    );
    formDataToSend.append("status", formData.status);
    formDataToSend.append(
      "author",
      JSON.stringify({ name: "Yala Safari Admin" })
    );

    if (imageFile) {
      formDataToSend.append("featuredImage", imageFile);
      formDataToSend.append("featuredImageCaption", formData.title);
      formDataToSend.append("featuredImageAlt", formData.title);
    }

    try {
      const url = editingBlog
        ? apiEndpoints.blogs.byId(editingBlog._id)
        : apiEndpoints.blogs.base;

      const response = await authenticatedFetch(url, {
        method: editingBlog ? "PUT" : "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success || response.ok) {
        alert(editingBlog ? "Blog updated!" : "Blog created!");
        setShowForm(false);
        setEditingBlog(null);
        resetForm();
        fetchBlogs();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.categories?.[0] || "Wildlife",
      tags: blog.tags?.join(", ") || "",
      status: blog.status || "draft",
      author: blog.author || { name: "Yala Safari Admin" },
      featuredImage: blog.featuredImage || { url: "", caption: "", alt: "" },
    });
    setImagePreview(blog.featuredImage?.url || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const response = await authenticatedFetch(apiEndpoints.blogs.byId(id), {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Blog deleted!");
        fetchBlogs();
      }
    } catch (error) {
      alert("Failed to delete blog");
    }
  };

  const handlePublish = async (id) => {
    try {
      const response = await authenticatedFetch(
        apiEndpoints.blogs.publish(id),
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        alert("Blog published!");
        fetchBlogs();
      }
    } catch (error) {
      alert("Failed to publish blog");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Wildlife",
      tags: "",
      status: "draft",
      author: { name: "Yala Safari Admin" },
      featuredImage: { url: "", caption: "", alt: "" },
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
            setShowForm(!showForm);
            setEditingBlog(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <FiPlus /> {showForm ? "Cancel" : "New Blog Post"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

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
              />
            </div>

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
              />
            </div>

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
            </div>

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
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-48 h-32 object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                <FiSave /> {editingBlog ? "Update" : "Create"} Blog
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
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
              <tr key={blog._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {blog.featuredImage?.url && (
                      <img
                        src={blog.featuredImage.url}
                        alt={blog.title}
                        className="h-10 w-10 rounded-md mr-3 object-cover"
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
            <p className="text-gray-500">No blog posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;