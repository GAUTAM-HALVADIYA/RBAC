import type { ColumnDef } from "../../components/data-table/types";

export interface Module {
    _id: string;
    name: string;
    key: string;
    isActive: boolean;
}

export function moduleColumns(
    onEditClick: (mod: Module) => void,
    onDeleteClick: (id: string) => void,
): ColumnDef<Module>[] {
    return [
        {
            id: "name",
            header: "Module Name",
            accessorFn: (row) => row.name,
            enableSorting: true,
        },
        {
            id: "key",
            header: "Key",
            accessorFn: (row) => row.key,
            enableSorting: true,
            cell: ({ row }) => (
                <code className="bg-light px-2 py-1 rounded border">
                    {row.original.key}
                </code>
            ),
        },
        {
            id: "isActive",
            header: "Status",
            accessorFn: (row) => row.isActive,
            exportValue: (row) => (row.isActive ? "Active" : "Inactive"),
            enableSorting: true,
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <span
                        className={`badge ${
                            isActive
                                ? "bg-success-subtle text-success border-success"
                                : "bg-danger-subtle text-danger border-danger"
                        } px-3 py-2 rounded-pill shadow-sm border border-opacity-25`}
                    >
                        {isActive ? "Active" : "Inactive"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableExport: false,
            cell: ({ row }) => {
                const mod = row.original;
                return (
                    <div className="text-end pe-3">
                        <button
                            className="btn btn-sm btn-light text-primary me-2 shadow-sm"
                            onClick={() => onEditClick(mod)}
                        >
                            <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                            className="btn btn-sm btn-light text-danger shadow-sm"
                            onClick={() => onDeleteClick(mod._id)}
                        >
                            <i className="bi bi-trash-fill"></i> Delete
                        </button>
                    </div>
                );
            },
        },
    ];
}
