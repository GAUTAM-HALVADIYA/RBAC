import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import "dotenv/config";
import dbConnection from "./config/connection";
import roleModel from "./models/role.model";
import userModel from "./models/user.model";
import moduleModel from "./models/module.model";
import permissionModel from "./models/permission.model";
import logger from "./utils/logger.util";
import { MODULES } from "./constants/modules.constants";
import { ROLES } from "./constants/roles.constants";

const seedData = async () => {
    try {
        await dbConnection();

        logger.info("Starting database initialization process...");

        // 1. Seed Roles
        logger.info("Syncing roles...");
        const rolesToCreate = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER];
        const roleIds: Record<string, mongoose.Types.ObjectId> = {};

        for (const roleName of rolesToCreate) {
            let role = await roleModel.findOne({ name: roleName });
            if (!role) {
                role = await roleModel.create({ name: roleName });
                logger.info(`  [+] Role created: ${roleName}`);
            }
            roleIds[roleName] = role._id as mongoose.Types.ObjectId;
        }

        // 2. Seed Modules
        logger.info("Syncing modules...");
        const moduleIds: Record<string, mongoose.Types.ObjectId> = {};
        const modulesData = Object.values(MODULES);
        
        for (const moduleKey of modulesData) {
            let m = await moduleModel.findOne({ key: moduleKey });
            if (!m) {
                m = await moduleModel.create({ name: moduleKey.toUpperCase(), key: moduleKey });
                logger.info(`  [+] Module created: ${moduleKey}`);
            }
            moduleIds[moduleKey] = m._id as mongoose.Types.ObjectId;
        }

        // 3. Seed Permissions
        logger.info("Syncing permissions...");
        
        const setPermission = async (roleName: string, moduleKey: string, read: boolean, write: boolean) => {
            const roleId = roleIds[roleName];
            const moduleId = moduleIds[moduleKey];
            let p = await permissionModel.findOne({ roleId, moduleId });
            if (!p) {
                await permissionModel.create({
                    roleId,
                    moduleId,
                    permissions: { read, write }
                });
                logger.info(`  [+] Permission created for ${roleName} on ${moduleKey}: read=${read}, write=${write}`);
            } else {
                p.permissions = { read, write };
                await p.save();
            }
        };

        for (const moduleKey of modulesData) {
            // Super Admin: Full Access
            await setPermission(ROLES.SUPER_ADMIN, moduleKey, true, true);
            
            // Admin Access
            const adminWriteAccess = [MODULES.USERS, MODULES.PROFILE];
            const adminReadAccess = [MODULES.USERS, MODULES.PROFILE, MODULES.AUDIT_LOGS];
            await setPermission(
                ROLES.ADMIN, 
                moduleKey, 
                adminReadAccess.includes(moduleKey), 
                adminWriteAccess.includes(moduleKey)
            );
            
            // User Access
            const userWriteAccess = [MODULES.PROFILE];
            const userReadAccess = [MODULES.PROFILE];
            await setPermission(
                ROLES.USER, 
                moduleKey, 
                userReadAccess.includes(moduleKey), 
                userWriteAccess.includes(moduleKey)
            );
        }

        // 4. Seed Super Admin User
        logger.info("Syncing super admin user...");
        let adminUser = await userModel.findOne({ email: "admin@admin.com" });
        if (!adminUser) {
            const randomPassword = crypto.randomBytes(8).toString("hex");
            const hashPassword = await bcrypt.hash(randomPassword, 10);

            adminUser = await userModel.create({
                name: "Super Admin",
                email: "admin@admin.com",
                password: hashPassword,
                role: roleIds[ROLES.SUPER_ADMIN],
                isVerified: true,
            });
            logger.info("\n=======================================================");
            logger.info("             SUPER ADMIN CREATED SUCCESSFULLY          ");
            logger.info("=======================================================");
            logger.info(`Email    : admin@admin.com`);
            logger.info(`Password : ${randomPassword}`);
            logger.info("PLEASE SAVE THIS PASSWORD SECURELY (It won't be shown again)");
            logger.info("=======================================================\n");
        } else {
            // Ensure the super admin role is correct
            if (adminUser.role?.toString() !== roleIds[ROLES.SUPER_ADMIN]!.toString()) {
                adminUser.role = roleIds[ROLES.SUPER_ADMIN] as any;
                await adminUser.save();
                logger.info("  [*] Super Admin user role mapping updated.");
            } else {
                logger.info("  [-] Super Admin user already exists.");
            }
        }

        logger.info("Database initialization completed successfully.");
        process.exit(0);
    } catch (error) {
        logger.error(`Initialization error: ${error}`);
        process.exit(1);
    }
};

seedData();
