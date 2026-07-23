import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import permissionModel from "../models/permission.model";
import moduleModel from "../models/module.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { MESSAGES } from "../constants/messages.constants";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";
import { cloudinary } from "../middleware/upload.middleware";
import bcrypt from "bcrypt";

export class UserService {
    async getUsers(query: Record<string, any> = {}, currentUserId?: string) {
        const options = getPaginationOptions(query);
        const filter: any = {};

        if (currentUserId) {
            filter._id = { $ne: currentUserId };
        }

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
    async createUsers(data: CreateUserDto) {
        const { email, password, role } = data;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new AppError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_EXISTS);
        }

        const existRole = await roleModel.findById(role);
        if (!existRole) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.ROLE_NOT_FOUND);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            ...data,
            password: hashPassword,
            isVerified: true,
        });
        return { id: newUser._id, email: newUser.email };
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
        console.log(targetUserRole, currentUserRole);
        if (currentUserRole === "Admin" && (targetUserRole === "Admin" || targetUserRole === "Super Admin")) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.ADMIN_NO_MODIFY);
        }
        const { name, role } = data;

        if (role) {
            const roleExists = await roleModel.findById(role);
            if (!roleExists) {
                throw new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ROLE_NOT_FOUND);
            }
            if (currentUserRole === "Admin" && (roleExists?.name === "Admin" || roleExists?.name === "Super Admin")) {
                throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.ADMIN_NO_MODIFY);
            }
            targetUser.set("role", role);
        }

        if (name) targetUser.name = name;

        await targetUser.save();
        return targetUser;
    }

    async deleteUser(targetUserId: string, currentUserRole: string, currentUser: string) {
        const targetUser = await userModel.findById(targetUserId).populate("role");

        if (!targetUser) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        if (targetUser._id.toString() == currentUser) throw new AppError(HTTP_STATUS.BAD_REQUEST, "you can't delete loged user");
        const targetUserRole = (targetUser.role as unknown as { name: string }).name;

        if (currentUserRole === "Admin" && (targetUserRole === "Admin" || targetUserRole === "Super Admin")) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.ADMIN_NO_DELETE);
        }

        await userModel.findByIdAndDelete(targetUserId);
    }

    async getProfile(userId: string) {
        const user = await userModel.findById(userId).populate("role", "name");
        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        const permissions = await permissionModel.find({ roleId: user.role._id }).populate("moduleId", "name key isActive");

        return { ...user.toObject(), permissions };
    }

    async updateProfile(userId: string, data: UpdateUserDto) {
        const { bio, address, dob, avatar, name } = data;

        const user = await userModel.findById(userId);
        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (address !== undefined) user.address = address;
        if (dob !== undefined) user.dob = dob;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();
        return user;
    }

    async uploadAvatar(userId: string, fileInfo: any) {
        if (!fileInfo) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "No file provided");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        user.avatar = fileInfo.path;
        await user.save();
        return user;
    }

    async deleteAvatar(userId: string) {
        const user = await userModel.findById(userId);
        if (!user || !user.avatar) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Avatar not found");
        }

        try {
            const urlParts = user.avatar.split("/");
            const filenameWithExt = urlParts[urlParts.length - 1];
            const public_id = filenameWithExt.split(".")[0];
            await cloudinary.uploader.destroy(public_id);
        } catch (error) {
            console.error("Cloudinary deletion error:", error);
        }

        user.avatar = undefined;
        await user.save();
        return user;
    }
}
