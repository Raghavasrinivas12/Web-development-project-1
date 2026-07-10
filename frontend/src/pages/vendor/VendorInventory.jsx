import { useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  CircleX,
} from "lucide-react";
import toast from "react-hot-toast";

const VendorInventory = () => {

  const [inventory] = useState([
    {
      id: 1,
      product: "Wireless Mouse",
      sku: "WM-101",
      stock: 45,
      status: "In Stock",
      price: "₹999",
    },
    {
      id: 2,
      product: "Gaming Keyboard",
      sku: "GK-202",
      stock: 8,
      status: "Low Stock",
      price: "₹2,499",
    },
    {
      id: 3,
      product: "USB Hub",
      sku: "UH-303",
      stock: 0,
      status: "Out of Stock",
      price: "₹799",
    },
    {
      id: 4,
      product: "Laptop Stand",
      sku: "LS-404",
      stock: 25,
      status: "In Stock",
      price: "₹1,499",
    },
  ]);
const [selectedProduct, setSelectedProduct] = useState(null);
const [showModal, setShowModal] = useState(false);
const [stockValue, setStockValue] = useState("");

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Inventory Management
        </h1>

        <p className="text-slate-400 mt-2">
          Manage product stock and inventory levels.
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                Total Products
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {inventory.length}
              </h2>

            </div>

            <Package className="text-blue-500" size={32} />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                In Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {inventory.filter(item => item.status === "In Stock").length}
              </h2>

            </div>

            <Boxes className="text-green-500" size={32} />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                Low Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {inventory.filter(item => item.status === "Low Stock").length}
              </h2>

            </div>

            <AlertTriangle className="text-yellow-500" size={32} />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                Out of Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {inventory.filter(item => item.status === "Out of Stock").length}
              </h2>

            </div>

            <CircleX className="text-red-500" size={32} />

          </div>

        </div>

      </div>

      {/* Search & Filters */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

        <div className="flex flex-col lg:flex-row gap-4">

          <input
            type="text"
            placeholder="Search by Product or SKU..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          >
            <option>All Stock</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

        </div>

      </div>

      {/* Inventory Table */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="text-left px-6 py-4">Product</th>

              <th className="text-left px-6 py-4">SKU</th>

              <th className="text-left px-6 py-4">Price</th>

              <th className="text-left px-6 py-4">Stock</th>

              <th className="text-left px-6 py-4">Status</th>

              <th className="text-left px-6 py-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {inventory.map((item) => (

              <tr
                key={item.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="px-6 py-4 font-medium">
                  {item.product}
                </td>

                <td className="px-6 py-4">
                  {item.sku}
                </td>

                <td className="px-6 py-4">
                  {item.price}
                </td>

                <td className="px-6 py-4">
                  {item.stock}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${
                      item.status === "In Stock"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "Low Stock"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <button onClick={()=>{setSelectedProduct(item);setStockValue(item.stock);setShowModal(true)}}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                  >
                    Update Stock
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

     {/* Update Stock Modal */}

{showModal && selectedProduct && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

  <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">

    {/* Header */}

    <div className="flex justify-between items-center p-6 border-b border-slate-800">

      <h2 className="text-2xl font-bold">
        Update Stock
      </h2>

      <button
        onClick={() => setShowModal(false)}
        className="text-slate-400 hover:text-white text-2xl"
      >
        ×
      </button>

    </div>

    {/* Body */}

    <div className="p-6 space-y-5">

      <div>

        <label className="text-slate-400 text-sm">
          Product
        </label>

        <h3 className="font-semibold mt-1">
          {selectedProduct.product}
        </h3>

      </div>

      <div>

        <label className="text-slate-400 text-sm">
          SKU
        </label>

        <h3 className="mt-1">
          {selectedProduct.sku}
        </h3>

      </div>

      <div>

        <label className="block text-slate-400 mb-2">
          Stock Quantity
        </label>

        <input
          type="number"
          min="0"
          value={stockValue}
          onChange={(e) => setStockValue(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

      </div>

    </div>

    {/* Footer */}

    <div className="flex justify-end gap-3 p-6 border-t border-slate-800">

      <button
        onClick={() => setShowModal(false)}
        className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg"
      >
        Cancel
      </button>

      <button
        onClick={() => {
          toast.success("Stock updated successfully!");
          setShowModal(false);
        }}
        className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg"
      >
        Save
      </button>

    </div>

  </div>

</div>

)}

{/* Stock Overview */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

  {/* Stock Status */}

  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

    <h2 className="text-xl font-semibold mb-6">
      Stock Overview
    </h2>

    <div className="space-y-5">

      {/* In Stock */}

      <div>

        <div className="flex justify-between mb-2">

          <span>In Stock</span>

          <span className="text-green-400">80%</span>

        </div>

        <div className="w-full bg-slate-800 rounded-full h-3">

          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: "80%" }}
          ></div>

        </div>

      </div>

      {/* Low Stock */}

      <div>

        <div className="flex justify-between mb-2">

          <span>Low Stock</span>

          <span className="text-yellow-400">15%</span>

        </div>

        <div className="w-full bg-slate-800 rounded-full h-3">

          <div
            className="bg-yellow-500 h-3 rounded-full"
            style={{ width: "15%" }}
          ></div>

        </div>

      </div>

      {/* Out of Stock */}

      <div>

        <div className="flex justify-between mb-2">

          <span>Out of Stock</span>

          <span className="text-red-400">5%</span>

        </div>

        <div className="w-full bg-slate-800 rounded-full h-3">

          <div
            className="bg-red-500 h-3 rounded-full"
            style={{ width: "5%" }}
          ></div>

        </div>

      </div>

    </div>

  </div>

  {/* Low Stock Products */}

  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

    <h2 className="text-xl font-semibold mb-6">
      Low Stock Products
    </h2>

    <div className="space-y-4">

      {inventory
        .filter(item => item.status !== "In Stock")
        .map(item => (

          <div
            key={item.id}
            className="flex justify-between items-center bg-slate-800 rounded-lg p-4"
          >

            <div>

              <h3 className="font-medium">
                {item.product}
              </h3>

              <p className="text-sm text-slate-400">
                SKU: {item.sku}
              </p>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                item.status === "Low Stock"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {item.stock} Left
            </span>

          </div>

        ))}

    </div>

  </div>

</div>

{/* Pagination */}

<div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">

  <p className="text-slate-400">
    Showing 1–4 of 4 Products
  </p>

  <div className="flex gap-2">

    <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
      Previous
    </button>

    <button className="bg-blue-500 px-4 py-2 rounded-lg">
      1
    </button>

    <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
      Next
    </button>

  </div>

</div>
</div>

);

};

export default VendorInventory;