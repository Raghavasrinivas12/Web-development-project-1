import React,{ useState } from "react";
import {
  Store,
  BadgeCheck,
  Star,
  Package,
  ShoppingBag,
  Users,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import ContactVendor from "../../Components/ContactVendor";
import FollowStore from "../../Components/FollowStore";
import ProductPreview from "../../Components/ProductPreview";

const vendor = {
  name: "Royal Fashion Store",
  logo: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
  banner:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
  rating: 4.8,
  followers: 2450,
  products: 124,
  orders: 1528,
  joined: "January 2025",
  email: "royalfashion@gmail.com",
  phone: "+91 9876543210",
  location: "Chennai, Tamil Nadu",
  description:
    "Royal Fashion Store specializes in premium ethnic wear, wedding collections, sherwanis, kurtas, suits, and accessories. Our mission is to provide high-quality fashion with excellent customer service.",
};

const featuredProducts = [
  {
    id: 1,
    name: "Royal Wedding Sherwani",
    image: "https://images.unsplash.com/photo-1783188223239-d27dbdd0b95a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNoZXJ3YW5pfGVufDB8fDB8fHww",
    price: 12999,
    rating: 4.8,
    category: "Sherwani",
    description:
      "Premium handcrafted royal wedding sherwani with embroidery and luxurious fabric.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },

  {
    id: 2,
    name: "Premium Silk Kurta",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    price: 3999,
    rating: 4.7,
    category: "Kurta",
    description:
      "Comfortable premium silk kurta suitable for festivals and traditional events.",
    sizes: ["M", "L", "XL"],
  },

  {
    id: 3,
    name: "Designer Jodhpuri Suit",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    price: 16999,
    rating: 4.9,
    category: "Suit",
    description:
      "Elegant designer Jodhpuri suit made from premium fabric for weddings.",
    sizes: ["S", "M", "L", "XL"],
  },

  {
    id: 4,
    name: "Traditional Kurta Set",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
    price: 5499,
    rating: 4.6,
    category: "Kurta Set",
    description:
      "Traditional kurta set with matching pajama designed for festive occasions.",
    sizes: ["M", "L", "XL", "XXL"],
  },
];


const AboutVendor = () => {
    const [showContact, setShowContact] = useState(false);

const [showFollow, setShowFollow] = useState(false);

const [showProduct, setShowProduct] = useState(false);

const [selectedProduct, setSelectedProduct] = useState(null);

const [following, setFollowing] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Banner */}

      <div className="relative h-72 md:h-96">

        <img
          src={vendor.banner}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

      </div>

      {/* Vendor Hero */}

      <div className="max-w-7xl mx-auto px-6">

        <div className="relative -mt-20">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

            <div className="flex flex-col lg:flex-row gap-8 items-center">

              {/* Logo */}

              <img
                src={vendor.logo}
                alt="Logo"
                className="w-36 h-36 rounded-2xl border-4 border-slate-700 object-cover"
              />

              {/* Vendor Details */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-4xl font-bold">
                    {vendor.name}
                  </h1>

                  <span className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-full text-sm">

                    <BadgeCheck size={16} />

                    Verified Seller

                  </span>

                </div>

                <div className="flex items-center gap-2 mt-4">

                  <Star
                    className="text-yellow-400 fill-yellow-400"
                    size={20}
                  />

                  <span className="text-lg font-semibold">
                    {vendor.rating}
                  </span>

                  <span className="text-slate-400">
                    Customer Rating
                  </span>

                </div>

                <p className="text-slate-300 mt-6 leading-7">
                  {vendor.description}
                </p>

                <div className="flex flex-wrap gap-6 mt-6 text-slate-300">

                  <div className="flex items-center gap-2">

                    <MapPin size={18} />

                    {vendor.location}

                  </div>

                  <div className="flex items-center gap-2">

                    <Phone size={18} />

                    {vendor.phone}

                  </div>

                  <div className="flex items-center gap-2">

                    <Mail size={18} />

                    {vendor.email}

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-4 w-full lg:w-auto">

                <button onClick={() => setShowContact(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
>
    Contact Vendor
</button>

                <button
    onClick={() => setShowFollow(true)}
    className={`px-6 py-3 rounded-xl font-semibold transition ${
        following
            ? "bg-green-600 hover:bg-green-700"
            : "bg-slate-800 hover:bg-slate-700"
    }`}
>
    {following ? "✔ Following" : "Follow Store"}
</button>

              </div>

            </div>

          </div>

        </div>

      </div>
            {/* Statistics */}

      <section className="max-w-7xl mx-auto px-6 mt-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  Total Products
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {vendor.products}
                </h2>
              </div>

              <div className="bg-blue-500/10 p-4 rounded-xl">
                <Package className="text-blue-500" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  Orders Delivered
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {vendor.orders}
                </h2>
              </div>

              <div className="bg-green-500/10 p-4 rounded-xl">
                <ShoppingBag className="text-green-500" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  Followers
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {vendor.followers}
                </h2>
              </div>

              <div className="bg-purple-500/10 p-4 rounded-xl">
                <Users className="text-purple-500" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  Store Rating
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {vendor.rating}
                </h2>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-xl">
                <Star
                  className="text-yellow-400 fill-yellow-400"
                  size={32}
                />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* About Store */}

      <section className="max-w-7xl mx-auto px-6 mt-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left */}

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              About Our Store
            </h2>

            <p className="text-slate-300 leading-8">
              Royal Fashion Store has become one of the trusted fashion
              destinations for premium ethnic wear. Our collection includes
              sherwanis, kurtas, suits, wedding accessories, festive outfits,
              and traditional collections designed with quality craftsmanship.
            </p>

            <p className="text-slate-300 leading-8 mt-6">
              We believe in offering premium quality, affordable pricing,
              secure payments, fast delivery, and excellent customer support.
              Thousands of customers trust our store for their wedding and
              festive shopping needs.
            </p>

          </div>

          {/* Right */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Store Information
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Store Name
                </span>

                <span>{vendor.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Joined
                </span>

                <span>{vendor.joined}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Location
                </span>

                <span>{vendor.location}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Email
                </span>

                <span>{vendor.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Phone
                </span>

                <span>{vendor.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Status
                </span>

                <span className="text-green-400">
                  Active
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

            {/* Store Performance & Policies */}

      <section className="max-w-7xl mx-auto px-6 mt-10 mb-12">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Store Performance */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-8">
              Store Performance
            </h2>

            <div className="space-y-8">

              <div>
                <div className="flex justify-between mb-2">
                  <span>Customer Satisfaction</span>
                  <span className="text-green-400">98%</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-[98%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Order Fulfillment</span>
                  <span className="text-blue-400">96%</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[96%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Success</span>
                  <span className="text-purple-400">94%</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[94%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Repeat Customers</span>
                  <span className="text-yellow-400">87%</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full w-[87%]"></div>
                </div>
              </div>

            </div>

          </div>

          {/* Store Policies */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-8">
              Store Policies
            </h2>

            <div className="space-y-6">

              <div className="border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-lg">
                  Shipping Policy
                </h3>

                <p className="text-slate-400 mt-2">
                  Orders are processed within 24 hours and usually delivered
                  within 3–7 business days depending on the delivery location.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-lg">
                  Return Policy
                </h3>

                <p className="text-slate-400 mt-2">
                  Customers can request returns within 7 days for damaged,
                  defective, or incorrect products.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-lg">
                  Customer Support
                </h3>

                <p className="text-slate-400 mt-2">
                  Our support team is available Monday to Saturday,
                  9:00 AM – 7:00 PM for all customer queries.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Featured Products */}

<section className="max-w-7xl mx-auto px-6 mt-12">

    <div className="flex justify-between items-center mb-8">

        <div>

            <h2 className="text-3xl font-bold">
                Featured Products
            </h2>

            <p className="text-slate-400 mt-2">
                Best selling products from this vendor.
            </p>

        </div>

      <button
onClick={() => {
    setSelectedProduct(featuredProducts[0]);
    setShowProduct(true);
}}
className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
>
View Featured Product
</button>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {featuredProducts.map((product) => (

            <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500 transition duration-300 hover:-translate-y-1"
            >

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                />

                <div className="p-5">

                    <h3 className="text-lg font-semibold">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-4">

                        <span className="text-blue-400 text-xl font-bold">
                            ₹{product.price.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1">

                            <Star
                                size={18}
                                className="text-yellow-400 fill-yellow-400"
                            />

                            {product.rating}

                        </div>

                    </div>

                    <button
    onClick={() => {
        setSelectedProduct(product);
        setShowProduct(true);
    }}
    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
>
    View Product
</button>

                </div>

            </div>

        ))}

    </div>

</section>

{/* Customer Reviews */}

<section className="max-w-7xl mx-auto px-6 mt-12 mb-20">

    <h2 className="text-3xl font-bold mb-8">
        Customer Reviews
    </h2>

    <div className="space-y-6">

        {[1,2,3].map((item)=>(

            <div
                key={item}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >

                <div className="flex justify-between items-center">

                    <div>

                        <h3 className="font-semibold text-lg">
                            Rahul Sharma
                        </h3>

                        <div className="flex mt-2">

                            {[...Array(5)].map((_,index)=>(

                                <Star
                                    key={index}
                                    size={18}
                                    className="text-yellow-400 fill-yellow-400"
                                />

                            ))}

                        </div>

                    </div>

                    <span className="text-slate-400">
                        2 Days Ago
                    </span>

                </div>

                <p className="text-slate-300 mt-5 leading-7">

                    Amazing shopping experience. The quality exceeded my expectations,
                    delivery was quick and packaging was excellent.

                </p>

            </div>

        ))}

    </div>

</section>

{/* Contact Vendor */}

{showContact && (

<ContactVendor
    vendor={vendor}
    onClose={() => setShowContact(false)}
/>

)}

{/* Follow Store */}

{showFollow && (

<FollowStore
    vendor={vendor}
    following={following}
    onClose={() => setShowFollow(false)}

    onFollow={() => {
        setFollowing(true);
        setShowFollow(false);
    }}

    onUnfollow={() => {
        setFollowing(false);
        setShowFollow(false);
    }}
/>

)}

{/* Product Preview */}

{showProduct && (

<ProductPreview
    product={selectedProduct}
    onClose={() => {
        setShowProduct(false);
        setSelectedProduct(null);
    }}
/>

)}
    </div>
  );
};

export default AboutVendor;