import React, { useState, useRef } from "react";
import {
  Plus,
  Search,
  Eye,
  SquarePen,
  Trash2,
  Package,
} from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([
    {
      id: "p1",
      title: "Midnight Velvet Sherwani",
      category: "Traditional Wear",
      price: 12500,
      stock: 43,
      variants: ["M", "L", "XL"],
      image: "https://via.placeholder.com/70",
    },
    {
      id: "p2",
      title: "Crimson Silk Kurta",
      category: "Traditional Wear",
      price: 4200,
      stock: 2,
      variants: ["S", "M"],
      image: "https://via.placeholder.com/70",
    },
    {
      id: "p3",
      title: "Classic Ivory Jodhpuri",
      category: "Traditional Wear",
      price: 18500,
      stock: 0,
      variants: ["L", "XL"],
      image: "https://via.placeholder.com/70",
    },
  ]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fileInputRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    brand: "",
    sku: "",
    price: "",
    discount: "",
    stock: "",
    status: "Active",
    variants: "",
    description: "",
    image: "",
  });

  const getStockBadge = (stock) => {
    if (stock === 0)
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    if (stock <= 5)
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    return "bg-green-500/10 text-green-400 border border-green-500/20";
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setPreviewImage(imageUrl);
      setNewProduct({
        ...newProduct,
        image: imageUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    if (
      !newProduct.title ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const product = {
      id: Date.now().toString(),
      title: newProduct.title,
      category: newProduct.category,
      image: newProduct.image || "https://via.placeholder.com/150",
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      variants: newProduct.variants === "" 
        ? [] 
        : newProduct.variants.split(",").map((v) => v.trim()),
    };

    setProducts([...products, product]);
    setShowModal(false);
    setPreviewImage(null);
    setNewProduct({
      title: "",
      category: "",
      brand: "",
      sku: "",
      price: "",
      discount: "",
      stock: "",
      status: "Active",
      variants: "",
      description: "",
      image: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    setProducts(products.filter((item) => item.id !== id));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "In Stock" && product.stock > 5) ||
      (stockFilter === "Low Stock" && product.stock > 0 && product.stock <= 5) ||
      (stockFilter === "Out of Stock" && product.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Products</h1>
          <p className="text-slate-400 mt-2">
            Manage your store products, pricing, stock and product details.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/10 transition text-sm w-full md:w-auto flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* ================= SEARCH & FILTERS ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-white"
          >
            <option value="All">All Categories</option>
            <option value="Traditional Wear">Traditional Wear</option>
            <option value="Casual Wear">Casual Wear</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-white"
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Total Products */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <p className="text-slate-300 font-medium">
              Total Products :
              <span className="text-blue-400 font-bold ml-2">
                {filteredProducts.length}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-slate-300 text-sm">
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-left px-6 py-4">Stock</th>
              <th className="text-left px-6 py-4">Variants</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                {/* Product */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="font-semibold text-white">
                        {product.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        ID : {product.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-5 text-slate-300">
                  {product.category}
                </td>

                {/* Price */}
                <td className="px-6 py-5 font-semibold text-green-400">
                  ₹{product.price.toLocaleString("en-IN")}
                </td>

                {/* Stock */}
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockBadge(product.stock)}`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Variants */}
                <td className="px-6 py-5">
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((item, index) => (
                      <span
                        key={index}
                        className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  {product.stock === 0 ? (
                    <span className="text-red-400 font-medium">
                      Out of Stock
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="text-yellow-400 font-medium">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-400 font-medium">
                      Active
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                    <button className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition text-white">
                      <Eye size={18} />
                    </button>
                    <button className="bg-slate-800 hover:bg-green-600 p-2 rounded-lg transition text-white">
                      <SquarePen size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-slate-800 hover:bg-slate-600 p-2 rounded-lg transition text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Add Product Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Add New Product</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setPreviewImage(null);
                  setNewProduct({
                    title: "",
                    category: "",
                    brand: "",
                    sku: "",
                    price: "",
                    discount: "",
                    stock: "",
                    status: "Active",
                    variants: "",
                    description: "",
                    image: "",
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-slate-400">Product Name</label>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    placeholder="Nike"
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={newProduct.discount}
                    onChange={handleInputChange}
                    placeholder="10"
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <select
                    name="status"
                    value={newProduct.status}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400">Variants</label>
                  <input
                    type="text"
                    name="variants"
                    placeholder="S,M,L"
                    value={newProduct.variants}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-slate-400 block mb-2">Product Image</label>
                  <label
                    htmlFor="productImage"
                    className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer block bg-slate-800/30"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Plus size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-blue-400 hover:text-blue-300 font-medium">
                          Click to Upload Image
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                    id="productImage"
                  />
                </div>
              </div>

              {/* Preview Image */}
              {previewImage && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-3">Product Preview</p>
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Product Preview"
                        className="w-48 h-48 object-cover rounded-xl border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                        onError={(e) => {
                          console.error("Image failed to load:", previewImage);
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                        onLoad={() => {
                          console.log("Image loaded successfully");
                        }}
                      />
                      <button
                        onClick={() => {
                          setPreviewImage(null);
                          setNewProduct({
                            ...newProduct,
                            image: "",
                          });
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-slate-500 hover:bg-slate-600 rounded-full w-7 h-7 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPreviewImage(null);
                  setNewProduct({
                    title: "",
                    category: "",
                    brand: "",
                    sku: "",
                    price: "",
                    discount: "",
                    stock: "",
                    status: "Active",
                    variants: "",
                    description: "",
                    image: "",
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition text-white"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;