import { useState, useCallback } from 'react';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '../services/profile.service';
import type { ProfileResponse } from '../services/profile.service';
import axios from 'axios';

export function useProfile() {
    const [profile, setProfile] = useState<ProfileResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getProfile();
            setProfile(res.data);
            return res.data;
        } catch (err) {
            console.error(err);
            setError('Failed to fetch profile');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpdateProfile = async (data: any) => {
        try {
            await updateProfile(data);
            await fetchProfile();
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Update failed' };
            }
            return { success: false, error: 'Update failed' };
        }
    };

    const handleUploadAvatar = async (file: File) => {
        try {
            await uploadAvatar(file);
            await fetchProfile();
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Upload failed' };
            }
            return { success: false, error: 'Upload failed' };
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            await deleteAvatar();
            await fetchProfile();
            return { success: true };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return { success: false, error: err.response?.data?.message || 'Delete failed' };
            }
            return { success: false, error: 'Delete failed' };
        }
    };

    return {
        profile,
        loading,
        error,
        fetchProfile,
        handleUpdateProfile,
        handleUploadAvatar,
        handleDeleteAvatar
    };
}
