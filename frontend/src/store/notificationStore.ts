import { create } from 'zustand';

/**
 * Tipo de notificación
 */
export interface AppNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    duration?: number; // Duración en ms, undefined = permanente
}

/**
 * Estado de notificaciones
 */
interface NotificationState {
    notifications: AppNotification[];
    queue: AppNotification[]; // Cola para notificaciones pendientes
    
    // Acciones
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    clearExpiredNotifications: () => void;
}

/**
 * Store para notificaciones
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    queue: [],

    addNotification: (notification) => {
        const newNotification: AppNotification = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
        ...notification,
        };

        set((state) => ({
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Limitar a 50
        }));

        // Auto-remover si tiene duración
        if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
            get().removeNotification(newNotification.id);
        }, newNotification.duration);
        }
    },

    removeNotification: (id) => {
        set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    markAsRead: (id) => {
        set((state) => ({
        notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        ),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
    },

    clearNotifications: () => {
        set({ notifications: [] });
    },

    clearExpiredNotifications: () => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        set((state) => ({
        notifications: state.notifications.filter(
            (n) => n.timestamp > oneWeekAgo
        ),
        }));
    },
}));

/**
 * Hook de utilidad para notificaciones comunes
 */
export const useNotificationActions = () => {
    const { addNotification } = useNotificationStore();

    return {
        showSuccess: (message: string, title: string = 'Éxito') => {
        addNotification({
            type: 'success',
            title,
            message,
            duration: 5000,
        });
        },

        showError: (message: string, title: string = 'Error') => {
        addNotification({
            type: 'error',
            title,
            message,
            duration: 8000,
        });
        },

        showWarning: (message: string, title: string = 'Advertencia') => {
        addNotification({
            type: 'warning',
            title,
            message,
            duration: 6000,
        });
        },

        showInfo: (message: string, title: string = 'Información') => {
        addNotification({
            type: 'info',
            title,
            message,
            duration: 4000,
        });
        },
    };
};