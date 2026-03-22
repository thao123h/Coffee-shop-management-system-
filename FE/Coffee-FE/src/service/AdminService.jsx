import axiosClient from "./axiosClient";

export const getDashboardStats = async () => {
    try {
        const res = await axiosClient.get("/admin/dashboard");
        return res.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

export const getTrafficStats = async () => {
    try {
        const res = await axiosClient.get("/admin/traffic");
        return res.data;
    } catch (error) {
        console.error("Error fetching traffic stats:", error);
        throw error;
    }
};

export const getUserStats = async () => {
    try {
        const res = await axiosClient.get("/admin/stats");
        return res.data;
    } catch (error) {
        console.error("Error fetching user stats:", error);
        throw error;
    }
};
