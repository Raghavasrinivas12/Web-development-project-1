import { X, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const ContactVendor = ({ vendor, onClose }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    alert("Message sent successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">

      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-xl">

        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b border-slate-800">

          <h2 className="text-2xl font-bold text-white">
            Contact Vendor
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          <div>

            <h3 className="text-xl font-semibold text-white">
              {vendor.name}
            </h3>

          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <Mail className="text-blue-400" />

              <span>{vendor.email}</span>

            </div>

            <div className="flex items-center gap-3">

              <Phone className="text-green-400" />

              <span>{vendor.phone}</span>

            </div>

            <div className="flex items-center gap-3">

              <MapPin className="text-red-400" />

              <span>{vendor.location}</span>

            </div>

          </div>

          <textarea
            rows={5}
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
          />

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-6 border-t border-slate-800">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Send Message
          </button>

        </div>

      </div>

    </div>
  );
};

export default ContactVendor;