import profileModel from "../models/profile.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { MESSAGES } from "../constants/messages.constants";
import { CreateProfileDto, UpdateProfileDto } from "../dto/profile.dto";
import { cloudinary } from "../middleware/upload.middleware";
import userModel from "../models/user.model";

export class ProfileService {
    async createProfile(userId: string, data: CreateProfileDto) {
        const existProfile = await profileModel.findOne({ user: userId });

        if (existProfile) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.PROFILE_EXISTS);
        }
        
        const profileData = { ...data, user: userId };
        const profile = await profileModel.create(profileData);
        return profile;
    }

    async getProfile(userId: string) {
        const profile = await profileModel.findOne({ user: userId }).populate("user", "name email");

        if (!profile) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.PROFILE_NOT_FOUND);
        }

        return profile;
    }

    async getCurrentUser(id: string) {
            const user = await userModel.findById(id).select("name email").populate("role", "name");
            if (!user) {
                throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
            }
            return user;
        }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        const { bio, address, dob, avatar } = data;

        let profile = await profileModel.findOne({ user: userId });

        if (!profile) {
            profile = await profileModel.create({
                user: userId,
                bio,
                address,
                dob,
                avatar,
            });
        } else {
            if (bio !== undefined) profile.bio = bio;
            if (address !== undefined) profile.address = address;
            if (dob !== undefined) profile.dob = dob;
            if (avatar !== undefined) profile.avatar = avatar;
            await profile.save();
        }

        return profile;
    }

    async deleteProfile(userId: string) {
        const profile = await profileModel.findOne({ user: userId });

        if (!profile) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.PROFILE_NOT_FOUND);
        }
        
        const deletedProfile = await profileModel.findByIdAndDelete(profile._id);
        return deletedProfile;
    }

    async uploadAvatar(userId: string, fileInfo: any) {
        if (!fileInfo) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "No file provided");
        }

        let profile = await profileModel.findOne({ user: userId });
        if (!profile) {
            profile = await profileModel.create({ user: userId });
        }

        profile.avatar = fileInfo.path;
        await profile.save();
        return profile;
    }

    async deleteAvatar(userId: string) {
        let profile = await profileModel.findOne({ user: userId });
        if (!profile || !profile.avatar) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Avatar not found");
        }

        try {
            // Extract public_id from Cloudinary URL if possible
            const urlParts = profile.avatar.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1];
            const public_id = filenameWithExt.split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        } catch (error) {
            console.error("Cloudinary deletion error:", error);
        }

        profile.avatar = "";
        await profile.save();
        return profile;
    }
}
