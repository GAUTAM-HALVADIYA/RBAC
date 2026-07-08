// export type CreatePermissionDto = {
//     name: string;
//     key: string;
//     moduleId: string;
//     description?: string;
// };

import { Types } from "mongoose";

// export type UpdatePermissionDto = {
//     name?: string;
//     key?: string;
//     moduleId?: string;
//     description?: string;
// };

export type CreatePermissionDto = {
    permissions?: {
        read: boolean,
        write: boolean,
    };
    moduleId: Types.ObjectId;
    roleId: Types.ObjectId;
};

export type UpdatePermissionDto = {
    permissions: {
        read: boolean,
        write: boolean,
    };
    moduleId: Types.ObjectId;
    roleId: Types.ObjectId;
};
