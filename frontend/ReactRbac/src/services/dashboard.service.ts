import api from "../api";

export const getDashboardStats = async () => {
    try {
        const [usersRes, rolesRes, modulesRes] = await Promise.all([
            api.get("/users?limit=1"),
            api.get("/roles?limit=1"),
            api.get("/modules?limit=1")
        ]);

        return {
            totalUsers: usersRes.data?.meta?.totalRecords || 0,
            totalRoles: rolesRes.data?.meta?.totalRecords || 0,
            totalModules: modulesRes.data?.meta?.totalRecords || 0
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        return { totalUsers: 0, totalRoles: 0, totalModules: 0 };
    }
};
