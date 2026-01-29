import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { fetchMyNotifications } from "../services/notificationService"; // ✅ Correct import
import { useAuth } from "./AuthUtils";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const socket = useSocket();
    const { user, loading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!socket || !socket.socket) return;

        try {
            socket.socket.on("newNotification", (notification) => {
                setNotifications((prev) => [notification, ...prev]);
                if (!notification.read) {
                    setUnreadCount(prev => prev + 1);
                }
            });
        } catch (err) {
            console.error("❌ Error setting up notification listener:", err.message);
        }

        return () => {
            try {
                if (socket && socket.socket) {
                    socket.socket.off("newNotification");
                }
            } catch (err) {
                console.error("❌ Error cleaning up notification listener:", err.message);
            }
        };
    }, [socket]);

    useEffect(() => {
        // Only fetch notifications if user is authenticated
        if (loading || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        // Try to fetch notifications, but don't error if it fails
        fetchMyNotifications()
            .then((data) => {
                setNotifications(data || []);
                setUnreadCount((data || []).filter(n => !n.read).length);
            })
            .catch((err) => {
                console.error("Failed to fetch notifications:", err);
                setNotifications([]);
            });
    }, [user, loading]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export function useNotification() {
    return useContext(NotificationContext);
}
