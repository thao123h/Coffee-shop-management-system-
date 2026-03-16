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
