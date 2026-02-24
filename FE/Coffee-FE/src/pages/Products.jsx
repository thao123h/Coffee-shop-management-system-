import React from "react";
import { Package, Plus, Edit, Trash2 } from "lucide-react";

export default function Products() {
  const products = [
    {
      id: 1,
      name: "Espresso",
      category: "Coffee",
      price: 2.5,
      stock: 100,
      image:
        "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200",
    },
    {
      id: 2,
      name: "Americano",
      category: "Coffee",
      price: 2.95,
      stock: 85,
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200",
    },
    {
      id: 3,
      name: "Latte",
      category: "Coffee",
      price: 3.95,
      stock: 120,
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=200",
    },
    {
      id: 4,
      name: "Cappuccino",
      category: "Coffee",
      price: 4.25,
      stock: 95,
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-amber-600" size={32} />
            Products
          </h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <span className="text-xl font-bold text-amber-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  Stock: {product.stock}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 50
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {product.stock > 50 ? "In Stock" : "Low Stock"}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
