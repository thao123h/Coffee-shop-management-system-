import axiosClient from "./axiosClient";

export const createOrder = async (orderData) => {
  const response = await axiosClient.post("/orders", orderData);
  return response.data;
};

export const completeCashPayment = async (orderId) => {
  const response = await axiosClient.patch(`/orders/${orderId}/complete`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await axiosClient.patch(`/orders/${orderId}/cancel`);
  return response.data;
};

export const getAllOrders = async (
  page = 0,
  size = 10,
  filters = {}
) => {
  const {
    orderId,
    status,
    paymentMethod,
    fromDate,
    toDate,
  } = filters;

  const params = {
    page,
    size,
    ...(orderId && { orderId }),
    ...(status && { status }),
    ...(paymentMethod && { paymentMethod }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };

  const response = await axiosClient.get("/orders", { params });

  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
}