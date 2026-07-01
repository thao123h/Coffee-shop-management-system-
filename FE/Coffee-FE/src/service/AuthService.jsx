import axiosClient from "./axiosClient";

export const loginApi = async (username, password) => {
  try {
    const res = await axiosClient.post("/auth/login", { username, password });

    // Backend wraps response: { success, message, data: { token, type, id, username, fullName, role } }
    const payload = res.data?.data || res.data;

    // Remap to what AuthProvider expects: { accessToken, tokenType, username, role }
    return {
      accessToken: payload.token  || payload.accessToken,
      tokenType:   payload.type   || payload.tokenType || "Bearer",
      id:          payload.id,
      username:    payload.username,
      fullName:    payload.fullName,
      role:        payload.role,
    };
  } catch (err) {
    console.error("login error:", err.response || err);
    throw err;
  }
};

export const registerApi = async (username, password, role) => {
  try {
    const res = await axiosClient.post("/auth/signup", { username, password, role });
    return res.data?.data || res.data;
  } catch (err) {
    console.error("register error:", err.response || err);
    throw err;
  }
};
