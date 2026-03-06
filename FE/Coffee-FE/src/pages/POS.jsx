import React, { useState, useRef } from "react";
import { useCart } from "../lib/cartContext";
import { CoffeeModal } from "../components/CoffeeModal";
import { CoffeeBillingPanel } from "../components/CoffeeBillingPanel";
import { getAllProducts } from "../service/ProductService";
import { useEffect } from "react";
import { Search } from "lucide-react";

export default function POS() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  const [products, setProducts] = useState([]); // This will hold the products fetched from the API
  const printRef = useRef(null);


  useEffect(() => {
    const  fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (cartItem) => {
    addItem(cartItem);
  };

  const handlePrintBill = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side: Search + Products (60%) */}
      <div className="flex-1 flex flex-col">
        {/* Compact Search Bar */}
        <div className="bg-white shadow-md border-b border-gray-200 p-4">
          <div className="max-w-md mx-auto relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search coffee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.02] transform text-left relative"
              >
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price Badge */}
                  {/* <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-amber-600">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      Add
                    </div>
                  </div> */}
                </div>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-200 rounded-full p-8 mb-4">
                <Search size={64} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No coffee found
              </h3>
              <p className="text-gray-500">
                Try searching with a different keyword
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Cart Panel (40%) */}
      <CoffeeBillingPanel onPrint={handlePrintBill} />

      <CoffeeModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <div ref={printRef} className="hidden print:block" />
    </div>
  );
}
