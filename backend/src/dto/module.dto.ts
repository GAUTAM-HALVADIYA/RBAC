export type CreateModuleDto = {
    name: string;
    key: string;
    description?: string;
    isActive?: boolean;
};

export type UpdateModuleDto = {
    name?: string;
    key?: string;
    description?: string;
    isActive?: boolean;
};
