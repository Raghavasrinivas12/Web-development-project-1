import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Plus, Minus, Truck, Tag, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import axios from "axios";
import toast from "react-hot-toast";

import API from "../../config";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addItem, items } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, averageRating: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState(null);

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
        const d = revRes.data.distribution || {};
        setReviewStats({
          total: revRes.data.total,
          averageRating: revRes.data.averageRating,
          distribution: d,
        });
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const inCart = items.find((i) => i._id === id);

  const handleAddToCart = () => {
    if (!product || product.stockQuantity < 1) return toast.error("Out of stock");
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`Added ${quantity} to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleWishlist = () => {
    toggleItem(product);
    toast.success(isWishlisted(id) ? "Removed from wishlist" : "Added to wishlist");
  };

  const checkPincode = () => {
    if (!pincode || pincode.length !== 6) {
      setPincodeMsg({ type: "error", text: "Enter a valid 6-digit pincode" });
      return;
    }
    setPincodeMsg({ type: "success", text: "Delivery available in 3-5 business days" });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    if (!reviewForm.comment.trim()) return toast.error("Please write a review");
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/reviews`, {
        productId: id, rating: reviewForm.rating, comment: reviewForm.comment,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReviews((prev) => [res.data.review, ...prev]);
      const total = reviewStats.total + 1;
      const avg = ((reviewStats.averageRating * reviewStats.total + reviewForm.rating) / total);
      setReviewStats((prev) => ({ ...prev, total, averageRating: Math.round(avg * 10) / 10 }));
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const decQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incQty = () => setQuantity((q) => Math.min(product?.stockQuantity || 1, q + 1));

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
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-700 opacity-70 hover:opacity-100"}`}>
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
                <span className="mr-1 font-semibold">{reviewStats.averageRating || "—"}</span>
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-slate-400">{reviewStats.total} Reviews</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl md:text-3xl font-bold text-blue-500">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="ml-3 text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="ml-3 text-green-500 font-semibold">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            {product.category && <p className="text-sm text-slate-500 mt-2">Category: {product.category}</p>}
            {product.stockQuantity > 0 ? (
              <p className="text-sm text-green-400 mt-1">{product.stockQuantity} in stock</p>
            ) : (
              <p className="text-sm text-red-400 mt-1">Out of stock</p>
            )}
            {product.description && (
              <p className="mt-6 text-slate-300 leading-relaxed">{product.description}</p>
            )}
            <div className="bg-slate-900 p-5 rounded-xl mt-6 border border-slate-800">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Tag size={18} /> Available Offers</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>🏷️ 10% Instant Discount on HDFC Cards</li>
                <li>🏷️ Flat ₹500 Off on Orders Above ₹3000</li>
                <li>🏷️ No Cost EMI Available</li>
                <li>🚚 Free Delivery Available</li>
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Truck size={18} /> Delivery</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Enter Pincode" value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setPincodeMsg(null); }}
                  className="bg-slate-800 px-4 py-3 rounded-lg outline-none flex-1 border border-slate-700 focus:border-blue-500" />
                <button onClick={checkPincode}
                  className="bg-blue-500 hover:bg-blue-600 px-5 rounded-lg font-medium">Check</button>
              </div>
              {pincodeMsg && (
                <p className={`text-sm mt-2 ${pincodeMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {pincodeMsg.text}
                </p>
              )}
            </div>
            {product.stockQuantity > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button onClick={decQty} disabled={quantity <= 1}
                    className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 disabled:opacity-40"><Minus size={18} /></button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button onClick={incQty} disabled={quantity >= product.stockQuantity}
                    className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 disabled:opacity-40"><Plus size={18} /></button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <button onClick={handleAddToCart} disabled={!product.stockQuantity}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold">
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={!product.stockQuantity}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold">Buy Now</button>
              <button onClick={handleWishlist}
                className="w-full flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold">
                <Heart size={20} className={isWishlisted(id) ? "fill-red-500 text-red-500" : ""} /> Wishlist
              </button>
            </div>
            {inCart && (
              <p className="text-sm text-blue-400 mt-3 text-center">
                {inCart.quantity} in cart · <button onClick={() => navigate("/cart")} className="underline">View Cart</button>
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mt-10">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <ul className="space-y-2 text-slate-300">
            {product.description && <li><span className="text-slate-500">Description:</span> {product.description}</li>}
            {product.category && <li><span className="text-slate-500">Category:</span> {product.category}</li>}
            {product.variants?.length > 0 && (
              <li><span className="text-slate-500">Variants:</span> {product.variants.join(", ")}</li>
            )}
            <li><span className="text-slate-500">Price:</span> ₹{product.price.toLocaleString("en-IN")}</li>
            <li><span className="text-slate-500">Stock:</span> {product.stockQuantity} units</li>
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
                    <img src={review.userId.profilePic} alt="" className="w-8 h-8 rounded-full object-cover" />
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
                    <Star size={24} className={`transition ${star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600 hover:text-yellow-400"}`} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Share your experience..." value={reviewForm.comment}
                onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none focus:border-blue-500 resize-none" />
              <button type="submit" disabled={submitting}
                className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-2.5 rounded-lg font-semibold">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
