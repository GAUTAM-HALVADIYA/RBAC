export type CreateUserDto = {
    name: string;
    email: string;
    password: string;
    role: string;
};

export type UpdateUserDto = {
    name?: string;
    role?: string;
    bio?: string;
    address?: string;
    dob?: Date;
    avatar?: string;
};