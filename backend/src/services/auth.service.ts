import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import otpModel from "../models/otp.model";
import profileModel from "../models/profile.model";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/otp.util";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.util";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { MESSAGES } from "../constants/messages.constants";
import { RegisterDto, LoginDto, VerifyOtpDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from "../dto/auth.dto";

export class AuthService {
    async register(data: RegisterDto) {
        const { name, email, password } = data;

        const defaultRole = await roleModel.findOne({ name: "User" });
        if (!defaultRole) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.ROLE_NOT_FOUND);
        }

        const role = defaultRole._id;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new AppError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_EXISTS);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            role,
            isVerified: false,
        });

        await profileModel.create({ user: newUser._id });

        await otpModel.updateMany({ user: newUser._id }, { isUsed: true });

        const otp = generateOtp();
        await otpModel.create({
            user: newUser._id,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000),
        });

        console.log(` OTP for ${email} is ${otp}`);

        return { id: newUser._id, email: newUser.email };
    }

    async verifyOtp(data: VerifyOtpDto) {
        const { email, otp } = data;
        const user = await userModel.findOne({ email }).populate("role");

        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        const otpRecord = await otpModel.findOne({
            user: user._id,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_OTP);
        }

        otpRecord.isUsed = true;
        await otpRecord.save();

        if (!user.isVerified) {
            user.isVerified = true;
        }

        const roleData: any = user.role;
        const roleName = roleData?.name || user.role.toString();

        const accessToken = generateAccessToken(user._id.toString(), roleName);
        const refreshToken = generateRefreshToken(user._id.toString(), roleName);

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    }

    async resendOtp(data: { email: string }) {
        const { email } = data;
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        await otpModel.updateMany({ user: user._id }, { isUsed: true });

        const otp = generateOtp();
        await otpModel.create({
            user: user._id,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000), // 10 mins expiry
        });

        console.log(` Resent OTP for ${email} is ${otp}`);

        return { message: "OTP resent successfully" };
    }

    async login(data: LoginDto) {
        const { email, password } = data;
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        if (!user.isVerified) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.VERIFY_FIRST);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CRED);
        }

        await otpModel.updateMany({ user: user._id }, { isUsed: true });

        const otp = generateOtp();
        await otpModel.create({
            user: user._id,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60000),
        });

        console.log(` Login OTP for ${email} is ${otp}`);
    }

    async forgotPassword(data: ForgotPasswordDto) {
        const { email } = data;
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        await otpModel.updateMany({ user: user._id }, { isUsed: true });

        const otp = generateOtp();
        await otpModel.create({
            user: user._id,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000),
        });

        console.log(` Reset Password OTP for ${email} is ${otp}`);
    }

    async resetPassword(data: ResetPasswordDto) {
        const { email, otp, newPassword } = data;
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
        }

        const otpRecord = await otpModel.findOne({
            user: user._id,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_OTP);
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        otpRecord.isUsed = true;
        await otpRecord.save();
    }

    async refreshToken(data: RefreshTokenDto) {
        const { refreshToken } = data;
        if (!refreshToken) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "Refresh token is required");
        }

        let decoded: any;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.INVALID_TOKEN);
        }

        const user = await userModel.findById(decoded.id).populate("role");

        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError(HTTP_STATUS.FORBIDDEN, MESSAGES.INVALID_TOKEN);
        }

        const roleData: any = user.role;
        const accessToken = generateAccessToken(user._id.toString(), roleData.name);

        return { accessToken };
    }

    async logout(userId: string) {
        if (!userId) {
            throw new AppError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHENTICATED);
        }

        const user = await userModel.findById(userId);
        if (user) {
            user.refreshToken = "";
            await user.save();
        }
    }
}
