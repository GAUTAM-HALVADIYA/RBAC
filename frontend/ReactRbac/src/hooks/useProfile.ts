import { useState } from 'react';
import { updateProfile, uploadAvatar, deleteAvatar } from '../services/user.service';
import { useAuth } from './useAuth';
import axios from 'axios';

export function useProfile() {
    const { profile, fetchProfileData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error] = useState('');

    const handleUpdateProfile = async (data: any) => {
        try {
            setLoading(true);
            await updateProfile(data);
            if (fetchProfileData) await fetchProfileData();
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'Update failed' };
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAvatar = async (file: File) => {
        try {
            setLoading(true);
            await uploadAvatar(file);
            if (fetchProfileData) await fetchProfileData();
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Upload failed' };
            }
            return { success: false, error: 'Upload failed' };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            setLoading(true);
            await deleteAvatar();
            if (fetchProfileData) await fetchProfileData();
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Delete failed' };
            }
            return { success: false, error: 'Delete failed' };
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        loading,
        error,
        handleUpdateProfile,
        handleUploadAvatar,
        handleDeleteAvatar
    };
}
