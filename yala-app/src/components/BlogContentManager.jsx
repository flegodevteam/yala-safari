import React, { useState, useEffect } from "react";
import { FiFileText, FiEdit, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";

const BlogContentManager = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Best Time to Visit Yala National Park",
      author: "Admin",
      date: "2023-05-15",
      status: "published",
      featuredImage: "https://example.com/blog1.jpg",
    },
    {
      id: 2,
      title: "Wildlife You Can Spot in Yala",
      author: "Admin",
      date: "2023-04-22",
      status: "draft",
      featuredImage: "https://example.com/blog2.jpg",
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setPosts([]);
      });
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [currentPost, setCurrentPost] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [postContent, setPostContent] = useState(
    "Write your blog post content here..."
  );
  const [packages, setPackages] = useState([]); // For storing fetched packages

  const handleEdit = (post) => {
    setCurrentPost(post);
    setIsEditorOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, status: newStatus } : post
      )
    );
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/blogs/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPosts((prev) => prev.filter((post) => post._id !== id));
      })
      .catch((error) => console.error("Error deleting blog post:", error));
  };

  const handleSavePost = () => {
    const method = currentPost ? "PATCH" : "POST";
    const url = currentPost
      ? `http://localhost:5000/api/blogs/${currentPost._id}`
      : "http://localhost:5000/api/blogs";

    const formData = new FormData();
    formData.append("title", currentPost?.title || "New Blog Post");
    formData.append("author", "Admin");
    formData.append("date", new Date().toISOString().split("T")[0]);
    formData.append("status", currentPost?.status || "draft");
    formData.append("content", postContent);
    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }

    fetch(url, {
      method,
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedImageFile(null);
        // ...update posts state as before...
      })
      .catch((error) => console.error("Error saving blog post:", error));
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/packages")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching packages:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Blog Posts</h3>
        <button
          onClick={() => {
            setCurrentPost(null);
            setIsEditorOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <FiFileText className="mr-2" /> New Post
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={post.featuredImage}
                            alt=""
                          />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={post.status}
                      onChange={(e) =>
                        handleStatusChange(post.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentPost
                  ? `Editing: ${currentPost.title}`
                  : "New Blog Post"}
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePost}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Post
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto">
              <div className="mb-4">
                <input
                  type="text"
                  value={currentPost?.title || ""}
                  onChange={(e) =>
                    setCurrentPost((cp) => ({ ...cp, title: e.target.value }))
                  }
                  placeholder="Post title"
                  className="w-full px-3 py-2 text-2xl font-bold border-b focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImageFile(e.target.files[0])}
                />
              </div>

              <div className="mb-4 flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image
                  </label>
                  <div className="flex items-center">
                    {currentPost?.featuredImage ? (
                      <>
                        <img
                          src={
                            currentPost.featuredImage?.startsWith("http")
                              ? currentPost.featuredImage
                              : `http://localhost:5000${currentPost.featuredImage}`
                          }
                          alt=""
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <button className="ml-2 text-sm text-red-600">
                          Remove
                        </button>
                      </>
                    ) : (
                      <button className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200">
                        Upload Image
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={currentPost?.status || "draft"}
                    onChange={(e) =>
                      setCurrentPost((cp) => ({
                        ...cp,
                        status: e.target.value,
                      }))
                    }
                    className="px-3 py-1 border rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* In a real app, you would use a proper rich text editor like TinyMCE or Quill */}
              <div className="border rounded-md p-4 min-h-[400px]">
                <textarea
                  className="w-full h-full min-h-[400px] p-2 focus:outline-none"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogContentManager;
