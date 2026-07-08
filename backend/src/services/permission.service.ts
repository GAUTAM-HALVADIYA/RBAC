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

        const permission = await permissionModel.findByIdAndUpdate(id, data, { new: true }).populate("moduleId").populate("roleId");
        if (!permission) throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
        return permission;
    }

    async deletePermission(id: string) {
        const permission = await permissionModel.findByIdAndDelete(id);
        if (!permission) throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
        return permission;
    }
}
// import permissionModel from "../models/permission.model";
// import { AppError } from "../utils/AppError";
// import { HTTP_STATUS } from "../constants/http-status.constants";
// import {
//     CreatePermissionDto,
//     UpdatePermissionDto,
// } from "../dto/permission.dto";

// export class PermissionService {
//     async createPermission(data: CreatePermissionDto) {
//         const permissionExists = await permissionModel.findOne({
//             key: data.key,
//         });
//         if (permissionExists) {
//             throw new AppError(
//                 HTTP_STATUS.BAD_REQUEST,
//                 "Permission with this key already exists",
//             );
//         }
//         return await permissionModel.create(data);
//     }

//     async getPermissions(
//         skip: number,
//         limit: number,
//         sortBy: string | undefined,
//         sortOrder: string | undefined,
//         search?: string | undefined,
//     ) {
//         const filter: any = {};

//         if (search) {
//             filter.$or = [
//                 {
//                     name: {
//                         $regex: search,
//                         $options: "i",
//                     },
//                 },

//                 {
//                     key: {
//                         $regex: search,
//                         $options: "i",
//                     },
//                 },
//             ];
//         }
//         const sort: any = {};

//         if (sortBy) {
//             sort[sortBy] = sortOrder === "desc" ? -1 : 1;
//         }
//         return await permissionModel
//             .find(filter)
//             .select("name key")
//             .populate("moduleId", "name key")
//             .sort(sort)
//             .skip(skip)
//             .limit(limit);
//     }

//     async getPermissionById(id: string) {
//         const permission = await permissionModel
//             .findById(id)
//             .populate("moduleId");
//         if (!permission)
//             throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
//         return permission;
//     }

//     async updatePermission(id: string, data: UpdatePermissionDto) {
//         const permission = await permissionModel
//             .findByIdAndUpdate(id, data, { new: true })
//             .populate("moduleId");
//         if (!permission)
//             throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
//         return permission;
//     }

//     async deletePermission(id: string) {
//         const permission = await permissionModel.findByIdAndDelete(id);
//         if (!permission)
//             throw new AppError(HTTP_STATUS.NOT_FOUND, "Permission not found");
//         return permission;
//     }
// }
