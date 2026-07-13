import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Tag, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, averageRating: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/products/${id}`),
      axios.get(`${API}/api/reviews/product/${id}`),
    ])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data.product);
        setReviews(revRes.data.reviews);
        setReviewStats({
          total: revRes.data.total,
          averageRating: revRes.data.averageRating,
          distribution: revRes.data.distribution,
        });
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    if (!reviewForm.comment.trim()) return toast.error("Please write a review");
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/reviews`, {
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReviews((prev) => [res.data.review, ...prev]);
      setReviewStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        averageRating: ((prev.averageRating * prev.total + reviewForm.rating) / (prev.total + 1)),
      }));
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Product not found
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
    ));

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="bg-slate-900 rounded-xl p-6">
            <img src={product.images?.[selectedImage] || product.images?.[0] || "https://via.placeholder.com/500"}
              alt={product.title} className="w-full h-64 sm:h-80 md:h-96 lg:h-[450px] object-cover rounded-lg" />
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? "border-blue-500" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center bg-green-600 px-2 py-1 rounded">
                <span className="mr-1">{reviewStats.averageRating || product.rating || "—"}</span>
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-slate-400">{reviewStats.total} Reviews</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl md:text-3xl font-bold text-blue-500">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="ml-3 text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="ml-3 text-green-500 font-semibold">{discount}% OFF</span>
                </>
              )}
            </div>
            {product.description && (
              <p className="mt-6 text-slate-300 leading-relaxed">{product.description}</p>
            )}
            <div className="bg-slate-900 p-5 rounded-xl mt-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Tag size={18} /> Available Offers</h3>
              <ul className="space-y-2 text-slate-300">
                <li>🏷️ 10% Instant Discount on HDFC Cards</li>
                <li>🏷️ Flat ₹500 Off on Orders Above ₹3000</li>
                <li>🏷️ No Cost EMI Available</li>
                <li>🚚 Free Delivery Available</li>
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Truck size={18} /> Delivery</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Enter Pincode"
                  className="bg-slate-800 px-4 py-3 rounded-lg outline-none flex-1" />
                <button className="bg-blue-500 hover:bg-blue-600 px-5 rounded-lg">Check</button>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700"><Minus size={18} /></button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700"><Plus size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <button onClick={() => { addToCart(product, quantity); toast.success("Added to cart"); }}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg">
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg">Buy Now</button>
              <button onClick={() => { addToWishlist(product); toast.success("Added to wishlist"); }}
                className="w-full flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 px-6 py-3 rounded-lg">
                <Heart size={20} /> Wishlist
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mt-10">
          <h2 className="text-2xl font-bold mb-4">Highlights</h2>
          <ul className="list-disc ml-6 space-y-2 text-slate-300">
            <li>Bluetooth 5.3 Connectivity</li>
            <li>30 Hours Battery Backup</li>
            <li>Active Noise Cancellation</li>
            <li>Fast Charging Support</li>
            <li>Built-in Microphone</li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mt-10">
          <h2 className="text-2xl font-bold mb-4">Specifications</h2>
          <ul className="space-y-3 text-slate-300">
            <li>Bluetooth 5.3 Connectivity</li>
            <li>30 Hours Battery Backup</li>
            <li>Active Noise Cancellation</li>
            <li>Fast Charging Support</li>
            <li>Built-in Microphone</li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 sm:p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-slate-400">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-b border-slate-700 pb-4 mb-4 last:border-none">
                <div className="flex items-center gap-2">
                  {review.userId?.profilePic ? (
                    <img src={review.userId.profilePic} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><User size={14} /></div>
                  )}
                  <span className="font-medium">{review.userId?.username || "Anonymous"}</span>
                  <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">{renderStars(review.rating)}</div>
                <p className="mt-2 text-slate-300">{review.comment}</p>
                {review.vendorReply && (
                  <div className="mt-2 ml-6 pl-4 border-l-2 border-blue-500">
                    <p className="text-xs text-blue-400 font-medium">Vendor Reply</p>
                    <p className="text-sm text-slate-400">{review.vendorReply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {user && (
          <div className="bg-slate-900 rounded-xl p-4 sm:p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}>
                    <Star size={24} className={star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Share your experience..." value={reviewForm.comment}
                onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none focus:border-blue-500 resize-none" />
              <button type="submit" disabled={submitting}
                className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-slate-900 rounded-xl p-4 hover:scale-105 transition">
                <img src={product.images?.[0] || "https://via.placeholder.com/150"} alt="Product"
                  className="w-full h-28 sm:h-40 object-cover rounded-lg" />
                <h3 className="mt-3 text-sm md:text-base font-semibold">{product.title}</h3>
                <p className="text-blue-500 font-bold mt-2">₹{product.price.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
