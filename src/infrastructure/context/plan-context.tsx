import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface PlanContextValue {
    planVersion: number;
    bumpPlanVersion: () => void;
}

const PlanContext = createContext<PlanContextValue>({ planVersion: 0, bumpPlanVersion: () => {} });

export const usePlanVersion = () => useContext(PlanContext);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [planVersion, setPlanVersion] = useState(0);
    const bumpPlanVersion = useCallback(() => setPlanVersion(v => v + 1), []);
    const value = useMemo(() => ({ planVersion, bumpPlanVersion }), [planVersion, bumpPlanVersion]);
    return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
