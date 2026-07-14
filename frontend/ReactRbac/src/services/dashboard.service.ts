import api from "../api";

export const getDashboardStats = async () => {
    try {
        const response = await api.get("/dashboard/stats");
        return {
            totalUsers: response.data?.data?.totalUsers || 0,
            totalRoles: response.data?.data?.totalRoles || 0,
            totalModules: response.data?.data?.totalModules || 0,
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        return { totalUsers: 0, totalRoles: 0, totalModules: 0 };
    }
};
