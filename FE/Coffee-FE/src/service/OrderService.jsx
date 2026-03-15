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