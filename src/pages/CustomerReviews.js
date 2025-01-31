import React, { useState } from "react";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([
    { name: "John Doe", rating: 5, comment: "Amazing safari experience!" },
    {
      name: "Jane Smith",
      rating: 4,
      comment: "Beautiful scenery and great guides.",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([...reviews, newReview]);
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Customer Reviews</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {reviews.map((review, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{review.name}</h3>
            <p className="text-yellow-500">
              Rating: {"⭐".repeat(review.rating)}
            </p>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-bold mb-4">Submit Your Review</h3>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded-md mb-2"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          required
        />
        <select
          className="w-full p-2 border rounded-md mb-2"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: parseInt(e.target.value) })
          }
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>
        <textarea
          placeholder="Your Feedback"
          className="w-full p-2 border rounded-md mb-2"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default CustomerReviews;
