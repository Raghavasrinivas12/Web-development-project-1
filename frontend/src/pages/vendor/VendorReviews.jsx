import { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

import API from "../../config";

const VendorReviews = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, averageRating: 0, positive: 0, negative: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");

  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/reviews/vendor`, { headers })
      .then((res) => {
        setReviews(res.data.reviews);
        setStats({
          total: res.data.total,
          averageRating: res.data.averageRating,
          positive: res.data.positive,
          negative: res.data.negative,
          distribution: res.data.distribution,
        });
      })
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, []);

  const handleSendReply = async () => {
    if (!reply.trim()) return toast.error("Please enter your reply.");
    if (!selectedReview) return;
    setSendingReply(true);
    try {
      const res = await axios.post(`${API}/api/reviews/${selectedReview._id}/reply`, { reply }, { headers });
      setReviews((prev) => prev.map((r) => (r._id === selectedReview._id ? { ...r, vendorReply: reply } : r)));
      toast.success(res.data.msg);
      setReply("");
      setShowReplyModal(false);
      setSelectedReview(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const ratingPercentage = (stars) => {
    if (stats.total === 0) return 0;
    return (stats.distribution[stars] || 0) / stats.total * 100;
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = (r.userId?.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.productName || "").toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === "All" || r.rating === Number(ratingFilter);
    return matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
        <p className="text-slate-400 mt-2">View customer feedback and respond to reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Average Rating</p>
              <h2 className="text-3xl font-bold mt-2">{stats.averageRating}</h2>
            </div>
            <Star className="text-yellow-400" size={32} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Reviews</p>
              <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
            </div>
            <MessageSquare className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Positive Reviews</p>
              <h2 className="text-3xl font-bold mt-2">{stats.positive}</h2>
            </div>
            <ThumbsUp className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Negative Reviews</p>
              <h2 className="text-3xl font-bold mt-2">{stats.negative}</h2>
            </div>
            <ThumbsDown className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <input type="text" placeholder="Search customer or product..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500">
            <option value="All">All Ratings</option>
            {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{'⭐'.repeat(s)} ({s} Star)</option>)}
          </select>
        </div>
      </div>

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
                <tr key={review._id} className="border-t border-slate-800 hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {review.userId?.profilePic ? (
                      <img src={review.userId.profilePic} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center"><User size={12} /></div>
                    )}
                    {review.userId?.username || "Unknown"}
                  </td>
                  <td className="px-6 py-4">{review.productName}</td>
                  <td className="px-6 py-4">
                    <div className="flex">{Array.from({ length: review.rating }, (_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{review.comment}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(review.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    {review.vendorReply ? (
                      <span className="text-green-400 text-sm">Replied</span>
                    ) : (
                      <button onClick={() => { setSelectedReview(review); setShowReplyModal(true); }}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">Reply</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-8 text-slate-400">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold">Reply to Review</h2>
              <button onClick={() => { setShowReplyModal(false); setSelectedReview(null); setReply(""); }}
                className="text-2xl text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-slate-400 text-sm">Customer</p>
                <h3 className="font-semibold">{selectedReview.userId?.username || "Unknown"}</h3>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Product</p>
                <h3>{selectedReview.productName}</h3>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Customer Review</p>
                <p>{selectedReview.comment}</p>
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Your Reply</label>
                <textarea rows={5} placeholder="Write your reply..." value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button onClick={() => { setShowReplyModal(false); setSelectedReview(null); setReply(""); }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg">Cancel</button>
              <button onClick={handleSendReply} disabled={sendingReply}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-2 rounded-lg">
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 self-start">
            <h2 className="text-xl font-bold mb-6">Rating Distribution</h2>
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-4 mb-5">
                <div className="w-20 text-sm">{'⭐'.repeat(stars)}</div>
                <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${ratingPercentage(stars)}%` }} />
                </div>
                <span className="text-sm text-slate-400 w-10 text-right">{stats.distribution[stars] || 0}</span>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Customer Satisfaction</h2>
                <h1 className="text-5xl font-bold text-green-400 mt-4">
                  {stats.total ? Math.round((stats.positive / stats.total) * 100) : 0}%
                </h1>
                <p className="text-slate-400 mt-3">Most customers are satisfied with your products and service.</p>
              </div>
              <div className="bg-slate-800 p-5 rounded-full">
                <Star size={45} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 self-start">
          <h2 className="text-xl font-bold mb-6">Recent Feedback</h2>
          <div className="space-y-5">
            {reviews.slice(0, 4).map((review) => (
              <div key={review._id} className="border-b border-slate-800 pb-4 last:border-none">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{review.userId?.username || "Unknown"}</h3>
                  <div className="flex">{Array.from({ length: review.rating }, (_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}</div>
                </div>
                <p className="text-blue-400 text-sm mt-1">{review.productName}</p>
                <p className="text-slate-300 mt-2">{review.comment}</p>
                <p className="text-xs text-slate-500 mt-2">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorReviews;
