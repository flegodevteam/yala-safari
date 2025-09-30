import React, { useState, useEffect } from "react";
import { FiImage, FiBookmark, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { apiEndpoints, authenticatedFetch } from "../config/api";

const MediaGallery = () => {
  const [images, setImages] = useState([
    {
      id: 1,
      url: "https://example.com/image1.jpg",
      title: "Leopard in Yala",
      category: "wildlife",
      featured: true,
    },
    {
      id: 2,
      url: "https://example.com/image2.jpg",
      title: "Elephant herd",
      category: "wildlife",
      featured: false,
    },
    {
      id: 3,
      url: "https://example.com/image3.jpg",
      title: "Safari jeep",
      category: "equipment",
      featured: false,
    },
  ]);

  const [categories, setCategories] = useState([
    "wildlife",
    "landscape",
    "equipment",
    "people",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("wildlife");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        e.target.value = ""; // Clear the input
        return;
      }

      setSelectedFile(file);
      console.log(
        "File selected:",
        file.name,
        file.type,
        (file.size / 1024 / 1024).toFixed(2) + "MB"
      );
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await authenticatedFetch(apiEndpoints.images.base);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (err) {
        alert("Failed to fetch images");
      }
    };

    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    if (!imageTitle.trim()) {
      alert("Please enter a title for the image");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", imageTitle);
    formData.append("category", selectedCategory);

    console.log("MediaGallery: Starting image upload...");
    console.log("API endpoint:", apiEndpoints.images.base);
    console.log(
      "File:",
      selectedFile.name,
      selectedFile.type,
      selectedFile.size
    );
    console.log("Title:", imageTitle);
    console.log("Category:", selectedCategory);
    
    // Log the auth token to verify it exists
    const token = localStorage.getItem('adminToken');
    console.log("Auth token present:", !!token);
    if (token) {
      console.log("Token preview:", token.substring(0, 20) + "...");
    }

    try {
      const response = await authenticatedFetch(apiEndpoints.images.base, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header for FormData - let browser set it
      });

      console.log("MediaGallery: Upload response status:", response.status);
      console.log("MediaGallery: Response headers:", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const newImage = await response.json();
        console.log("MediaGallery: Upload successful:", newImage);
        setImages([...images, newImage]);
        setUploadModalOpen(false);
        setSelectedFile(null);
        setImageTitle("");
        alert("Image uploaded successfully!");
      } else {
        let errorData;
        try {
          errorData = await response.json();
          console.error("MediaGallery: Upload failed (JSON):", response.status, errorData);
        } catch (e) {
          errorData = await response.text();
          console.error("MediaGallery: Upload failed (Text):", response.status, errorData);
        }
        
        const errorMessage = errorData?.error || errorData?.message || errorData || `HTTP ${response.status}`;
        alert(`Upload failed: ${errorMessage}`);
      }
    } catch (err) {
      console.error("MediaGallery: Network error:", err);
      alert("Network error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (id) => {
    if (!id) return;
    try {
      const response = await authenticatedFetch(
        apiEndpoints.images.featured(id),
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        const updated = await response.json();
        setImages(
          images.map((img) =>
            (img._id || img.id) === id
              ? updated
              : img.featured
              ? { ...img, featured: false }
              : img
          )
        );
      } else {
        alert("Failed to update featured status");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const deleteImage = async (id) => {
    try {
      const response = await authenticatedFetch(apiEndpoints.images.byId(id), {
        method: "DELETE",
      });
      if (response.ok) {
        setImages(images.filter((img) => img.id !== id && img._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Media Gallery</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FiImage className="mr-2" /> Upload Image
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Filter by category:
        </span>
        <select
          className="border rounded-md px-3 py-1 text-sm"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center ml-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="border rounded-l-md px-3 py-1 text-sm"
          />
          <button
            onClick={addCategory}
            className="bg-gray-200 px-3 py-1 rounded-r-md text-sm hover:bg-gray-300"
          >
            Add
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images
          .filter(
            (img) =>
              selectedCategory === "all" || img.category === selectedCategory
          )
          .map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow overflow-hidden relative group"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 overflow-hidden">
                <img
                  src={apiEndpoints.images.url(image.url)}
                  alt={image.title}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 truncate">
                  {image.title}
                </h4>
                <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
                  {image.category}
                </span>
                {image.featured && (
                  <span className="inline-block bg-yellow-100 rounded-full px-2 py-1 text-xs font-semibold text-yellow-800">
                    Featured
                  </span>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 space-x-2">
                <button
                  onClick={() => toggleFeatured(image._id)}
                  className={`p-2 rounded-full ${
                    image.featured
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  title={image.featured ? "Remove featured" : "Set as featured"}
                >
                  <FiBookmark />
                </button>
                <button
                  onClick={() => deleteImage(image._id)}
                  className="p-2 rounded-full bg-white text-red-600"
                  title="Delete image"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload New Image
              </h3>
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {selectedFile ? (
                        <div>
                          <div className="mb-3">
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt="Preview"
                              className="mx-auto h-24 w-24 object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            JPEG, PNG, GIF, WebP up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      uploading || !selectedFile || !imageTitle.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    disabled={uploading || !selectedFile || !imageTitle.trim()}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
