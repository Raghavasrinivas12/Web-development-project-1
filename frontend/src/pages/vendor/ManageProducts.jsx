import React, { useState } from 'react';

const ManageProducts = () => {
  const [products, setProducts] = useState([
    { id: "p1", title: "Midnight Velvet Sherwani", price: 12500, stock: 43, variants: ["M", "L", "XL"] },
    { id: "p2", title: "Crimson Silk Kurta", price: 4200, stock: 2, variants: ["S", "M"] },
    { id: "p3", title: "Classic Ivory Jodhpuri", price: 18500, stock: 0, variants: ["L", "XL"] },
  ]);

  const getStockBadge = (stock) => {
    if (stock === 0) return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (stock <= 5) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-slate-800 text-slate-400 border border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Products</h1>
          <p className="text-slate-400 mt-1">Configure item pricing setups, variations, and active quantities.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/10 transition dynamic context text-sm cursor-pointer">
          + Add New Product
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Product Details</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4">Variants</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-white">{product.title}</td>
                <td className="p-4 font-medium text-blue-400">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadge(product.stock)}`}>
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} units left`}
                  </span>
                </td>
                <td className="p-4 text-xs tracking-wide font-mono text-slate-400">
                  {product.variants.join(', ')}
                </td>
                <td className="p-4 text-right space-x-4">
                  <button className="text-slate-400 hover:text-rose-400 transition-colors font-medium text-xs cursor-pointer">Edit</button>
                  <button className="text-slate-500 hover:text-red-400 transition-colors font-medium text-xs cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;