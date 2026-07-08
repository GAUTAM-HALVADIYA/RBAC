import roleModel from "../models/role.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { MESSAGES } from "../constants/messages.constants";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";
import moduleModel from "../models/module.model";
import userModel from "../models/user.model";
import permissionModel from "../models/permission.model";
import { CreatePermissionDto } from "../dto/permission.dto";
import { PermissionService } from "./permission.service";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";

const permissionService = new PermissionService();

export class RoleService {
    async createRole(data: CreateRoleDto) {
        const roleExists = await roleModel.findOne({ name: data.name });
        if (roleExists) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ROLE_EXISTS);
        }
        const role = await roleModel.create({
            name: data.name,
        });

        const allModules = await moduleModel.find().select("_id");

        const permissionPromises = allModules.map((module) => {
            const data: CreatePermissionDto = {
                moduleId: module._id,
                roleId: role._id,
            };
            return permissionService.createPermission(data);
        });
        const alldata = await Promise.all(permissionPromises);
        return role;
    }

    async getRoles(query: Record<string, any> = {}) {
        const options = getPaginationOptions(query);
        const filter: any = {};

        if (options.search) {
            filter.name = {
                $regex: options.search,
                $options: "i",
            };
        }

        const sort: any = {};
        if (options.sortBy) {
            sort[options.sortBy] = options.sortOrder === "desc" ? -1 : 1;
        }

        const [totalRecords, data] = await Promise.all([
            roleModel.countDocuments(filter),
            roleModel.find(filter).select("name").sort(sort).skip(options.skip).limit(options.limit).lean(),
        ]);
        const meta = getPaginatedMetadata(totalRecords, options.page, options.limit);

        return { data, meta };
    }

    async getRoleById(id: string) {
        const role = await roleModel.findById(id);
        if (!role) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.ROLE_NOT_FOUND);
        }
        return role;
    }

    async updateRole(id: string, data: UpdateRoleDto) {
        const role = await roleModel.findByIdAndUpdate(id, data, { new: true });
        if (!role) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.ROLE_NOT_FOUND);
        }
        return role;
    }

    async deleteRole(id: string) {
        const usersWithRole = await userModel.countDocuments({ role: id });
        if (usersWithRole > 0) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "Cannot delete role because it is assigned to existing users");
        }

        const role = await roleModel.findByIdAndDelete(id);
        if (!role) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.ROLE_NOT_FOUND);
        }

        // Cascade delete permissions associated with this role
        await permissionModel.deleteMany({ roleId: id });
    }
}
