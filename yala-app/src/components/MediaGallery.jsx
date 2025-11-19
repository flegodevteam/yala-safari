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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", imageTitle);
    formData.append("category", selectedCategory);

    // In a real app, you would upload to your server here
    const newImage = {
      id: images.length + 1,
      url: URL.createObjectURL(selectedFile),
      title: imageTitle,
      category: selectedCategory,
      featured: false,
    };

    try {
      const response = await authenticatedFetch(apiEndpoints.images.base, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const newImage = await response.json();
        setImages([...images, newImage]);
        setUploadModalOpen(false);
        setSelectedFile(null);
        setImageTitle("");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Network error: " + err.message);
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
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
          <span className="text-sm font-semibold text-[#034123] whitespace-nowrap">
            Filter by category:
          </span>
          <select
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-sm text-[#1f2937] shadow-sm"
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

          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="flex-1 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-sm text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
            />
            <button
              onClick={addCategory}
              className="bg-[#034123] hover:bg-[#026042] text-white px-5 py-2.5 rounded-r-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {images
          .filter(
            (img) =>
              selectedCategory === "all" || img.category === selectedCategory
          )
          .map((image) => (
            <div
              key={image.id || image._id}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden relative group hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#e6e6e6] to-[#f5f5f5] overflow-hidden">
                <img
                  src={apiEndpoints.images.url(image.url)}
                  alt={image.title}
                  className="object-cover w-full h-48 lg:h-56"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-[#034123] truncate mb-2">
                  {image.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-[#034123]/10 text-[#034123] rounded-full px-3 py-1 text-xs font-semibold border border-[#034123]/20">
                    {image.category}
                  </span>
                  {image.featured && (
                    <span className="inline-block bg-[#fee000]/20 text-[#856404] rounded-full px-3 py-1 text-xs font-bold border border-[#fee000]/40">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-sm transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 space-x-3 rounded-2xl">
                <button
                  onClick={() => toggleFeatured(image._id || image.id)}
                  className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 ${
                    image.featured
                      ? "bg-[#fee000] text-[#034123]"
                      : "bg-white/95 backdrop-blur-sm text-[#034123]"
                  }`}
                  title={image.featured ? "Remove featured" : "Set as featured"}
                >
                  <FiBookmark className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteImage(image._id || image.id)}
                  className="p-3 rounded-xl bg-white/95 backdrop-blur-sm text-red-600 shadow-lg transition-all duration-300 hover:scale-110"
                  title="Delete image"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
      </div>

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
                    Title
                  </label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    required
                    placeholder="Image title"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#034123] mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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
                    disabled={!selectedFile}
                  >
                    Upload Image
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
