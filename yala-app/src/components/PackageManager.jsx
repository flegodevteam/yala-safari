import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

      // First try to fetch from API
      const response = await fetch(
        "http://localhost:5000/api/packages/current"
      );
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
        const response = await fetch(
          "http://localhost:5000/api/admin/packages",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pricing),
          }
        );

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Package Manager</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            {/* Jeep Pricing Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Jeep Safari Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(pricing.jeep).map(([jeepType, timeSlots]) => (
                  <div
                    key={jeepType}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold mb-4 capitalize">
                      {jeepType.replace(/([A-Z])/g, " $1").trim()} Jeep
                    </h3>

                    <div className="space-y-3">
                      {Object.entries(timeSlots).map(([slot, price]) => (
                        <div
                          key={slot}
                          className="flex items-center justify-between"
                        >
                          <label className="capitalize">
                            {slot.replace(/([A-Z])/g, " $1").trim()}:
                          </label>
                          <div className="flex items-center">
                            <span className="mr-2">$</span>
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
                              className="w-20 border rounded px-2 py-1"
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
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Shared Safari Pricing (Per Person)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Object.entries(pricing.shared).map(([people, price]) => (
                  <div
                    key={people}
                    className="border rounded-lg p-4 bg-gray-50 text-center"
                  >
                    <div className="font-medium mb-2">
                      {people} {people === "1" ? "Person" : "People"}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="mr-1">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(`shared.${people}`, e.target.value)
                        }
                        className="w-20 border rounded px-2 py-1 text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Guide Pricing */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Guide Options Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(pricing.guide).map(([guideType, price]) => (
                  <div
                    key={guideType}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold mb-2 capitalize">
                      {guideType.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
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
                        className="w-20 border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Meal Pricing */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Meal Options Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(pricing.meals).map(([mealType, price]) => (
                  <div
                    key={mealType}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold mb-2 capitalize">
                      {mealType}
                    </h3>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(`meals.${mealType}`, e.target.value)
                        }
                        className="w-20 border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                onClick={resetToDefaults}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                disabled={saving}
              >
                Reset Defaults
              </button>
              <button
                onClick={savePricing}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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
