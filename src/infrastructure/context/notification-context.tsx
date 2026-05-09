import { Toast, ToastIntent, ToastTitle, useToastController } from "@fluentui/react-components";
import React, { createContext, useContext } from "react";

interface NotificationContextValue {
    notify: (message: string, intent?: ToastIntent) => void;
}

const NotificationContext = createContext<NotificationContextValue>({ notify: () => {} });

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { dispatchToast } = useToastController("app");

    const notify = (message: string, intent: ToastIntent = "success") => {
        dispatchToast(
            <Toast>
                <ToastTitle>{message}</ToastTitle>
            </Toast>,
            { intent },
        );
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
