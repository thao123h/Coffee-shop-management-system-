// Simple i18n helper for Vietnamese translations

const translations = {
  vi: {
    // general
    "dashboardOverview": "Tổng quan bảng điều khiển",
    "welcomeBack": "Chào mừng trở lại! Đây là những gì đang diễn ra hôm nay.",

    // login
    "coffeePOS": "Cửa hàng cà phê",
    "signInManage": "Đăng nhập để quản lý quán cà phê của bạn",
    "username": "Tên đăng nhập",
    "password": "Mật khẩu",
    "enterYourUsername": "Nhập tên đăng nhập của bạn",
    "enterYourPassword": "Nhập mật khẩu của bạn",
    "pleaseEnterBoth": "Vui lòng nhập cả tên đăng nhập và mật khẩu",
    "invalidCredentials": "Thông tin đăng nhập không hợp lệ",
    "signIn": "Đăng nhập",
    "demoCredentials": "Demo: Nhập bất kỳ tên đăng nhập và mật khẩu nào để đăng nhập",

    // pos
    "searchCoffee": "Tìm cà phê theo tên...",
    "noCoffeeFound": "Không tìm thấy cà phê",
    "tryDifferentKeyword": "Thử tìm với từ khóa khác",
    "add": "Thêm",

    // modal
    "temperature": "Nhiệt độ",
    "size": "Kích cỡ",
    "toppings": "Thêm",
    "optional": "(tùy chọn)",
    "specialInstructions": "Ghi chú đặc biệt",
    "quantity": "Số lượng",
    "total": "Tổng cộng:",
    "addToCart": "Thêm vào giỏ",
    "cancel": "Hủy",
    "hot": "Nóng",
    "iced": "Đá",
    "sizeS": "S",
    "sizeM": "M",
    "sizeL": "L",
    "+": "+",

    // billing panel
    "cart": "Giỏ hàng",
    "item": "món",
    "items": "món",
    "cartIsEmpty": "Giỏ hàng trống",
    "addItems": "Thêm sản phẩm để bắt đầu",
    "subtotal": "Tạm tính:",
    "tax": "Thuế (10%):",
    "totalAmount": "Tổng cộng:",
    "payment": "Thanh toán",
    "cash": "Tiền mặt",
    "card": "Thẻ",
    "mobile": "Di động",
    "completeOrder": "Hoàn tất đơn",
    "cashPayment": "💵 Thanh toán tiền mặt",
    "cardPayment": "💳 Thanh toán thẻ",
    "mobilePayment": "📱 Thanh toán di động",
    "removeItem": "Xóa sản phẩm",

    // other common
    "products": "Sản phẩm",
    "orders": "Đơn hàng",
    "payments": "Thanh toán",
    "users": "Người dùng",
    "vouchers": "Phiếu giảm giá",
    "categories": "Danh mục",
    "pos": "POS",
    "dashboard": "Bảng điều khiển",
    "logout": "Đăng xuất",
    "productsPageTitle": "Sản phẩm",
    "manageInventory": "Quản lý tồn kho sản phẩm",
    "addProduct": "Thêm sản phẩm",
    "stock": "Tồn kho",
    "inStock": "Còn hàng",
    "lowStock": "Sắp hết hàng",
    "edit": "Chỉnh sửa",
    "delete": "Xóa",
    "ordersPageTitle": "Đơn hàng",
    "viewManageOrders": "Xem và quản lý đơn hàng của khách",
    "orderID": "Mã đơn",
    "customer": "Khách hàng",
    "items": "Số lượng",
    "total": "Tổng tiền",
    "status": "Trạng thái",
    "date": "Ngày",
    "actions": "Thao tác",
  }
};

const currentLang = "vi";

export function t(key) {
  return translations[currentLang][key] || key;
}
