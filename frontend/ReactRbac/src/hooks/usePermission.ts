import { useEffect, useState } from "react";
import axios from "axios";
import { getPermissions, updatePermission } from "../services/permission.service";

import type { Permission } from "../types/permission.types";

export function usePermissions() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPermissions();

            setPermissions(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const changePermission = async (id: string, read: boolean, write: boolean) => {
        try {
            await updatePermission(id, {
                read,
                write,
            });

            setPermissions((prev) =>
                prev.map((permission) =>
                    permission._id === id
                        ? {
                              ...permission,
                              permissions: {
                                  read,
                                  write,
                              },
                          }
                        : permission,
                ),
            );
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Unable to update permission");
            }
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return {
        permissions,
        loading,
        error,
        changePermission,
    };
}
