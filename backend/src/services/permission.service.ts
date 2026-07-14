import permissionModel from "../models/permission.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { CreatePermissionDto, UpdatePermissionDto } from "../dto/permission.dto";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";
import roleModel from "../models/role.model";
import moduleModel from "../models/module.model";

export class PermissionService {
    async createPermission(data: CreatePermissionDto) {
        const permissionExists = await permissionModel.findOne({
            moduleId: data.moduleId,
            roleId: data.roleId,
        });
        if (permissionExists) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "Permission with this key already exists");
        }
        return await permissionModel.create(data);
    }

    async getPermissions(query: Record<string, any> = {}) {
        const options = getPaginationOptions(query);
        const filter: any = {};
        const sort: any = {};

        if (options.search) {
            const [matchingRoles, matchingModules] = await Promise.all([
                roleModel.find({ name: { $regex: options.search, $options: "i" } }).select('_id'),
                moduleModel.find({ name: { $regex: options.search, $options: "i" } }).select('_id')
            ]);
            console.log(matchingRoles, matchingModules);
            filter.$or = [
                { roleId: { $in: matchingRoles.map(r => r._id) } },
                { moduleId: { $in: matchingModules.map(m => m._id) } }
            ];
        }

        if (options.sortBy) {
            sort[options.sortBy] = options.sortOrder === "desc" ? -1 : 1;
        }

        const [totalRecords, data] = await Promise.all([
            permissionModel.countDocuments(filter),
            permissionModel
                .find(filter)
                .select("permissions moduleId roleId")
                .populate("moduleId", "name key")
                .populate("roleId", "name")
                .sort(sort)
                .skip(options.skip)
                .limit(options.limit)
                .lean()
        ]);
            
        const meta = getPaginatedMetadata(totalRecords, options.page, options.limit);

        return { data, meta };
    }

    async getPermissionById(id: string) {
        const permission = await permissionModel.findById(id).populate("moduleId").populate("roleId");
        if (!permission) throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
        return permission;
    }

    async updatePermission(id: string, data: UpdatePermissionDto) {
        if (!data.permissions) throw new AppError(HTTP_STATUS.BAD_REQUEST, "Permission not provided");

        if (data.permissions.write) data.permissions.read = true;

        const permission = await permissionModel.findByIdAndUpdate(id, data, {returnDocument: "after"}).populate("moduleId").populate("roleId");
        if (!permission) throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
        return permission;
    }

    async deletePermission(id: string) {
        const permission = await permissionModel.findByIdAndDelete(id);
        if (!permission) throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
        return permission;
    }
}
