import { useEffect, useState } from "react";
import axios from "axios";

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
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => setBlogPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/blogs", form);
      setBlogPosts([res.data, ...blogPosts]);
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
      window.dispatchEvent(
        new CustomEvent("blogUpdated", { detail: res.data })
      );
      localStorage.setItem("lastBlogUpdate", Date.now().toString());
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setBlogPosts(
        blogPosts.filter((post) => post.id !== id && post._id !== id)
      );

      // Trigger events to notify other components about blog deletion
      window.dispatchEvent(
        new CustomEvent("blogUpdated", { detail: { deleted: id } })
      );
      localStorage.setItem("lastBlogUpdate", Date.now().toString());
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  return (
    <div className="mt-12 bg-white p-5  rounded-xl shadow-lg flex justify-around gap-5">
      <div>
        {" "}
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Add New Blog Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="Blog Title"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="Short description"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                Date
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                Read Time
              </label>
              <input
                name="readTime"
                value={form.readTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                placeholder="e.g. 4 min read"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="Optional image URL"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Add Blog Post
          </button>
          {success && (
            <div className="text-green-600 text-center font-medium mt-2">
              Blog post added successfully!
            </div>
          )}
        </form>
      </div>

      <hr className="my-8" />
      <div>
        {" "}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          All Blog Posts
        </h3>
        <ul className="space-y-4">
          {blogPosts.map((post) => (
            <li
              key={post._id ? post._id : post.id}
              className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md shadow"
            >
              <div>
                <div className="font-medium text-gray-900">{post.title}</div>
                <div className="text-sm text-gray-500">
                  {post.category} | {post.date}
                </div>
              </div>
              <button
                onClick={() => handleDelete(post._id || post.id)}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
          {blogPosts.length === 0 && (
            <li className="text-gray-500 text-center">No blog posts found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
