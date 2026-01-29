import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [socketReady, setSocketReady] = useState(false);
    const [profileUpdate, setProfileUpdate] = useState(null);
    const profileListeners = useRef([]);
    const location = useLocation();

    // Avoid socket connection on auth-related routes to prevent noise on login/registration
    const authRoutes = new Set([
        "/login",
        "/register",
        "/verify-otp",
        "/forgot-password",
        "/reset-password",
        // Google login route removed
        "/register-stakeholder",
        "/register-csr",
        "/pending-approval",
        "/register-parent",
        "/register-teacher",
        "/register-seller",
    ]);
    const isAuthRoute = authRoutes.has(location.pathname);

    // Subscribe/unsubscribe API for components
    const subscribeProfileUpdate = useCallback((cb) => {
        profileListeners.current.push(cb);
        return () => {
            profileListeners.current = profileListeners.current.filter(fn => fn !== cb);
        };
    }, []);

    useEffect(() => {
        // Only connect when authenticated user is present and not on auth pages
        if (user && !isAuthRoute && !socketRef.current) {
            const token = localStorage.getItem("finmen_token");

            if (!token) {
                console.warn("⚠️ No token found in localStorage for socket auth.");
                return;
            }

            // Validate token format before using it
            try {
                // Simple check to see if token has three parts (header.payload.signature)
                if (!token.includes('.') || token.split('.').length !== 3) {
                    console.error("❌ Invalid token format");
                    return;
                }
            } catch (err) {
                console.error("❌ Token validation error:", err.message);
                return;
            }

            const socket = io(import.meta.env.VITE_API_URL, {
                transports: ["websocket"],
                withCredentials: true,
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                forceNew: true,
                path: "/socket.io",
            });

            socket.on("connect", () => {
                console.log("🟢 Socket connected:", socket.id);
                try {
                    socket.emit("join", user._id);
                } catch (err) {
                    console.error("❌ Error joining socket room:", err.message);
                }
                setSocketReady(true);
            });

            socket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
                setSocketReady(false);
            });

            socket.on("error", (data) => {
                console.error("❌ Socket error:", data.message);
                setSocketReady(false);
            });

            socket.on("disconnect", (reason) => {
                console.log("🔴 Socket disconnected:", reason);
                setSocketReady(false);
                
                // Only attempt to reconnect for certain disconnect reasons
                if (reason === "io server disconnect" || reason === "io client disconnect") {
                    // These are intentional disconnects, don't reconnect automatically
                    console.log("Intentional disconnect, not attempting reconnection");
                } else {
                    // For transport close, ping timeout, etc.
                    console.log("Unintentional disconnect, socket will attempt reconnection automatically");
                }
            });

            // Listen for real-time profile updates
            socket.on("user:profile:updated", (payload) => {
                try {
                    setProfileUpdate(payload);
                    profileListeners.current.forEach(cb => cb(payload));
                } catch (error) {
                    console.error("Error handling profile update:", error);
                }
            });
            socket.on("student:profile:updated", (payload) => {
                try {
                    setProfileUpdate(payload);
                    profileListeners.current.forEach(cb => cb(payload));
                } catch (error) {
                    console.error("Error handling student profile update:", error);
                }
            });

            // Phase 8: Real-time CSR notifications (toast when CSR gets a new notification on any page)
            if (user?.role === "csr") {
                socket.on("csr:notification:new", (payload) => {
                    try {
                        if (payload?.title) toast.success(payload.title, { icon: "🔔" });
                    } catch (e) {
                        console.error("CSR notification toast error:", e);
                    }
                });
            }

            socketRef.current = socket;
        }

        return () => {
            if (socketRef.current) {
                try {
                    socketRef.current.disconnect();
                    console.log("🔴 Socket disconnected");
                } catch (err) {
                    console.error("❌ Error disconnecting socket:", err.message);
                } finally {
                    socketRef.current = null;
                    setSocketReady(false);
                }
            }
        };
    }, [user, isAuthRoute]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, socketReady, profileUpdate, subscribeProfileUpdate }}>
            {children}
        </SocketContext.Provider>
    );
};