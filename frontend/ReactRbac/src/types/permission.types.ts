export interface Permission {
    _id: string;
    permissions: {
        read: boolean;
        write: boolean;
    };
    roleId: {
        _id: string;
        name: string;
    };
    moduleId: {
        _id: string;
        name: string;
        key: string;
    };
}

export interface PermissionResponse {
    data: Permission[];
    meta: {
        page: number;
        limit: number;
        totalRecords: number;
        totalPages: number;
    };
}