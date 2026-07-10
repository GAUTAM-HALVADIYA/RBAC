import permissionModel from "../models/permission.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { CreatePermissionDto, UpdatePermissionDto } from "../dto/permission.dto";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";

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
