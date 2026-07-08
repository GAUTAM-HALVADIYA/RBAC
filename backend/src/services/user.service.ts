import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { MESSAGES } from "../constants/messages.constants";
import { UpdateUserDto } from "../dto/user.dto";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";

export class UserService {
    async getUsers(query: Record<string, any> = {}) {
        const options = getPaginationOptions(query);
        const filter: any = {};

        if (options.search) {
            filter.$or = [
                {
                    name: {
                        $regex: options.search,
                        $options: "i",
                    },
                },

                {
                    email: {
                        $regex: options.search,
                        $options: "i",
                    },
                },
            ];
        }

        const sort: any = {};
        if (options.sortBy) {
            sort[options.sortBy] = options.sortOrder === "desc" ? -1 : 1;
        }

        const [totalRecords, data] = await Promise.all([
            userModel.countDocuments(filter),
            userModel.find(filter).populate("role", "name").sort(sort).skip(options.skip).limit(options.limit).lean(),
        ]);

        const meta = getPaginatedMetadata(totalRecords, options.page, options.limit);

        return { data, meta };
    }

    async getUserById(id: string) {
        const user = await userModel.findById(id).populate("role", "name");
        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }

    async updateUser(targetUserId: string, currentUserRole: string, data: UpdateUserDto) {
        const targetUser = await userModel.findById(targetUserId).populate("role");

        if (!targetUser) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        const targetUserRole = (targetUser.role as unknown as { name: string }).name;

        if (currentUserRole === "Admin" && (targetUserRole === "Admin" || targetUserRole === "Super Admin")) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.ADMIN_NO_MODIFY);
        }

        const { name, role } = data;

        if (role) {
            const roleExists = await roleModel.findById(role);
            if (!roleExists) {
                throw new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ROLE_NOT_FOUND);
            }
            targetUser.set("role", role);
        }

        if (name) targetUser.name = name;

        await targetUser.save();
        return targetUser;
    }

    async deleteUser(targetUserId: string, currentUserRole: string) {
        const targetUser = await userModel.findById(targetUserId).populate("role");

        if (!targetUser) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        const targetUserRole = (targetUser.role as unknown as { name: string }).name;

        if (currentUserRole === "Admin" && (targetUserRole === "Admin" || targetUserRole === "Super Admin")) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.ADMIN_NO_DELETE);
        }

        await userModel.findByIdAndDelete(targetUserId);
    }
}
