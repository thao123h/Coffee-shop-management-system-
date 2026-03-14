  import React, { useState, useRef, useEffect } from "react";
import { t } from "../i18n";
  import { CoffeeModal } from "../components/CoffeeModal";
  import { CoffeeBillingPanel } from "../components/CoffeeBillingPanel";
  import { getAllProducts } from "../service/ProductService";
  import { Search } from "lucide-react";
  import { Pagination } from "../components/Pagination";
  import { useCart } from "../lib/CartContext";
  import { createOrder } from "../service/OrderService";

  export default function POS() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const { addItem } = useCart();

    const [products, setProducts] = useState([]); // This will hold the products fetched from the API
  const [totalElements, setTotalElements] = useState(0);
  const printRef = useRef(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts(currentPage - 1, itemsPerPage, searchQuery); // Fetch products for the current page with search
        setProducts(res.data.content); // Assuming the API response has a 'content' field with the products array
        setTotalElements(res.data.totalElements); // Assuming totalElements is in the response
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery]);
  const totalPages = Math.ceil(totalElements / itemsPerPage);
    
    // Reset to page 1 when search query changes
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    };

    const handleProductSelect = (product) => {
      setSelectedProduct(product);
    };

    const handleAddToCart = (cartItem) => {
      addItem(cartItem);
    };

    const handlePrintBill = () => {
      window.print();
    };

    const handleCreateOrder = ( orderRequest) => {
      const postOrder = async () => {
        try {         
           const order = await createOrder(orderRequest);
           console.log("Order created successfully:", order.data);
           if(orderRequest.paymentMethod === "CASH"){
            // Handle cash payment flow (e.g., show confirmation, print receipt)
           }
           else if(orderRequest.paymentMethod === "BANK"){
            // Handle bank payment flow (e.g., redirect to payment gateway)
            }
        } catch (error) {
          console.error("Error creating order:", error);
        }
      };
      postOrder();
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
                placeholder={t('searchCoffee')}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.02] transform text-left relative h-full flex flex-col"
                >
                  {/* Image Container with Overlay */}
                  <div className="relative overflow-hidden h-48 flex-shrink-0 border-b-2 border-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-amber-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                      {product.description}
                    </p>

                    {/* Price Badge */}
                    <div className="flex items-center justify-between">
                        {/* <div className="text-2xl font-bold text-amber-600">
                          ₫{product.price?.toLocaleString()}
                        </div> */}
                      <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        Thêm
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              </div>

              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gray-200 rounded-full p-8 mb-4">
                    <Search size={64} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    {t('noCoffeeFound')}
                  </h3>
                  <p className="text-gray-500">
                    {t('tryDifferentKeyword')}
                  </p>
                </div>
              )}
            </div>
            
            {products.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Cart Panel (40%) */}
        <CoffeeBillingPanel onCompleteOrder={handleCreateOrder} />

        <CoffeeModal
        key={selectedProduct?.id}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        />

        <div ref={printRef} className="hidden print:block" />
      </div>
    );
  }
