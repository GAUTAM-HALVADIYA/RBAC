import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import moduleModel from "../models/module.model";

export class DashboardService {
    async getStats() {
        const [totalUsers, totalRoles, totalModules] = await Promise.all([
            userModel.countDocuments(),
            roleModel.countDocuments(),
            moduleModel.countDocuments(),
        ]);
        return { totalUsers, totalRoles, totalModules };
    }
}
