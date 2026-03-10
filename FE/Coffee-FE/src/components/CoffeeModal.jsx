import { useEffect, useState } from "react";
import { t } from "../i18n";
import { getAllToppings } from "../service/ToppingService";
import { X, Plus, Minus } from "lucide-react";
import {  getProductVariantsByIdProduct } from "../service/ProductVariantService";

export function CoffeeModal({ product, onClose, onAddToCart }) {
  const [temperature, setTemperature] = useState("hot");
  const [productVariant, setProductVariant] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [allToppings, setAllToppings] = useState([]);
  const [productVariants, setProductVariants] = useState([]);


 useEffect(() => {
  if (product) {
    const fetchProductVariants = async () => {
      try {
        const variants = await getProductVariantsByIdProduct(product.id);
        setProductVariants(variants.data);
      } catch (error) {
        console.error("Error fetching product variants:", error);
      }
    };

    fetchProductVariants();
  }
}, [product]);

  useEffect(() => {
    // Simulate an API call to fetch all toppings
    const fetchToppings = async () => {
      try {
        const toppings = await getAllToppings();
        setAllToppings(toppings.data);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };
    fetchToppings();
  }, []);

  if (!product) return null;

  const calculateTotal = () => {
    const basePrice = productVariant?.price || 0;
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping],
    );
  };

const handleAddToCart = () => {
  const temperatureLabel = temperature === "hot" ? "Nóng" : "Lạnh";
  const finalNote = notes
  ? `${temperatureLabel} - ${notes}`
  : temperatureLabel;

  const cartItem = {
    id: `${product.id}-${Date.now()}`,
    product,
    quantity,
    temperature,
    productVariant,
    toppings: selectedToppings,
    notes: finalNote,
  };

  onAddToCart(cartItem);
  console.log("Added to cart:", cartItem);
  onClose();
};



  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-300">
        {/* Modern Header with Image Background */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">{product.name}</h2>
            <p className="text-white/90 text-sm">{product.description}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Temperature Selection */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🌡️</span>
              {t('temperature')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["hot", "iced"].map((temp) => (
                <button
                  key={temp}
                  onClick={() => setTemperature(temp)}
                  className={`py-4 rounded-xl font-semibold text-lg transition-all ${
                    temperature === temp
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {temp === "hot" ? `☕ ${t('hot')}` : `🧊 ${t('iced')}`}
                </button>
              ))}
            </div>
          </div>

              

            <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">📏</span>
              {t('size')}s
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {productVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setProductVariant(variant)}
                  className={`py-4 rounded-xl font-bold text-xl transition-all ${
                    productVariant?.id === variant.id
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(`${variant.name}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🧁</span>
              {t('toppings')}
              <span className="text-xs text-gray-500 font-normal">
                {t('optional')}
              </span>
            </h3>
            <div className="space-y-2">
              {allToppings.map((topping) => (
                <button
                  key={topping.id}
                  onClick={() => toggleTopping(topping)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    selectedToppings.find((t) => t.id === topping.id)
                      ? "border-amber-600 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="font-semibold text-gray-900">
                    {topping.name}
                  </span>
                  <span className="text-amber-600 font-bold text-lg">
                    +{topping.price.toLocaleString('vi-VN')} ₫
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span>
              {t('specialInstructions')}
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="thêm shot cà phê, ít bọt sữa, ít đường..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🔢</span>
              {t('quantity')}
            </h3>
            <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-2 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-white hover:bg-gray-50 p-3 rounded-lg transition shadow-sm"
              >
                <Minus size={24} className="text-gray-700" />
              </button>
              <span className="text-3xl font-bold w-16 text-center text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-white hover:bg-gray-50 p-3 rounded-lg transition shadow-sm"
              >
                <Plus size={24} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t-2 border-gray-200 p-2 space-y-2 min-h-[100px]">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-lg font-semibold">{t('total')}</span>
            <span className="text-2xl font-bold text-amber-600">
              {Math.round(calculateTotal()).toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            {t('addToCart')}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold transition"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
