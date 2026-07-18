import { useState } from "react";
import {
  Search,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  Store,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse products, add them to your cart, proceed to checkout, enter your delivery address, choose a payment method, and place your order.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Go to My Orders from your profile and click Track Order to see the latest delivery updates.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Yes. Orders can be cancelled before they are shipped from the seller.",
  },
  {
    question: "How do I request a refund?",
    answer:
      "Open My Orders, select the product and click Return / Refund Request.",
  },
  {
    question: "Which payment methods are accepted?",
    answer:
      "We accept UPI, Debit Cards, Credit Cards, Net Banking and Cash on Delivery for eligible products.",
  },
  {
    question: "How do I contact a vendor?",
    answer:
      "Visit the Vendor Store page and click the Contact Vendor button.",
  },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-20 text-center">

          <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">

            <HelpCircle size={40} />

          </div>

          <h1 className="text-5xl font-bold">
            Help Center
          </h1>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Find answers to common questions, learn about orders,
            shipping, returns, payments and more.
          </p>

          <div className="relative max-w-2xl mx-auto mt-10">

            <Search
              size={22}
              className="absolute left-5 top-4 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-14 pr-4 outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </section>

      {/* Quick Help */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-center mb-12">
          Quick Help
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition">

            <Package className="text-blue-500 mb-5" size={40} />

            <h3 className="text-xl font-semibold mb-3">
              Orders
            </h3>

            <ul className="text-slate-400 space-y-2">
              <li>• Place Orders</li>
              <li>• Order History</li>
              <li>• Track Orders</li>
            </ul>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition">

            <Truck className="text-blue-500 mb-5" size={40} />

            <h3 className="text-xl font-semibold mb-3">
              Shipping
            </h3>

            <ul className="text-slate-400 space-y-2">
              <li>• Delivery Time</li>
              <li>• Shipping Charges</li>
              <li>• Delivery Status</li>
            </ul>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition">

            <RotateCcw className="text-blue-500 mb-5" size={40} />

            <h3 className="text-xl font-semibold mb-3">
              Returns
            </h3>

            <ul className="text-slate-400 space-y-2">
              <li>• Return Products</li>
              <li>• Refunds</li>
              <li>• Replacement</li>
            </ul>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition">

            <CreditCard className="text-blue-500 mb-5" size={40} />

            <h3 className="text-xl font-semibold mb-3">
              Payments
            </h3>

            <ul className="text-slate-400 space-y-2">
              <li>• UPI</li>
              <li>• Debit Cards</li>
              <li>• Credit Cards</li>
            </ul>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition">

            <User className="text-blue-500 mb-5" size={40} />

            <h3 className="text-xl font-semibold mb-3">
              Account
            </h3>

            <ul className="text-slate-400 space-y-2">
              <li>• Login</li>
              <li>• Register</li>
              <li>• Profile Settings</li>
            </ul>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition">

            <Store className="text-blue-500 mb-5" size={40} />

            <h3 className="text-xl font-semibold mb-3">
              Vendors
            </h3>

            <ul className="text-slate-400 space-y-2">
              <li>• Contact Vendor</li>
              <li>• Vendor Policies</li>
              <li>• Store Information</li>
            </ul>

          </div>

        </div>

      </section>
            {/* Frequently Asked Questions */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="text-center mb-12">

          <h2 className="text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="text-slate-400 mt-3">
            Find answers to the most commonly asked questions.
          </p>

        </div>

        <div className="space-y-5">

          {filteredFaqs.length > 0 ? (

            filteredFaqs.map((faq, index) => (

              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition hover:border-blue-500"
              >

                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >

                  <span className="font-semibold text-lg">
                    {faq.question}
                  </span>

                  {openIndex === index ? (

                    <ChevronUp
                      className="text-blue-500"
                      size={22}
                    />

                  ) : (

                    <ChevronDown
                      className="text-slate-400"
                      size={22}
                    />

                  )}

                </button>

                {openIndex === index && (

                  <div className="px-6 pb-6 border-t border-slate-800">

                    <p className="text-slate-300 leading-8 pt-5">
                      {faq.answer}
                    </p>

                  </div>

                )}

              </div>

            ))

          ) : (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

              <HelpCircle
                size={50}
                className="mx-auto text-blue-500 mb-4"
              />

              <h3 className="text-2xl font-semibold">
                No Results Found
              </h3>

              <p className="text-slate-400 mt-3">
                We couldn't find any help articles matching your search.
              </p>

            </div>

          )}

        </div>

      </section>
            {/* Contact Support */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="text-center mb-12">

          <h2 className="text-3xl font-bold">
            Contact Support
          </h2>

          <p className="text-slate-400 mt-3">
            Our support team is always ready to help you.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Email */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">

            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-5">

              <Mail className="text-blue-500" size={30} />

            </div>

            <h3 className="text-xl font-semibold">
              Email Support
            </h3>

            <p className="text-slate-400 mt-4">
              support@shophub.com
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Reply within 24 hours
            </p>

          </div>

          {/* Phone */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">

            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-5">

              <Phone className="text-blue-500" size={30} />

            </div>

            <h3 className="text-xl font-semibold">
              Phone Support
            </h3>

            <p className="text-slate-400 mt-4">
              +91 98765 43210
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Monday - Saturday
            </p>

            <p className="text-slate-500 text-sm">
              9:00 AM - 8:00 PM
            </p>

          </div>

          {/* Live Chat */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">

            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-5">

              <MessageCircle className="text-blue-500" size={30} />

            </div>

            <h3 className="text-xl font-semibold">
              Live Chat
            </h3>

            <p className="text-slate-400 mt-4">
              Chat with our support team
            </p>

            <span className="inline-block mt-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">

              ● Online

            </span>

          </div>

        </div>

      </section>

      {/* Need More Help */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-10 md:p-14 text-center shadow-xl">

          <HelpCircle
            size={55}
            className="mx-auto mb-6"
          />

          <h2 className="text-4xl font-bold">
            Still Need Help?
          </h2>

          <p className="mt-5 text-blue-100 max-w-2xl mx-auto leading-8">

            If you couldn't find the answer you're looking for,
            our customer support team is available to assist you.

          </p>

          <button className="mt-8 bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold transition">

            Contact Support

          </button>

        </div>

      </section>

      {/* Footer */}

      <section className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-8 text-center">

          <p className="text-slate-500">

            Help Center • Last Updated July 2026

          </p>

        </div>

      </section>

    </div>
  );
};

export default HelpCenter;