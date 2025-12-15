import { useState, useEffect, useCallback } from "react";
import { apiEndpoints, publicFetch, API_BASE_URL } from "../config/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/default-image.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

// Transform API response to component format
const transformImage = (image) => {
  return {
    id: image._id,
    url: getImageUrl(image.url),
    category: image.category || "gallery",
    alt: image.title || image.alt || "Yala Safari Image",
    caption: image.title || image.caption || "",
    title: image.title || "",
    featured: image.featured || false,
    createdAt: image.createdAt || image.uploadedAt,
  };
};

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching images from gallery API...");
      const response = await publicFetch(`${apiEndpoints.images.base}/gallery`);

      if (response.ok) {
        const result = await response.json();
        console.log("Received image data:", result);

        // Handle new API response structure: { success, count, images }
        if (result.success && Array.isArray(result.images)) {
          const transformedImages = result.images.map(transformImage);
          setImages(transformedImages);
        } else if (result.success && Array.isArray(result.data)) {
          // Fallback for { success, data, count } structure
          const transformedImages = result.data.map(transformImage);
          setImages(transformedImages);
        } else if (Array.isArray(result)) {
          // Fallback for old API structure (direct array)
          const transformedImages = result.map(transformImage);
          setImages(transformedImages);
        } else {
          console.error("Unexpected API response structure:", result);
          setImages([]);
        }
      } else {
        console.error("Error fetching images:", response.status);
        setImages([]);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Get unique categories from images
  const categories = [
    { name: "All", value: "all" },
    ...Array.from(
      new Set(images.map((img) => img.category).filter(Boolean))
    ).map((cat) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
    })),
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowRight") {
          const currentIndex = filteredImages.findIndex(
            (img) => img.id === selectedImage.id
          );
          if (currentIndex < filteredImages.length - 1) {
            setSelectedImage(filteredImages[currentIndex + 1]);
          }
        } else if (e.key === "ArrowLeft") {
          const currentIndex = filteredImages.findIndex(
            (img) => img.id === selectedImage.id
          );
          if (currentIndex > 0) {
            setSelectedImage(filteredImages[currentIndex - 1]);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <div className="bg-gradient-to-b from-[#e6e6e6] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#034123] sm:text-5xl sm:tracking-tight lg:text-6xl">
            Photo Gallery
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-lg text-[#333333]">
            Explore stunning wildlife photography and safari moments captured
            during our unforgettable Yala National Park adventures.
          </p>
          <button
            onClick={fetchImages}
            className="mt-6 px-8 py-4 bg-[#f26b21] text-white rounded-lg hover:bg-[#034123] transition-all duration-300 font-semibold"
          >
            Refresh Gallery
          </button>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#034123]/10 p-4 lg:p-6">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => {
                  const count = category.value === "all"
                    ? images.length
                    : images.filter((img) => img.category === category.value).length;
                  
                  return (
                    <button
                      key={category.value}
                      onClick={() => setActiveCategory(category.value)}
                      className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                        activeCategory === category.value
                          ? "bg-gradient-to-r from-[#f26b21] to-[#e05a1a] text-white shadow-xl scale-105"
                          : "bg-white/90 text-[#034123] border-2 border-[#034123]/20 hover:border-[#f26b21] hover:text-[#f26b21] hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      <span className="relative z-10">{category.name}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeCategory === category.value
                          ? "bg-white/20 text-white"
                          : "bg-[#034123]/10 text-[#034123]"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f26b21] to-[#034123] rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-[#034123]/20 border-t-[#f26b21] border-r-[#034123]"></div>
            </div>
            <p className="mt-6 text-lg text-[#333333] font-medium">Loading stunning images...</p>
            <p className="mt-2 text-sm text-[#6b7280]">Please wait while we fetch your gallery</p>
          </div>
        )}

        {/* Image Grid */}
        {!loading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative rounded-3xl shadow-xl overflow-hidden bg-white border-2 border-[#034123]/10 hover:border-[#f26b21]/50 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer"
                onClick={() => openLightbox(image)}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#e6e6e6] to-[#f5f5f5] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-72 object-cover group-hover:scale-125 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/default-image.jpg";
                    }}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Featured Badge */}
                  {image.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-[#fee000] to-[#f26b21] text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1.5 bg-[#034123]/90 text-white text-xs font-semibold rounded-full backdrop-blur-md shadow-lg border border-white/20">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </span>
                  </div>
                  
                  {/* Title/Caption Overlay */}
                  {(image.title || image.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-base font-bold mb-1 line-clamp-2">
                        {image.title || image.caption}
                      </p>
                      {image.createdAt && (
                        <p className="text-white/80 text-xs">
                          {new Date(image.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* View Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border-2 border-white/30">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-[#034123]/10 shadow-2xl">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#034123]/20 to-[#f26b21]/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#034123] to-[#026042] p-8 rounded-3xl shadow-xl">
                <div className="text-7xl">📷</div>
              </div>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-4">
              No images found
            </h3>
            <p className="mt-4 text-lg text-[#333333] max-w-md mx-auto">
              {activeCategory === "all"
                ? "We don't have any images in the gallery yet. Check back soon for stunning wildlife photography!"
                : `We don't have any images in the ${activeCategory} category yet.`}
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#f26b21] to-[#e05a1a] hover:from-[#e05a1a] hover:to-[#d04a10] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View All Images
              </button>
            )}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
          >
            <div className="relative max-w-7xl max-h-[95vh] mx-4 w-full">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-16 right-0 z-20 text-white hover:text-[#f26b21] transition-all duration-300 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm border-2 border-white/20 hover:border-[#f26b21] transform hover:scale-110"
                aria-label="Close lightbox"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredImages.findIndex(
                        (img) => img.id === selectedImage.id
                      );
                      if (currentIndex > 0) {
                        setSelectedImage(filteredImages[currentIndex - 1]);
                      } else {
                        setSelectedImage(filteredImages[filteredImages.length - 1]);
                      }
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-[#f26b21] transition-all duration-300 bg-black/60 hover:bg-black/80 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-md border-2 border-white/20 hover:border-[#f26b21] transform hover:scale-110 shadow-xl"
                    aria-label="Previous image"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredImages.findIndex(
                        (img) => img.id === selectedImage.id
                      );
                      if (currentIndex < filteredImages.length - 1) {
                        setSelectedImage(filteredImages[currentIndex + 1]);
                      } else {
                        setSelectedImage(filteredImages[0]);
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-[#f26b21] transition-all duration-300 bg-black/60 hover:bg-black/80 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-md border-2 border-white/20 hover:border-[#f26b21] transform hover:scale-110 shadow-xl"
                    aria-label="Next image"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                    {filteredImages.findIndex((img) => img.id === selectedImage.id) + 1} / {filteredImages.length}
                  </div>
                </>
              )}

              {/* Image Container */}
              <div className="relative bg-black/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain mx-auto block"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    e.target.src = "/default-image.jpg";
                  }}
                />

                {/* Image Info */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 lg:p-8 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-4xl mx-auto">
                    {(selectedImage.title || selectedImage.caption) && (
                      <h3 id="lightbox-title" className="text-white text-2xl lg:text-3xl font-bold mb-3">
                        {selectedImage.title || selectedImage.caption}
                      </h3>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-[#034123]/80 text-white text-sm font-semibold rounded-full backdrop-blur-sm border border-white/20">
                          {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                        </span>
                        {selectedImage.featured && (
                          <span className="px-4 py-2 bg-gradient-to-r from-[#fee000] to-[#f26b21] text-white text-sm font-bold rounded-full">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      {selectedImage.createdAt && (
                        <span className="text-white/90 text-sm font-medium">
                          📅 {new Date(selectedImage.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

