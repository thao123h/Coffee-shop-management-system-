import axiosClient from "./axiosClient";

export const createOrder = async (orderData) => {
  const response = await axiosClient.post("/orders", orderData);
  return response.data;
};