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
    category: image.category || "uncategorized",
    alt: image.alt || "Yala Safari Image",
    caption: image.caption || "",
    createdAt: image.createdAt,
  };
};

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching images from API...");
      const response = await publicFetch(apiEndpoints.images.base);

      if (response.ok) {
        const result = await response.json();
        console.log("Received image data:", result);

        // Handle new API response structure: { success, data, count }
        if (result.success && Array.isArray(result.data)) {
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
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.value
                      ? "bg-[#f26b21] text-white shadow-lg"
                      : "bg-white text-[#034123] border border-[#034123]/20 hover:border-[#f26b21] hover:text-[#f26b21]"
                  }`}
                >
                  {category.name} (
                  {category.value === "all"
                    ? images.length
                    : images.filter((img) => img.category === category.value)
                        .length}
                  )
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f26b21]"></div>
            <p className="mt-4 text-[#333333]">Loading images...</p>
          </div>
        )}

        {/* Image Grid */}
        {!loading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-2xl shadow-lg overflow-hidden bg-white border border-[#034123]/10 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#e6e6e6] to-[#f5f5f5] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium truncate">
                      {image.caption}
                    </p>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-[#034123]/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    {image.category.charAt(0).toUpperCase() +
                      image.category.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#034123]/10">
            <h3 className="text-2xl font-bold text-[#034123]">
              No images found
            </h3>
            <p className="mt-4 text-[#333333]">
              {activeCategory === "all"
                ? "We don't have any images in the gallery yet. Check back soon!"
                : `We don't have any images in the ${activeCategory} category yet.`}
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-6 inline-flex items-center px-8 py-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#f26b21] hover:bg-[#034123] transition-all duration-300"
              >
                View All Images
              </button>
            )}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="relative max-w-6xl max-h-[90vh] mx-4">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-[#f26b21] transition-colors duration-300 text-4xl font-bold"
                aria-label="Close lightbox"
              >
                ×
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
                      }
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#f26b21] transition-colors duration-300 text-4xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredImages.findIndex(
                        (img) => img.id === selectedImage.id
                      );
                      if (currentIndex < filteredImages.length - 1) {
                        setSelectedImage(filteredImages[currentIndex + 1]);
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#f26b21] transition-colors duration-300 text-4xl font-bold bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image */}
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Info */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedImage.caption && (
                  <p className="text-white text-lg font-semibold mb-2">
                    {selectedImage.caption}
                  </p>
                )}
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>
                    {selectedImage.category.charAt(0).toUpperCase() +
                      selectedImage.category.slice(1)}
                  </span>
                  {selectedImage.createdAt && (
                    <span>
                      {new Date(selectedImage.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

