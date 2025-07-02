import React, { useEffect, useState } from "react";

const defaultPricing = {
  jeep: {
    basic: { morning: 5, afternoon: 5, extended: 7, fullDay: 10 },
    luxury: { morning: 7, afternoon: 7, extended: 9, fullDay: 12 },
    superLuxury: { morning: 10, afternoon: 10, extended: 12, fullDay: 15 },
  },
  shared: { 1: 10, 2: 8, 3: 7, 4: 5, 5: 5, 6: 5, 7: 5 },
  meals: { breakfast: 5, lunch: 6 },
  guide: { driver: 0, driverGuide: 10, separateGuide: 15 },
};
const defaultAvailability = {
  shared: ["2025-07-02", "2025-07-03"],
  private: ["2025-07-02", "2025-07-03", "2025-07-04"],
};

const AdminPackages = () => {
  const [pricing, setPricing] = useState(defaultPricing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/packages")
      .then((res) => res.json())
      .then((data) => {
  if (data && data.jeep && data.shared && data.meals && data.guide) setPricing(data);
  else setPricing(defaultPricing);
  setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleJeepChange = (type, slot, value) => {
    setPricing((prev) => ({
      ...prev,
      jeep: {
        ...prev.jeep,
        [type]: { ...prev.jeep[type], [slot]: Number(value) },
      },
    }));
  };

  const handleSharedChange = (num, value) => {
    setPricing((prev) => ({
      ...prev,
      shared: { ...prev.shared, [num]: Number(value) },
    }));
  };

  const handleMealsChange = (meal, value) => {
    setPricing((prev) => ({
      ...prev,
      meals: { ...prev.meals, [meal]: Number(value) },
    }));
  };

  const handleGuideChange = (type, value) => {
    setPricing((prev) => ({
      ...prev,
      guide: { ...prev.guide, [type]: Number(value) },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      if (res.ok) setMessage("Package pricing updated successfully!");
      else setMessage("Failed to update pricing.");
    } catch {
      setMessage("Failed to update pricing.");
    }
    setSaving(false);
  };

  if (
  !pricing ||
  !pricing.jeep ||
  !pricing.shared ||
  !pricing.meals ||
  !pricing.guide
) {
  return <div className="p-8">Loading...</div>;
}

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Manage Safari Packages & Pricing</h1>
      <form onSubmit={handleSave} className="space-y-8">
        {/* Jeep Pricing */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Jeep Pricing</h2>
          {["basic", "luxury", "superLuxury"].map((type) => (
            <div key={type} className="mb-4">
              <h3 className="font-medium capitalize mb-2">{type.replace(/([A-Z])/g, " $1")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["morning", "afternoon", "extended", "fullDay"].map((slot) => (
                  <div key={slot}>
                    <label className="block text-sm mb-1 capitalize">{slot}</label>
                    <input
                      type="number"
                      min={0}
                      value={pricing.jeep[type][slot]}
                      onChange={(e) => handleJeepChange(type, slot, e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Shared Pricing */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Shared Safari Pricing (per person)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num}>
                <label className="block text-sm mb-1">People: {num}</label>
                <input
                  type="number"
                  min={0}
                  value={pricing.shared[num]}
                  onChange={(e) => handleSharedChange(num, e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Meals Pricing */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Meals Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            {["breakfast", "lunch"].map((meal) => (
              <div key={meal}>
                <label className="block text-sm mb-1 capitalize">{meal}</label>
                <input
                  type="number"
                  min={0}
                  value={pricing.meals[meal]}
                  onChange={(e) => handleMealsChange(meal, e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Guide Pricing */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Guide Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "driver", label: "Driver Only" },
              { key: "driverGuide", label: "Driver + Guide" },
              { key: "separateGuide", label: "Separate Guide" },
            ].map((g) => (
              <div key={g.key}>
                <label className="block text-sm mb-1">{g.label}</label>
                <input
                  type="number"
                  min={0}
                  value={pricing.guide[g.key]}
                  onChange={(e) => handleGuideChange(g.key, e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && (
          <div className="mt-4 text-center text-green-700 font-semibold">{message}</div>
        )}
      </form>
    </div>
  );
};

export default AdminPackages;