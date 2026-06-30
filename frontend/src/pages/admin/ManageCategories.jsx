import { useState } from "react";
import {
  Folder,
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

const ManageCategories = () => {

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  const [editPreviewImage, setEditPreviewImage] = useState("");

  const [newCategory, setNewCategory] = useState({
    image: "",
    name: "",
    description: "",
    status: "Active",
  });

  const [editCategory, setEditCategory] = useState({
    id: "",
    image: "",
    name: "",
    description: "",
    status: "",
    products: 0,
    created: "",
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
      name: "Electronics",
      description: "Mobiles, Laptops & Accessories",
      status: "Active",
      products: 120,
      created: "10 Jun 2026",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200",
      name: "Fashion",
      description: "Men & Women Clothing",
      status: "Active",
      products: 85,
      created: "15 Jun 2026",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200",
      name: "Furniture",
      description: "Home Furniture",
      status: "Inactive",
      products: 40,
      created: "20 Jun 2026",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200",
      name: "Books",
      description: "Education & Story Books",
      status: "Active",
      products: 65,
      created: "25 Jun 2026",
    },
  ]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const addCategory = () => {

    if (
      newCategory.name.trim() === "" ||
      newCategory.image === ""
    )
      return;

    setCategories([
      ...categories,
      {
        id: Date.now(),
        ...newCategory,
        products: 0,
        created: "Today",
      },
    ]);

    setNewCategory({
      image: "",
      name: "",
      description: "",
      status: "Active",
    });

    setPreviewImage("");

    setShowAddModal(false);
  };

  const updateCategory = () => {

    setCategories(
      categories.map((category) =>
        category.id === editCategory.id
          ? editCategory
          : category
      )
    );

    setEditPreviewImage("");

    setShowEditModal(false);
  };

  const deleteCategory = (id) => {

    setCategories(
      categories.filter(
        (category) => category.id !== id
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

        <div className="flex items-center gap-3">

          <Folder
            size={28}
            className="text-blue-500"
          />

          <div>

            <h1 className="text-2xl font-bold">
              Manage Categories
            </h1>

            <p className="text-slate-400 text-sm">
              Add, edit and manage product categories
            </p>

          </div>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          Add Category
        </button>

      </div>

      {/* Search */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500"
          />

        </div>

      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">

            <h2 className="text-xl font-semibold mb-5">
              Add Category
            </h2>

            <div className="space-y-4">

              {/* Upload Image */}

              <div>

                <label className="block text-sm mb-2">
                  Category Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {

                    const file = e.target.files[0];

                    if (file) {

                      const imageUrl = URL.createObjectURL(file);

                      setPreviewImage(imageUrl);

                      setNewCategory({
                        ...newCategory,
                        image: imageUrl,
                      });

                    }

                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm"
                />

              </div>

              {/* Preview */}

              {previewImage && (

                <div className="flex justify-center">

                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border border-slate-700"
                  />

                </div>

              )}

              {/* Category Name */}

              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    name: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none"
              />

              {/* Description */}

              <textarea
                rows="3"
                placeholder="Category Description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none resize-none"
              />

              {/* Status */}

              <select
                value={newCategory.status}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    status: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setPreviewImage("");
                }}
                className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={addCategory}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-sm"
              >
                Add Category
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Desktop Table */}

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800 text-sm">

            <tr>

              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Products</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
              <th className="text-center p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredCategories.map((category) => (
                <tr
                key={category.id}
                className="border-t border-slate-800 hover:bg-slate-800 text-sm"
              >
                <td className="p-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                </td>

                <td className="p-4">
                  <h3 className="font-semibold">
                    {category.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    {category.description}
                  </p>
                </td>

                <td className="p-4">
                  {category.products}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      category.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {category.status}
                  </span>
                </td>

                <td className="p-4">
                  {category.created}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => {
                        setEditCategory(category);
                        setEditPreviewImage(category.image);
                        setShowEditModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="bg-slate-500 hover:bg-slate-600 p-2 rounded-lg"
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

      {/* Mobile Cards */}

      <div className="lg:hidden space-y-5">

        {filteredCategories.map((category) => (

          <div
            key={category.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >

            <img
              src={category.image}
              alt={category.name}
              className="w-20 h-20 rounded-lg object-cover mb-4"
            />

            <h2 className="text-lg font-semibold">
              {category.name}
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              {category.description}
            </p>

            <p className="mt-2 text-sm">
              Products : {category.products}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Created : {category.created}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${
                category.status === "Active"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {category.status}
            </span>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => {
                  setEditCategory(category);
                  setEditPreviewImage(category.image);
                  setShowEditModal(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteCategory(category.id)}
                className="bg-slate-500 hover:bg-slate-600 p-2 rounded-lg"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>

      {showEditModal && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">

      <h2 className="text-xl font-semibold mb-5">
        Edit Category
      </h2>

      <div className="space-y-4">

        <div>

          <label className="block text-sm mb-2">
            Category Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file = e.target.files[0];

              if (file) {

                const imageUrl = URL.createObjectURL(file);

                setEditPreviewImage(imageUrl);

                setEditCategory({
                  ...editCategory,
                  image: imageUrl,
                });

              }

            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm"
          />

        </div>

        {editPreviewImage && (

          <div className="flex justify-center">

            <img
              src={editPreviewImage}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border border-slate-700"
            />

          </div>

        )}

        <input
          type="text"
          placeholder="Category Name"
          value={editCategory.name}
          onChange={(e) =>
            setEditCategory({
              ...editCategory,
              name: e.target.value,
            })
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none"
        />

        <textarea
          rows="3"
          placeholder="Category Description"
          value={editCategory.description}
          onChange={(e) =>
            setEditCategory({
              ...editCategory,
              description: e.target.value,
            })
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none resize-none"
        />

        <select
          value={editCategory.status}
          onChange={(e) =>
            setEditCategory({
              ...editCategory,
              status: e.target.value,
            })
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => {
            setShowEditModal(false);
            setEditPreviewImage("");
          }}
          className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg text-sm"
        >
          Cancel
        </button>

        <button
          onClick={updateCategory}
          className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-sm"
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>
)}

</div>
);
};

export default ManageCategories;