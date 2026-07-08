import moduleModel from "../models/module.model";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { CreateModuleDto, UpdateModuleDto } from "../dto/module.dto";
import roleModel from "../models/role.model";
import permissionModel from "../models/permission.model";
import { PermissionService } from "./permission.service";
import { CreatePermissionDto } from "../dto/permission.dto";
import { PaginationOptions, getPaginatedMetadata, getPaginationOptions } from "../utils/pagination.util";

const permissionService = new PermissionService();
export class ModuleService {
    async createModule(data: CreateModuleDto) {
        const moduleExists = await moduleModel.findOne({ key: data.key });
        if (moduleExists) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "Module is already exists");
        }
        const newModule = await moduleModel.create(data);

        const allRoles = await roleModel.find().select("_id");

        const permissionPromises = allRoles.map((role) => {
            const data: CreatePermissionDto = {
                moduleId: newModule._id,
                roleId: role._id,
            };
            return permissionService.createPermission(data);
        });
        const alldata = await Promise.all(permissionPromises);

        return newModule;
    }

    async getModules(query: Record<string, any> = {}) {
        const options = getPaginationOptions(query);
        const { skip, limit, sortBy, sortOrder, search } = options;
        const filter: any = {};

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    key: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const sort: any = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
        }

        const [totalRecords, data] = await Promise.all([
            moduleModel.countDocuments(filter),
            moduleModel.find(filter).sort(sort).skip(skip).limit(limit).lean()
        ]);
        const meta = getPaginatedMetadata(totalRecords, options.page, limit);

        return { data, meta };
    }

    async getModuleById(id: string) {
        const module = await moduleModel.findById(id);
        if (!module) throw new AppError(HTTP_STATUS.NOT_FOUND, "Module not found");
        return module;
    }

    async updateModule(id: string, data: UpdateModuleDto) {
        const module = await moduleModel.findByIdAndUpdate(id, data, { new: true });
        if (!module) throw new AppError(HTTP_STATUS.NOT_FOUND, "Module not found");
        return module;
    }

    async deleteModule(id: string) {
        const module = await moduleModel.findByIdAndDelete(id);
        if (!module) throw new AppError(HTTP_STATUS.NOT_FOUND, "Module not found");

        // Cascade delete permissions associated with this module
        await permissionModel.deleteMany({ moduleId: id });

        return module;
    }
}
// import moduleModel from "../models/module.model";
// import { AppError } from "../utils/AppError";
// import { HTTP_STATUS } from "../constants/http-status.constants";
// import { CreateModuleDto, UpdateModuleDto } from "../dto/module.dto";

// export class ModuleService {
//     async createModule(data: CreateModuleDto) {
//         const moduleExists = await moduleModel.findOne({ key: data.key });
//         if (moduleExists) {
//             throw new AppError(HTTP_STATUS.BAD_REQUEST, "Module with this key already exists");
//         }
//         return await moduleModel.create(data);
//     }

//     async getModules(
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

//         return await moduleModel
//             .find(filter)
//             .sort(sort)
//             .skip(skip)
//             .limit(limit);
//     }

//     async getModuleById(id: string) {
//         const module = await moduleModel.findById(id);
//         if (!module) throw new AppError(HTTP_STATUS.NOT_FOUND, "Module not found");
//         return module;
//     }

//     async updateModule(id: string, data: UpdateModuleDto) {
//         const module = await moduleModel.findByIdAndUpdate(id, data, { new: true });
//         if (!module) throw new AppError(HTTP_STATUS.NOT_FOUND, "Module not found");
//         return module;
//     }

//     async deleteModule(id: string) {
//         const module = await moduleModel.findByIdAndDelete(id);
//         if (!module) throw new AppError(HTTP_STATUS.NOT_FOUND, "Module not found");
//         return module;
//     }
// }
