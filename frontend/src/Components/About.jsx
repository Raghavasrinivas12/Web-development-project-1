import {
  ShoppingBag,
  Target,
  Eye,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Users,
  Store,
  Package,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <div className="w-20 h-20 mx-auto bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
            <ShoppingBag size={38} />
          </div>

          <h1 className="text-5xl font-bold mt-6">
            About <span className="text-blue-500">ShopHub</span>
          </h1>

          <p className="text-slate-300 mt-6 max-w-3xl mx-auto text-lg leading-8">
            ShopHub is a modern multi-vendor marketplace where customers
            discover trusted stores, quality products, secure payments,
            and fast delivery—all in one place.
          </p>

        </div>
      </section>

      {/* Story */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"
            alt="About ShopHub"
            className="rounded-3xl"
          />

          <div>

            <h2 className="text-4xl font-bold">
              Our Story
            </h2>

            <p className="text-slate-300 mt-6 leading-8">
              ShopHub was created with a simple vision—to help customers
              shop from multiple trusted vendors through one secure
              platform.
            </p>

            <p className="text-slate-300 mt-5 leading-8">
              Instead of visiting multiple websites, customers can explore
              electronics, fashion, accessories, groceries and much more
              from verified sellers while enjoying a seamless shopping
              experience.
            </p>

          </div>

        </div>

      </section>

      {/* Mission Vision */}

      <section className="bg-slate-900 py-20">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">

          <div className="bg-slate-800 rounded-2xl p-8">

            <Target className="text-blue-500" size={40} />

            <h2 className="text-3xl font-bold mt-6">
              Our Mission
            </h2>

            <p className="text-slate-300 mt-5 leading-8">
              To empower businesses by providing a reliable marketplace
              while giving customers the best online shopping experience
              through quality products, trusted vendors and excellent
              customer service.
            </p>

          </div>

          <div className="bg-slate-800 rounded-2xl p-8">

            <Eye className="text-blue-500" size={40} />

            <h2 className="text-3xl font-bold mt-6">
              Our Vision
            </h2>

            <p className="text-slate-300 mt-5 leading-8">
              To become one of India's leading multi-vendor marketplaces,
              connecting millions of buyers and sellers through innovation,
              trust and technology.
            </p>

          </div>

        </div>

      </section>

      {/* Why Choose */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-center">
          Why Choose ShopHub?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <ShieldCheck className="mx-auto text-blue-500" size={42} />
            <h3 className="font-bold text-xl mt-5">
              Secure Shopping
            </h3>
            <p className="text-slate-400 mt-4">
              Safe payments and trusted vendors.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <Truck className="mx-auto text-blue-500" size={42} />
            <h3 className="font-bold text-xl mt-5">
              Fast Delivery
            </h3>
            <p className="text-slate-400 mt-4">
              Quick and reliable shipping across India.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <BadgeCheck className="mx-auto text-blue-500" size={42} />
            <h3 className="font-bold text-xl mt-5">
              Verified Sellers
            </h3>
            <p className="text-slate-400 mt-4">
              Genuine stores with quality products.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <Users className="mx-auto text-blue-500" size={42} />
            <h3 className="font-bold text-xl mt-5">
              Customer First
            </h3>
            <p className="text-slate-400 mt-4">
              Dedicated customer support whenever you need.
            </p>
          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="bg-slate-900 py-20">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="text-center">
            <Store className="mx-auto text-blue-500" size={42} />
            <h2 className="text-4xl font-bold mt-4">500+</h2>
            <p className="text-slate-400 mt-2">Stores</p>
          </div>

          <div className="text-center">
            <Package className="mx-auto text-blue-500" size={42} />
            <h2 className="text-4xl font-bold mt-4">20K+</h2>
            <p className="text-slate-400 mt-2">Products</p>
          </div>

          <div className="text-center">
            <Users className="mx-auto text-blue-500" size={42} />
            <h2 className="text-4xl font-bold mt-4">50K+</h2>
            <p className="text-slate-400 mt-2">Customers</p>
          </div>

          <div className="text-center">
            <Star className="mx-auto text-yellow-400 fill-yellow-400" size={42} />
            <h2 className="text-4xl font-bold mt-4">4.9</h2>
            <p className="text-slate-400 mt-2">Average Rating</p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-blue-600 rounded-3xl p-12 text-center">

            <h2 className="text-4xl font-bold">
              Start Shopping Today
            </h2>

            <p className="mt-5 text-blue-100 text-lg">
              Discover thousands of products from trusted vendors.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Explore Products
              <ArrowRight size={20} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default About;