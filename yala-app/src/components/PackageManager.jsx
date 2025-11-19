import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft, FiSave, FiRotateCcw } from "react-icons/fi";
import { apiEndpoints, authenticatedFetch } from "../config/api";

const PackageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pricing, setPricing] = useState({
    jeep: {
      basic: { morning: 0, afternoon: 0, extended: 0, fullDay: 0 },
      luxury: { morning: 0, afternoon: 0, extended: 0, fullDay: 0 },
      superLuxury: { morning: 0, afternoon: 0, extended: 0, fullDay: 0 },
    },
    shared: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    },
    meals: {
      breakfast: 0,
      lunch: 0,
    },
    guide: {
      driver: 0,
      driverGuide: 0,
      separateGuide: 0,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      console.log("PackageManager: Fetching pricing...");

      // First try to fetch from API with authentication
      const response = await authenticatedFetch(apiEndpoints.packages.current);
      console.log("PackageManager: Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("PackageManager: Received data from API:", data);
        if (data) {
          setPricing(data);
          // Save to localStorage as backup
          localStorage.setItem("currentPricing", JSON.stringify(data));
        }
      } else {
        throw new Error("API response not OK");
      }
      setLoading(false);
    } catch (error) {
      console.error("PackageManager: Error fetching from API:", error);
      console.log("PackageManager: Trying localStorage fallback...");

      // Fallback to localStorage
      const savedPricing = localStorage.getItem("currentPricing");
      if (savedPricing) {
        try {
          const data = JSON.parse(savedPricing);
          console.log("PackageManager: Loaded from localStorage:", data);
          setPricing(data);
        } catch (parseError) {
          console.error(
            "PackageManager: Error parsing localStorage data:",
            parseError
          );
        }
      }
      setLoading(false);
    }
  };

  const handlePriceChange = (path, value) => {
    const pathParts = path.split(".");
    const newPricing = { ...pricing };

    let current = newPricing;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }

    current[pathParts[pathParts.length - 1]] = parseFloat(value) || 0;
    setPricing(newPricing);
  };

  const savePricing = async () => {
    setSaving(true);
    try {
      console.log("PackageManager: Saving pricing:", pricing);

      // Save to localStorage immediately for instant sync
      localStorage.setItem("currentPricing", JSON.stringify(pricing));
      console.log("PackageManager: Saved to localStorage");

      // Try to save to API
      try {
        const response = await authenticatedFetch(apiEndpoints.packages.admin, {
          method: "PUT",
          body: JSON.stringify(pricing),
        });

        console.log("PackageManager: Save response status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("PackageManager: Save result:", result);
          toast.success("Pricing updated successfully!");
        } else {
          const errorData = await response.json();
          console.error("PackageManager: API Save error:", errorData);
          toast.success("Pricing updated locally (API unavailable)");
        }
      } catch (apiError) {
        console.error("PackageManager: API Error:", apiError);
        toast.success("Pricing updated locally (API unavailable)");
      }

      // Trigger events to notify other components about the pricing update
      console.log("PackageManager: Dispatching pricing update events");
      window.dispatchEvent(
        new CustomEvent("pricingUpdated", { detail: pricing })
      );
      localStorage.setItem("lastPricingUpdate", Date.now().toString());
    } catch (error) {
      console.error("PackageManager: Error saving pricing:", error);
      toast.error("Failed to update pricing");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setPricing({
      jeep: {
        basic: { morning: 5, afternoon: 5, extended: 7, fullDay: 10 },
        luxury: { morning: 7, afternoon: 7, extended: 9, fullDay: 12 },
        superLuxury: { morning: 10, afternoon: 10, extended: 12, fullDay: 15 },
      },
      shared: {
        1: 10,
        2: 8,
        3: 7,
        4: 5,
        5: 5,
        6: 5,
        7: 5,
      },
      meals: {
        breakfast: 5,
        lunch: 6,
      },
      guide: {
        driver: 0,
        driverGuide: 10,
        separateGuide: 15,
      },
    });
    toast.info("Reset to default pricing");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034123] mb-4"></div>
        <span className="text-[#4b5563] font-medium">Loading pricing data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">Package Manager</h1>
            <p className="text-[#6b7280] text-base">Manage safari package pricing</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-xl hover:bg-white text-[#034123] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-8">
          <div className="p-4 lg:p-6 xl:p-8">
            {/* Jeep Pricing Section */}
            <section className="mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-6 pb-3 border-b border-[#034123]/20">
                🚙 Jeep Safari Pricing
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {Object.entries(pricing.jeep).map(([jeepType, timeSlots]) => (
                  <div
                    key={jeepType}
                    className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-[#034123] mb-4 capitalize border-b border-[#034123]/20 pb-2">
                      {jeepType.replace(/([A-Z])/g, " $1").trim()} Jeep
                    </h3>

                    <div className="space-y-3">
                      {Object.entries(timeSlots).map(([slot, price]) => (
                        <div
                          key={slot}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                        >
                          <label className="text-sm font-semibold text-[#1f2937] capitalize">
                            {slot.replace(/([A-Z])/g, " $1").trim()}:
                          </label>
                          <div className="flex items-center w-full sm:w-auto">
                            <span className="mr-2 text-[#034123] font-semibold">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={price}
                              onChange={(e) =>
                                handlePriceChange(
                                  `jeep.${jeepType}.${slot}`,
                                  e.target.value
                                )
                              }
                              className="flex-1 sm:w-24 px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shared Safari Pricing */}
            <section className="mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-6 pb-3 border-b border-[#034123]/20">
                👥 Shared Safari Pricing (Per Person)
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
                {Object.entries(pricing.shared).map(([people, price]) => (
                  <div
                    key={people}
                    className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 border border-[#e5e7eb]/60 hover:shadow-md transition-all duration-300 text-center"
                  >
                    <div className="font-semibold text-[#034123] mb-3 text-sm lg:text-base">
                      {people} {people === "1" ? "Person" : "People"}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[#034123] font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(`shared.${people}`, e.target.value)
                        }
                        className="w-full sm:w-20 px-2 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-center text-[#1f2937] shadow-sm text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Guide Pricing */}
            <section className="mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-6 pb-3 border-b border-[#034123]/20">
                👨‍✈️ Guide Options Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {Object.entries(pricing.guide).map(([guideType, price]) => (
                  <div
                    key={guideType}
                    className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-base lg:text-lg font-bold text-[#034123] mb-3 capitalize border-b border-[#034123]/20 pb-2">
                      {guideType.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[#034123] font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(
                            `guide.${guideType}`,
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Meal Pricing */}
            <section className="mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-6 pb-3 border-b border-[#034123]/20">
                🍽️ Meal Options Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {Object.entries(pricing.meals).map(([mealType, price]) => (
                  <div
                    key={mealType}
                    className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-base lg:text-lg font-bold text-[#034123] mb-3 capitalize border-b border-[#034123]/20 pb-2">
                      {mealType}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[#034123] font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(`meals.${mealType}`, e.target.value)
                        }
                        className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 lg:gap-4 mt-8 pt-6 border-t border-[#e5e7eb]">
              <button
                onClick={resetToDefaults}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#f9fafb] hover:bg-[#e5e7eb] text-[#4b5563] font-semibold rounded-xl transition-all duration-300 border border-[#d1d5db]/60 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                <FiRotateCcw className="w-5 h-5" />
                Reset Defaults
              </button>
              <button
                onClick={savePricing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#034123] hover:bg-[#026042] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageManager;
