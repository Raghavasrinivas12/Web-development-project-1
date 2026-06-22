import {
  ShieldCheck,
  Store,
  Truck,
  CreditCard,
} from "lucide-react";

const WhyShopHub = () => {
  return (
    <section className="bg-slate-950 py-16 px-6">
      <h2 className="text-4xl font-bold text-white text-center mb-12">
        Why ShopHub?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-slate-900 p-8 rounded-xl text-center">
          <Store
            size={50}
            className="mx-auto text-blue-500 mb-4"
          />
          <h3 className="text-white font-semibold text-xl">
            Multiple Stores
          </h3>
          <p className="text-gray-400 mt-2">
            Shop from multiple vendors in one place.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-xl text-center">
          <ShieldCheck
            size={50}
            className="mx-auto text-blue-500 mb-4"
          />
          <h3 className="text-white font-semibold text-xl">
            Secure Shopping
          </h3>
          <p className="text-gray-400 mt-2">
            Protected payments and user security.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-xl text-center">
          <Truck
            size={50}
            className="mx-auto text-blue-500 mb-4"
          />
          <h3 className="text-white font-semibold text-xl">
            Fast Delivery
          </h3>
          <p className="text-gray-400 mt-2">
            Quick and reliable order delivery.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-xl text-center">
          <CreditCard
            size={50}
            className="mx-auto text-blue-500 mb-4"
          />
          <h3 className="text-white font-semibold text-xl">
            Easy Payments
          </h3>
          <p className="text-gray-400 mt-2">
            Multiple payment options available.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyShopHub;