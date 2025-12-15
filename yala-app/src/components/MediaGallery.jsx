import React, { useState, useEffect } from "react";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { apiEndpoints, authenticatedFetch, API_BASE_URL } from "../config/api";

const MediaGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["package", "blog", "gallery", "wildlife"];
  const [filterCategory, setFilterCategory] = useState("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("gallery");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-image.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Build URL with optional category filter
        let url = apiEndpoints.images.base;
        if (filterCategory !== "all") {
          url += `?category=${filterCategory}`;
        }

        const response = await authenticatedFetch(url);
        if (response.ok) {
          const result = await response.json();
          
          // Handle new API response structure: { success, data, count }
          if (result.success && Array.isArray(result.data)) {
            setImages(result.data);
          } else if (Array.isArray(result)) {
            // Fallback for old API structure (direct array)
            setImages(result);
          } else {
            console.error("Unexpected API response structure:", result);
            setImages([]);
          }
        } else {
          setError("Failed to fetch images");
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to fetch images");
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [filterCategory]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !imageTitle.trim()) {
      setError("Please select an image and provide a title");
      return;
    }

    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("category", selectedCategory);
      formData.append("title", imageTitle);

      const response = await authenticatedFetch(apiEndpoints.images.base, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // API returns image directly: { title, url, category, featured, _id, ... }
        if (result._id || result.url) {
          setImages([result, ...images]);
          setUploadModalOpen(false);
          setSelectedFile(null);
          setImageTitle("");
          setSelectedCategory("gallery");
          setError("");
        } else if (result.success && result.data) {
          // Fallback for wrapped response
          setImages([result.data, ...images]);
          setUploadModalOpen(false);
          setSelectedFile(null);
          setImageTitle("");
          setSelectedCategory("gallery");
          setError("");
        } else {
          setError(result.message || "Upload failed - unexpected response");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message || "Network error occurred");
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setError("");
      const response = await authenticatedFetch(apiEndpoints.images.byId(id), {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setImages(images.filter((img) => (img._id || img.id) !== id));
        } else {
          setError(result.message || "Delete failed");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError(err.message || "Network error occurred");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">Media Gallery</h3>
          <p className="text-[#6b7280] text-base">Manage your safari images and media</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-[#f26b21] hover:bg-[#e05a1a] text-white px-5 py-3 rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <FiImage className="w-5 h-5" /> Upload Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 lg:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-semibold text-[#034123] whitespace-nowrap">
            Filter by category:
          </span>
          <select
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-sm text-[#1f2937] shadow-sm"
            onChange={(e) => setFilterCategory(e.target.value)}
            value={filterCategory}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f26b21]"></div>
          <p className="mt-4 text-[#6b7280]">Loading images...</p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && (
        <>
          {images.length === 0 ? (
            <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
              <p className="text-[#6b7280] text-lg">No images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden relative group hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#e6e6e6] to-[#f5f5f5] overflow-hidden">
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.title || image.alt || "Gallery image"}
                      className="object-cover w-full h-48 lg:h-56"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    {image.title && (
                      <h4 className="font-semibold text-[#034123] truncate mb-2">
                        {image.title}
                      </h4>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-[#034123]/10 text-[#034123] rounded-full px-3 py-1 text-xs font-semibold border border-[#034123]/20">
                        {image.category}
                      </span>
                      {image.featured && (
                        <span className="inline-block bg-[#fee000]/20 text-[#856404] rounded-full px-3 py-1 text-xs font-bold border border-[#fee000]/40">
                          ⭐ Featured
                        </span>
                      )}
                      {(image.createdAt || image.uploadedAt) && (
                        <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-semibold">
                          {new Date(image.createdAt || image.uploadedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-sm transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 space-x-3 rounded-2xl">
                    <button
                      onClick={() => deleteImage(image._id)}
                      className="p-3 rounded-xl bg-white/95 backdrop-blur-sm text-red-600 shadow-lg transition-all duration-300 hover:scale-110"
                      title="Delete image"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setUploadModalOpen(false)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 lg:p-8">
              <h3 className="text-2xl font-bold text-[#034123] mb-6">
                Upload New Image
              </h3>
              <form onSubmit={handleUpload}>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#034123] mb-2">
                    Image File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-[#d1d5db]/60 border-dashed rounded-xl bg-[#f9fafb]/50 backdrop-blur-sm hover:border-[#034123]/40 transition-all duration-300">
                    <div className="space-y-2 text-center">
                      {selectedFile ? (
                        <div>
                          <p className="text-sm font-medium text-[#034123] mb-2">
                            {selectedFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-sm text-red-600 hover:text-red-700 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-[#6b7280] gap-1">
                            <label className="relative cursor-pointer font-semibold text-[#034123] hover:text-[#026042] transition-colors duration-300">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/*"
                              />
                            </label>
                            <span>or drag and drop</span>
                          </div>
                          <p className="text-xs text-[#9ca3af]">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#034123] mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#034123] mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g. Yala National Park Elephant"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-5 py-3 border border-[#d1d5db]/60 rounded-xl text-sm font-semibold text-[#4b5563] hover:bg-[#f9fafb] transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-[#034123] hover:bg-[#026042] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034123]/50 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedFile || !selectedCategory || !imageTitle.trim()}
                  >
                    Upload Image
                  </button>
                </div>
                {error && (
                  <div className="mt-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
