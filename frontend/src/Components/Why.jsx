import {
  ShieldCheck,
  Store,
  Truck,
  CreditCard,
} from "lucide-react";

const WhyShopHub = () => {
  return (
    <section className="bg-slate-950 py-14 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        Why ShopHub?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        <div className="bg-slate-900 p-6 rounded-xl text-center ">
          <Store
            size={44}
            className="mx-auto text-blue-500 mb-3"
          />
          <h3 className="text-white font-semibold text-lg">
            Multiple Stores
          </h3>
          <p className="text-gray-400 mt-2">
            Shop from multiple vendors in one place.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl text-center">
          <ShieldCheck
            size={44}
            className="mx-auto text-blue-500 mb-3"
          />
          <h3 className="text-white font-semibold text-lg">
            Secure Shopping
          </h3>
          <p className="text-gray-400 mt-2">
            Protected payments and user security.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl text-center">
          <Truck
            size={44}
            className="mx-auto text-blue-500 mb-3"
          />
          <h3 className="text-white font-semibold text-lg">
            Fast Delivery
          </h3>
          <p className="text-gray-400 mt-2">
            Quick and reliable order delivery.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl text-center">
          <CreditCard
            size={44}
            className="mx-auto text-blue-500 mb-3"
          />
          <h3 className="text-white font-semibold text-lg">
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
