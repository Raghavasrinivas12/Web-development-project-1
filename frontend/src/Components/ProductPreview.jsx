import {
  X,
  Star,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
} from "lucide-react";

const ProductPreview = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden">

        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b border-slate-800">

          <h2 className="text-2xl font-bold text-white">
            Product Details
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="grid lg:grid-cols-2 gap-8 p-8">

          {/* Left */}

          <div>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[450px] object-cover rounded-xl border border-slate-700"
            />

          </div>

          {/* Right */}

          <div className="space-y-6">

            <div>

              <h2 className="text-3xl font-bold text-white">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-3">

                <Star
                  size={18}
                  className="text-yellow-400 fill-yellow-400"
                />

                <span className="text-slate-300">
                  {product.rating} / 5
                </span>

              </div>

            </div>

            <div>

              <p className="text-4xl font-bold text-blue-400">

                ₹{product.price.toLocaleString("en-IN")}

              </p>

            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-3">

                <Package className="text-green-400" />

                <span>
                  Category: {product.category || "Ethnic Wear"}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Truck className="text-blue-400" />

                <span>
                  Delivery within 3–5 Business Days
                </span>

              </div>

            </div>

            <div>

              <h3 className="text-lg font-semibold mb-3">
                Description
              </h3>

              <p className="text-slate-400 leading-7">

                {product.description ||
                  "Premium handcrafted ethnic wear made with high-quality fabric. Designed for weddings, festivals, and special occasions to provide both comfort and elegance."}

              </p>

            </div>

            <div>

              <h3 className="text-lg font-semibold mb-3">
                Available Sizes
              </h3>

              <div className="flex flex-wrap gap-3">

                {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map(
                  (size) => (
                    <div
                      key={size}
                      className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
                    >
                      {size}
                    </div>
                  )
                )}

              </div>

            </div>

            {/* Buttons */}

            <div className="grid grid-cols-2 gap-4 pt-4">

              <button className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">

                <ShoppingCart size={20} />

                Add to Cart

              </button>

              <button className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold transition">

                <CreditCard size={20} />

                Buy Now

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductPreview;