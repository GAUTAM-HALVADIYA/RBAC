import type { ColumnDef } from "@tanstack/react-table";
import type { Permission } from "../../types/permission.types";

export function permissionColumns(
    onReadChange: (id: string, checked: boolean) => void,
    onWriteChange: (id: string, checked: boolean) => void,
    onSave: (permission: Permission) => void,
): ColumnDef<Permission>[] {
    return [
        {
            accessorFn: (row) => row.roleId.name,
            id: "role",
            header: "Role",
        },

        {
            accessorFn: (row) => row.moduleId.name,
            id: "module",
            header: "Module",
        },

        {
            id: "read",

            header: "Read",

            cell: ({ row }) => {
                const permission = row.original;

                return (
                    <input
                        type="checkbox"
                        checked={permission.permissions.read}
                        disabled={permission.permissions.write}
                        onChange={(e) => onReadChange(permission._id, e.target.checked)}
                    />
                );
            },
        },

        {
            id: "write",

            header: "Write",

            cell: ({ row }) => {
                const permission = row.original;

                return (
                    <input
                        type="checkbox"
                        checked={permission.permissions.write}
                        onChange={(e) => onWriteChange(permission._id, e.target.checked)}
                    />
                );
            },
        },

        {
            id: "action",

            header: "Action",

            cell: ({ row }) => {
                const permission = row.original;

                return (
                    <button className="btn btn-primary btn-sm" onClick={() => onSave(permission)}>
                        Save
                    </button>
                );
            },
        },
    ];
}
