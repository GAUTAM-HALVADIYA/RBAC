import type { ColumnDef } from "../../components/data-table/types";

export interface User {
    _id: string;
    name: string;
    email: string;
    role?: {
        _id: string;
        name: string;
    };
}

export function userColumns(
    onEditClick: (user: User) => void,
    onDeleteClick: (id: string) => void,
): ColumnDef<User>[] {
    return [
        {
            id: "name",
            header: "Name",
            accessorFn: (row) => row.name,
            enableSorting: true,
        },
        {
            id: "email",
            header: "Email",
            accessorFn: (row) => row.email,
            enableSorting: true,
        },
        {
            id: "role",
            header: "Role",
            accessorFn: (row) => row.role?.name || "No Role",
            enableSorting: true,
            cell: ({ row }) => (
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">
                    {row.original.role?.name || "No Role"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableExport: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="text-end pe-3">
                        <button
                            className="btn btn-sm btn-light text-primary me-2 shadow-sm"
                            onClick={() => onEditClick(user)}
                        >
                            <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                            className="btn btn-sm btn-light text-danger shadow-sm"
                            onClick={() => onDeleteClick(user._id)}
                        >
                            <i className="bi bi-trash-fill"></i> Delete
                        </button>
                    </div>
                );
            },
        },
    ];
}
