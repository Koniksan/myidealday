import React, { createContext, useContext, useMemo, useState } from "react";

export interface HeaderAction {
    id: string;
    label: string;
    icon: React.ReactElement;
    onClick: () => void;
    appearance?: "primary" | "secondary" | "subtle";
}

interface HeaderActionsContextValue {
    actions: HeaderAction[];
    setActions: React.Dispatch<React.SetStateAction<HeaderAction[]>>;
}

const HeaderActionsContext = createContext<HeaderActionsContextValue>({
    actions: [],
    setActions: () => {},
});

export const useHeaderActions = () => useContext(HeaderActionsContext);

export const HeaderActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [actions, setActions] = useState<HeaderAction[]>([]);
    const value = useMemo(() => ({ actions, setActions }), [actions]);
    return <HeaderActionsContext.Provider value={value}>{children}</HeaderActionsContext.Provider>;
};
