// src/context/AuthContext.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextExport";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 🔄 Fetch authenticated user from backend
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("finmen_token");

            // Check if token exists and has valid format
            if (!token || !token.includes('.') || token.split('.').length !== 3) {
                console.warn("⚠️ Invalid or missing token");
                setUser(null);
                localStorage.removeItem("finmen_token");
                setLoading(false);
                return null;
            }

            // Add timeout to prevent hanging requests
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );

            const apiPromise = api.get("/api/auth/me");
            const res = await Promise.race([apiPromise, timeoutPromise]);
            
            const fetchedUser = res.data;

            const enhancedUser = {
                ...fetchedUser,
                isApproved: fetchedUser.approvalStatus === "approved",
            };

            setUser(enhancedUser);
            setLoading(false);
            return enhancedUser;
        } catch (err) {
            console.error("❌ Failed to fetch user:", err?.response?.data || err.message);

            // If it's an auth error, clear the token
            if (err.response?.status === 401 || err.message === 'Request timeout') {
                localStorage.removeItem("finmen_token");
            }

            setUser(null);
            setLoading(false);
            return null;
        }
    };

    // 🔐 Login function
    const loginUser = async (credentials) => {
        try {
            const res = await api.post("/api/auth/login", credentials);
            const token = res.data?.token;
            const userData = res.data?.user;

            if (!token || !userData) throw new Error("Invalid login response");

            // Validate token format before storing
            if (!token.includes('.') || token.split('.').length !== 3) {
                throw new Error("Invalid token format received from server");
            }

            localStorage.setItem("finmen_token", token);

            const enhancedUser = {
                ...userData,
                isApproved: userData.approvalStatus === "approved",
            };

            setUser(enhancedUser);

            // Redirect after login based on role
            switch (enhancedUser.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "school_admin":
                    navigate("/school/admin/dashboard");
                    break;
                case "school_teacher":
                    navigate("/school-teacher/overview");
                    break;
                case "parent":
                    // Parents are auto-approved; route directly to dashboard
                    navigate("/parent/dashboard");
                    break;
                case "seller":
                    if (!enhancedUser.isApproved) {
                        navigate("/pending-approval", {
                            state: {
                                message: "Your seller account is currently under review. You will be notified once approved.",
                                user: { email: enhancedUser.email },
                            },
                        });
                    } else {
                        navigate("/seller/dashboard");
                    }
                    break;
                case "csr":
                    // Check User.approvalStatus and redirect accordingly (same as sellers)
                    if (!enhancedUser.isApproved) {
                        if (userData.approvalStatus === "pending") {
                            navigate("/csr/pending-approval");
                        } else if (userData.approvalStatus === "rejected") {
                            navigate("/csr/rejected");
                        } else {
                            navigate("/csr/pending-approval");
                        }
                    } else {
                        navigate("/csr/overview");
                    }
                    break;
                case "student":
                case "school_student":
                default:
                    navigate("/student/dashboard");
                    break;
            }
        } catch (err) {
            console.error("Login error:", err?.response?.data || err.message);
            throw err;
        }
    };

    // 🚪 Logout and clean state
    const logoutUser = async () => {
        try {
            await api.post("/api/auth/logout");
        } catch (err) {
            console.error("❌ Logout failed:", err?.response?.data || err.message);
        } finally {
            // Clear all auth-related storage
            localStorage.removeItem("finmen_token");

            if (user?._id) {
                try {
                    sessionStorage.removeItem(`finmen_student_welcome_${user._id}`);
                } catch (storageError) {
                    console.error("Error clearing welcome toast state:", storageError);
                }
            }

            // Clear any other auth-related items
            try {
                // Clear any session cookies if present
                document.cookie.split(";").forEach(c => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
            } catch (e) {
                console.error("Error clearing cookies:", e);
            }

            setUser(null);
            setTimeout(() => navigate("/", { replace: true }), 50);
        }
    };

    // On mount, fetch user if token is present
    useEffect(() => {
        const token = localStorage.getItem("finmen_token");
        if (token) {
            fetchUser().catch((err) => {
                console.error("❌ Error in fetchUser:", err);
                setLoading(false);
                setUser(null);
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                fetchUser,
                loginUser,
                logoutUser,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// useAuth hook moved to AuthUtils.js for Fast Refresh compatibility
