import axiosClient from "./axiosClient";

export const getAllPayments = async (
  page = 0,
  size = 10,
  keyword = "",
  status = "",
  provider = "",
  fromDate = "",
  toDate = ""
) => {
  const res = await axiosClient.get("/payments", {
    params: { page, size, keyword, status, provider, fromDate, toDate },
  });
  return res.data;
};
/**
 * Tạo link thanh toán PayOS cho đơn hàng
 * @param {number} orderId - ID đơn hàng
 * @returns {Promise} - Response chứa checkoutUrl, qrCode, etc.
 */
export const createPaymentApi = async (orderId) => {
    try {
        const res = await axiosClient.post(`/payments/${orderId}`);
        return res.data;
    } catch (err) {
        console.error("create payment error:", err.response || err);
        throw err;
    }
};

/**
 * Kiểm tra trạng thái thanh toán
 * @param {number} orderId - ID đơn hàng
 * @returns {Promise} - Response chứa status (PAID, PENDING, CANCELLED, EXPIRED)
 */
export const getPaymentStatusApi = async (orderId) => {
    try {
        const res = await axiosClient.get(`/payments/status/${orderId}`);
        return res.data;
    } catch (err) {
        console.error("get payment status error:", err.response || err);
        throw err;
    }
};

/**
 * Hủy link thanh toán PayOS
 * @param {number} orderId - ID đơn hàng
 * @returns {Promise}
 */
export const cancelPaymentApi = async (orderId) => {
    try {
        const res = await axiosClient.post(`/payments/cancel/${orderId}`);
        return res.data;
    } catch (err) {
        console.error("cancel payment error:", err.response || err);
        throw err;
    }
};