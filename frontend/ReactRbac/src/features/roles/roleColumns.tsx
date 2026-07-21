import type { ColumnDef } from "../../components/data-table/types";

export interface Role {
    _id: string;
    name: string;
}

export function roleColumns(
    onEditClick: (role: Role) => void,
    onDeleteClick: (id: string) => void,
): ColumnDef<Role>[] {
    return [
        {
            id: "name",
            header: "Role Name",
            accessorFn: (row) => row.name,
            enableSorting: true,
            cell: ({ row }) => (
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">
                    {row.original.name}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableExport: false,
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <div className="text-end pe-3">
                        <button
                            className="btn btn-sm btn-light text-primary me-2 shadow-sm"
                            onClick={() => onEditClick(role)}
                        >
                            <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                            className="btn btn-sm btn-light text-danger shadow-sm"
                            onClick={() => onDeleteClick(role._id)}
                        >
                            <i className="bi bi-trash-fill"></i> Delete
                        </button>
                    </div>
                );
            },
        },
    ];
}
