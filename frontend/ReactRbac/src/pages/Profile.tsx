import { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import Header from "../components/layout/Header";
import { useProfile } from "../hooks/useProfile";

export default function Profile() {
    const {
        profile,
        loading,
        error: fetchError,
        fetchProfile,
        handleUpdateProfile,
        handleUploadAvatar,
        handleDeleteAvatar,
    } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ bio: "", address: "", dob: "" });
    const [actionError, setActionError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile().then((data) => {
            if (data) {
                setFormData({
                    bio: data.bio || "",
                    address: data.address || "",
                    dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
                });
            }
        });
    }, [fetchProfile]);

    const onUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError("");
        setSuccessMsg("");
        const res = await handleUpdateProfile(formData);
        if (res.success) {
            setSuccessMsg("Profile updated successfully");
            setIsEditing(false);
        } else {
            setActionError(res.error || "Update failed");
        }
    };

    const onAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setActionError("");
        const res = await handleUploadAvatar(file);
        if (!res.success) {
            setActionError(res.error || "Avatar upload failed");
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onAvatarDelete = async () => {
        setUploading(true);
        setActionError("");
        const res = await handleDeleteAvatar();
        if (!res.success) {
            setActionError(res.error || "Avatar delete failed");
        }
        setUploading(false);
    };

    if (loading) {
        return (
            <Layout>
                <Header title="My Profile" />
                <div className="p-4 d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header title="My Profile" />
            <div className="card glass-panel border-0 shadow-sm" style={{ maxWidth: "600px" }}>
                <div className="card-body p-4">
                    {fetchError && <div className="alert alert-danger py-2">{fetchError}</div>}
                    {actionError && <div className="alert alert-danger py-2">{actionError}</div>}
                    {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}

                    <div className="d-flex align-items-center gap-4 mb-4">
                        <div className="position-relative">
                            {profile?.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt="Avatar"
                                    className="rounded-circle object-fit-cover shadow-sm"
                                    style={{ width: "96px", height: "96px" }}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                    style={{
                                        width: "96px",
                                        height: "96px",
                                        background: "linear-gradient(135deg, var(--primary-color), var(--primary-hover))",
                                        color: "white",
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {profile?.user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="position-absolute bottom-0 end-0 d-flex gap-1 bg-white rounded-pill shadow p-1">
                                <button
                                    className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
                                    style={{ width: "28px", height: "28px" }}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    title="Upload Avatar"
                                >
                                    <i className="bi bi-camera-fill text-primary" style={{ fontSize: "14px" }}></i>
                                </button>
                                {profile?.avatar && (
                                    <button
                                        className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center"
                                        style={{ width: "28px", height: "28px" }}
                                        onClick={onAvatarDelete}
                                        disabled={uploading}
                                        title="Delete Avatar"
                                    >
                                        <i className="bi bi-trash-fill text-danger" style={{ fontSize: "14px" }}></i>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={onAvatarUpload} />
                        </div>

                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
                                {profile?.user?.name}
                            </h2>
                            <p className="text-muted mb-0">{profile?.user?.email}</p>
                        </div>
                    </div>

                    <hr className="text-muted opacity-25" />

                    {isEditing ? (
                        <form onSubmit={onUpdateSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-medium">Bio</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-medium">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="City, Country"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-muted small fw-medium">Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary px-4">
                                    Save Changes
                                </button>
                                <button type="button" className="btn btn-light px-4" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="mb-3">
                                <p className="text-muted small fw-medium mb-1">Bio</p>
                                <p className="mb-0">{profile?.bio || <span className="text-muted fst-italic">No bio added</span>}</p>
                            </div>
                            <div className="mb-3">
                                <p className="text-muted small fw-medium mb-1">Address</p>
                                <p className="mb-0">
                                    {profile?.address || <span className="text-muted fst-italic">No address added</span>}
                                </p>
                            </div>
                            <div className="mb-4">
                                <p className="text-muted small fw-medium mb-1">Date of Birth</p>
                                <p className="mb-0">
                                    {profile?.dob ? (
                                        new Date(profile.dob).toLocaleDateString()
                                    ) : (
                                        <span className="text-muted fst-italic">Not specified</span>
                                    )}
                                </p>
                            </div>
                            <button className="btn btn-outline-primary px-4" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
