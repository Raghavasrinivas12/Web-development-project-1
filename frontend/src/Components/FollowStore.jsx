import { X, Heart, Bell, Gift, Tag } from "lucide-react";

const FollowStore = ({
  vendor,
  onClose,
  onFollow,
  following,
  onUnfollow,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {following ? "Following Store" : "Follow Store"}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          <div className="flex flex-col items-center text-center">

            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-5">
              <Heart size={38} className="text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white">
              {following
                ? `You're following ${vendor.name}`
                : `Follow ${vendor.name}?`}
            </h3>

            <p className="text-slate-400 mt-3">
              {following
                ? "You'll continue receiving new product alerts, offers and festival sale notifications."
                : "You'll receive notifications whenever this store adds new arrivals, discounts, flash sales and exclusive offers."}
            </p>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-3">
              <Bell className="text-blue-400" />
              <span>New Product Notifications</span>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="text-green-400" />
              <span>Exclusive Discounts</span>
            </div>

            <div className="flex items-center gap-3">
              <Gift className="text-yellow-400" />
              <span>Festival & Flash Sale Updates</span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-800">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>

          {following ? (
            <button
              onClick={onUnfollow}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Unfollow Store
            </button>
          ) : (
            <button
              onClick={onFollow}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Follow Store
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default FollowStore;