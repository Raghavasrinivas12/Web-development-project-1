import { useState } from "react";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import toast from "react-hot-toast";

const VendorReviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      customer: "Rahul Sharma",
      product: "Wireless Mouse",
      rating: 5,
      review: "Excellent quality and fast delivery.",
      date: "2026-07-08",
    },
    {
      id: 2,
      customer: "Priya Singh",
      product: "Gaming Keyboard",
      rating: 4,
      review: "Very good product. Worth buying.",
      date: "2026-07-07",
    },
    {
      id: 3,
      customer: "Arjun Patel",
      product: "USB Hub",
      rating: 5,
      review: "Highly recommended.",
      date: "2026-07-06",
    },
    {
      id: 4,
      customer: "Sneha Reddy",
      product: "Laptop Stand",
      rating: 2,
      review: "Packaging could be better.",
      date: "2026-07-05",
    },
  ]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [reply, setReply] = useState("");

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Average Rating
  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) /
    reviews.length
  ).toFixed(1);

  const positiveReviews = reviews.filter(
    (review) => review.rating >= 4
  ).length;

  const negativeReviews = reviews.filter(
    (review) => review.rating <= 2
  ).length;

  // Search + Filter
  const filteredReviews = reviews.filter((review) => {
    const searchMatch =
      review.customer.toLowerCase().includes(search.toLowerCase()) ||
      review.product.toLowerCase().includes(search.toLowerCase());

    const ratingMatch =
      ratingFilter === "All"
        ? true
        : review.rating === Number(ratingFilter);

    const dateMatch =
      dateFilter === "" ? true : review.date === dateFilter;

    return searchMatch && ratingMatch && dateMatch;
  });

  const ratingPercentage = (stars) => {
    const count = reviews.filter(
      (review) => review.rating === stars
    ).length;

    return (count / reviews.length) * 100;
  };

  const handleSendReply = () => {
    if (reply.trim() === "") {
      toast.error("Please enter your reply.");
      return;
    }

    toast.success("Reply sent successfully!");

    setReply("");
    setShowReplyModal(false);
    setSelectedReview(null);
  };

  const closeModal = () => {
    setShowReplyModal(false);
    setSelectedReview(null);
    setReply("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Reviews & Ratings
        </h1>

        <p className="text-slate-400 mt-2">
          View customer feedback and respond to reviews.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {/* Average Rating */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Average Rating
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {averageRating}
              </h2>
            </div>

            <Star
              className="text-yellow-400"
              size={32}
            />
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Total Reviews
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {reviews.length}
              </h2>
            </div>

            <MessageSquare
              className="text-blue-500"
              size={32}
            />
          </div>
        </div>

        {/* Positive Reviews */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Positive Reviews
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {positiveReviews}
              </h2>
            </div>

            <ThumbsUp
              className="text-green-500"
              size={32}
            />
          </div>
        </div>

        {/* Negative Reviews */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Negative Reviews
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {negativeReviews}
              </h2>
            </div>

            <ThumbsDown
              className="text-red-500"
              size={32}
            />
          </div>
        </div>
      </div>
            {/* Search & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">

          <input
            type="text"
            placeholder="Search customer or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Star)</option>
            <option value="4">⭐⭐⭐⭐ (4 Star)</option>
            <option value="3">⭐⭐⭐ (3 Star)</option>
            <option value="2">⭐⭐ (2 Star)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto mb-8">

        <table className="w-full">

          <thead className="bg-slate-800">
            <tr>
              <th className="text-left px-6 py-4">Customer</th>
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">Rating</th>
              <th className="text-left px-6 py-4">Review</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-left px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredReviews.length > 0 ? (

              filteredReviews.map((review) => (

                <tr
                  key={review.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                >

                  <td className="px-6 py-4 font-medium">
                    {review.customer}
                  </td>

                  <td className="px-6 py-4">
                    {review.product}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {review.review}
                  </td>

                  <td className="px-6 py-4">
                    {review.date}
                  </td>

                  <td className="px-6 py-4">

                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setShowReplyModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                    >
                      Reply
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-slate-400"
                >
                  No reviews found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800">

              <h2 className="text-2xl font-bold">
                Reply to Review
              </h2>

              <button
                onClick={closeModal}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>

            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              <div>
                <p className="text-slate-400 text-sm">
                  Customer
                </p>

                <h3 className="font-semibold">
                  {selectedReview.customer}
                </h3>
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Product
                </p>

                <h3>{selectedReview.product}</h3>
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Customer Review
                </p>

                <p>{selectedReview.review}</p>
              </div>

              <div>

                <label className="block text-slate-300 mb-2">
                  Your Reply
                </label>

                <textarea
                  rows={5}
                  placeholder="Write your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none focus:border-blue-500 resize-none"
                />

              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">

              <button
                onClick={closeModal}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSendReply}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
              >
                Send Reply
              </button>

            </div>

          </div>

        </div>

      )}
        {/* Rating Distribution & Recent Feedback */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* LEFT COLUMN */}
    <div className="space-y-6">

  {/* Rating Distribution */}
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 self-start">

    <h2 className="text-xl font-bold mb-6">
      Rating Distribution
    </h2>

    {[5, 4, 3, 2, 1].map((stars) => (
      <div
        key={stars}
        className="flex items-center gap-4 mb-5"
      >
        <div className="w-20 text-sm">
          {"⭐".repeat(stars)}
        </div>

        <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">

          <div
            className="bg-yellow-400 h-full rounded-full"
            style={{
              width: `${ratingPercentage(stars)}%`,
            }}
          />

        </div>

        <span className="text-sm text-slate-400 w-10 text-right">
          {reviews.filter((r) => r.rating === stars).length}
        </span>

      </div>
    ))}

  </div>
  {/* Customer Satisfaction */}
<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
    <div className="flex justify-between items-center">

        <div>
            <h2 className="text-lg font-semibold">
                Customer Satisfaction
            </h2>

            <h1 className="text-5xl font-bold text-green-400 mt-4">
                96%
            </h1>

            <p className="text-slate-400 mt-3">
                Most customers are satisfied with your products and service.
            </p>
        </div>

        <div className="bg-slate-800 p-5 rounded-full">
            <Star
                size={45}
                className="text-yellow-400 fill-yellow-400"
            />
        </div>

    </div>
</div>
{/* Review Insights */}
<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">

    <h2 className="text-lg font-semibold mb-5">
        Review Insights
    </h2>

    <div className="space-y-4">

        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <p className="text-slate-300">
                Customers appreciate fast delivery.
            </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <p className="text-slate-300">
                Product quality receives excellent ratings.
            </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <p className="text-slate-300">
                Packaging can be improved.
            </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <p className="text-slate-300">
                Overall customer experience is improving.
            </p>
        </div>

    </div>

</div>
</div>

  {/* Recent Feedback */}
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 self-start">

    <h2 className="text-xl font-bold mb-6">
      Recent Feedback
    </h2>

    <div className="space-y-5">

      {reviews.slice(0, 4).map((review) => (

        <div
          key={review.id}
          className="border-b border-slate-800 pb-4 last:border-none"
        >

          <div className="flex justify-between items-center">

            <h3 className="font-semibold">
              {review.customer}
            </h3>

            <div className="flex">
              {[...Array(review.rating)].map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

          </div>

          <p className="text-blue-400 text-sm mt-1">
            {review.product}
          </p>

          <p className="text-slate-300 mt-2">
            {review.review}
          </p>

          <p className="text-xs text-slate-500 mt-2">
            {review.date}
          </p>

        </div>

      ))}

    </div>

  </div>

</div>   

      </div>

   
  );
};

export default VendorReviews;