import axiosClient from "./axiosClient";

export const getAllVouchers = async (page = 0, size = 10, keyword = "") => {
  const res = await axiosClient.get("/vouchers", {
    params: { page, size, keyword },
  });
  return res.data;
};

export const createVoucher = async (data) => {
  const res = await axiosClient.post("/vouchers", data);
  return res.data;
};

export const updateVoucher = async (id, data) => {
  const res = await axiosClient.put(`/vouchers/${id}`, data);
  return res.data;
};

export const deleteVoucher = async (id) => {
  const res = await axiosClient.delete(`/vouchers/${id}`);
  return res.data;
};

export const toggleVoucherActive = async (id) => {
  const res = await axiosClient.patch(`/vouchers/${id}/toggle-active`);
  return res.data;
};

export const getVoucherByCode = async (code) => {
  const res = await axiosClient.get(`/vouchers/code/${code}`);
  return res.data;
}