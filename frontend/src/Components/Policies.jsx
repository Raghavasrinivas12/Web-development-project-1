import React from "react";
import {
  ShieldCheck,
  FileText,
  RefreshCcw,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const Policies = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}

      <div className="bg-blue-600 via-blue-900 to-slate-900 border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <h1 className="text-5xl font-bold text-center">

            ShopHub Policies

          </h1>

          <p className="text-slate-300 text-center mt-5 text-lg max-w-3xl mx-auto">

            At <span className="text-blue-200 font-semibold">ShopHub</span>,
            we are committed to providing a secure, transparent, and reliable
            shopping experience for our customers, vendors, and administrators.
            Please read our policies carefully before using our platform.

          </p>

        </div>

      </div>

      {/* Policy Cards */}

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Terms */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition duration-300">

            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">

              <FileText
                className="text-blue-400"
                size={28}
              />

            </div>

            <h2 className="text-2xl font-bold mt-5">

              Terms & Conditions

            </h2>

            <p className="text-slate-400 mt-3">

              Read the rules and conditions for using ShopHub.

            </p>

          </div>

          {/* Privacy */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition duration-300">

            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">

              <ShieldCheck
                className="text-green-400"
                size={28}
              />

            </div>

            <h2 className="text-2xl font-bold mt-5">

              Privacy Policy

            </h2>

            <p className="text-slate-400 mt-3">

              Learn how we collect and protect your personal information.

            </p>

          </div>

          {/* Refund */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition duration-300">

            <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center">

              <RefreshCcw
                className="text-yellow-400"
                size={28}
              />

            </div>

            <h2 className="text-2xl font-bold mt-5">

              Refund Policy

            </h2>

            <p className="text-slate-400 mt-3">

              Understand our refund, replacement, and return process.

            </p>

          </div>

        </div>
        {/* Terms & Conditions */}

        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition duration-300">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">

              <FileText
                className="text-blue-400"
                size={24}
              />

            </div>

            <h2 className="text-3xl font-bold">
              Terms & Conditions
            </h2>

          </div>

          <p className="text-slate-400 leading-8 mb-6">

            By accessing and using ShopHub, you agree to comply with the
            following terms and conditions. These terms are intended to ensure
            a secure, fair, and reliable shopping experience for all users.

          </p>

          <div className="space-y-5">

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-blue-400 font-semibold text-lg mb-2">
                1. User Accounts
              </h3>

              <p className="text-slate-400">
                Users must provide accurate registration information and are
                responsible for maintaining the confidentiality of their login
                credentials.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-blue-400 font-semibold text-lg mb-2">
                2. Product Information
              </h3>

              <p className="text-slate-400">
                Vendors are responsible for ensuring that product descriptions,
                pricing, and images are accurate and up to date.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-blue-400 font-semibold text-lg mb-2">
                3. Orders & Payments
              </h3>

              <p className="text-slate-400">
                Orders are confirmed only after successful payment or order
                verification. ShopHub reserves the right to cancel suspicious
                or fraudulent orders.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-blue-400 font-semibold text-lg mb-2">
                4. Prohibited Activities
              </h3>

              <p className="text-slate-400">
                Users must not misuse the platform, upload illegal content,
                attempt unauthorized access, or engage in fraudulent
                activities.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-blue-400 font-semibold text-lg mb-2">
                5. Changes to Terms
              </h3>

              <p className="text-slate-400">
                ShopHub may modify these terms at any time. Continued use of
                the platform indicates acceptance of the updated terms.
              </p>

            </div>

          </div>

        </div>
        {/* Privacy Policy */}

        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-500 transition duration-300">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">

              <ShieldCheck
                className="text-green-400"
                size={24}
              />

            </div>

            <h2 className="text-3xl font-bold">
              Privacy Policy
            </h2>

          </div>

          <p className="text-slate-400 leading-8 mb-6">

            At <span className="text-green-400 font-semibold">ShopHub</span>,
            we respect your privacy and are committed to protecting your
            personal information. This policy explains how we collect, use,
            and safeguard your data while using our platform.

          </p>

          <div className="space-y-5">

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-green-400 font-semibold text-lg mb-2">
                1. Information We Collect
              </h3>

              <p className="text-slate-400">
                We collect information such as your name, email address,
                phone number, delivery address, and account details to
                provide our services efficiently.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-green-400 font-semibold text-lg mb-2">
                2. How We Use Your Information
              </h3>

              <p className="text-slate-400">
                Your information is used to process orders, improve customer
                experience, communicate order updates, and enhance platform
                security.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-green-400 font-semibold text-lg mb-2">
                3. Data Security
              </h3>

              <p className="text-slate-400">
                We implement appropriate security measures to protect your
                personal information from unauthorized access, loss, or misuse.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-green-400 font-semibold text-lg mb-2">
                4. Cookies
              </h3>

              <p className="text-slate-400">
                ShopHub may use cookies to improve website functionality,
                remember user preferences, and provide a better browsing
                experience.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-green-400 font-semibold text-lg mb-2">
                5. Third-Party Services
              </h3>

              <p className="text-slate-400">
                We do not sell your personal information. Trusted third-party
                services may be used only for payment processing, delivery,
                and essential platform operations.
              </p>

            </div>

          </div>

        </div>
        {/* Refund Policy */}

        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-yellow-500 transition duration-300">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">

              <RefreshCcw
                className="text-yellow-400"
                size={24}
              />

            </div>

            <h2 className="text-3xl font-bold">
              Refund Policy
            </h2>

          </div>

          <p className="text-slate-400 leading-8 mb-6">

            ShopHub aims to provide a smooth shopping experience. If you
            receive a damaged, defective, or incorrect product, you may
            request a return, replacement, or refund according to the
            following policy.

          </p>

          <div className="space-y-5">

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                1. Return Eligibility
              </h3>

              <p className="text-slate-400">
                Products can be returned within <span className="text-white font-semibold">7 days</span> of delivery if they are damaged, defective, incorrect, or eligible under the seller's return policy.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                2. Product Condition
              </h3>

              <p className="text-slate-400">
                Returned items should be unused, in their original packaging,
                and include all accessories, manuals, and invoices wherever applicable.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                3. Refund Process
              </h3>

              <p className="text-slate-400">
                After the returned product is inspected and approved,
                the refund will be initiated to the original payment method
                within <span className="text-white font-semibold">5–7 business days</span>.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                4. Replacement Policy
              </h3>

              <p className="text-slate-400">
                Customers may request a replacement instead of a refund
                if the product is available in stock and qualifies under
                the seller's replacement policy.
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                5. Non-Returnable Items
              </h3>

              <p className="text-slate-400">
                Certain products such as personal care items, customized
                products, gift cards, and digital products may not be
                eligible for return or refund.
              </p>

            </div>

          </div>

        </div>
        {/* Contact & Support */}

        <div className="bg-blue-600 via-blue-900 to-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-3xl font-bold text-center">
            Need Help?
          </h2>

          <p className="text-slate-300 text-center mt-4 max-w-3xl mx-auto leading-8">
            If you have any questions regarding our Terms & Conditions,
            Privacy Policy, or Refund Policy, please feel free to contact
            our support team. We are always happy to assist you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

  {/* Email */}
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-blue-500 transition">
    <div className="flex items-center justify-center gap-2">
      <Mail size={22} className="text-blue-400" />
      <h3 className="text-blue-400 font-semibold text-xl">
        Email
      </h3>
    </div>

    <p className="text-slate-400 mt-3">
      support@shophub.com
    </p>
  </div>

  {/* Phone */}
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-blue-500 transition">
    <div className="flex items-center justify-center gap-2">
      <Phone size={22} className="text-blue-400" />
      <h3 className="text-blue-400 font-semibold text-xl">
        Phone
      </h3>
    </div>

    <p className="text-slate-400 mt-3">
      +91 98765 43210
    </p>
  </div>

  {/* Address */}
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-blue-500 transition">
    <div className="flex items-center justify-center gap-2">
      <MapPin size={22} className="text-blue-400" />
      <h3 className="text-blue-400 font-semibold text-xl">
        Address
      </h3>
    </div>

    <p className="text-slate-400 mt-3">
      Bengaluru, Karnataka, India
    </p>
  </div>

</div>

        </div>

        {/* Last Updated */}

        <div className="mt-10 border-t border-slate-800 pt-6 text-center">

          <p className="text-slate-500">
            Last Updated: July 2026
          </p>

          <p className="text-slate-400 mt-2">
            © 2026 <span className="text-blue-400 font-semibold">ShopHub</span>. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>

  );
};

export default Policies;