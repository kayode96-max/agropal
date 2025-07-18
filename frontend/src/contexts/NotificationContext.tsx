import React, { createContext, useContext, useState, useCallback } from 'react';
import { BeautifulAlert } from '../components/ui';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: React.ReactNode;
  autoHideDuration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    title: string,
    message: React.ReactNode,
    autoHideDuration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: React.ReactNode,
      autoHideDuration = 5000
    ) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      setNotifications((prev) => [
        ...prev,
        { id, type, title, message, autoHideDuration },
      ]);

      // Auto-remove notification after duration
      if (autoHideDuration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, autoHideDuration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxWidth: 400,
        }}
      >
        {notifications.map((notification) => (
          <BeautifulAlert
            key={notification.id}
            severity={notification.type}
            title={notification.title}
            content={notification.message}
            variant="filled"
            autoHideDuration={notification.autoHideDuration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
