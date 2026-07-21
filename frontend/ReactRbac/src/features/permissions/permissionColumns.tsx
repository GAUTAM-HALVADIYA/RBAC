import type { ColumnDef } from "../../components/data-table/types";
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
            enableSorting: true,
            width: 220,
            minWidth: 100,
        },

        {
            accessorFn: (row) => row.moduleId.name,
            id: "module",
            header: "Module",
            enableSorting: true,
            enableEditing: true,
            width: 220,
            minWidth: 150,
        },

        {
            id: "read",

            header: "Read",

            exportValue: (row) => (row.permissions.read ? "Yes" : "No"),

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
            width:120,

        },

        {
            id: "write",

            header: "Write",

            exportValue: (row) => (row.permissions.write ? "Yes" : "No"),

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
            width:120,
        },

        {
            id: "action",

            header: "Action",

            enableExport: false,

            cell: ({ row }) => {
                const permission = row.original;

                return (
                    <button className="btn btn-primary btn-sm" onClick={() => onSave(permission)}>
                        Save
                    </button>
                );
            },
            width:140,
        },
    ];
}
