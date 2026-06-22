import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = ({
    title,
    message,
    actionText,
    action,
  }) => {
    setNotification({
      title,
      message,
      actionText,
      action,
    });

    setTimeout(() => {
      setNotification(null);
    }, 8000);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification }}
    >
      {children}

      {notification && (
        <div className="floating-toast">

          <h3>{notification.title}</h3>

          <p>{notification.message}</p>

          {notification.actionText && (
            <button
              onClick={() => {
                notification.action?.();
                setNotification(null);
              }}
            >
              {notification.actionText}
            </button>
          )}

        </div>
      )}

    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}